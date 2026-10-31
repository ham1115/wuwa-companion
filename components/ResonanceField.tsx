"use client";

import { useMemo, type CSSProperties } from "react";

const COLS = 20;
const ROWS = 11;

/** Where the wave starts, in cell coordinates. Left of centre, so the ring
 * opens out of the list rather than out of the middle of the pane. */
const FOCUS_X = 3;
const FOCUS_Y = (ROWS - 1) / 2;

/**
 * A field of pixels with a ring travelling out through it.
 *
 * Every cell runs the same one-shot pulse on the same loop; what makes it a
 * wave is that each one is held back in proportion to its distance from the
 * focus, so the bright phase reaches them in rings. No canvas, no timer and
 * nothing to tick — the only JavaScript is the arithmetic below, which runs
 * once, and the browser animates 220 opacities on the compositor.
 *
 * The delay is offset by a whole extra cycle so that every cell is already
 * mid-animation on the first frame. Without it the far corners sit dark for
 * three seconds while the first ring crawls out to them.
 */
export default function ResonanceField() {
  const cells = useMemo(() => {
    const out: { key: string; d: number }[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const dx = x - FOCUS_X;
        const dy = y - FOCUS_Y;
        out.push({ key: `${x}-${y}`, d: Math.sqrt(dx * dx + dy * dy) });
      }
    }
    return out;
  }, []);

  return (
    <div
      className="field"
      aria-hidden="true"
      style={{ "--cols": COLS } as CSSProperties}
    >
      {cells.map((cell) => (
        <i
          key={cell.key}
          style={{ "--d": cell.d.toFixed(2) } as CSSProperties}
        />
      ))}
    </div>
  );
}
