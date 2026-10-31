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
  /**
   * Resonance Chain, S0–S6: how many copies of the character you have pulled
   * beyond the first. It belongs with the build because the stat targets are
   * quoted at a particular sequence — 5-stars at S0, 4-stars and free
   * characters at S6 — so without it a shortfall cannot be read.
   */
  sequence?: number;
  /** The equipped weapon's own level, 1–90. */
  weaponLevel?: number;
  /**
   * Syntonize rank, R1–R5: duplicates of the weapon. The ranked weapon lists
   * in data/characters.ts are all quoted at R1, so anything above that is
   * above what the recommendation assumes.
   */
  weaponRank?: number;
  /** Keyed by the target's label, e.g. "CRIT Rate" -> "68.4". */
  stats?: Record<string, string>;
  /**
   * Forte levels, 1-10, keyed by the skill keys in data/skills.ts. Partial on
   * purpose: a skill you have not recorded is not the same as one at level 1,
   * and only the ones you have touched are stored.
   */
  skills?: Record<string, number>;
};

/** The cap, and so the point at which a character is finished levelling. */
export const MAX_LEVEL = 90;

/** S0 through S6 — six duplicates past the first copy. */
export const MAX_SEQUENCE = 6;

/** R1 through R5. Unlike a sequence, a weapon starts at R1, not R0. */
export const MAX_RANK = 5;

/** Forte levels run 1-10. */
export const MAX_SKILL_LEVEL = 10;

/** The numeric fields, and the range each one accepts. */
export const NUMERIC_FIELDS = {
  level: { min: 1, max: MAX_LEVEL },
  sequence: { min: 0, max: MAX_SEQUENCE },
  weaponLevel: { min: 1, max: MAX_LEVEL },
  weaponRank: { min: 1, max: MAX_RANK },
} as const;

export type NumericField = keyof typeof NUMERIC_FIELDS;

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
   * Sets one of the numeric fields from raw input. Anything outside that
   * field's range removes it rather than storing a value the game cannot
   * produce, so a half-typed "9" on the way to "90" simply reads as unset for
   * that keystroke instead of being clamped to something nobody meant.
   */
  const setNumber = useCallback(
    (id: string, field: NumericField, value: string) =>
      setAll((prev) => {
        const entry = { ...prev[id] };
        const { min, max } = NUMERIC_FIELDS[field];
        const n = Math.floor(Number(value));
        if (value.trim() !== "" && Number.isFinite(n) && n >= min && n <= max) {
          entry[field] = n;
        } else {
          delete entry[field];
        }
        const next = { ...prev, [id]: entry };
        if (Object.keys(entry).length === 0) delete next[id];
        return next;
      }),
    [setAll]
  );

  const setLevel = useCallback(
    (id: string, value: string) => setNumber(id, "level", value),
    [setNumber]
  );

  /**
   * One forte's level. Same rule as the other numbers: anything outside 1-10
   * removes the entry rather than storing a level the game cannot produce, so
   * clearing the box forgets that skill instead of pinning it to a value.
   */
  const setSkillLevel = useCallback(
    (id: string, skill: string, value: string) =>
      setAll((prev) => {
        const entry = { ...prev[id] };
        const skills = { ...(entry.skills ?? {}) };
        const n = Math.floor(Number(value));
        if (
          value.trim() !== "" &&
          Number.isFinite(n) &&
          n >= 1 &&
          n <= MAX_SKILL_LEVEL
        ) {
          skills[skill] = n;
        } else {
          delete skills[skill];
        }
        if (Object.keys(skills).length === 0) delete entry.skills;
        else entry.skills = skills;
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

  return {
    all,
    get,
    setField,
    setStat,
    setNumber,
    setLevel,
    setSkillLevel,
    clear,
    hydrated,
  };
}
