"use client";

import { useMemo } from "react";

/**
 * A pixel sprite, drawn as a grid rather than an image.
 *
 * Grids rather than PNGs because the colours come from the palette: a cell is
 * given a role, not a value, so the cat is pink under Pink and lemon and blue
 * under Sky and lemon without a second asset existing. Nothing here is a file
 * to keep in step with the theme.
 *
 * Frames are stacked on top of each other and swapped by cutting one to zero
 * opacity at the instant the other reaches one. That is how a sprite has
 * always been animated and it is what keeps it looking drawn rather than
 * tweened: there is no in-between state, because an 8-bit animation never had
 * one.
 *
 *   .  nothing      B  body        D  outline
 *   L  eye          N  nose        P  inner ear
 */
const CAT_OPEN = [
  "................",
  "..D..........D..",
  "..DD........DD..",
  "..DPD......DPD..",
  "..DPPD....DPPD..",
  "..DBBBDDDDBBBD..",
  ".DBBBBBBBBBBBBD.",
  ".DBLLBBBBBBLLBD.",
  ".DBLDBBBBBBDLBD.",
  ".DBBBBBNNBBBBBD.",
  ".DBBBBDBBDBBBBD.",
  ".DBBBBBBBBBBBBD.",
  "..DBBBBBBBBBBD..",
  "...DBBBBBBBBD...",
  "....DDDDDDDD....",
  "................",
];

/** The same cat with its eyes shut. Two rows differ, which is the whole blink. */
const CAT_SHUT = [
  "................",
  "..D..........D..",
  "..DD........DD..",
  "..DPD......DPD..",
  "..DPPD....DPPD..",
  "..DBBBDDDDBBBD..",
  ".DBBBBBBBBBBBBD.",
  ".DBBBBBBBBBBBBD.",
  ".DBDDBBBBBBDDBD.",
  ".DBBBBBNNBBBBBD.",
  ".DBBBBDBBDBBBBD.",
  ".DBBBBBBBBBBBBD.",
  "..DBBBBBBBBBBD..",
  "...DBBBBBBBBD...",
  "....DDDDDDDD....",
  "................",
];

const SIZE = CAT_OPEN.length;

function Frame({ rows, className }: { rows: string[]; className: string }) {
  const cells = useMemo(
    () => rows.flatMap((row, y) => [...row].map((c, x) => ({ c, key: `${x}-${y}` }))),
    [rows]
  );

  return (
    <div className={className}>
      {cells.map((cell) =>
        cell.c === "." ? (
          <i key={cell.key} />
        ) : (
          <i key={cell.key} data-c={cell.c} />
        )
      )}
    </div>
  );
}

export default function Sprite() {
  return (
    <div className="sprite" aria-hidden="true" style={{ "--sprite-size": SIZE } as React.CSSProperties}>
      <Frame rows={CAT_OPEN} className="sprite-frame sprite-open" />
      <Frame rows={CAT_SHUT} className="sprite-frame sprite-shut" />
    </div>
  );
}
