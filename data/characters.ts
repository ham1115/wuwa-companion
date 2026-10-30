/**
 * Build parameters for every Resonator.
 *
 * Source: prydwen.gg character build guides (reviewed patch 3.6, captured
 * 22 October 2026). Only the structured build parameters are reproduced —
 * weapon/echo/set rankings, main-stat slots and substat order. Prydwen's
 * written guides, reviews and tier-list commentary are their own work and
 * are not included here; go read them at prydwen.gg.
 */

export type Element =
  | "Aero"
  | "Electro"
  | "Fusion"
  | "Glacio"
  | "Havoc"
  | "Spectro";

export type WeaponType =
  | "Sword"
  | "Broadblade"
  | "Pistols"
  | "Gauntlets"
  | "Rectifier";

export type Role = "DPS" | "Support" | "Hybrid";

export type Character = {
  id: string;
  name: string;
  rarity: 4 | 5;
  element: Element;
  weaponType: WeaponType;
  /** Null for characters with no published build yet. */
  role: Role | null;
  /** Ranked best-in-slot weapons, strongest first. */
  weapons: string[];
  /** Ranked Sonata (echo set) options. */
  sets: string[];
  /** Recommended main (4-cost) Echo options. */
  echoes: string[];
  /** Main stat priority per Echo cost slot. */
  stats: string[];
  /** Substat priority order. */
  substats: string;
  /** Character-specific ascension materials (generic cores omitted). */
  materials: string[];
};

export const ELEMENTS: Element[] = [
  "Aero",
  "Electro",
  "Fusion",
  "Glacio",
  "Havoc",
  "Spectro",
];

export const ROLES: Role[] = ["DPS", "Support", "Hybrid"];

export const WEAPON_TYPES: WeaponType[] = [
  "Sword",
  "Broadblade",
  "Pistols",
  "Gauntlets",
  "Rectifier",
];

/**
 * Empty on purpose: every visitor picks their own in Settings. Kept as an
 * export so the owned-list hook has a default to seed from.
 */
export const OWNED: string[] = [];

export const CHARACTERS: Character[] = [
  {
    id: "aalto", name: "Aalto", rarity: 4, element: "Aero", weaponType: "Pistols", role: "Hybrid",
    weapons: ["The Last Dance (R1)", "Woodland Aria (R1)", "Static Mist (R1)", "Relativistic Jet (R5)"],
    sets: ["Sierra Gale", "Windward Pilgrimage", "Moonlit Clouds"],
    echoes: ["Nightmare: Feilian Beringal", "Nightmare: Kelpie", "Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG > Energy Regen", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK ≥ Basic Attack DMG% > Resonance Skill DMG%",
    materials: ["46x Roaring Rock Fist", "60x Wintry Bell"],
  },
  {
    id: "aemeath", name: "Aemeath", rarity: 5, element: "Fusion", weaponType: "Sword", role: "DPS",
    weapons: ["Everbright Polestar (R1)", "Emerald of Genesis (R1)", "Red Spring (R1)", "Emerald Sentence (R1)"],
    sets: ["Trailblazing Star"],
    echoes: ["Hyvatia", "Reactor Husk", "Reminiscence: Denia"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: ATK% = Fusion DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT DMG = CRIT Rate > ATK% > Liberation DMG% > ATK",
    materials: ["46x Our Choice", "60x Moss Amber"],
  },
  {
    id: "augusta", name: "Augusta", rarity: 5, element: "Electro", weaponType: "Broadblade", role: "DPS",
    weapons: ["Thunderflare Dominion (R1)", "Verdant Summit (R1)", "Ages of Harvest (R1)", "Wildfire Mark (R1)"],
    sets: ["Crown of Valor"],
    echoes: ["Lady of the Sea", "Fallacy of No Return", "The False Sovereign"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% = Heavy Attack DMG% > ATK > Resonance Skill DMG%",
    materials: ["46x Blighted Crown of Puppet King", "60x Luminous Calendula"],
  },
  {
    id: "baizhi", name: "Baizhi", rarity: 4, element: "Glacio", weaponType: "Rectifier", role: "Support",
    weapons: ["Stellar Symphony (R1)", "Variation (R5)", "Call of the Abyss (R5)", "Rectifier of Voyager (R5)"],
    sets: ["Rejuvenating Glow", "Moonlit Clouds"],
    echoes: ["Fallacy of No Return", "Impermanence Heron"],
    stats: ["4 cost: HP% / CRIT Rate", "3 cost: Energy Regen", "3 cost: Energy Regen", "1 cost: HP%", "1 cost: HP%"],
    substats: "Energy Regen (Until Satisfied) > HP% > Flat HP",
    materials: ["60x Lanternberry"],
  },
  {
    id: "brant", name: "Brant", rarity: 5, element: "Fusion", weaponType: "Sword", role: "DPS",
    weapons: ["Unflickering Valor (R1)", "Laser Shearer (R1)", "Bloodpact's Pledge (R5)", "Red Spring (R1)"],
    sets: ["Molten Rift", "Tidebreaking Courage"],
    echoes: ["Lioness of Glory", "Myriad Snare: Rustfire Chassis", "Nightmare: Inferno Rider"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Energy Regen", "3 cost: Energy Regen / Fusion DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until 250%) > CRIT Rate = CRIT DMG > Energy Regen (Above 250%) > Basic Attack DMG% > ATK% > ATK",
    materials: ["46x Blazing Bone", "60x Golden Fleece"],
  },
  {
    id: "buling", name: "Buling", rarity: 4, element: "Electro", weaponType: "Rectifier", role: "Support",
    weapons: ["Stringmaster (R1)", "Lethean Elegy (R1)", "Rime-Draped Sprouts (R1)", "Luminous Hymn (R1)"],
    sets: ["Rejuvenating Glow"],
    echoes: ["Fallacy of No Return"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > Energy Regen", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["46x Blighted Crown of Puppet King", "60x Pecok Flower"],
  },
  {
    id: "calcharo", name: "Calcharo", rarity: 5, element: "Electro", weaponType: "Broadblade", role: "DPS",
    weapons: ["Wildfire Mark (R1)", "Lustrous Razor (R1)", "Ages of Harvest (R1)", "Verdant Summit (R1)"],
    sets: ["Void Thunder", "Endless Resonance"],
    echoes: ["Nightmare: Thundering Mephis", "Nightmare: Tempest Mephis", "Mech Abomination"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK = Liberation DMG%",
    materials: ["60x Iris"],
  },
  {
    id: "camellya", name: "Camellya", rarity: 5, element: "Havoc", weaponType: "Sword", role: "DPS",
    weapons: ["Red Spring (R1)", "Emerald Sentence (R1)", "Frostburn (R1)", "Everbright Polestar (R1)"],
    sets: ["Havoc Eclipse", "Endless Resonance"],
    echoes: ["Hyvatia", "Reactor Husk", "Nightmare: Crownless"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: ATK% ≥ Havoc DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Basic DMG% > ATK",
    materials: ["46x Topological Confinement", "60x Nova"],
  },
  {
    id: "cantarella", name: "Cantarella", rarity: 5, element: "Havoc", weaponType: "Rectifier", role: "Hybrid",
    weapons: ["Whispers of Sirens (R1)", "Rime-Draped Sprouts (R1)", "Stringmaster (R1)", "Lethean Elegy (R1)"],
    sets: ["Midnight Veil", "Moonlit Clouds"],
    echoes: ["Nightmare: Hecate", "Bell-Borne Geochelone", "Lorelei"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: Havoc DMG > Energy Regen", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT RATE = CRIT DMG > ATK% > ATK = Basic ATK DMG%",
    materials: ["46x Cleansing Conch", "60x Seaside Cendrelis"],
  },
  {
    id: "carlotta", name: "Carlotta", rarity: 5, element: "Glacio", weaponType: "Pistols", role: "DPS",
    weapons: ["The Last Dance (R1)", "Phasic Homogenizer (R1)", "Woodland Aria (R1)", "Spectrum Blaster (R1)"],
    sets: ["Frosty Resolve"],
    echoes: ["Hyvatia", "Reactor Husk", "Sentry Construct"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Glacio DMG", "3 cost: Glacio DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Resonance Skill DMG > ATK",
    materials: ["60x Sword Acorus"],
  },
  {
    id: "cartethyia", name: "Cartethyia", rarity: 5, element: "Aero", weaponType: "Sword", role: "DPS",
    weapons: ["Defier's Thorn (R1)", "Red Spring (R1)", "Blazing Brilliance (R1)", "Feather Edge (R5)"],
    sets: ["Windward Pilgrimage"],
    echoes: ["Nightmare: Kelpie", "Reminiscence: Threnodian - Leviathan", "Reminiscence: Fleurdelys"],
    stats: ["4 cost: CRIT Rate", "4 cost: CRIT DMG", "1 cost: HP%", "1 cost: HP%", "1 cost: HP%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > HP% > Basic Attack DMG% = Liberation DMG% > HP",
    materials: ["46x Unfading Glory", "60x Bamboo Iris"],
  },
  {
    id: "changli", name: "Changli", rarity: 5, element: "Fusion", weaponType: "Sword", role: "Hybrid",
    weapons: ["Blazing Brilliance (R1)", "Emerald of Genesis (R1)", "Emerald Sentence (R1)", "Frostburn (R1)"],
    sets: ["Molten Rift"],
    echoes: ["Dragon of Dirge", "Lioness of Glory", "Nightmare: Inferno Rider"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: ATK% ≥ Fusion DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Resonance Skill DMG%",
    materials: ["60x Pavo Plum"],
  },
  {
    id: "chisa", name: "Chisa", rarity: 5, element: "Havoc", weaponType: "Broadblade", role: "Support",
    weapons: ["Kumokiri (R1)", "Wildfire Mark (R1)", "Ages of Harvest (R1)", "Verdant Summit (R1)"],
    sets: ["Rejuvenating Glow", "Moonlit Clouds", "Thread of Severed Fate"],
    echoes: ["Sigillum", "Reminiscence: Denia", "Fallacy of No Return"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: Havoc DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Liberation DMG% > ATK",
    materials: ["46x Abyssal Husk", "60x Summer Flower"],
  },
  {
    id: "chixia", name: "Chixia", rarity: 4, element: "Fusion", weaponType: "Pistols", role: "DPS",
    weapons: ["The Last Dance (R1)", "Static Mist (R1)", "Thunderbolt (R5)", "Relativistic Jet (R5)"],
    sets: ["Molten Rift"],
    echoes: ["Nightmare: Inferno Rider", "Inferno Rider"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: Fusion DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Belle Poppy"],
  },
  {
    id: "ciaccona", name: "Ciaccona", rarity: 5, element: "Aero", weaponType: "Pistols", role: "Hybrid",
    weapons: ["Woodland Aria (R1)", "Phasic Homogenizer (R1)", "Spectrum Blaster (R1)", "Lux & Umbra (R1)"],
    sets: ["Gusts of Welkin", "Moonlit Clouds", "Windward Pilgrimage"],
    echoes: ["Reminiscence: Fleurdelys", "Reminiscence: Threnodian - Leviathan", "Nightmare: Kelpie"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["46x Blazing Bone", "60x Golden Fleece"],
  },
  {
    id: "danjin", name: "Danjin", rarity: 4, element: "Havoc", weaponType: "Sword", role: "Hybrid",
    weapons: ["Blazing Brilliance (R1)", "Red Spring (R1)", "Emerald of Genesis (R1)", "Commando of Conviction (R5)"],
    sets: ["Moonlit Clouds", "Midnight Veil", "Havoc Eclipse"],
    echoes: ["Impermanence Heron", "Lorelei", "Nightmare: Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: Havoc DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Heavy DMG% > Resonance Skill DMG%",
    materials: ["60x Belle Poppy"],
  },
  {
    id: "denia", name: "Denia", rarity: 5, element: "Fusion", weaponType: "Rectifier", role: "Hybrid",
    weapons: ["Forged Dwarf Star (R1)", "Stringmaster (R1)", "Lethean Elegy (R1)", "Luminous Hymn (R1)"],
    sets: ["Chromatic Foam", "Reel of Spliced Memories", "Flaming Clawprint"],
    echoes: ["Sigillum", "Fallacy of No Return", "Twin Nova: Nebulous Cannon"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: Fusion DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > Liberation DMG% ≥ ATK% > ATK",
    materials: [],
  },
  {
    id: "encore", name: "Encore", rarity: 5, element: "Fusion", weaponType: "Rectifier", role: "DPS",
    weapons: ["Stringmaster (R1)", "Rime-Draped Sprouts (R1)", "Whispers of Sirens (R1)", "Lethean Elegy (R1)"],
    sets: ["Molten Rift", "Flaming Clawprint"],
    echoes: ["Nightmare: Inferno Rider", "Inferno Rider", "Lioness of Glory"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: Fusion DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Basic DMG% > Skill DMG%",
    materials: ["60x Pecok Flower"],
  },
  {
    id: "galbrena", name: "Galbrena", rarity: 5, element: "Fusion", weaponType: "Pistols", role: "DPS",
    weapons: ["Lux & Umbra (R1)", "Phasic Homogenizer (R1)", "Spectrum Blaster (R1)", "The Last Dance (R1)"],
    sets: ["Flamewing's Shadow"],
    echoes: ["Lioness of Glory", "Reactor Husk", "Corrosaurus"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: Fusion DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Heavy Attack DMG%",
    materials: ["46x Blighted Crown of Puppet King", "60x Stone Rose"],
  },
  {
    id: "hiyuki", name: "Hiyuki", rarity: 5, element: "Glacio", weaponType: "Sword", role: "DPS",
    weapons: ["Frostburn (R1)", "Blazing Brilliance (R1)", "Emerald of Genesis (R1)", "Emerald Sentence (R1)"],
    sets: ["Wishes of Quiet Snowfall"],
    echoes: ["Glommoth", "Forbidden Bastion", "Reminiscence: Threnodian - Voidborne Construct"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Glacio DMG", "3 cost: Glacio DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT DMG = CRIT Rate (until 75%) > ATK% > Liberation DMG% > ATK",
    materials: [],
  },
  {
    id: "hsin", name: "Hsin", rarity: 5, element: "Electro", weaponType: "Rectifier", role: "DPS",
    weapons: ["Blooming Jadehaven (R1)", "Lethean Elegy (R1)", "Stringmaster (R1)", "Whispers of Sirens (R1)"],
    sets: ["Heart of Sworn Vigil"],
    echoes: ["Impermanence Heron", "Fallacy of No Return", "Soulfrayer"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% = Skill DMG% > ATK",
    materials: [],
  },
  {
    id: "iuno", name: "Iuno", rarity: 5, element: "Aero", weaponType: "Gauntlets", role: "DPS",
    weapons: ["Moongazer's Sigil (R1)", "Verity's Handle (R1)", "Blazing Justice (R1)", "Aether Strike (R5)"],
    sets: ["Crown of Valor", "Moonlit Clouds"],
    echoes: ["Hyvatia", "Reactor Husk", "Fallacy of No Return"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > Resonance Liberation DMG% ≥ ATK% > ATK",
    materials: ["46x Abyssal Husk", "60x Sliverglow Bloom"],
  },
  {
    id: "jianxin", name: "Jianxin", rarity: 5, element: "Aero", weaponType: "Gauntlets", role: "Hybrid",
    weapons: ["Verity's Handle (R1)", "Moongazer's Sigil (R1)", "Blazing Justice (R1)", "Tragicomedy (R1)"],
    sets: ["Moonlit Clouds"],
    echoes: ["Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG / Energy Regen", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Liberation DMG% > Heavy Attack DMG% > Basic Attack DMG%",
    materials: ["46x Roaring Rock Fist", "60x Lanternberry"],
  },
  {
    id: "jingran", name: "Jingran", rarity: 5, element: "Fusion", weaponType: "Broadblade", role: "DPS",
    weapons: ["Thousandfold Deliverance (R1)", "Thunderflare Dominion (R1)", "Verdant Summit (R1)", "Wildfire Mark (R1)"],
    sets: ["Lamp of Nether Road"],
    echoes: ["Bell-Borne Geochelone", "Fallacy of No Return", "Myriad Snare: Rustfire Chassis"],
    stats: ["4 cost: CRIT DMG / HP%", "4 cost: CRIT DMG / HP%", "1 cost: HP%", "1 cost: HP%", "1 cost: HP%"],
    substats: "Energy Regen (Until Satisfied) > HP (Until 50000) > CRIT Rate = CRIT DMG > Heavy DMG% > ATK% > ATK",
    materials: [],
  },
  {
    id: "jinhsi", name: "Jinhsi", rarity: 5, element: "Spectro", weaponType: "Broadblade", role: "DPS",
    weapons: ["Ages of Harvest (R1)", "Kumokiri (R1)", "Wildfire Mark (R1)", "Verdant Summit (R1)"],
    sets: ["Celestial Light"],
    echoes: ["Reminiscence: Suhsin the Inevitable", "Fallacy of No Return", "Jué"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: Spectro DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Resonance Skill DMG% > ATK",
    materials: ["60x Loong's Pearl"],
  },
  {
    id: "jiyan", name: "Jiyan", rarity: 5, element: "Aero", weaponType: "Broadblade", role: "DPS",
    weapons: ["Verdant Summit (R1)", "Thunderflare Dominion (R1)", "Ages of Harvest (R1)", "Kumokiri (R1)"],
    sets: ["Windward Pilgrimage", "Sierra Gale"],
    echoes: ["Lady of the Sea", "Nightmare: Kelpie", "Nightmare: Feilian Beringal"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: ATK% ≥ Aero DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK = Heavy DMG%",
    materials: ["46x Roaring Rock Fist", "60x Pecok Flower"],
  },
  {
    id: "lily", name: "Lily", rarity: 5, element: "Spectro", weaponType: "Pistols", role: "Support",
    weapons: [], sets: [], echoes: [], stats: [],
    substats: "No build yet. Kuro's Resonator Archive preview (8 October 2026) confirms Spectro Pistols and a healing support role for version 3.8; everything else circulating is beta leaks that contradict each other, so nothing is recorded here until she ships.",
    materials: [],
  },
  {
    id: "lingyang", name: "Lingyang", rarity: 5, element: "Glacio", weaponType: "Gauntlets", role: "DPS",
    weapons: ["Moongazer's Sigil (R1)", "Blazing Justice (R1)", "Verity's Handle (R1)", "Tragicomedy (R1)"],
    sets: ["Endless Resonance", "Frosty Resolve", "Freezing Frost"],
    echoes: ["Mech Abomination", "Sentry Construct", "Lampylumen Myriad"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Glacio DMG", "3 cost: Glacio DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Coriolus"],
  },
  {
    id: "lucilla", name: "Lucilla", rarity: 5, element: "Glacio", weaponType: "Rectifier", role: "Hybrid",
    weapons: ["Freeze Frame (R1)", "Whispers of Sirens (R1)", "Stringmaster (R1)", "Lethean Elegy (R1)"],
    sets: ["Wishes of Quiet Snowfall", "Moonlit Clouds", "Dream of the Lost"],
    echoes: ["Reminiscence: Threnodian - Voidborne Construct", "Forbidden Bastion", "Nameless Explorer"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Glacio DMG", "3 cost: Glacio DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "CRIT Rate = CRIT DMG > ATK% > ATK = Basic DMG%",
    materials: [],
  },
  {
    id: "lucy", name: "Lucy", rarity: 5, element: "Spectro", weaponType: "Pistols", role: "DPS",
    weapons: ["Spectral Trigger (R1)", "Lux & Umbra (R1)", "Skull Thrasher (R1)", "Phasic Homogenizer (R1)"],
    sets: ["Shadow of Shattered Dreams"],
    echoes: ["Bell-Borne Geochelone", "Reactor Husk", "Reminiscence - Nightmare: Adam Smasher"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: Spectro DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Heavy DMG% > ATK",
    materials: [],
  },
  {
    id: "lumi", name: "Lumi", rarity: 4, element: "Electro", weaponType: "Broadblade", role: "Hybrid",
    weapons: ["Ages of Harvest (R1)", "Verdant Summit (R1)", "Lustrous Razor (R1)", "Autumntrace (R5)"],
    sets: ["Moonlit Clouds", "Void Thunder"],
    echoes: ["Impermanence Heron", "Nightmare: Thundering Mephis"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > Energy Regen", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Terraspawn Fungus"],
  },
  {
    id: "lupa", name: "Lupa", rarity: 5, element: "Fusion", weaponType: "Broadblade", role: "Hybrid",
    weapons: ["Wildfire Mark (R1)", "Ages of Harvest (R1)", "Kumokiri (R1)", "Verdant Summit (R1)"],
    sets: ["Flaming Clawprint"],
    echoes: ["Sigillum", "Reactor Husk", "Lioness of Glory"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: Fusion DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Liberation ATK DMG%",
    materials: ["46x Unfading Glory", "60x Bloodleaf Viburnum"],
  },
  {
    id: "luuk-herssen", name: "Luuk Herssen", rarity: 5, element: "Spectro", weaponType: "Gauntlets", role: "DPS",
    weapons: ["Daybreaker's Spine (R1)", "Pulsation Bracer (R1)", "Blazing Justice (R1)", "Moongazer's Sigil (R1)"],
    sets: ["Rite of Gilded Revelation"],
    echoes: ["Voidwing Moth", "Reactor Husk", "Twin Nova: Nebulous Cannon"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: ATK% = Spectro DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT DMG = CRIT Rate > ATK% = Basic DMG% > ATK",
    materials: [],
  },
  {
    id: "lynae", name: "Lynae", rarity: 5, element: "Spectro", weaponType: "Pistols", role: "Hybrid",
    weapons: ["Spectrum Blaster (R1)", "Static Mist (R1)", "Phasic Homogenizer (R1)", "Woodland Aria (R1)"],
    sets: ["Pact of Neonlight Leap"],
    echoes: ["Sigillum", "Reactor Husk", "Hyvatia"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: Spectro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK = Basic Attack DMG%",
    materials: ["46x Suncoveter's Reach", "60x Rimewisp"],
  },
  {
    id: "mornye", name: "Mornye", rarity: 5, element: "Fusion", weaponType: "Broadblade", role: "Support",
    weapons: ["Starfield Calibrator (R1)", "Discord (R5)", "Broadblade#41 (R5)"],
    sets: ["Halo of Starry Radiance", "Rejuvenating Glow"],
    echoes: ["Reactor Husk", "Spacetrek Explorer", "Fallacy of No Return"],
    stats: ["4 cost: DEF% > Healing Bonus", "3 cost: Energy Regen", "3 cost: Energy Regen / Fusion DMG", "1 cost: DEF%", "1 cost: DEF%"],
    substats: "Energy Regen (Until 260%) >>> Liberation DMG% > CRIT DMG > DEF% > CRIT Rate (until 20%) > ATK% > DEF > ATK",
    materials: ["46x Burning Judgment", "60x Gemini Spore"],
  },
  {
    id: "mortefi", name: "Mortefi", rarity: 4, element: "Fusion", weaponType: "Pistols", role: "Hybrid",
    weapons: ["Static Mist (R1)", "Spectrum Blaster (R1)", "The Last Dance (R1)", "Woodland Aria (R1)"],
    sets: ["Moonlit Clouds", "Empyrean Anthem"],
    echoes: ["Myriad Snare: Rustfire Chassis", "Lioness of Glory", "Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Fusion DMG", "3 cost: Fusion DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Coriolus"],
  },
  {
    id: "phoebe", name: "Phoebe", rarity: 5, element: "Spectro", weaponType: "Rectifier", role: "DPS",
    weapons: ["Luminous Hymn (R1)", "Lethean Elegy (R1)", "Stringmaster (R1)", "Whispers of Sirens (R1)"],
    sets: ["Eternal Radiance", "Moonlit Clouds"],
    echoes: ["Hyvatia", "Fallacy of No Return", "Capitaneus"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: Spectro DMG = ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Heavy ATK DMG%",
    materials: ["46x Cleansing Conch", "60x Firecracker Jewelweed"],
  },
  {
    id: "phrolova", name: "Phrolova", rarity: 5, element: "Havoc", weaponType: "Rectifier", role: "DPS",
    weapons: ["Lethean Elegy (R1)", "Stringmaster (R1)", "Whispers of Sirens (R1)", "Rime-Draped Sprouts (R1)"],
    sets: ["Dream of the Lost"],
    echoes: ["Voidwing Moth", "Bell-Borne Geochelone", "Nightmare: Hecate"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: Havoc DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "CRIT RATE = CRIT DMG > ATK% > Skill DMG% > ATK",
    materials: ["46x Truth in Lies", "60x Afterlife"],
  },
  {
    id: "qingxiao", name: "Qingxiao", rarity: 5, element: "Aero", weaponType: "Sword", role: "DPS",
    weapons: ["Glint of Clouds (R1)", "Red Spring (R1)", "Azure Oath (R1)", "Everbright Polestar (R1)"],
    sets: ["Heart of Evil's Purge"],
    echoes: ["Voidwing Moth", "Reactor Husk", "Calamity Effigy"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: ATK% ≥ Aero DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Heavy/Liberation/Basic DMG%",
    materials: [],
  },
  {
    id: "qiuyuan", name: "Qiuyuan", rarity: 5, element: "Aero", weaponType: "Sword", role: "Hybrid",
    weapons: ["Emerald Sentence (R1)", "Red Spring (R1)", "Blazing Brilliance (R1)", "Feather Edge (R5)"],
    sets: ["Law of Harmony", "Moonlit Clouds"],
    echoes: ["Nameless Explorer", "Nightmare: Kelpie", "Reminiscence: Fenrico"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Heavy Attack DMG% > ATK",
    materials: ["46x Truth in Lies", "60x Wintry Bell"],
  },
  {
    id: "rebecca", name: "Rebecca", rarity: 5, element: "Electro", weaponType: "Pistols", role: "Hybrid",
    weapons: ["Skull Thrasher (R1)", "Spectrum Blaster (R1)", "Static Mist (R1)", "Phasic Homogenizer (R1)"],
    sets: ["Moonlit Clouds", "Shadow of Shattered Dreams", "Pact of Neonlight Leap"],
    echoes: ["Thousand-Puppet Pavilion", "Forbidden Bastion", "Bell-Borne Geochelone"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > Basic DMG% > ATK% > ATK",
    materials: [],
  },
  {
    id: "roccia", name: "Roccia", rarity: 5, element: "Havoc", weaponType: "Gauntlets", role: "Hybrid",
    weapons: ["Tragicomedy (R1)", "Solsworn Ciphers (R1)", "Blazing Justice (R1)", "Verity's Handle (R1)"],
    sets: ["Midnight Veil", "Moonlit Clouds"],
    echoes: ["Nightmare: Hecate", "Lorelei", "Nightmare: Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: Havoc DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate > CRIT DMG > ATK% > Heavy ATK DMG% > ATK",
    materials: ["46x Cleansing Conch", "60x Firecracker Jewelweed"],
  },
  {
    id: "rover-aero", name: "Rover (Aero)", rarity: 5, element: "Aero", weaponType: "Sword", role: "Support",
    weapons: ["Bloodpact's Pledge (R5)", "Bloodpact's Pledge (R1)"],
    sets: ["Rejuvenating Glow", "Windward Pilgrimage"],
    echoes: ["Bell-Borne Geochelone", "Reminiscence: Fleurdelys"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Skill DMG% > ATK",
    materials: [],
  },
  {
    id: "rover-electro", name: "Rover (Electro)", rarity: 5, element: "Electro", weaponType: "Sword", role: "Hybrid",
    weapons: ["Blazing Brilliance (R1)", "Red Spring (R1)", "Azure Oath (R1)", "Everbright Polestar (R1)"],
    sets: ["Flash of Electric Reflection"],
    echoes: ["Reminiscence: Suhsin the Inevitable", "Forbidden Bastion", "Soulfrayer"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Skill DMG% = ATK > Liberation DMG%",
    materials: [],
  },
  {
    id: "rover-havoc", name: "Rover (Havoc)", rarity: 5, element: "Havoc", weaponType: "Sword", role: "DPS",
    weapons: ["Red Spring (R1)", "Blazing Brilliance (R1)", "Emerald of Genesis (R1)", "Somnoire Anchor (R5)"],
    sets: ["Havoc Eclipse"],
    echoes: ["Dreamless"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: Havoc DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Basic DMG% > Liberation DMG%",
    materials: ["5x Mysterious Code", "60x Pecok Flower"],
  },
  {
    id: "rover-spectro", name: "Rover (Spectro)", rarity: 5, element: "Spectro", weaponType: "Sword", role: "Support",
    weapons: ["Blazing Brilliance (R1)", "Emerald of Genesis (R1)", "Lunar Cutter (R5)", "Endless Collapse (R5)"],
    sets: ["Moonlit Clouds", "Rejuvenating Glow", "Eternal Radiance"],
    echoes: ["Impermanence Heron", "Fallacy of No Return", "Nightmare: Mourning Aix"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: Spectro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Skill DMG% > Liberation DMG%",
    materials: ["5x Mysterious Code", "60x Pecok Flower"],
  },
  {
    id: "sanhua", name: "Sanhua", rarity: 4, element: "Glacio", weaponType: "Sword", role: "Hybrid",
    weapons: ["Blazing Brilliance (R1)", "Red Spring (R1)", "Emerald Sentence (R1)", "Azure Oath (R1)"],
    sets: ["Moonlit Clouds"],
    echoes: ["Reminiscence: Suhsin the Inevitable", "Fallacy of No Return", "Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Glacio DMG", "3 cost: Glacio DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Wintry Bell"],
  },
  {
    id: "sigrika", name: "Sigrika", rarity: 5, element: "Aero", weaponType: "Gauntlets", role: "DPS",
    weapons: ["Solsworn Ciphers (R1)", "Blazing Justice (R1)", "Pulsation Bracer (R1)", "Verity's Handle (R1)"],
    sets: ["Sound of True Name"],
    echoes: ["Impermanence Heron", "Nightmare: Kelpie", "Nameless Explorer"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: ATK%", "3 cost: ATK% / Energy Regen", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT DMG = CRIT Rate > Energy Regen (Until 150%) > ATK% > ATK",
    materials: [],
  },
  {
    id: "suisui", name: "Suisui", rarity: 5, element: "Glacio", weaponType: "Rectifier", role: "Support",
    weapons: ["Firstlight's Herald (R1)", "Stellar Symphony (R1)", "Variation (R5)", "Call of the Abyss (R5)"],
    sets: ["Song of Feathered Trace", "Rejuvenating Glow"],
    echoes: ["Forbidden Bastion", "Fallacy of No Return"],
    stats: ["4 cost: CRIT DMG", "3 cost: Energy Regen", "3 cost: Energy Regen / HP%", "1 cost: HP%", "1 cost: HP%"],
    substats: "Energy Regen (Until 260%) > CRIT DMG > HP% > CRIT Rate > Basic DMG% > HP",
    materials: [],
  },
  {
    id: "suoming", name: "Suoming", rarity: 5, element: "Electro", weaponType: "Sword", role: "DPS",
    weapons: ["Unspoken Rue (R1)", "Red Spring (R1)", "Emerald Sentence (R1)", "Azure Oath (R1)"],
    sets: ["Heart of Sworn Vigil", "Moonlit Clouds"],
    echoes: ["Reminiscence: Suhsin the Inevitable", "Fallacy of No Return", "Hyvatia"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG ≥ ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Basic DMG% > ATK",
    materials: [],
  },
  {
    id: "taoqi", name: "Taoqi", rarity: 4, element: "Havoc", weaponType: "Broadblade", role: "Hybrid",
    weapons: ["Discord (R5)", "Dauntless Evernight (R5)"],
    sets: ["Rejuvenating Glow", "Moonlit Clouds"],
    echoes: ["Fallacy of No Return", "Impermanence Heron"],
    stats: ["4 cost: DEF%", "3 cost: Energy Regen / Havoc DMG%", "3 cost: Energy Regen / Havoc DMG", "1 cost: DEF%", "1 cost: DEF%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > DEF% > DEF",
    materials: ["46x Gold-Dissolving Feather", "60x Iris"],
  },
  {
    id: "the-shorekeeper", name: "The Shorekeeper", rarity: 5, element: "Spectro", weaponType: "Rectifier", role: "Support",
    weapons: ["Stellar Symphony (R1)", "Variation (R5)", "Rectifier#25 (R5)", "Call of the Abyss (R5)"],
    sets: ["Rejuvenating Glow", "Halo of Starry Radiance"],
    echoes: ["Fallacy of No Return", "Spacetrek Explorer"],
    stats: ["4 cost: CRIT DMG > HP%", "3 cost: Energy Regen", "3 cost: Energy Regen / Spectro DMG", "1 cost: HP%", "1 cost: HP%"],
    substats: "Energy Regen (Until 230%) > CRIT DMG ≥ Liberation DMG% > HP% > CRIT Rate > HP > ATK% = ATK",
    materials: ["46x Topological Confinement", "60x Novas"],
  },
  {
    id: "verina", name: "Verina", rarity: 5, element: "Spectro", weaponType: "Rectifier", role: "Support",
    weapons: ["Variation (R5)", "Rectifier#25 (R5)", "Call of the Abyss (R5)"],
    sets: ["Rejuvenating Glow"],
    echoes: ["Fallacy of No Return"],
    stats: ["4 cost: CRIT Rate > ATK%", "3 cost: Energy Regen", "3 cost: Energy Regen / Spectro DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Belle Poppy"],
  },
  {
    id: "xiangli-yao", name: "Xiangli Yao", rarity: 5, element: "Electro", weaponType: "Gauntlets", role: "DPS",
    weapons: ["Moongazer's Sigil (R1)", "Verity's Handle (R1)", "Blazing Justice (R1)", "Tragicomedy (R1)"],
    sets: ["Void Thunder", "Endless Resonance"],
    echoes: ["Hyvatia", "Reactor Husk", "Nightmare: Thundering Mephis"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: ATK% ≥ Electro DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Liberation DMG% > ATK",
    materials: ["60x Violet Coral"],
  },
  {
    id: "yangyang", name: "Yangyang", rarity: 4, element: "Aero", weaponType: "Sword", role: "Hybrid",
    weapons: ["Blazing Brilliance (R1)", "Emerald of Genesis (R1)", "Lumingloss (R5)", "Endless Collapse (R5)"],
    sets: ["Moonlit Clouds", "Sierra Gale"],
    echoes: ["Impermanence Heron", "Nightmare: Feilian Beringal", "Feilian Beringal"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Aero DMG", "3 cost: Aero DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Liberation DMG% > Basic DMG%",
    materials: ["46x Roaring Rock Fist", "60x Wintry Bell"],
  },
  {
    id: "yangyang-xuanling", name: "Yangyang Xuanling", rarity: 5, element: "Havoc", weaponType: "Sword", role: "DPS",
    weapons: ["Azure Oath (R1)", "Emerald Sentence (R1)", "Everbright Polestar (R1)", "Red Spring (R1)"],
    sets: ["Song of Feathered Trace"],
    echoes: ["Impermanence Heron", "Forbidden Bastion", "Thousand-Puppet Pavilion"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Havoc DMG", "3 cost: ATK% = Havoc DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% = Heavy DMG% > ATK",
    materials: [],
  },
  {
    id: "yinlin", name: "Yinlin", rarity: 5, element: "Electro", weaponType: "Rectifier", role: "Hybrid",
    weapons: ["Stringmaster (R1)", "Whispers of Sirens (R1)", "Rime-Draped Sprouts (R1)", "Lethean Elegy (R1)"],
    sets: ["Moonlit Clouds", "Empyrean Anthem"],
    echoes: ["Fallacy of No Return", "Impermanence Heron", "Nightmare: Tempest Mephis"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK = Resonance Skill DMG%",
    materials: ["60x Coriolus"],
  },
  {
    id: "youhu", name: "Youhu", rarity: 4, element: "Glacio", weaponType: "Gauntlets", role: "Support",
    weapons: ["Marcato (R5)", "Gauntlets#21D (R5)", "Abyss Surges (R1)", "Celestial Spiral (R5)"],
    sets: ["Rejuvenating Glow", "Moonlit Clouds"],
    echoes: ["Fallacy of No Return", "Impermanence Heron"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Energy Regen / Glacio DMG%", "3 cost: Energy Regen / Glacio DMG", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK > Skill DMG%",
    materials: ["46x Topological Confinement", "60x Violet Coral"],
  },
  {
    id: "yuanwu", name: "Yuanwu", rarity: 4, element: "Electro", weaponType: "Gauntlets", role: "Support",
    weapons: ["Verity's Handle (R1)", "Amity Accord (R5)", "Stonard (R5)", "Guardian Gauntlets (R5)"],
    sets: ["Rejuvenating Glow", "Moonlit Clouds", "Empyrean Anthem"],
    echoes: ["Fallacy of No Return", "Impermanence Heron", "Nightmare: Tempest Mephis"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Electro DMG", "3 cost: Electro DMG > DEF%", "1 cost: DEF%", "1 cost: DEF%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > DEF% > Flat DEF",
    materials: ["60x Terraspawn Fungus"],
  },
  {
    id: "zani", name: "Zani", rarity: 5, element: "Spectro", weaponType: "Gauntlets", role: "DPS",
    weapons: ["Blazing Justice (R1)", "Tragicomedy (R1)", "Verity's Handle (R1)", "Pulsation Bracer (R1)"],
    sets: ["Eternal Radiance"],
    echoes: ["Impermanence Heron", "Fallacy of No Return", "Capitaneus"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Spectro DMG", "3 cost: Spectro DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > ATK",
    materials: ["60x Sword Acorus"],
  },
  {
    id: "zhezhi", name: "Zhezhi", rarity: 5, element: "Glacio", weaponType: "Rectifier", role: "Hybrid",
    weapons: ["Rime-Draped Sprouts (R1)", "Whispers of Sirens (R1)", "Lethean Elegy (R1)", "Stringmaster (R1)"],
    sets: ["Empyrean Anthem", "Moonlit Clouds"],
    echoes: ["Sentry Construct", "Fallacy of No Return", "Nightmare: Lampylumen Myriad"],
    stats: ["4 cost: CRIT Rate / CRIT DMG", "3 cost: Glacio DMG", "3 cost: Glacio DMG > ATK%", "1 cost: ATK%", "1 cost: ATK%"],
    substats: "Energy Regen (Until Satisfied) > CRIT Rate = CRIT DMG > ATK% > Basic DMG% > Flat ATK",
    materials: ["60x Lanternberry"],
  },
];
