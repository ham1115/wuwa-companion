"use client";

import { useMemo, useState } from "react";
import { SyncProvider } from "@/lib/sync";
import { useIdSet } from "@/lib/storage";
import CharacterDetail from "../CharacterDetail";
import { ProtoFilters, ProtoHeader } from "../Chrome";
import { useCharacterFilter } from "../filters";
import "../prototype.css";

export default function Page() {
  return (
    <SyncProvider>
      <LayoutB />
    </SyncProvider>
  );
}

/**
 * Prototype B: a grid you browse, and a panel that slides in over it.
 *
 * The difference from A is what the page is for when nothing is selected. A
 * always has a character open, so it answers "tell me about this one". B opens
 * on the whole roster at once, so it answers "show me what I have" — which is
 * why the card carries a line of build summary that A's row has no room for.
 *
 * The grid stays put behind the panel rather than reflowing to fewer columns:
 * cards jumping between columns while you read one of them is worse than the
 * panel covering a few.
 *
 * A grid is harder to look a name up in than a list, because the eye has no
 * single edge to run down. The first answer tried here was a header row per
 * initial, which worked and cost far too much: 20 headers plus the partial
 * row each one starts took the grid from 2.4 screens to 4.2. The jump bar
 * does the same job for nothing, because it adds no height to the grid at
 * all — only the first card of each letter carries an anchor.
 */
function LayoutB() {
  const f = useCharacterFilter();
  const built = useIdSet("built");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const current = f.results.find((c) => c.id === selectedId) ?? null;

  /** The initial of each name, and which card first carries it. */
  const firstOf = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of f.results) {
      const key = c.name[0].toUpperCase();
      if (!seen.has(key)) seen.set(key, c.id);
    }
    return seen;
  }, [f.results]);

  const jump = (letter: string) => {
    const el = document.querySelector<HTMLElement>(
      `[data-letter="${letter}"]`
    );
    if (!el) return;
    // Offset by the sticky bar, which would otherwise cover the card landed on.
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    /* Explicitly instant, against the smooth scrolling the stylesheet sets
     * globally. Sliding thirteen hundred pixels past every other card is not
     * continuity, it is a wait — and the letter you pressed already told you
     * where you were going. */
    window.scrollTo({ top: y, behavior: "instant" });
  };

  return (
    <main className="proto proto-b">
      <ProtoHeader which="B" />

      <ProtoFilters f={f} count={f.results.length} />

      {f.results.length === 0 && (
        <p className="empty">Nothing matches those filters.</p>
      )}

      <nav className="pb-jump" aria-label="Jump to initial">
        {[...firstOf.keys()].map((letter) => (
          <button key={letter} onClick={() => jump(letter)}>
            {letter}
          </button>
        ))}
      </nav>

      <div className="pb-grid">
        {f.results.map((c) => {
          const letter = c.name[0].toUpperCase();
          return (
              <button
                key={c.id}
                className="pb-card"
                data-letter={firstOf.get(letter) === c.id ? letter : undefined}
                data-sel={current?.id === c.id}
                data-built={built.has(c.id)}
                onClick={() => setSelectedId(c.id)}
              >
                <span className="pb-name">
                  {c.name}
                  {f.owned.has(c.id) && <span className="owned-dot">mine</span>}
                </span>
                {/* One badge row and one line of prose. The sonata and the
                  * role chip were both here as well, and four pieces of
                  * metadata on a 260px card read as noise rather than as a
                  * summary. */}
                <span className="pb-badges">
                  <span className="star" data-r={c.rarity}>
                    {c.rarity}★
                  </span>
                  <span className="el" data-el={c.element}>
                    {c.element}
                  </span>
                </span>
                <span className="pb-meta">
                  {c.role ?? "no build"} · {c.weapons[0] ?? "—"}
                </span>
              </button>
          );
        })}
      </div>

      {/* Click-through backdrop, so the panel closes the way a sheet should. */}
      {current && (
        <div
          className="pb-scrim"
          role="presentation"
          onClick={() => setSelectedId(null)}
        />
      )}

      <section className="pb-panel" data-open={current !== null}>
        {current && (
          <>
            <button className="pa-back" onClick={() => setSelectedId(null)}>
              ← Close
            </button>
            <CharacterDetail c={current} />
          </>
        )}
      </section>
    </main>
  );
}
