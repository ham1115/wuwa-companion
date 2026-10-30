"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PREFIX,
  STORAGE_GROUPS,
  isSyncedKey,
  type StorageGroup,
} from "./keys";

export { PREFIX, STORAGE_GROUPS };
export type { StorageGroup };


/** Wipes one group. Returns how many keys were actually removed. */
export function resetGroup(group: StorageGroup): number {
  if (typeof window === "undefined") return 0;
  let n = 0;
  for (const k of STORAGE_GROUPS[group]) {
    try {
      if (window.localStorage.getItem(PREFIX + k) !== null) {
        window.localStorage.removeItem(PREFIX + k);
        n++;
      }
    } catch {
      // storage blocked — nothing to remove
    }
  }
  return n;
}

/** Wipes everything this app stored, leaving other sites' data alone. */
export function resetEverything(): number {
  if (typeof window === "undefined") return 0;
  let n = 0;
  try {
    for (const k of Object.keys(window.localStorage)) {
      if (k.startsWith(PREFIX)) {
        window.localStorage.removeItem(k);
        n++;
      }
    }
  } catch {
    // storage blocked
  }
  return n;
}

/** Everything this app stored, as a JSON string you can save or paste elsewhere. */
export function exportAll(): string {
  const out: Record<string, unknown> = {};
  if (typeof window !== "undefined") {
    try {
      for (const k of Object.keys(window.localStorage)) {
        if (!k.startsWith(PREFIX)) continue;
        const raw = window.localStorage.getItem(k);
        if (raw === null) continue;
        try {
          out[k.slice(PREFIX.length)] = JSON.parse(raw);
        } catch {
          out[k.slice(PREFIX.length)] = raw;
        }
      }
    } catch {
      // storage blocked
    }
  }
  return JSON.stringify({ app: "wuwa-companion", version: 1, data: out }, null, 2);
}

/** Restores an exportAll() payload. Throws with a readable message on bad input. */
export function importAll(json: string): number {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("That is not valid JSON.");
  }
  const body = parsed as { app?: string; data?: Record<string, unknown> };
  if (body?.app !== "wuwa-companion" || typeof body.data !== "object" || !body.data) {
    throw new Error("That JSON did not come from this app.");
  }
  let n = 0;
  try {
    for (const [k, v] of Object.entries(body.data)) {
      window.localStorage.setItem(PREFIX + k, JSON.stringify(v));
      n++;
    }
  } catch {
    throw new Error("Could not write to this browser's storage.");
  }
  return n;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/*
 * Two components can hold the same key at once — the theme lives in the page
 * header and in Settings, for instance. Without this, each would keep its own
 * copy and the stale one would overwrite the fresh one on its next render, so
 * every writer tells the other holders of that key what it wrote.
 */
const listeners = new Map<string, Set<(value: unknown) => void>>();

function subscribe(key: string, fn: (value: unknown) => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(fn);
  return () => {
    set!.delete(fn);
    if (set!.size === 0) listeners.delete(key);
  };
}

/**
 * When each key was last changed in THIS browser, by key. Kept in its own
 * localStorage entry so a tab that has never rendered a given key still knows
 * how old its copy is, which is what the sync merge compares against.
 */
const META_KEY = "__updated";

type Meta = Record<string, number>;

function readMeta(): Meta {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PREFIX + META_KEY);
    return raw ? (JSON.parse(raw) as Meta) : {};
  } catch {
    return {};
  }
}

function writeMeta(meta: Meta) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + META_KEY, JSON.stringify(meta));
  } catch {
    // Same as any other write: the app keeps working without persistence.
  }
}

/**
 * The stored value for a key, or null when there is none — for sync, which
 * needs to read a key's current contents without holding a hook for it.
 */
export function readRaw(key: string): unknown {
  return read<unknown>(key, null);
}

/** When this browser last changed `key`, or 0 if it never has. */
export function localUpdatedAt(key: string): number {
  return readMeta()[key] ?? 0;
}

export function setLocalUpdatedAt(key: string, at: number) {
  const meta = readMeta();
  meta[key] = at;
  writeMeta(meta);
}

/** Notified whenever a local edit happens, so sync can queue a push. */
let onLocalChange: ((key: string) => void) | null = null;

export function setLocalChangeHandler(fn: ((key: string) => void) | null) {
  onLocalChange = fn;
}

function store<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Private browsing, blocked storage, or quota. The app keeps working in memory.
    }
  }
  const set = listeners.get(key);
  if (set) for (const fn of set) fn(value);
}

function write<T>(key: string, value: T) {
  store(key, value);
  // A local edit: stamp it and let sync know there is something to send.
  setLocalUpdatedAt(key, Date.now());
  if (onLocalChange && isSyncedKey(key)) onLocalChange(key);
}

/**
 * Apply a value that came from the server.
 *
 * Separate from `write` on purpose: this must not re-stamp the key with the
 * current time, or every pull would look like a fresh local edit and bounce
 * straight back up as a push.
 */
export function applyRemote<T>(key: string, value: T, updatedAt: number) {
  store(key, value);
  setLocalUpdatedAt(key, updatedAt);
}

/**
 * localStorage-backed state that hydrates after mount, so server and first
 * client render always agree. Reads and writes never throw.
 */
export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  /**
   * The current value, readable without going through a state updater.
   *
   * `write` notifies every other component holding this key, which means it
   * calls their setState. Resolving the next value inside `setValue(prev =>
   * …)` would put that notification inside an updater, and React runs those
   * during render — "Cannot update a component while rendering a different
   * component". Keeping the value in a ref lets `update` resolve and write in
   * the event handler, where the notification belongs.
   */
  const latest = useRef(value);

  useEffect(() => {
    const stored = read<T>(key, fallback);
    latest.current = stored;
    setValue(stored);
    setHydrated(true);
    return subscribe(key, (v) => {
      latest.current = v as T;
      setValue(v as T);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (p: T) => T)(latest.current)
          : next;
      latest.current = resolved;
      setValue(resolved);
      write(key, resolved);
    },
    [key]
  );

  return [value, update, hydrated] as const;
}

/** A set of ids, stored as an array. */
export function useIdSet(key: string) {
  const [ids, setIds, hydrated] = usePersistentState<string[]>(key, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) =>
      setIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    [setIds]
  );

  const clear = useCallback(() => setIds([]), [setIds]);

  /** Replace the whole set — for rules that tick or clear several ids at once. */
  const set = useCallback((next: string[]) => setIds(next), [setIds]);

  return { ids, has, toggle, clear, set, hydrated };
}

/** Free-text notes keyed by term id. */
export function useNotes(key: string) {
  const [notes, setNotes, hydrated] = usePersistentState<Record<string, string>>(
    key,
    {}
  );

  const get = useCallback((id: string) => notes[id] ?? "", [notes]);

  const set = useCallback(
    (id: string, text: string) =>
      setNotes((prev) => {
        const next = { ...prev };
        if (text.trim() === "") delete next[id];
        else next[id] = text;
        return next;
      }),
    [setNotes]
  );

  return { notes, get, set, hydrated };
}
