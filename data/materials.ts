/**
 * Where every ascension material in data/characters.ts comes from.
 *
 * Source: the Wuthering Waves Wiki's item and boss pages, checked 30 October
 * 2026. Boss locations are quoted as the wiki gives them, deepest place first.
 *
 * Note what this file deliberately does NOT do: estimate how many runs a
 * quantity takes. Drops per claim scale with the boss's level and there is no
 * published table, so a "you need 7 runs" figure would be invented. The cost
 * per claim is real; the run count is yours to discover.
 */

export type Material =
  | {
      kind: "boss";
      /** The Overlord-class boss that drops it. */
      boss: string;
      /** Deepest location first, as the wiki writes it. */
      location: string;
      region: string;
    }
  | {
      kind: "gather";
      /** The region whose open world grows it. */
      region: string;
      /** Also buyable from this vendor, where one sells it. */
      vendor?: string;
    }
  | {
      kind: "quest";
      detail: string;
    };

export const MATERIALS: Record<string, Material> = {
  // ---------- Boss drops — 60 Waveplate per claim ----------
  "Truth in Lies": {
    kind: "boss",
    boss: "Fenrico",
    location: "Lumen Tower, Fabricatorium of the Deep",
    region: "Rinascita",
  },
  "Abyssal Husk": {
    kind: "boss",
    boss: "Lady of the Sea",
    location: "Capitoline Hill, Septimont",
    region: "Rinascita",
  },
  "Blazing Bone": {
    kind: "boss",
    boss: "Dragon of Dirge",
    location: "Figurehead's Shrine, Penitent's End",
    region: "Rinascita",
  },
  "Blighted Crown of Puppet King": {
    kind: "boss",
    boss: "The False Sovereign",
    location: "Earthrend Wedge, Sanguis Plateaus",
    region: "Rinascita",
  },
  "Cleansing Conch": {
    kind: "boss",
    boss: "Lorelei",
    location: "Atrium of Reflections, Nimbus Sanctum",
    region: "Rinascita",
  },
  "Unfading Glory": {
    kind: "boss",
    boss: "Lioness of Glory",
    location: "Titanbone Expanse, Septimont",
    region: "Rinascita",
  },
  "Burning Judgment": {
    kind: "boss",
    boss: "Reactor Husk",
    location: "Fangspire Chasm",
    region: "Roya Frostlands",
  },
  "Our Choice": {
    kind: "boss",
    boss: "Nameless Explorer",
    location: "SkyArk Space Station, Starblind Crashsite",
    region: "Roya Frostlands",
  },
  "Suncoveter's Reach": {
    kind: "boss",
    boss: "Hyvatia",
    location: "Starward Riseway",
    region: "Roya Frostlands",
  },
  "Gold-Dissolving Feather": {
    kind: "boss",
    boss: "Impermanence Heron",
    location: "Camp Overwatch, Desorock Highland",
    region: "Huanglong",
  },
  "Roaring Rock Fist": {
    kind: "boss",
    boss: "Feilian Beringal",
    location: "Giant Banyan, Dim Forest",
    region: "Huanglong",
  },
  "Topological Confinement": {
    kind: "boss",
    boss: "Fallacy of No Return",
    location: "Data Torrent, Tethys' Deep",
    region: "The Black Shores",
  },

  // ---------- Open-world gathering — free, but region-locked ----------
  "Belle Poppy": { kind: "gather", region: "Jinzhou" },
  Coriolus: { kind: "gather", region: "Jinzhou" },
  Iris: { kind: "gather", region: "Jinzhou" },
  Lanternberry: { kind: "gather", region: "Jinzhou" },
  "Pecok Flower": { kind: "gather", region: "Jinzhou" },
  "Terraspawn Fungus": { kind: "gather", region: "Jinzhou" },
  "Violet Coral": { kind: "gather", region: "Jinzhou" },
  "Wintry Bell": { kind: "gather", region: "Jinzhou" },

  "Loong's Pearl": { kind: "gather", region: "Mt. Firmament" },
  "Pavo Plum": { kind: "gather", region: "Mt. Firmament" },

  Afterlife: { kind: "gather", region: "Rinascita", vendor: "Danvers" },
  "Bamboo Iris": { kind: "gather", region: "Rinascita" },
  "Bloodleaf Viburnum": { kind: "gather", region: "Rinascita" },
  "Firecracker Jewelweed": { kind: "gather", region: "Rinascita" },
  "Golden Fleece": { kind: "gather", region: "Rinascita" },
  "Luminous Calendula": { kind: "gather", region: "Rinascita" },
  "Seaside Cendrelis": { kind: "gather", region: "Rinascita" },
  "Sliverglow Bloom": { kind: "gather", region: "Rinascita" },
  "Stone Rose": { kind: "gather", region: "Rinascita" },
  "Sword Acorus": { kind: "gather", region: "Rinascita" },

  Nova: { kind: "gather", region: "The Black Shores", vendor: "KU-Money" },
  "Summer Flower": { kind: "gather", region: "The Black Shores" },

  "Gemini Spore": { kind: "gather", region: "Lahai-Roi", vendor: "N.A.N.A." },
  "Moss Amber": { kind: "gather", region: "Lahai-Roi", vendor: "N.A.N.A." },
  Rimewisp: { kind: "gather", region: "Lahai-Roi" },

  // ---------- Neither ----------
  "Mysterious Code": {
    kind: "quest",
    detail: "Casket Delivery and main quests. Rover's own material, not farmable.",
  },
};

/**
 * Which chapter opens each region, and the act id in data/progress.ts that
 * marks it reached — so the shopping list can say a material is behind story
 * you have not played yet.
 */
export const REGION_GATE: Record<string, { label: string; act?: string }> = {
  Jinzhou: { label: "Open from the start" },
  Huanglong: { label: "Open from the start" },
  "Mt. Firmament": { label: "Chapter I, Act VII", act: "ch1a7" },
  "The Black Shores": { label: "Chapter I, Act VIII", act: "ch1a8" },
  Rinascita: { label: "Chapter II", act: "ch2-pro" },
  "Roya Frostlands": { label: "Chapter III", act: "ch3-pro" },
  "Lahai-Roi": { label: "Chapter III", act: "ch3-pro" },
  Mengzhou: { label: "Chapter IV", act: "ch4a1" },
};

export type Activity = {
  name: string;
  waveplate: number;
  gives: string;
  note?: string;
};

/** What a claim costs, per the wiki's challenge pages. */
export const WAVEPLATE_COSTS: Activity[] = [
  {
    name: "Boss Challenge",
    waveplate: 60,
    gives: "Resonator ascension materials",
    note: "Overlord class. Bosses respawn, so this is the repeatable one.",
  },
  {
    name: "Weekly Challenge",
    waveplate: 60,
    gives: "Skill upgrade materials",
    note: "Calamity class. Limited attempts per week.",
  },
  {
    name: "Tacet Field",
    waveplate: 60,
    gives: "Echoes and Echo development materials",
  },
  {
    name: "Forgery Challenge",
    waveplate: 40,
    gives: "Weapon and skill materials",
  },
  {
    name: "Simulation Training",
    waveplate: 40,
    gives: "Shell Credits and character EXP",
    note: "Credits block more upgrades than any material does.",
  },
];

export const MATERIALS_NOTE =
  "Gathered materials cost nothing but travel time: the catch is the region. Boss materials cost 60 Waveplate per claim; how many claims a quantity takes depends on the boss's level, which is not published, so nothing here guesses at run counts.";
