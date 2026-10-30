"use client";

import { useCallback, useEffect, useState } from "react";

export const PREFIX = "wuwa-companion:";

/** Every storage key this app owns, grouped so they can be reset per section. */
export const STORAGE_GROUPS = {
  characters: ["built", "char-notes", "owned"],
  plan: ["plan", "build-steps", "plan-notes", "account-notes"],
  glossary: ["learned", "revealed", "notes"],
  story: ["acts", "priority-now"],
  routine: ["routine", "routine-day"],
  display: ["tab", "theme", "show-account-notes"],
} as const;

export type StorageGroup = keyof typeof STORAGE_GROUPS;

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

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Private browsing, blocked storage, or quota. The app keeps working in memory.
  }
}

/**
 * localStorage-backed state that hydrates after mount, so server and first
 * client render always agree. Reads and writes never throw.
 */
export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, resolved);
        return resolved;
      });
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
