"use client";

import { useCallback } from "react";
import { usePersistentState } from "./storage";

/** What a character is actually running, and what their stats actually read. */
export type Loadout = {
  weapon?: string;
  set?: string;
  /**
   * What level the character actually is right now, 1–90. Kept here rather
   * than as a checklist step because it is a reading off the character
   * screen, like the stats below it, not a box you tick once.
   */
  level?: number;
  /** Keyed by the target's label, e.g. "CRIT Rate" -> "68.4". */
  stats?: Record<string, string>;
};

/** The cap, and so the point at which a character is finished levelling. */
export const MAX_LEVEL = 90;

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

  /**
   * Sets the current level from raw input. Anything that is not a number in
   * 1–90 removes it rather than storing a level the game cannot produce, so a
   * half-typed "9" on the way to "90" simply reads as unset for that keystroke
   * instead of being clamped to something the player did not mean.
   */
  const setLevel = useCallback(
    (id: string, value: string) =>
      setAll((prev) => {
        const entry = { ...prev[id] };
        const n = Math.floor(Number(value));
        if (value.trim() !== "" && Number.isFinite(n) && n >= 1 && n <= MAX_LEVEL) {
          entry.level = n;
        } else {
          delete entry.level;
        }
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

  return { all, get, setField, setStat, setLevel, clear, hydrated };
}
