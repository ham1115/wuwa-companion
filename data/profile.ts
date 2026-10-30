/**
 * One specific player's progress, kept out of the app's defaults so a new
 * visitor always starts blank. Nothing here is loaded automatically — Settings
 * has a "Load the author's profile" button that writes it into the browser.
 *
 * Shape matches the localStorage keys in lib/storage.ts, so this doubles as a
 * worked example of the export/import format.
 */

export type Profile = {
  label: string;
  detail: string;
  owned: string[];
  plan: string[];
  accountNotes: Record<string, string[]>;
  priorityNow: string[];
};

export const AUTHOR_PROFILE: Profile = {
  label: "Alex's account",
  detail: "AR53, SOL3 Rank 5, mid Chapter I Act 7. Verina built, Phrolova walled at Lv.40.",
  owned: [
    "verina",
    "phrolova",
    "qiuyuan",
    "lupa",
    "galbrena",
    "lynae",
    "rover-havoc",
  ],
  plan: ["verina", "phrolova", "qiuyuan", "rover-havoc"],
  accountNotes: {
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
  },
  priorityNow: [
    "Finish the Chronosorter: facing it, disable the right Photonvault, then middle, then left.",
    "Push the main quest. It unlocks regions, flight, Shell Credits and Phrolova's materials all at once.",
    "Do not pull — save for a character you actually want.",
    "Claim Milestone and Journey rewards if you have not already.",
  ],
};
