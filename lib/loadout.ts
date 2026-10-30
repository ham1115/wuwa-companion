"use client";

import { useCallback } from "react";
import { usePersistentState } from "./storage";

/** What a character is actually running, and what their stats actually read. */
export type Loadout = {
  weapon?: string;
  set?: string;
  /** Keyed by the target's label, e.g. "CRIT Rate" -> "68.4". */
  stats?: Record<string, string>;
};

/**
 * Per-character record of the real build, as opposed to the recommended one.
 * Stored in the browser alongside the rest of the Characters group.
 */
export function useLoadout() {
  const [all, setAll, hydrated] = usePersistentState<Record<string, Loadout>>(
    "loadout",
    {}
  );

  const get = useCallback((id: string): Loadout => all[id] ?? {}, [all]);

  /** Writes one field; an empty value removes it, and empty entries are dropped. */
  const setField = useCallback(
    (id: string, field: "weapon" | "set", value: string) =>
      setAll((prev) => {
        const next = { ...prev, [id]: { ...prev[id] } };
        if (value) next[id][field] = value;
        else delete next[id][field];
        if (Object.keys(next[id]).length === 0) delete next[id];
        return next;
      }),
    [setAll]
  );

  const setStat = useCallback(
    (id: string, label: string, value: string) =>
      setAll((prev) => {
        const entry = { ...prev[id] };
        const stats = { ...(entry.stats ?? {}) };
        if (value.trim()) stats[label] = value.trim();
        else delete stats[label];
        if (Object.keys(stats).length === 0) delete entry.stats;
        else entry.stats = stats;
        const next = { ...prev, [id]: entry };
        if (Object.keys(entry).length === 0) delete next[id];
        return next;
      }),
    [setAll]
  );

  const clear = useCallback(
    (id: string) =>
      setAll((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      }),
    [setAll]
  );

  return { all, get, setField, setStat, clear, hydrated };
}
