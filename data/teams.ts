/**
 * Recommended team compositions for every Resonator that has one published.
 *
 * Source: prydwen.gg character guides, captured 31 October 2026. Only the
 * structured team lists are reproduced — the named team, its element, and the
 * characters in each slot. Prydwen's written gameplay notes and rotations are
 * their own work and are not included here; go read them at prydwen.gg.
 *
 * Members are stored as character ids rather than display names so the UI can
 * resolve them against data/characters.ts, highlight the ones you own, and
 * answer the reverse question — which teams is this character wanted in.
 *
 * Generated, not hand-written. Each slot's first id is the pick; anything in
 * `alternates` is a listed substitute for that same slot.
 */

export type TeamSlot = {
  character: string;
  /** Other characters the guide lists for this slot, in its order. */
  alternates?: string[];
};

export type Team = {
  name: string;
  /** The element the guide files the team under, where it gives one. */
  element: string | null;
  slots: TeamSlot[];
};

/** Keyed by character id. A character with no published team has no entry. */
export const TEAMS: Record<string, Team[]> = {
  "aalto": [
    {
      name: "Best Team (DPS)",
      element: "Aero",
      slots: [
        { character: "aalto" },
        { character: "ciaccona" },
        { character: "rover-aero" },
      ],
    },
    {
      name: "Best Team (DPS)",
      element: "Aero",
      slots: [
        { character: "jiyan", alternates: ["iuno"] },
        { character: "aalto" },
        { character: "the-shorekeeper", alternates: ["verina","rover-aero"] },
      ],
    },
    {
      name: "Best Team (DPS)",
      element: "Aero",
      slots: [
        { character: "aalto" },
        { character: "sanhua" },
        { character: "the-shorekeeper", alternates: ["verina","rover-aero"] },
      ],
    },
  ],
  "aemeath": [
    {
      name: "Fusion Burst Team",
      element: "Fusion",
      slots: [
        { character: "aemeath" },
        { character: "denia" },
        { character: "chisa", alternates: ["suisui","lupa"] },
      ],
    },
    {
      name: "Fusion Burst Team",
      element: "Fusion",
      slots: [
        { character: "aemeath" },
        { character: "lynae" },
        { character: "mornye" },
      ],
    },
    {
      name: "Fusion Burst Team",
      element: "Fusion",
      slots: [
        { character: "aemeath" },
        { character: "lupa" },
        { character: "mornye", alternates: ["brant","changli"] },
      ],
    },
  ],
  "augusta": [
    {
      name: "Team #1 - Best Team",
      element: "Electro",
      slots: [
        { character: "augusta" },
        { character: "iuno", alternates: ["lynae","rebecca","mortefi"] },
        { character: "the-shorekeeper", alternates: ["verina","mornye"] },
      ],
    },
  ],
  "brant": [
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "aemeath", alternates: ["galbrena","changli"] },
        { character: "brant" },
        { character: "lupa" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "encore", alternates: ["chixia"] },
        { character: "brant" },
        { character: "lupa", alternates: ["the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "carlotta", alternates: ["jinhsi"] },
        { character: "brant" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "brant" },
        { character: "lupa", alternates: ["sanhua"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
  ],
  "buling": [
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "hsin" },
        { character: "rover-electro" },
        { character: "buling" },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "phrolova", alternates: ["carlotta"] },
        { character: "cantarella", alternates: ["zhezhi"] },
        { character: "buling" },
      ],
    },
  ],
  "calcharo": [
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "calcharo" },
        { character: "lynae", alternates: ["yinlin"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "calcharo" },
        { character: "jianxin" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "camellya": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "camellya" },
        { character: "lynae", alternates: ["roccia","sanhua"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "camellya" },
        { character: "danjin", alternates: ["cantarella"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "cantarella": [
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "cantarella" },
        { character: "lucilla", alternates: ["qiuyuan","roccia","danjin"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "cantarella" },
        { character: "rover-havoc", alternates: ["the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "carlotta", alternates: ["jinhsi"] },
        { character: "cantarella" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "carlotta": [
    {
      name: "Team #1: Best Team",
      element: "Glacio",
      slots: [
        { character: "carlotta" },
        { character: "lynae", alternates: ["zhezhi","brant","cantarella"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Glacio",
      slots: [
        { character: "carlotta" },
        { character: "taoqi", alternates: ["yangyang"] },
        { character: "verina", alternates: ["buling"] },
      ],
    },
  ],
  "cartethyia": [
    {
      name: "Team #1",
      element: "Aero",
      slots: [
        { character: "cartethyia" },
        { character: "ciaccona" },
        { character: "chisa", alternates: ["rover-aero","the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1",
      element: "Aero",
      slots: [
        { character: "cartethyia" },
        { character: "rover-aero" },
        { character: "chisa", alternates: ["sanhua","rover-aero"] },
      ],
    },
  ],
  "changli": [
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "changli" },
        { character: "aemeath", alternates: ["brant"] },
        { character: "lupa" },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "changli" },
        { character: "brant" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "changli" },
        { character: "jinhsi", alternates: ["xiangli-yao","cartethyia"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "changli" },
        { character: "encore", alternates: ["chixia"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "changli" },
        { character: "yangyang" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "chisa": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "suisui", alternates: ["lynae","rebecca","phrolova"] },
        { character: "chisa" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "aemeath" },
        { character: "denia" },
        { character: "chisa" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "hiyuki" },
        { character: "lynae" },
        { character: "chisa" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "hsin" },
        { character: "rover-electro" },
        { character: "chisa" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "cartethyia" },
        { character: "ciaccona", alternates: ["rover-aero"] },
        { character: "chisa" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "phoebe" },
        { character: "rover-spectro", alternates: ["ciaccona"] },
        { character: "chisa" },
      ],
    },
  ],
  "chixia": [
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "chixia" },
        { character: "brant", alternates: ["encore"] },
        { character: "lupa" },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "brant" },
        { character: "chixia" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "changli" },
        { character: "chixia" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "ciaccona": [
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "sigrika" },
        { character: "qiuyuan" },
        { character: "ciaccona" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "cartethyia" },
        { character: "ciaccona" },
        { character: "chisa", alternates: ["rover-aero","the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "jiyan" },
        { character: "iuno" },
        { character: "ciaccona" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "iuno", alternates: ["sigrika","jiyan"] },
        { character: "ciaccona" },
        { character: "rover-aero" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "phoebe", alternates: ["zani"] },
        { character: "ciaccona" },
        { character: "rover-aero", alternates: ["the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "ciaccona" },
        { character: "lynae", alternates: ["sanhua"] },
        { character: "mornye", alternates: ["chisa","the-shorekeeper"] },
      ],
    },
  ],
  "danjin": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "danjin" },
        { character: "lucilla", alternates: ["qiuyuan","cantarella","rover-havoc"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "camellya" },
        { character: "danjin" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "rover-havoc" },
        { character: "danjin" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "danjin" },
        { character: "cantarella", alternates: ["roccia","mortefi"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "denia": [
    {
      name: "Fusion Burst Team",
      element: "Fusion",
      slots: [
        { character: "aemeath" },
        { character: "denia" },
        { character: "chisa", alternates: ["suisui","lupa"] },
      ],
    },
    {
      name: "Fusion Burst Team",
      element: "Fusion",
      slots: [
        { character: "qingxiao", alternates: ["luuk-herssen"] },
        { character: "denia" },
        { character: "mornye" },
      ],
    },
  ],
  "encore": [
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "encore" },
        { character: "lupa" },
        { character: "mornye", alternates: ["the-shorekeeper","brant"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "encore" },
        { character: "sanhua" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "encore" },
        { character: "changli" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "galbrena": [
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "galbrena" },
        { character: "lupa" },
        { character: "mornye" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "galbrena" },
        { character: "qiuyuan", alternates: ["lucilla"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "galbrena" },
        { character: "brant", alternates: ["mortefi"] },
        { character: "lupa" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "galbrena" },
        { character: "phrolova", alternates: ["iuno"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "galbrena" },
        { character: "rebecca", alternates: ["mortefi"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "hiyuki": [
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "hiyuki" },
        { character: "lucilla", alternates: ["lynae"] },
        { character: "suisui", alternates: ["chisa","mornye","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "hiyuki" },
        { character: "yinlin", alternates: ["zhezhi","changli","jianxin"] },
        { character: "suisui", alternates: ["chisa"] },
      ],
    },
  ],
  "hsin": [
    {
      name: "Best Team (Unison)",
      element: "Electro",
      slots: [
        { character: "hsin" },
        { character: "suoming" },
        { character: "the-shorekeeper", alternates: ["verina","buling"] },
      ],
    },
    {
      name: "Best Team (Unison)",
      element: "Electro",
      slots: [
        { character: "hsin" },
        { character: "rover-electro" },
        { character: "suisui", alternates: ["chisa","buling"] },
      ],
    },
  ],
  "iuno": [
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "jingran", alternates: ["augusta"] },
        { character: "iuno" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "iuno" },
        { character: "lynae", alternates: ["ciaccona","yinlin","jianxin"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "jiyan" },
        { character: "iuno" },
        { character: "ciaccona", alternates: ["rover-aero","the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "galbrena" },
        { character: "iuno" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Aero",
      slots: [
        { character: "zani", alternates: ["phoebe"] },
        { character: "iuno" },
        { character: "rover-spectro" },
      ],
    },
  ],
  "jianxin": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "iuno" },
        { character: "jianxin" },
        { character: "rover-aero", alternates: ["the-shorekeeper"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "jinhsi" },
        { character: "jianxin" },
        { character: "mortefi" },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "xiangli-yao" },
        { character: "jianxin" },
        { character: "rover-aero", alternates: ["the-shorekeeper"] },
      ],
    },
  ],
  "jingran": [
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "jingran" },
        { character: "iuno" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "jingran" },
        { character: "mortefi", alternates: ["mornye"] },
        { character: "lupa" },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "jingran" },
        { character: "rebecca", alternates: ["mortefi"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "jinhsi": [
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "jinhsi" },
        { character: "hsin", alternates: ["zhezhi","yinlin","cantarella"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "jinhsi" },
        { character: "brant", alternates: ["changli"] },
        { character: "verina" },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "jinhsi" },
        { character: "mortefi", alternates: ["yuanwu"] },
        { character: "verina" },
      ],
    },
  ],
  "jiyan": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "jiyan" },
        { character: "iuno", alternates: ["phrolova","rebecca","mortefi"] },
        { character: "the-shorekeeper", alternates: ["ciaccona","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "jiyan" },
        { character: "ciaccona" },
        { character: "the-shorekeeper", alternates: ["rover-aero"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "jiyan" },
        { character: "lynae" },
        { character: "mornye" },
      ],
    },
  ],
  "lingyang": [
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "lingyang" },
        { character: "lynae", alternates: ["zhezhi"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "lingyang" },
        { character: "sanhua" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "lucilla": [
    {
      name: "Glacio Chafe Team",
      element: "Glacio",
      slots: [
        { character: "hiyuki" },
        { character: "lucilla" },
        { character: "suisui", alternates: ["chisa"] },
      ],
    },
    {
      name: "Glacio Chafe Team",
      element: "Glacio",
      slots: [
        { character: "sigrika", alternates: ["galbrena"] },
        { character: "lucilla" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Glacio Chafe Team",
      element: "Glacio",
      slots: [
        { character: "phrolova" },
        { character: "lucilla" },
        { character: "qiuyuan", alternates: ["cantarella"] },
      ],
    },
  ],
  "lucy": [
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "lucy" },
        { character: "rebecca" },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
  ],
  "lumi": [
    {
      name: "Best Team (Jinhsi)",
      element: "Electro",
      slots: [
        { character: "jinhsi" },
        { character: "lumi" },
        { character: "verina" },
      ],
    },
    {
      name: "Best Team (Jinhsi)",
      element: "Electro",
      slots: [
        { character: "carlotta" },
        { character: "lumi" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "lupa": [
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "jingran", alternates: ["aemeath","galbrena"] },
        { character: "lupa" },
        { character: "mortefi", alternates: ["denia","mornye"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "aemeath", alternates: ["changli","galbrena","encore"] },
        { character: "brant" },
        { character: "lupa" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "chixia" },
        { character: "brant" },
        { character: "lupa" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Fusion",
      slots: [
        { character: "encore" },
        { character: "lupa" },
        { character: "the-shorekeeper", alternates: ["chixia"] },
      ],
    },
  ],
  "luuk-herssen": [
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "luuk-herssen" },
        { character: "denia", alternates: ["lynae","sanhua"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
  ],
  "lynae": [
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "aemeath", alternates: ["qingxiao","luuk-herssen"] },
        { character: "lynae" },
        { character: "mornye" },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "hiyuki", alternates: ["yangyang-xuanling"] },
        { character: "lynae" },
        { character: "suisui", alternates: ["chisa"] },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "hiyuki", alternates: ["iuno","xiangli-yao","calcharo"] },
        { character: "lynae" },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "suoming", alternates: ["carlotta","camellya"] },
        { character: "lynae" },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "lynae" },
        { character: "rover-spectro" },
      ],
    },
  ],
  "mornye": [
    {
      name: "Lynae + Mornye",
      element: "Fusion",
      slots: [
        { character: "aemeath", alternates: ["hiyuki","suoming","iuno"] },
        { character: "lynae" },
        { character: "mornye" },
      ],
    },
    {
      name: "Lynae + Mornye",
      element: "Fusion",
      slots: [
        { character: "qingxiao", alternates: ["luuk-herssen"] },
        { character: "denia" },
        { character: "mornye" },
      ],
    },
    {
      name: "Lynae + Mornye",
      element: "Fusion",
      slots: [
        { character: "aemeath", alternates: ["galbrena","brant","encore"] },
        { character: "lupa" },
        { character: "mornye" },
      ],
    },
  ],
  "mortefi": [
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "mortefi" },
        { character: "chisa" },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "galbrena" },
        { character: "mortefi" },
        { character: "lupa" },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "augusta", alternates: ["jiyan","galbrena"] },
        { character: "mortefi" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "phoebe" },
        { character: "mortefi" },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team",
      element: "Fusion",
      slots: [
        { character: "zani" },
        { character: "mortefi" },
        { character: "rover-spectro" },
      ],
    },
  ],
  "phoebe": [
    {
      name: "Best Team (Absolution)",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "lynae", alternates: ["rebecca","phrolova"] },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team (Absolution)",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "iuno", alternates: ["mortefi","ciaccona","sanhua"] },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team (Absolution)",
      element: "Spectro",
      slots: [
        { character: "zani" },
        { character: "phoebe" },
        { character: "the-shorekeeper", alternates: ["rover-spectro","verina"] },
      ],
    },
    {
      name: "Best Team (Absolution)",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "chisa", alternates: ["changli"] },
        { character: "rover-spectro", alternates: ["ciaccona"] },
      ],
    },
    {
      name: "Best Team (Absolution)",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "rover-spectro" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "phrolova": [
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "lucilla", alternates: ["cantarella"] },
        { character: "qiuyuan", alternates: ["roccia","the-shorekeeper","danjin"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "sigrika", alternates: ["roccia","danjin"] },
        { character: "qiuyuan", alternates: ["the-shorekeeper","buling"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "yangyang-xuanling", alternates: ["galbrena","jiyan"] },
        { character: "phrolova" },
        { character: "suisui", alternates: ["chisa","the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "phoebe" },
        { character: "phrolova" },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "danjin" },
        { character: "the-shorekeeper", alternates: ["rover-havoc","buling"] },
      ],
    },
  ],
  "qingxiao": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "qingxiao" },
        { character: "denia" },
        { character: "mornye" },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "qingxiao" },
        { character: "lynae" },
        { character: "mornye", alternates: ["ciaccona","the-shorekeeper"] },
      ],
    },
  ],
  "qiuyuan": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "sigrika" },
        { character: "qiuyuan" },
        { character: "ciaccona", alternates: ["the-shorekeeper","phrolova","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "phrolova" },
        { character: "lucilla", alternates: ["cantarella","lynae","danjin"] },
        { character: "qiuyuan" },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "galbrena" },
        { character: "qiuyuan" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "rebecca": [
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "rebecca" },
        { character: "suisui", alternates: ["chisa"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "lucy" },
        { character: "rebecca" },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "phoebe" },
        { character: "rebecca" },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "augusta", alternates: ["jiyan","galbrena"] },
        { character: "rebecca" },
        { character: "the-shorekeeper", alternates: ["mornye","verina"] },
      ],
    },
  ],
  "roccia": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "cantarella" },
        { character: "roccia" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "camellya" },
        { character: "roccia" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "rover-havoc" },
        { character: "roccia" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "rover-aero": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "cartethyia" },
        { character: "ciaccona", alternates: ["changli","sanhua"] },
        { character: "rover-aero" },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "iuno" },
        { character: "ciaccona", alternates: ["jianxin"] },
        { character: "rover-aero" },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "jiyan" },
        { character: "mortefi", alternates: ["ciaccona"] },
        { character: "rover-aero" },
      ],
    },
  ],
  "rover-electro": [
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "hsin" },
        { character: "rover-electro" },
        { character: "suisui", alternates: ["chisa","buling"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "hsin" },
        { character: "rover-electro" },
        { character: "suisui", alternates: ["chisa","buling"] },
      ],
    },
  ],
  "rover-havoc": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "rover-havoc" },
        { character: "roccia" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "phrolova" },
        { character: "rover-havoc" },
        { character: "danjin", alternates: ["cantarella"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "rover-havoc" },
        { character: "danjin", alternates: ["sanhua"] },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "rover-havoc" },
        { character: "cantarella" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "rover-spectro": [
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "zani" },
        { character: "phoebe" },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "iuno", alternates: ["phrolova","ciaccona"] },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "mortefi", alternates: ["sanhua"] },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "changli" },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Best Team",
      element: "Spectro",
      slots: [
        { character: "phoebe" },
        { character: "rover-spectro" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "sanhua": [
    {
      name: "Premium Teams",
      element: "Glacio",
      slots: [
        { character: "suoming", alternates: ["luuk-herssen","camellya"] },
        { character: "sanhua" },
        { character: "the-shorekeeper", alternates: ["verina","mornye"] },
      ],
    },
    {
      name: "Premium Teams",
      element: "Glacio",
      slots: [
        { character: "encore", alternates: ["rover-havoc"] },
        { character: "sanhua" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "sigrika": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "sigrika" },
        { character: "qiuyuan", alternates: ["lucilla"] },
        { character: "ciaccona", alternates: ["the-shorekeeper","phrolova","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "sigrika" },
        { character: "lynae", alternates: ["ciaccona"] },
        { character: "mornye", alternates: ["rover-aero","the-shorekeeper","verina"] },
      ],
    },
  ],
  "suisui": [
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "chisa", alternates: ["rebecca","phrolova"] },
        { character: "suisui" },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "hiyuki" },
        { character: "lucilla", alternates: ["lynae"] },
        { character: "suisui" },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "aemeath" },
        { character: "denia" },
        { character: "suisui" },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "hsin" },
        { character: "rover-electro" },
        { character: "suisui" },
      ],
    },
  ],
  "suoming": [
    {
      name: "Unison Team",
      element: "Electro",
      slots: [
        { character: "hsin" },
        { character: "suoming" },
        { character: "the-shorekeeper", alternates: ["verina","buling"] },
      ],
    },
    {
      name: "Unison Team",
      element: "Electro",
      slots: [
        { character: "suoming" },
        { character: "lynae", alternates: ["sanhua"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
  ],
  "taoqi": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "carlotta" },
        { character: "taoqi" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "jinhsi" },
        { character: "taoqi" },
        { character: "verina" },
      ],
    },
  ],
  "the-shorekeeper": [
    {
      name: "Augusta Team",
      element: "Spectro",
      slots: [
        { character: "augusta" },
        { character: "iuno", alternates: ["mortefi"] },
        { character: "the-shorekeeper" },
      ],
    },
    {
      name: "Augusta Team",
      element: "Spectro",
      slots: [
        { character: "carlotta" },
        { character: "zhezhi" },
        { character: "the-shorekeeper" },
      ],
    },
    {
      name: "Augusta Team",
      element: "Spectro",
      slots: [
        { character: "zani" },
        { character: "phoebe" },
        { character: "the-shorekeeper" },
      ],
    },
    {
      name: "Augusta Team",
      element: "Spectro",
      slots: [
        { character: "camellya" },
        { character: "roccia", alternates: ["sanhua"] },
        { character: "the-shorekeeper" },
      ],
    },
  ],
  "xiangli-yao": [
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "xiangli-yao" },
        { character: "lynae", alternates: ["yinlin"] },
        { character: "mornye", alternates: ["the-shorekeeper","verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "xiangli-yao" },
        { character: "changli" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "xiangli-yao" },
        { character: "jianxin" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "xiangli-yao" },
        { character: "yangyang" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "yangyang": [
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "carlotta" },
        { character: "yangyang" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "xiangli-yao" },
        { character: "yangyang" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Best Team",
      element: "Aero",
      slots: [
        { character: "changli" },
        { character: "yangyang" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "yangyang-xuanling": [
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "chisa" },
        { character: "suisui" },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "lynae", alternates: ["rebecca","iuno","phrolova"] },
        { character: "suisui", alternates: ["chisa","mornye"] },
      ],
    },
    {
      name: "Best Team",
      element: "Havoc",
      slots: [
        { character: "yangyang-xuanling" },
        { character: "mortefi" },
        { character: "verina" },
      ],
    },
  ],
  "yinlin": [
    {
      name: "Main DPS Iuno",
      element: "Electro",
      slots: [
        { character: "iuno" },
        { character: "yinlin" },
        { character: "the-shorekeeper", alternates: ["rover-aero"] },
      ],
    },
    {
      name: "Main DPS Iuno",
      element: "Electro",
      slots: [
        { character: "jinhsi" },
        { character: "yinlin" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
    {
      name: "Main DPS Iuno",
      element: "Electro",
      slots: [
        { character: "augusta", alternates: ["xiangli-yao","calcharo"] },
        { character: "yinlin" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "youhu": [
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "calcharo" },
        { character: "yinlin" },
        { character: "youhu" },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "lingyang" },
        { character: "zhezhi" },
        { character: "youhu" },
      ],
    },
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "jiyan" },
        { character: "mortefi" },
        { character: "youhu" },
      ],
    },
  ],
  "yuanwu": [
    {
      name: "Best Team",
      element: "Electro",
      slots: [
        { character: "jinhsi" },
        { character: "yuanwu" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
  "zani": [
    {
      name: "Team #1: Best Team",
      element: "Spectro",
      slots: [
        { character: "zani" },
        { character: "phoebe" },
        { character: "rover-spectro", alternates: ["the-shorekeeper"] },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Spectro",
      slots: [
        { character: "zani" },
        { character: "ciaccona", alternates: ["iuno","phrolova"] },
        { character: "rover-spectro" },
      ],
    },
    {
      name: "Team #1: Best Team",
      element: "Spectro",
      slots: [
        { character: "zani" },
        { character: "mortefi" },
        { character: "rover-spectro" },
      ],
    },
  ],
  "zhezhi": [
    {
      name: "Best Team",
      element: "Glacio",
      slots: [
        { character: "carlotta", alternates: ["jinhsi","lingyang"] },
        { character: "zhezhi" },
        { character: "the-shorekeeper", alternates: ["verina"] },
      ],
    },
  ],
};

export const TEAMS_DISCLAIMER =
  "Team lists from prydwen.gg, captured 31 October 2026. The first name in a slot is the pick; the rest are listed substitutes for that slot.";

/** Every team that lists `id` in any slot, including as a substitute. */
export function teamsFeaturing(id: string): { owner: string; team: Team }[] {
  const out: { owner: string; team: Team }[] = [];
  for (const [owner, teams] of Object.entries(TEAMS)) {
    for (const team of teams) {
      const inIt = team.slots.some(
        (s) => s.character === id || (s.alternates ?? []).includes(id)
      );
      if (inIt) out.push({ owner, team });
    }
  }
  return out;
}
