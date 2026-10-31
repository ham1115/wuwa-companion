/**
 * Colour presets. Each one overrides a handful of the CSS custom properties
 * defined in app/globals.css, layered over whichever base theme (light or
 * dark) is active — so contrast between text and background stays correct and
 * a preset only has to describe its own character.
 *
 * Deliberately not a full theme per preset: the base themes already solve
 * readability, and duplicating every token five times would mean five places
 * to fix every future colour bug.
 */

/**
 * The tokens a preset is allowed to set. The three text tokens are here so a
 * custom text colour can reach them and so switching preset clears them
 * again; the presets themselves leave text alone, because the base light and
 * dark themes already pick text that reads on their own backgrounds.
 */
export type PaletteToken =
  | "bg"
  | "bg-raised"
  | "bg-sunken"
  | "border"
  | "border-strong"
  | "text"
  | "text-dim"
  | "text-faint"
  | "accent"
  | "accent-soft"
  | "accent-ink"
  | "lemon"
  | "lemon-soft"
  | "lemon-ink";

export type Palette = {
  id: string;
  label: string;
  /** Two swatches for the picker: accent, then the secondary. */
  swatch: [string, string];
  light: Partial<Record<PaletteToken, string>>;
  dark: Partial<Record<PaletteToken, string>>;
};

export const DEFAULT_PALETTE = "pink-lemon";

export const PALETTES: Palette[] = [
  {
    id: "pink-lemon",
    label: "Pink & lemon",
    swatch: ["#c43f7a", "#f6c744"],
    // The original. No overrides — this is what globals.css already defines.
    light: {},
    dark: {},
  },
  {
    id: "seafoam-sand",
    label: "Seafoam & sand",
    swatch: ["#1f7d72", "#e0a93c"],
    light: {
      bg: "#f2fbf8",
      "bg-raised": "#ffffff",
      "bg-sunken": "#e4f4ef",
      border: "#cbe9e1",
      "border-strong": "#9ad2c6",
      accent: "#1f7d72",
      "accent-soft": "#cdeee6",
      "accent-ink": "#145c54",
      lemon: "#e0a93c",
      "lemon-soft": "#fbeecd",
      "lemon-ink": "#7d5a11",
    },
    dark: {
      bg: "#0f1a19",
      "bg-raised": "#182927",
      "bg-sunken": "#0a1413",
      border: "#24403c",
      "border-strong": "#3a5f59",
      accent: "#6fd8c6",
      "accent-soft": "#1c3b36",
      "accent-ink": "#a6ece0",
      lemon: "#f0c667",
      "lemon-soft": "#3b2f15",
      "lemon-ink": "#f8dfa6",
    },
  },
  {
    id: "lavender-honey",
    label: "Lavender & honey",
    swatch: ["#6b4bb5", "#e8a93a"],
    light: {
      bg: "#f8f5ff",
      "bg-raised": "#ffffff",
      "bg-sunken": "#efe9fc",
      border: "#ded2f7",
      "border-strong": "#b9a3ea",
      accent: "#6b4bb5",
      "accent-soft": "#e4daff",
      "accent-ink": "#4c3186",
      lemon: "#e8a93a",
      "lemon-soft": "#fcefd0",
      "lemon-ink": "#80590d",
    },
    dark: {
      bg: "#15111f",
      "bg-raised": "#1f1a2d",
      "bg-sunken": "#100c18",
      border: "#2f2742",
      "border-strong": "#473b63",
      accent: "#b79bf5",
      "accent-soft": "#2c2242",
      "accent-ink": "#d6c6fc",
      lemon: "#f2c56b",
      "lemon-soft": "#3a2e15",
      "lemon-ink": "#fadfa8",
    },
  },
  {
    id: "slate-amber",
    /* Named accent-first like the other four. It read "Slate & amber" while
     * its swatches showed amber then slate, because amber is the accent here
     * and slate is the secondary — the one preset whose dots did not line up
     * with its own name. The id stays, so nobody's saved choice moves. */
    label: "Amber & slate",
    swatch: ["#b86914", "#4a6075"],
    light: {
      bg: "#f7f8fa",
      "bg-raised": "#ffffff",
      "bg-sunken": "#eceef2",
      border: "#dcdfe6",
      "border-strong": "#b2b8c4",
      accent: "#b86914",
      "accent-soft": "#fae5c9",
      "accent-ink": "#8a4e0d",
      lemon: "#4a6075",
      "lemon-soft": "#dde4ec",
      "lemon-ink": "#33495d",
    },
    dark: {
      bg: "#13161a",
      "bg-raised": "#1c2127",
      "bg-sunken": "#0e1114",
      border: "#2a3038",
      "border-strong": "#414a56",
      accent: "#e9a455",
      "accent-soft": "#3a2a16",
      "accent-ink": "#f6cf9d",
      lemon: "#8fa8bf",
      "lemon-soft": "#1e2a35",
      "lemon-ink": "#c3d5e6",
    },
  },
  {
    id: "sky-lemon",
    label: "Sky & lemon",
    swatch: ["#1b6e9e", "#e3b43c"],
    light: {
      bg: "#f4faff",
      "bg-raised": "#ffffff",
      "bg-sunken": "#e6f2fb",
      border: "#d3e7f5",
      "border-strong": "#a3cbe6",
      /* 5.57:1 on white. The accent is body-adjacent here — section
       * headings, badges and the selected tab are all set in it — so it has
       * to clear 4.5 rather than merely look like the colour. */
      accent: "#1b6e9e",
      "accent-soft": "#cfe7f6",
      "accent-ink": "#0f4e73",
      lemon: "#e3b43c",
      "lemon-soft": "#fbeec9",
      "lemon-ink": "#7a5b0d",
    },
    dark: {
      bg: "#0e1620",
      "bg-raised": "#182532",
      "bg-sunken": "#0a1017",
      border: "#243545",
      "border-strong": "#3a5570",
      accent: "#7cc4ee",
      "accent-soft": "#16303f",
      "accent-ink": "#b4ddf6",
      lemon: "#f0cc6a",
      "lemon-soft": "#352c14",
      "lemon-ink": "#f6e3ab",
    },
  },
  {
    id: "forest-cream",
    label: "Forest & cream",
    swatch: ["#2f6b3a", "#c89b3f"],
    light: {
      bg: "#f5faf4",
      "bg-raised": "#ffffff",
      "bg-sunken": "#e7f2e5",
      border: "#d2e6cf",
      "border-strong": "#a2cb9d",
      accent: "#2f6b3a",
      "accent-soft": "#d6edd4",
      "accent-ink": "#1f4b27",
      lemon: "#c89b3f",
      "lemon-soft": "#f6ebcf",
      "lemon-ink": "#6d5210",
    },
    dark: {
      bg: "#101712",
      "bg-raised": "#19251c",
      "bg-sunken": "#0b110d",
      border: "#243523",
      "border-strong": "#3a5438",
      accent: "#84cf8d",
      "accent-soft": "#1d3320",
      "accent-ink": "#b3e6b8",
      lemon: "#dcb765",
      "lemon-soft": "#352c14",
      "lemon-ink": "#f0dba3",
    },
  },
];
