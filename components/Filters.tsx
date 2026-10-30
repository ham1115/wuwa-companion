"use client";

import { useState, type ReactNode } from "react";

/**
 * Secondary filters, folded away by default. The long tabs used to open with
 * three rows of chips above the list, which pushed the results off screen on a
 * phone. Primary toggles stay visible; everything else lives in here.
 */
export default function Filters({
  active,
  onClear,
  children,
}: {
  /** How many of the filters inside are currently narrowing the list. */
  active: number;
  onClear: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="chips">
        <button
          className="chip"
          data-on={open || active > 0}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "▾ " : "▸ "}
          Filters
          {active > 0 ? ` · ${active}` : ""}
        </button>
        {active > 0 && (
          <button className="chip" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {open && <div className="filter-panel">{children}</div>}
    </>
  );
}
