export type Act = {
  id: string;
  /** "Act VII", "Interlude", "Segue" — the label the Quest menu shows. */
  label: string;
  /** The in-game act title. */
  title: string;
  /** Game version the act released in, where the wiki records it. */
  version?: string;
  /** Named quest steps inside the act, for the long ones. */
  parts?: string[];
  note?: string;
  /**
   * Segues, interludes and side stories sit beside the main line rather than
   * gating it, so they tick on their own instead of filling in sequence.
   */
  optional?: boolean;
};

export type Chapter = {
  id: string;
  label: string;
  title: string;
  version: string;
  region: string;
  acts: Act[];
  unlocks?: string[];
};

/**
 * The real chapter and act names, from the Wuthering Waves Wiki's Main Quest
 * list, checked 30 October 2026. Chapter II's title follows Kuro's own 2.0
 * patch notes ("All Silent Souls Can Sing"); the wiki's page heading still
 * carries an older translation of it.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "prologue",
    label: "Prologue",
    title: "Utterance of Marvels",
    version: "1.0",
    region: "Huanglong",
    unlocks: ["Jinzhou", "The basics"],
    acts: [
      { id: "p-a1", label: "Act I", title: "Utterance of Marvels: I", version: "1.0" },
      { id: "p-a2", label: "Act II", title: "Utterance of Marvels: II", version: "1.0" },
    ],
  },
  {
    id: "ch1",
    label: "Chapter I",
    title: "Jinzhou Rising",
    version: "1.0 – 1.3",
    region: "Huanglong, then The Black Shores",
    unlocks: ["Huanglong", "Mt. Firmament", "The Black Shores"],
    acts: [
      { id: "ch1a1", label: "Act I", title: "First Resonance", version: "1.0" },
      { id: "ch1a2", label: "Act II", title: "Echoing Marche", version: "1.0" },
      { id: "ch1a3", label: "Act III", title: "Ominous Star", version: "1.0" },
      {
        id: "ch1a4",
        label: "Act IV",
        title: "Clashing Blades",
        version: "1.0",
        note: "Requires Union Level 11.",
      },
      { id: "ch1a5", label: "Act V", title: "Rewinding Raindrops", version: "1.0" },
      { id: "ch1a6", label: "Act VI", title: "Grand Warstorm", version: "1.0" },
      {
        id: "ch1-int",
        label: "Interlude",
        title: "A New Companion",
        version: "1.1",
        optional: true,
      },
      {
        id: "ch1a7",
        label: "Act VII",
        title: "Thaw of Eons",
        version: "1.1",
        parts: [
          "Dreamweaver's Ascent",
          "To Mt. Firmament",
          "Truthseeker's Pass",
          "Road of Pilgrimage",
          "Mianloong Chamber",
          "The Commander of Time",
          "Dawn of Snowstorm",
        ],
        note: "The Chronosorter puzzle sits inside Truthseeker's Pass.",
      },
      {
        id: "ch1a8",
        label: "Act VIII",
        title: "To the Shore's End",
        version: "1.3",
        parts: [
          "From the Echoes of Destruction",
          "Hidden Between the Waves",
          "Legacy of the Lasting Night",
          "Advance toward the Future from Today",
          "Beyond the Shore's End",
        ],
        note: "Moves to The Black Shores.",
      },
    ],
  },
  {
    id: "ch2",
    label: "Chapter II",
    title: "All Silent Souls Can Sing",
    version: "2.0 – 2.8",
    region: "Rinascita",
    unlocks: ["Rinascita", "Flight", "2.x character materials"],
    acts: [
      { id: "ch2-pro", label: "Prologue", title: "Through the Sea Thou Break", version: "2.0" },
      { id: "ch2a1", label: "Act I", title: "The Sacred Breeze So Often Breathes", version: "2.0" },
      { id: "ch2a2", label: "Act II", title: "Veils Off in Sun or Shadow", version: "2.0" },
      { id: "ch2a3", label: "Act III", title: "What Yesterday Wept, Today Doth Sing", version: "2.0" },
      {
        id: "ch2-int",
        label: "Interlude",
        title: "Old Man and the Whale",
        version: "2.1",
        optional: true,
      },
      { id: "ch2a4", label: "Act IV", title: "The Maiden, The Defier, The Death Crier", version: "2.2" },
      { id: "ch2a5", label: "Act V", title: "Shadow of Glory", version: "2.4" },
      { id: "ch2a6", label: "Act VI", title: "Flames of Heart", version: "2.4" },
      { id: "ch2a7", label: "Act VII", title: "Dreamcatchers in the Secret Gardens", version: "2.5" },
      {
        id: "ch2-seg1",
        label: "Segue",
        title: "Rust, Sword and the Sun",
        version: "2.5",
        optional: true,
        parts: [
          "New Arrival in The Big City",
          "Gladiator Training",
          "The Impossible Trial",
          "At the Summit of Septimont",
        ],
        note: "Also called Epic of the Blazing Sun.",
      },
      { id: "ch2a8", label: "Act VIII", title: "By Sun's Burning Hand", version: "2.6" },
      { id: "ch2a9", label: "Act IX", title: "By Moon's Fated Light", version: "2.6" },
      { id: "ch2a10", label: "Act X", title: "The Bygone Shall Always Return", version: "2.7" },
      { id: "ch2a11", label: "Act XI", title: "Dawn Breaks on Dark Tides", version: "2.7" },
      {
        id: "ch2-seg2",
        label: "Segue",
        title: "A Stranger in a Strange Land",
        version: "2.7",
        optional: true,
      },
      {
        id: "ch2a12",
        label: "Act XII",
        title: "Stagnant Dawn on Wastelands",
        version: "2.8",
        note: "Returns to The Black Shores.",
      },
      {
        id: "ch2-seg3",
        label: "Segue",
        title: "Flowing Starlight in the Iris",
        version: "2.8",
        optional: true,
      },
    ],
  },
  {
    id: "ch3",
    label: "Chapter III",
    title: "To the Stars Yet to Shine",
    version: "3.0 – 3.4",
    region: "Roya Frostlands",
    unlocks: ["Roya Frostlands", "3.x character materials"],
    acts: [
      { id: "ch3-pro", label: "Prologue", title: "When the Unknown Thrums", version: "3.0" },
      { id: "ch3a1", label: "Act I", title: "What Burns Beneath Frostlands", version: "3.0" },
      { id: "ch3a2", label: "Act II", title: "Ode to the Second Sunrise", version: "3.0" },
      { id: "ch3a3", label: "Act III", title: "The Star That Voyages Far", version: "3.1" },
      {
        id: "ch3-seg1",
        label: "Segue",
        title: "All That Sunlight Touches",
        version: "3.1",
        optional: true,
      },
      { id: "ch3a4", label: "Act IV", title: "Gold Suspended in Shadows", version: "3.2" },
      {
        id: "ch3-seg2",
        label: "Segue",
        title: "Rabbit Reflected in Shades",
        version: "3.2",
        optional: true,
      },
      {
        id: "ch3-seg3",
        label: "Segue",
        title: "The Flaming Red from Tomorrow",
        optional: true,
      },
      {
        id: "ch3-seg4",
        label: "Segue",
        title: "Wishes in the Bell",
        version: "3.3",
        optional: true,
      },
      { id: "ch3a5", label: "Act V", title: "Starlights from Yesterdays", version: "3.3" },
      {
        id: "ch3-seg5",
        label: "Segue",
        title: "Wishes in the Bell: Epilogue",
        version: "3.3",
        optional: true,
      },
      {
        id: "ch3-seg6",
        label: "Segue",
        title: "Beneath a Melting Night Sky",
        version: "3.3",
        optional: true,
      },
      {
        id: "ch3-side",
        label: "Side Story",
        title: "At Dream's Edge",
        version: "3.4",
        optional: true,
        note: "Cyberpunk: Edgerunners collaboration.",
      },
      {
        id: "ch3-seg7",
        label: "Segue",
        title: "We Choose the Sky",
        version: "3.4",
        optional: true,
      },
    ],
  },
  {
    id: "ch4",
    label: "Chapter IV",
    title: "Rebirth From the Depths",
    version: "3.5 – 3.7",
    region: "Mengzhou",
    unlocks: ["Mengzhou", "Current story frontier"],
    acts: [
      { id: "ch4a1", label: "Act I", title: "The Wind Before the Storm", version: "3.5" },
      { id: "ch4a2", label: "Act II", title: "Xuanling Sings, Storm Quelled", version: "3.5" },
      {
        id: "ch4-seg1",
        label: "Segue",
        title: "The Chant of Unseen Ties",
        version: "3.5",
        optional: true,
      },
      { id: "ch4a3", label: "Act III", title: "Song of the Heart Sword", version: "3.6" },
      {
        id: "ch4-seg2",
        label: "Segue",
        title: "The Nethermancer's Requiem",
        version: "3.6",
        optional: true,
      },
      { id: "ch4a4", label: "Act IV", title: "Simulacrum of the Heart", version: "3.7" },
      {
        id: "ch4-tales",
        label: "Tales",
        title: "Moonlike Heart, Mortal Longing",
        optional: true,
      },
    ],
  },
];

export const CHAPTER_DISCLAIMER =
  "Chapter and act titles come from the Wuthering Waves Wiki's Main Quest list, checked 30 October 2026. Segues, interludes and side stories tick on their own; numbered acts fill in order, because the game gates each behind the one before it.";

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
