/**
 * Which forte to pour upgrade materials into first, per character.
 *
 * Source: prydwen.gg character guides, captured 31 October 2026. Only the
 * ordered lists are reproduced — the skills in priority order, and the name of
 * the playstyle when a character has more than one order. Prydwen's written
 * rotations and gameplay notes are their own work and are not included here.
 *
 * 60 of the 61 Resonators have a priority published. Lily, who has not shipped,
 * has none and renders nothing.
 */

/** The five upgradable fortes, in the game's own naming. */
export const SKILL_NAMES = {
  BA: "Basic Attack",
  RS: "Resonance Skill",
  RL: "Resonance Liberation",
  FC: "Forte Circuit",
  IS: "Intro Skill",
} as const;

export type SkillKey = keyof typeof SKILL_NAMES;

export type SkillOrder = {
  /**
   * The playstyle this order belongs to, where a character has more than one.
   * Null when there is only one order and the label would say nothing.
   */
  style: string | null;
  /** Highest priority first. */
  order: SkillKey[];
};

/*
 * Stored as the compact keys above rather than full names: there are exactly
 * five, they are fixed, and the file is a 60-entry table that reads better as
 * orders than as repeated prose.
 */
const RAW: Record<string, string[]> = {
  "aalto": ["DPS|BA,RS,RL,FC,IS", "Hybrid|BA,FC,RL,RS,IS"],
  "aemeath": ["|RL,FC,RS,BA,IS"],
  "augusta": ["|RL,FC,BA,RS,IS"],
  "baizhi": ["|RL,RS,FC,IS,BA"],
  "brant": ["|FC,BA,RL,IS,RS"],
  "buling": ["|FC,BA,RS,IS,RL"],
  "calcharo": ["|FC,RL,RS,IS,BA"],
  "camellya": ["|RS,FC,RL,IS,BA"],
  "cantarella": ["|FC,RS,RL,BA,IS"],
  "carlotta": ["|RL,RS,FC,IS,BA"],
  "cartethyia": ["|FC,RL,BA,RS,IS"],
  "changli": ["|RS,FC,RL,BA,IS"],
  "chisa": ["|FC,RL,BA,RS,IS"],
  "chixia": ["|FC,RL,BA,RS,IS"],
  "ciaccona": ["|RL,BA,FC,IS,RS"],
  "danjin": ["|FC,RS,RL,BA,IS"],
  "denia": ["|RL,FC,RS,BA,IS"],
  "encore": ["Hyper Carry|RL,FC,RS,IS,BA", "Quick Swap|RS,FC,RL,IS,BA"],
  "galbrena": ["|FC,RL,BA,RS,IS"],
  "hiyuki": ["|RL,BA,FC,RS,IS"],
  "hsin": ["Unison|FC,RL,IS,BA,RS", "Flare|FC,RL,BA,RS,IS"],
  "iuno": ["Main DPS|FC,RL,BA,RS,IS", "Hybrid|FC,RL,IS,RS,BA"],
  "jianxin": ["|RL,FC,BA,RS,IS"],
  "jingran": ["|FC,RL,RS,BA,IS"],
  "jinhsi": ["|FC,RL,RS,IS,BA"],
  "jiyan": ["|RL,FC,RS,IS,BA"],
  "lingyang": ["|FC,RL,IS,RS,BA"],
  "lucilla": ["|RL,RS,FC,IS,BA"],
  "lucy": ["|RL,BA,FC,RS,IS"],
  "lumi": ["|FC,RL,RS,IS,BA"],
  "lupa": ["|RL,IS,FC,BA,RS"],
  "luuk-herssen": ["|RS,RL,BA,FC,IS"],
  "lynae": ["|FC,RL,BA,IS,RS"],
  "mornye": ["Damage focus|RL,FC,BA,IS,RS", "Healing focus|RL,FC,RS,BA,IS"],
  "mortefi": ["|RL,FC,BA,RS,IS"],
  "phoebe": ["|FC,RL,RS,IS,BA"],
  "phrolova": ["|RL,BA,FC,IS,RS"],
  "qingxiao": ["|FC,RL,BA,RS,IS"],
  "qiuyuan": ["|FC,RL,IS,RS,BA"],
  "rebecca": ["|FC,RL,BA,IS,RS"],
  "roccia": ["|FC,RL,BA,IS,RS"],
  "rover-aero": ["|FC,RL,RS,IS,BA"],
  "rover-electro": ["|FC,RL,BA,RS,IS"],
  "rover-havoc": ["Quick Swap|RL,FC,RS,BA,IS", "Hyper Carry|FC,RL,RS,BA,IS"],
  "rover-spectro": ["|RL,FC,BA,RS,IS"],
  "sanhua": ["|FC,RL,RS,IS,BA"],
  "sigrika": ["|FC,RL,BA,IS,RS"],
  "suisui": ["|IS,FC,RS,RL,BA"],
  "suoming": ["Unison|FC,RL,IS,BA,RS", "DPS|BA,FC,RL,IS,RS"],
  "taoqi": ["DPS|RL,FC,RS,BA,IS", "Support|FC,RS,RL,BA,IS"],
  "the-shorekeeper": ["|IS,RS,BA,FC,RL"],
  "verina": ["|FC,RL,RS,BA,IS"],
  "xiangli-yao": ["|RL,FC,IS,RS,BA"],
  "yangyang": ["|RL,RS,FC,BA,IS"],
  "yangyang-xuanling": ["|FC,RL,BA,IS,RS"],
  "yinlin": ["|FC,RL,RS,BA,IS"],
  "youhu": ["|RS,FC,RL,BA,IS"],
  "yuanwu": ["|RL,RS,FC,IS,BA"],
  "zani": ["|FC,RL,RS,IS,BA"],
  "zhezhi": ["|RL,FC,BA,RS,IS"],
};

/** Keyed by character id. A character with no published priority has no entry. */
export const SKILL_PRIORITY: Record<string, SkillOrder[]> = Object.fromEntries(
  Object.entries(RAW).map(([id, rows]) => [
    id,
    rows.map((row) => {
      const [style, keys] = row.split("|");
      return {
        style: style || null,
        order: keys.split(",") as SkillKey[],
      };
    }),
  ])
);

export const SKILL_PRIORITY_DISCLAIMER =
  "Upgrade order from prydwen.gg, captured 31 October 2026. Spend on the first before the second. The last in the list is the one to leave alone.";
