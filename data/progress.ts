export type Act = {
  id: string;
  label: string;
  /** Only set where the in-game act name is confirmed. */
  title?: string;
  note?: string;
};

export type Chapter = {
  id: string;
  label: string;
  version: string;
  acts: Act[];
  unlocks?: string[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    label: "Chapter I",
    version: "1.x",
    unlocks: ["Huanglong", "Jinzhou", "Mt. Firmament"],
    acts: [
      { id: "ch1a1", label: "Act 1" },
      { id: "ch1a2", label: "Act 2" },
      { id: "ch1a3", label: "Act 3" },
      { id: "ch1a4", label: "Act 4" },
      { id: "ch1a5", label: "Act 5" },
      { id: "ch1a6", label: "Act 6" },
      {
        id: "ch1a7",
        label: "Act 7",
        title: "Jinzhou Rising",
        note: "Contains Truthseeker's Pass and the Chronosorter puzzle. You are here.",
      },
    ],
  },
  {
    id: "ch2",
    label: "Chapter II",
    version: "2.x",
    unlocks: ["Rinascita", "Flight", "2.x character materials"],
    acts: [
      { id: "ch2a1", label: "Act 1" },
      { id: "ch2a2", label: "Act 2" },
      { id: "ch2a3", label: "Act 3" },
      { id: "ch2a4", label: "Act 4" },
      { id: "ch2a5", label: "Act 5" },
      { id: "ch2a6", label: "Act 6" },
    ],
  },
  {
    id: "ch3",
    label: "Chapter III",
    version: "3.x",
    unlocks: ["Later regions"],
    acts: [
      { id: "ch3a1", label: "Act 1" },
      { id: "ch3a2", label: "Act 2" },
      { id: "ch3a3", label: "Act 3" },
    ],
  },
  {
    id: "ch4",
    label: "Chapter IV",
    version: "3.x",
    unlocks: ["Current story frontier"],
    acts: [
      { id: "ch4a1", label: "Act 1" },
      { id: "ch4a2", label: "Act 2" },
      { id: "ch4a3", label: "Act 3" },
    ],
  },
];

export const CHAPTER_DISCLAIMER =
  "Act counts past Chapter I Act 7 are approximate placeholders. Rename or re-check them against the in-game Quest menu as you go — only Jinzhou Rising is confirmed here.";

export type Routine = {
  id: string;
  label: string;
  detail: string;
  cadence: "daily" | "weekly";
};

export const ROUTINE: Routine[] = [
  {
    id: "d-waveplate",
    label: "Spend Waveplate before it overflows",
    detail: "It caps and stops regenerating. Overflow is pure waste.",
    cadence: "daily",
  },
  {
    id: "d-activity",
    label: "Clear daily activity quests",
    detail: "Small, fast, and they pay Astrite plus upgrade materials.",
    cadence: "daily",
  },
  {
    id: "d-credits",
    label: "Simulation Training if Shell Credits are short",
    detail: "Credits block more upgrades than any material does.",
    cadence: "daily",
  },
  {
    id: "d-mail",
    label: "Check Mail and Events",
    detail: "Returning-player and event rewards expire.",
    cadence: "daily",
  },
  {
    id: "w-boss",
    label: "Weekly boss clears",
    detail: "Skill upgrade materials. Limited attempts per week.",
    cadence: "weekly",
  },
  {
    id: "w-tower",
    label: "Tower of Adversity on reset",
    detail: "Large Astrite payout. Needs multiple built teams, so expect partial clears for now.",
    cadence: "weekly",
  },
];

export const PRIORITY_NOW = [
  "Finish the Chronosorter: facing it, disable the right Photonvault, then middle, then left.",
  "Push the main quest. It unlocks regions, flight, Shell Credits and Phrolova's materials all at once.",
  "Do not pull. Do not level the Lv.1 characters.",
  "Claim Milestone and Journey rewards if you have not already.",
];
