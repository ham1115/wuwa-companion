"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { SYNCED_KEYS, isSyncedKey } from "./keys";
import {
  PREFIX,
  applyRemote,
  backfillMeta,
  localUpdatedAt,
  readRaw,
  setLocalChangeHandler,
} from "./storage";

export type SyncState =
  | "off" // signed out — everything stays in this browser
  | "syncing"
  | "synced"
  | "error";

type Entry = { value: unknown; updatedAt: number };

/** How long to wait after the last edit before sending. */
const PUSH_DEBOUNCE_MS = 1200;

async function fetchRemote(): Promise<Record<string, Entry>> {
  const res = await fetch("/api/state", { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /api/state → ${res.status}`);
  const body = (await res.json()) as { entries: Record<string, Entry> };
  return body.entries ?? {};
}

async function sendLocal(keys: string[]): Promise<void> {
  const entries = keys
    .filter(isSyncedKey)
    .map((key) => ({
      key,
      value: readRaw(key),
      updatedAt: localUpdatedAt(key),
    }))
    // A key this browser has never written has nothing to say about it.
    .filter((e) => e.updatedAt > 0);
  if (entries.length === 0) return;

  const res = await fetch("/api/state", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) throw new Error(`PUT /api/state → ${res.status}`);
}

/**
 * Local-first sync.
 *
 * Every edit is written to localStorage first and the UI never waits on the
 * network — signed out, that is the whole story and nothing here runs. Signed
 * in, the merge is per key and newest wins:
 *
 *   - the server's copy is newer  → adopt it locally
 *   - this browser's copy is newer → push it
 *   - only one side has it at all → that side wins
 *
 * So the first sign-in on a browser full of progress pushes all of it up, a
 * fresh device pulls all of it down, and two devices editing different parts
 * of the app never collide. Two devices editing the SAME key while apart is
 * the one lossy case: the later edit wins the whole key, so a character ticked
 * on a phone can be lost if the laptop also changed its owned list meanwhile.
 * Per-key timestamps keep that to the one key rather than the whole save.
 */
function useSyncEngine() {
  const { isLoaded, isSignedIn } = useAuth();
  const [state, setState] = useState<SyncState>("off");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Keys edited since the last push. */
  const pending = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Guards against a push and a pull overlapping. */
  const busy = useRef(false);

  const flush = useCallback(async () => {
    if (busy.current || pending.current.size === 0) return;
    const keys = [...pending.current];
    pending.current.clear();
    busy.current = true;
    setState("syncing");
    try {
      await sendLocal(keys);
      setState("synced");
      setLastSyncedAt(Date.now());
      setError(null);
    } catch (e) {
      // Put them back so the next edit or reload tries again.
      for (const k of keys) pending.current.add(k);
      setState("error");
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      busy.current = false;
    }
  }, []);

  /** Pull, adopt anything newer, then push anything of ours that is newer. */
  const reconcile = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setState("syncing");
    try {
      // Progress made before sync existed has no timestamp; without this it
      // would be invisible to the comparison below and never leave the device.
      backfillMeta(SYNCED_KEYS);

      const remote = await fetchRemote();
      const toPush: string[] = [];

      for (const key of SYNCED_KEYS) {
        const mine = localUpdatedAt(key);
        const theirs = remote[key];
        if (theirs && theirs.updatedAt > mine) {
          applyRemote(key, theirs.value, theirs.updatedAt);
        } else if (mine > 0 && (!theirs || mine > theirs.updatedAt)) {
          toPush.push(key);
        }
      }

      if (toPush.length > 0) await sendLocal(toPush);
      setState("synced");
      setLastSyncedAt(Date.now());
      setError(null);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      busy.current = false;
    }
  }, []);

  // Reconcile on sign-in, and stand down on sign-out.
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setState("off");
      setError(null);
      pending.current.clear();
      return;
    }
    void reconcile();
  }, [isLoaded, isSignedIn, reconcile]);

  // Collect local edits while signed in and send them in batches.
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    setLocalChangeHandler((key) => {
      pending.current.add(key);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), PUSH_DEBOUNCE_MS);
    });
    return () => {
      setLocalChangeHandler(null);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isLoaded, isSignedIn, flush]);

  // A tab being hidden or closed is the last chance to send recent edits.
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [isLoaded, isSignedIn, flush]);

  // Another tab of this app writing to localStorage is a local edit too.
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.startsWith(PREFIX)) return;
      const key = e.key.slice(PREFIX.length);
      if (!isSyncedKey(key)) return;
      pending.current.add(key);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), PUSH_DEBOUNCE_MS);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isLoaded, isSignedIn, flush]);

  return {
    state,
    error,
    lastSyncedAt,
    pendingCount: pending.current.size,
    /** Force a full reconcile, for the button in Settings. */
    syncNow: reconcile,
  };
}

export type Sync = ReturnType<typeof useSyncEngine>;

const OFF: Sync = {
  state: "off",
  error: null,
  lastSyncedAt: null,
  pendingCount: 0,
  syncNow: async () => {},
};

const SyncContext = createContext<Sync>(OFF);

/**
 * The engine runs once, at the top of the app. It owns a single global
 * change handler and one push queue, so a second instance would duplicate
 * every request and the two would fight over that handler — hence a provider
 * rather than a hook each component calls.
 */
export function SyncProvider({ children }: { children: React.ReactNode }) {
  const sync = useSyncEngine();
  return <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>;
}

/** Read-only view of sync status, for anything that wants to show it. */
export function useSync(): Sync {
  return useContext(SyncContext);
}
