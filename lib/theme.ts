"use client";

import { useCallback, useEffect } from "react";
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
 * The least forgiving surface each mode puts text on, across every preset:
 * the darkest light background and the lightest dark one. Aim at these and
 * every other surface in that mode does at least as well.
 */
const WORST_SURFACE: Record<Mode, string> = {
  light: "#efe9fc",
  dark: "#182927",
};

/**
 * The contrast each text token has to keep. These are the shipped themes' own
 * numbers rounded down, not WCAG's: the faintest caption in the base light
 * theme sits at 2.7:1 by design, so demanding AA's 3:1 of a custom colour
 * would make the picker stricter than the app it is themeing.
 */
const INK_CONTRAST = { text: 7, dim: 4.5, faint: 2.7 } as const;

/**
 * The lightness nearest `from` that clears `target` against the mode's worst
 * surface.
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
  mode: Mode
) {
  const bg = hexLuminance(WORST_SURFACE[mode]);
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
function inkTrio(hex: string, mode: Mode) {
  const hsl = hexToHsl(hex);
  if (!hsl) return null;
  const { h, l } = hsl;
  // Heavily saturated text is tiring to read; cap it well below the accent's.
  const sat = clamp(Math.min(hsl.s, 45));
  const dimSat = clamp(sat * 0.78);
  const faintSat = clamp(sat * 0.62);
  const step = mode === "light" ? 1 : -1;

  const text = legibleLightness(h, sat, l, INK_CONTRAST.text, mode);
  const dim = legibleLightness(
    h,
    dimSat,
    text + step * 22,
    INK_CONTRAST.dim,
    mode
  );
  const faint = legibleLightness(
    h,
    faintSat,
    text + step * 39,
    INK_CONTRAST.faint,
    mode
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

/** Whether this colour would be altered before being used as text. */
export function inkWouldAdjust(hex: string, mode: Mode): boolean {
  return inkTrio(hex, mode)?.adjusted ?? false;
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

function apply(
  palette: Palette,
  mode: Mode,
  customAccent: string,
  customInk: string
) {
  const root = document.documentElement;
  const vars: Partial<Record<string, string>> = {
    ...(mode === "light" ? palette.light : palette.dark),
  };
  const trio = customAccent ? accentTrio(customAccent, mode) : null;
  if (trio) Object.assign(vars, trio);
  const ink = customInk ? inkTrio(customInk, mode) : null;
  if (ink) Object.assign(vars, ink.vars);

  for (const token of ALL_TOKENS) {
    const value = vars[token];
    if (value) root.style.setProperty(`--${token}`, value);
    else root.style.removeProperty(`--${token}`);
  }
}

/**
 * Light or dark, which preset, and optional custom accent and text colours.
 * All of it lives in the browser; the preset layers over the base theme
 * rather than replacing it, so only the tokens it names actually change.
 */
export function useTheme() {
  const [mode, setMode] = usePersistentState<Mode>("theme", "light");
  const [paletteId, setPaletteId] = usePersistentState<string>(
    "palette",
    DEFAULT_PALETTE
  );
  const [accent, setAccent] = usePersistentState<string>("accent", "");
  const [ink, setInk] = usePersistentState<string>("ink", "");

  const palette = BY_ID.get(paletteId) ?? PALETTES[0];

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    apply(palette, mode, accent, ink);
  }, [mode, palette, accent, ink]);

  const toggleMode = useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode]
  );

  const reset = useCallback(() => {
    setPaletteId(DEFAULT_PALETTE);
    setAccent("");
    setInk("");
  }, [setPaletteId, setAccent, setInk]);

  const customised =
    paletteId !== DEFAULT_PALETTE || accent !== "" || ink !== "";

  return {
    mode,
    setMode,
    toggleMode,
    paletteId,
    setPaletteId,
    palette,
    accent,
    setAccent,
    ink,
    setInk,
    /** True when the picked text colour is being pulled back to stay legible. */
    inkAdjusted: ink !== "" && inkWouldAdjust(ink, mode),
    reset,
    customised,
  };
}
