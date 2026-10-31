"use client";

import { useMemo, type CSSProperties } from "react";

const BYTES_PER_ROW = 5;
const ROWS = 11;
const BITS = 8;
const CHARS = ROWS * BYTES_PER_ROW;

/**
 * Bits that say something, read by a scan travelling across them.
 *
 * The first version of this was random: every cell flipped on its own timer,
 * which looked like data and was not. It was noise wearing a costume, and it
 * read as one — there was nothing to follow, so there was nothing to look at.
 *
 * These are the real bits of a real sentence, the pane's own prompt, eight to
 * a byte and most significant first. That it decodes is the point: the first
 * three bits of every byte are 0, 1, 0 for any capital letter, so the left of
 * each group lines up into columns that no random field would ever produce.
 * You can see it is language before you can read it.
 *
 * The animation is the reading, not the data. A pulse crosses column by
 * column, and a bit that is set takes it brighter than one that is not.
 */
function bitsOf(message: string) {
  const phrase = `${message} / `.toUpperCase();
  let text = "";
  while (text.length < CHARS) text += phrase;
  return [...text.slice(0, CHARS)].map((ch) => {
    const code = ch.charCodeAt(0) & 0xff;
    return Array.from({ length: BITS }, (_, i) => (code >> (BITS - 1 - i)) & 1);
  });
}

export default function DataField({ message }: { message: string }) {
  const rows = useMemo(() => {
    const bytes = bitsOf(message);
    return Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: BYTES_PER_ROW }, (_, b) => ({
        key: `${r}-${b}`,
        bits: bytes[r * BYTES_PER_ROW + b],
      }))
    );
  }, [message]);

  return (
    <div className="field" aria-hidden="true">
      {rows.map((bytes, r) => (
        <div className="field-row" key={r}>
          {bytes.map((byte, b) => (
            <span className="byte" key={byte.key}>
              {byte.bits.map((bit, i) => (
                <i
                  key={i}
                  data-on={bit === 1}
                  style={
                    {
                      /* Where this bit sits across the whole row, which is
                       * what the scan is a function of. */
                      "--col": b * BITS + i,
                      /* Rows lag each other slightly so the scan reads as a
                       * sweep rather than a shutter coming down. */
                      "--row": r,
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
