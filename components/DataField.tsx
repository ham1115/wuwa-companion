"use client";

import { useMemo, type CSSProperties } from "react";

const BYTES_PER_ROW = 5;
const ROWS = 11;
const BITS = 8;

/**
 * A deterministic 0–1 from an index.
 *
 * Math.random would do, but this keeps the field identical on every render
 * for a given cell, so React re-rendering the pane never reshuffles a
 * pattern the reader is already looking at.
 */
function noise(n: number) {
  let x = (n * 2654435761) % 2147483647;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return Math.abs(x % 1000) / 1000;
}

/**
 * Bits, grouped into bytes, flipping on and off.
 *
 * This replaced a ring travelling out through an even grid. The ring was
 * pretty and said nothing: it read as a pond. Eight cells to a byte, five
 * bytes to a row, each bit holding its own state for its own length of time
 * says the thing the pane is actually waiting on, which is data.
 *
 * The flip is a step rather than a fade. A bit is on or it is off, and
 * easing between the two is the one thing that would make it look analogue.
 */
export default function DataField() {
  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: BYTES_PER_ROW }, (_, b) =>
          Array.from({ length: BITS }, (_, i) => {
            const n = (r * BYTES_PER_ROW + b) * BITS + i;
            return {
              key: `${r}-${b}-${i}`,
              /* Between 1.8s and 4.2s, so neighbours drift apart instead of
               * settling into a pulse the eye can follow. */
              duration: 1.8 + noise(n) * 2.4,
              offset: noise(n + 7919),
            };
          })
        )
      ),
    []
  );

  return (
    <div className="field" aria-hidden="true">
      {rows.map((bytes, r) => (
        <div className="field-row" key={r}>
          {bytes.map((bits, b) => (
            <span className="byte" key={b}>
              {bits.map((bit) => (
                <i
                  key={bit.key}
                  style={
                    {
                      "--dur": `${bit.duration.toFixed(2)}s`,
                      /* Negative, so every bit is already mid-cycle on the
                       * first frame rather than switching on together. */
                      "--delay": `${(-bit.offset * bit.duration).toFixed(2)}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
