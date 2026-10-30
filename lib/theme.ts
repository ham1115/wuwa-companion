"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  DEFAULT_PALETTE,
  PALETTES,
  type Palette,
  type PaletteToken,
} from "@/data/palettes";
import { usePersistentState } from "./storage";

export type Mode = "light" | "dark";

const BY_ID = new Map(PALETTES.map((p) => [p.id, p]));

/** #rrggbb -> {h, s, l} with s and l as percentages. Null on anything else. */
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l: l * 100 };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return { h, s: s * 100, l: l * 100 };
}

const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)));

/**
 * A custom accent only gives us one colour, but the app needs three: the
 * accent itself, a tinted background to sit behind it, and a darker ink that
 * stays readable on that tint. Derive the other two from the hue so any
 * colour the person picks still reads correctly in both modes.
 */
function accentTrio(hex: string, mode: Mode) {
  const hsl = hexToHsl(hex);
  if (!hsl) return null;
  const { h, s } = hsl;
  const sat = clamp(s < 12 ? 12 : s);
  return mode === "light"
    ? {
        accent: `hsl(${h} ${sat}% 42%)`,
        "accent-soft": `hsl(${h} ${clamp(sat * 0.85)}% 90%)`,
        "accent-ink": `hsl(${h} ${sat}% 30%)`,
      }
    : {
        accent: `hsl(${h} ${clamp(sat * 0.85)}% 72%)`,
        "accent-soft": `hsl(${h} ${clamp(sat * 0.55)}% 22%)`,
        "accent-ink": `hsl(${h} ${clamp(sat * 0.8)}% 84%)`,
      };
}

/**
 * The secondary colour, which carries callouts and the lemon pills. Same
 * three-token shape as the accent, but the mid tone sits lighter: this one is
 * a highlight rather than something text is set in.
 */
function lemonTrio(hex: string, mode: Mode) {
  const hsl = hexToHsl(hex);
  if (!hsl) return null;
  const { h, s } = hsl;
  const sat = clamp(s < 12 ? 12 : s);
  return mode === "light"
    ? {
        lemon: `hsl(${h} ${sat}% 55%)`,
        "lemon-soft": `hsl(${h} ${clamp(sat * 0.9)}% 88%)`,
        "lemon-ink": `hsl(${h} ${sat}% 29%)`,
      }
    : {
        lemon: `hsl(${h} ${sat}% 73%)`,
        "lemon-soft": `hsl(${h} ${clamp(sat * 0.5)}% 19%)`,
        "lemon-ink": `hsl(${h} ${sat}% 84%)`,
      };
}

/** WCAG relative luminance of an hsl() triple. */
function hslLuminance(h: number, s: number, l: number): number {
  const sat = s / 100;
  const li = l / 100;
  const c = (1 - Math.abs(2 * li - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = li - c / 2;
  const seg = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60) % 6];
  const f = (v: number) => {
    const u = v + m;
    return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(seg[0]) + 0.7152 * f(seg[1]) + 0.0722 * f(seg[2]);
}

/** WCAG relative luminance of #rrggbb. */
function hexLuminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => {
    const u = v / 255;
    return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * f((n >> 16) & 255) +
    0.7152 * f((n >> 8) & 255) +
    0.0722 * f(n & 255)
  );
}

const contrast = (a: number, b: number) =>
  (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/**
 * Every surface the app sets text on, with the base themes' values for when
 * nothing overrides them. `lemon-soft` is in here because callouts are
 * painted with it — and in dark mode it is lighter than the cards are, which
 * makes it the binding surface rather than an afterthought.
 */
const SURFACE_TOKENS = ["bg", "bg-raised", "bg-sunken", "lemon-soft"] as const;

const BASE_SURFACES: Record<Mode, Record<string, string>> = {
  light: {
    bg: "#fff6fa",
    "bg-raised": "#ffffff",
    "bg-sunken": "#fdecf3",
    "lemon-soft": "#fff2c2",
  },
  dark: {
    bg: "#1c1118",
    "bg-raised": "#271a22",
    "bg-sunken": "#150c11",
    "lemon-soft": "#463619",
  },
};

/** Luminance of a token value, which may be a hex or one of our hsl() strings. */
function cssLuminance(value: string): number | null {
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return hexLuminance(v);
  const m = /^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/i.exec(v);
  return m ? hslLuminance(+m[1], +m[2], +m[3]) : null;
}

/**
 * The least forgiving surface text will actually land on, given whatever the
 * preset and the pickers have resolved to. Text sits on the page, on cards and
 * in sunken wells, so the ramp has to clear the worst of the three — the
 * lightest one in dark mode, the darkest one in light.
 */
function worstSurfaceLum(
  vars: Partial<Record<string, string>>,
  mode: Mode
): number {
  const base = BASE_SURFACES[mode];
  const lums = SURFACE_TOKENS.map((token) => {
    const value = vars[token];
    return (value ? cssLuminance(value) : null) ?? hexLuminance(base[token]);
  });
  return mode === "light" ? Math.min(...lums) : Math.max(...lums);
}

/**
 * The contrast each text token has to keep. These are the shipped themes' own
 * numbers rounded down, not WCAG's: the faintest caption in the base light
 * theme sits at 2.7:1 by design, so demanding AA's 3:1 of a custom colour
 * would make the picker stricter than the app it is themeing.
 */
const INK_CONTRAST = { text: 7, dim: 4.5, faint: 2.7 } as const;

/**
 * The lightness nearest `from` that clears `target` against `bg`.
 *
 * This is why the clamp is on measured luminance and not on HSL lightness:
 * lightness is not brightness. Yellow at l=42 and blue at l=42 are the same
 * number and nowhere near the same contrast — clamping lightness alone let a
 * yellow pick land at 2.58:1 for body text, under AA's 4.5:1.
 */
function legibleLightness(
  h: number,
  s: number,
  from: number,
  target: number,
  mode: Mode,
  bg: number
) {
  const ok = (l: number) => contrast(hslLuminance(h, s, l), bg) >= target;
  const start = clamp(from);
  if (ok(start)) return start;
  // Walk toward the readable end: darker on a light page, lighter on a dark one.
  let lo = start;
  let hi = mode === "light" ? 0 : 100;
  if (!ok(hi)) return hi; // this hue cannot get there; take the extreme
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid;
  }
  // Round toward the readable end, not to nearest: rounding the boundary the
  // wrong way lands just under the target it was searched for.
  return mode === "light" ? Math.floor(hi) : Math.ceil(hi);
}

/**
 * The same problem as the accent, one level down: one picked colour has to
 * become the three text tokens — body text, the dimmer labels, and the
 * faintest captions — each a visible step from the last and all three still
 * readable. The steps are nominal; each is pulled back if it fails its target.
 */
function inkTrio(hex: string, mode: Mode, bgLum: number) {
  const hsl = hexToHsl(hex);
  if (!hsl) return null;
  const { h, l } = hsl;
  // Heavily saturated text is tiring to read; cap it well below the accent's.
  const sat = clamp(Math.min(hsl.s, 45));
  const dimSat = clamp(sat * 0.78);
  const faintSat = clamp(sat * 0.62);
  const step = mode === "light" ? 1 : -1;

  const text = legibleLightness(h, sat, l, INK_CONTRAST.text, mode, bgLum);
  const dim = legibleLightness(
    h,
    dimSat,
    text + step * 22,
    INK_CONTRAST.dim,
    mode,
    bgLum
  );
  const faint = legibleLightness(
    h,
    faintSat,
    text + step * 39,
    INK_CONTRAST.faint,
    mode,
    bgLum
  );

  return {
    vars: {
      text: `hsl(${h} ${sat}% ${text}%)`,
      "text-dim": `hsl(${h} ${dimSat}% ${dim}%)`,
      "text-faint": `hsl(${h} ${faintSat}% ${faint}%)`,
    },
    /** True when the colour had to be moved to stay readable. */
    adjusted: Math.abs(text - l) > 1.5 || hsl.s > 45,
  };
}

/**
 * How light a custom background is allowed to be. A light mode whose page is
 * near-black is not a dark mode — it is light mode with every pill, tint and
 * accent-soft still pale and now invisible. The band keeps each mode
 * recognisably itself; within it the text ramp re-derives to match.
 */
const BG_BAND: Record<Mode, readonly [number, number]> = {
  light: [84, 99],
  dark: [0, 14],
};

/**
 * One picked background becomes five tokens: the page, the cards that sit
 * above it, the wells that sit below, and the two border weights. The offsets
 * are the base themes' own gaps, so a custom background keeps the same sense
 * of depth rather than flattening the app.
 */
function bgSurfaces(hex: string, mode: Mode) {
  const hsl = hexToHsl(hex);
  if (!hsl) return null;
  const { h } = hsl;
  const band = BG_BAND[mode];
  // A saturated background fights the text on it; keep it a tint.
  const sat = clamp(Math.min(hsl.s, mode === "light" ? 40 : 30));
  const l = Math.min(band[1], Math.max(band[0], hsl.l));
  const at = (delta: number, s = sat) =>
    `hsl(${h} ${clamp(s)}% ${clamp(l + delta)}%)`;
  return mode === "light"
    ? {
        bg: at(0),
        "bg-raised": at(1.4),
        "bg-sunken": at(-2.6),
        border: at(-8, sat * 0.7),
        "border-strong": at(-17.6, sat * 0.64),
      }
    : {
        bg: at(0),
        "bg-raised": at(3.9),
        "bg-sunken": at(-2.5),
        border: at(10.2, sat * 0.9),
        "border-strong": at(19.2, sat * 0.8),
      };
}

/** Whether this background would be moved to keep the mode recognisable. */
export function bgWouldAdjust(hex: string, mode: Mode): boolean {
  const hsl = hexToHsl(hex);
  if (!hsl) return false;
  const [lo, hi] = BG_BAND[mode];
  return hsl.l < lo - 1.5 || hsl.l > hi + 1.5;
}

/** Every token any preset or picker can set, so switching away clears it. */
const ALL_TOKENS: PaletteToken[] = [
  "bg",
  "bg-raised",
  "bg-sunken",
  "border",
  "border-strong",
  "text",
  "text-dim",
  "text-faint",
  "accent",
  "accent-soft",
  "accent-ink",
  "lemon",
  "lemon-soft",
  "lemon-ink",
];

/** The four colours a person picks, which together make one of their presets. */
export type Custom = {
  accent: string;
  bg: string;
  ink: string;
  lemon: string;
};

/**
 * One of their own presets: the four colours under a name they chose, plus
 * the built-in preset they were sitting on. The base matters because a saved
 * preset need not set all four — one that sets only an accent would otherwise
 * look different depending on what happened to be selected when it was
 * applied.
 */
export type SavedPalette = Custom & {
  id: string;
  name: string;
  base: string;
};

export const EMPTY_CUSTOM: Custom = { accent: "", bg: "", ink: "", lemon: "" };

const sameCustom = (a: Custom, b: Custom) =>
  a.accent === b.accent &&
  a.bg === b.bg &&
  a.ink === b.ink &&
  a.lemon === b.lemon;

function resolve(palette: Palette, mode: Mode, custom: Custom) {
  const vars: Partial<Record<string, string>> = {
    ...(mode === "light" ? palette.light : palette.dark),
  };
  const trio = custom.accent ? accentTrio(custom.accent, mode) : null;
  if (trio) Object.assign(vars, trio);
  const second = custom.lemon ? lemonTrio(custom.lemon, mode) : null;
  if (second) Object.assign(vars, second);
  const surfaces = custom.bg ? bgSurfaces(custom.bg, mode) : null;
  if (surfaces) Object.assign(vars, surfaces);
  return vars;
}

function apply(palette: Palette, mode: Mode, custom: Custom) {
  const root = document.documentElement;
  const vars = resolve(palette, mode, custom);
  const customInk = custom.ink;

  // Text last, and against the surfaces as finally resolved: the ramp's whole
  // job is clearing its contrast targets on the background actually in use, so
  // it cannot be derived before a custom background has had its say.
  const ink = customInk
    ? inkTrio(customInk, mode, worstSurfaceLum(vars, mode))
    : null;
  if (ink) Object.assign(vars, ink.vars);

  for (const token of ALL_TOKENS) {
    const value = vars[token];
    if (value) root.style.setProperty(`--${token}`, value);
    else root.style.removeProperty(`--${token}`);
  }
}

/**
 * Light or dark, which preset, and optional custom accent, text and
 * background colours. All of it lives in the browser; the preset layers over
 * the base theme rather than replacing it, so only the tokens it names
 * actually change.
 */
export function useTheme() {
  const [mode, setMode] = usePersistentState<Mode>("theme", "light");
  const [paletteId, setPaletteId] = usePersistentState<string>(
    "palette",
    DEFAULT_PALETTE
  );
  const [accent, setAccent] = usePersistentState<string>("accent", "");
  const [ink, setInk] = usePersistentState<string>("ink", "");
  const [bg, setBg] = usePersistentState<string>("bg", "");
  const [lemon, setLemon] = usePersistentState<string>("lemon", "");
  const [saved, setSaved] = usePersistentState<SavedPalette[]>(
    "my-palettes",
    []
  );

  const palette = BY_ID.get(paletteId) ?? PALETTES[0];
  const custom = useMemo<Custom>(
    () => ({ accent, bg, ink, lemon }),
    [accent, bg, ink, lemon]
  );

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    apply(palette, mode, custom);
  }, [mode, palette, custom]);

  const toggleMode = useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode]
  );

  const setCustom = useCallback(
    (next: Custom) => {
      setAccent(next.accent);
      setBg(next.bg);
      setInk(next.ink);
      setLemon(next.lemon);
    },
    [setAccent, setBg, setInk, setLemon]
  );

  /**
   * Picking a built-in preset clears the custom colours, because they sit on
   * top of it: with all four set, a preset sets nothing that is still visible,
   * and clicking one would appear to do nothing at all. Presets and your own
   * presets are therefore one single-select list. Anything worth keeping
   * before switching is what "Save as my preset" is for.
   */
  const choosePreset = useCallback(
    (id: string) => {
      setPaletteId(id);
      setCustom(EMPTY_CUSTOM);
    },
    [setPaletteId, setCustom]
  );

  const reset = useCallback(() => {
    setPaletteId(DEFAULT_PALETTE);
    setCustom(EMPTY_CUSTOM);
  }, [setPaletteId, setCustom]);

  const customised =
    paletteId !== DEFAULT_PALETTE || !sameCustom(custom, EMPTY_CUSTOM);

  /** Saves whatever is on screen now as one of their own presets. */
  const savePalette = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      // A preset that sets no colour of its own would match the cleared state
      // and so read as active forever; there is nothing to save.
      if (!trimmed || sameCustom(custom, EMPTY_CUSTOM)) return;
      const entry: SavedPalette = {
        id: `own-${Date.now().toString(36)}`,
        name: trimmed,
        base: paletteId,
        ...custom,
      };
      // Saving under a name that already exists replaces it, so re-saving a
      // preset after a tweak updates it instead of making a near-duplicate.
      const without = saved.filter(
        (p) => p.name.toLowerCase() !== trimmed.toLowerCase()
      );
      setSaved([...without, entry]);
    },
    [custom, saved, setSaved]
  );

  const applySaved = useCallback(
    (id: string) => {
      const entry = saved.find((p) => p.id === id);
      if (!entry) return;
      // Older saves predate `base`; fall back to the default rather than
      // leaving whatever happens to be selected underneath.
      setPaletteId(entry.base || DEFAULT_PALETTE);
      setCustom(entry);
    },
    [saved, setCustom, setPaletteId]
  );

  const deleteSaved = useCallback(
    (id: string) => setSaved(saved.filter((p) => p.id !== id)),
    [saved, setSaved]
  );

  const hasCustomColours = !sameCustom(custom, EMPTY_CUSTOM);

  /** Which of their presets is on screen, found by colour rather than stored. */
  const activeSavedId = hasCustomColours
    ? saved.find(
        (p) => sameCustom(p, custom) && (p.base || DEFAULT_PALETTE) === paletteId
      )?.id ?? null
    : null;

  /**
   * Whether the picked text colour is being moved. Asked of the surfaces as
   * resolved, so the notice tracks a background or secondary change too.
   */
  const inkAdjusted = useMemo(() => {
    if (!ink) return false;
    const vars = resolve(palette, mode, custom);
    return inkTrio(ink, mode, worstSurfaceLum(vars, mode))?.adjusted ?? false;
  }, [ink, custom, mode, palette]);

  return {
    mode,
    setMode,
    toggleMode,
    paletteId,
    setPaletteId,
    choosePreset,
    palette,
    accent,
    setAccent,
    ink,
    setInk,
    bg,
    setBg,
    lemon,
    setLemon,
    inkAdjusted,
    /** True when the picked background is being moved to keep the mode itself. */
    bgAdjusted: bg !== "" && bgWouldAdjust(bg, mode),
    reset,
    customised,
    hasCustomColours,
    saved,
    savePalette,
    applySaved,
    deleteSaved,
    activeSavedId,
  };
}
