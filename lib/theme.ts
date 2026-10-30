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

/** Every token any preset can set, so switching away clears the last one. */
const ALL_TOKENS: PaletteToken[] = [
  "bg",
  "bg-raised",
  "bg-sunken",
  "border",
  "border-strong",
  "accent",
  "accent-soft",
  "accent-ink",
  "lemon",
  "lemon-soft",
  "lemon-ink",
];

function apply(palette: Palette, mode: Mode, customAccent: string) {
  const root = document.documentElement;
  const vars: Partial<Record<string, string>> = {
    ...(mode === "light" ? palette.light : palette.dark),
  };
  const trio = customAccent ? accentTrio(customAccent, mode) : null;
  if (trio) Object.assign(vars, trio);

  for (const token of ALL_TOKENS) {
    const value = vars[token];
    if (value) root.style.setProperty(`--${token}`, value);
    else root.style.removeProperty(`--${token}`);
  }
}

/**
 * Light or dark, which preset, and an optional custom accent. All three live
 * in the browser; the preset layers over the base theme rather than replacing
 * it, so only the tokens it names actually change.
 */
export function useTheme() {
  const [mode, setMode] = usePersistentState<Mode>("theme", "light");
  const [paletteId, setPaletteId] = usePersistentState<string>(
    "palette",
    DEFAULT_PALETTE
  );
  const [accent, setAccent] = usePersistentState<string>("accent", "");

  const palette = BY_ID.get(paletteId) ?? PALETTES[0];

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    apply(palette, mode, accent);
  }, [mode, palette, accent]);

  const toggleMode = useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode]
  );

  const reset = useCallback(() => {
    setPaletteId(DEFAULT_PALETTE);
    setAccent("");
  }, [setPaletteId, setAccent]);

  const customised = paletteId !== DEFAULT_PALETTE || accent !== "";

  return {
    mode,
    setMode,
    toggleMode,
    paletteId,
    setPaletteId,
    palette,
    accent,
    setAccent,
    reset,
    customised,
  };
}
