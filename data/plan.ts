/**
 * The build queue. Characters are added from the Characters tab; their build
 * parameters are read live from data/characters.ts, so nothing is duplicated
 * here. This file holds only the checklist shape and account-specific notes.
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

export const DEFAULT_PLAN = ["verina", "phrolova", "qiuyuan", "rover-havoc"];

/** Free-form context for specific characters on this account. */
export const ACCOUNT_NOTES: Record<string, string[]> = {
  verina: [
    "Done. Lv.80, weapon Lv.80, skills set, 5-piece Rejuvenating Glow active.",
    "Sits at ~1680 ATK and 191.7% Energy Regen.",
    "Correction to earlier advice: prydwen puts CRIT Rate on her 4-cost and keeps Energy Regen on both 3-costs, and names Fallacy of No Return as her main Echo over Bell-Borne Geochelone. Her 198.6% CRIT DMG is therefore not wasted.",
    "No re-farm needed. Swap pieces in only if they drop while farming something else.",
  ],
  phrolova: [
    "Walled at Lv.40 — needs 46x Truth in Lies and 60x Afterlife, which sit in a region this account has not unlocked.",
    "Gear is already done: 5-piece Havoc Eclipse with a maxed Crit DMG 44% Phantom: Dreamless.",
    "Havoc Eclipse is the working fallback. Dream of the Lost is the upgrade once reachable.",
    "Phantom: Dreamless gains bonus damage after Rover-Havoc uses Resonance Liberation, so Rover is a legitimate third slot.",
  ],
  qiuyuan: [
    "Already Lv.70. Aero, Sword, Hybrid. Named in guides as one of Phrolova's best partners.",
    "Needs 46x Truth in Lies and 60x Wintry Bell — same boss material as Phrolova, different plant.",
  ],
  "rover-havoc": [
    "Free, already Lv.70. Hold here — do not invest further until Phrolova unblocks.",
  ],
};

export const BUILD_RULES = [
  "Build one character at a time. Shell Credits are the bottleneck, not EXP.",
  "Do not level the Lv.1 characters. No exceptions.",
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
