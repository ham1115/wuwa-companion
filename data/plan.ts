/**
 * The build queue. Characters are added from the Characters tab; their build
 * parameters are read live from data/characters.ts, so nothing is duplicated
 * here. This file holds only the checklist shape and the shared build rules.
 *
 * Nothing here is personal: the queue and the per-character notes live in the
 * browser, seeded empty, so a new visitor starts blank. One player's filled-in
 * version is in data/profile.ts, loadable from Settings.
 */

export type PlanStep = { key: string; label: string; detail?: string };

/** The same six steps apply to every character, in this order. */
export const PLAN_STEPS: PlanStep[] = [
  { key: "level", label: "Character to Lv.80", detail: "Stop at 80 — 80 to 90 costs as much as 1 to 80." },
  { key: "weapon", label: "Weapon to Lv.80" },
  { key: "skills", label: "Skills levelled", detail: "Basic Attack stays at 1 unless the build says otherwise." },
  { key: "sonata", label: "Sonata set complete", detail: "Most sets need 5 matching Echoes; six of them need only 3. Check the Echoes tab." },
  { key: "mainstats", label: "Main stats correct per slot" },
  { key: "substats", label: "Substats acceptable", detail: "Good enough beats perfect. Do not re-farm." },
];

/** Empty on purpose. Queue your own from the Characters tab. */
export const DEFAULT_PLAN: string[] = [];

export const BUILD_RULES = [
  "Build one character at a time. Shell Credits are the bottleneck, not EXP.",
  "Stop at Lv.80. Going 80 to 90 costs roughly as much as 1 to 80.",
  "A complete 5-piece Sonata with a mediocre 4-cost beats a perfect 4-cost with no set bonus.",
  "An Echo Sonata is locked when it drops. There is no reroll — you re-farm the Echo instead.",
];

/** "46x Truth in Lies" -> { qty: 46, name: "Truth in Lies" } */
export function parseMaterial(s: string): { qty: number; name: string } | null {
  const m = s.match(/^(\d+)\s*x\s*(.+)$/);
  if (!m) return null;
  return { qty: parseInt(m[1], 10), name: m[2].trim() };
}
