"use client";

import { useState } from "react";
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
 */
function LayoutB() {
  const f = useCharacterFilter();
  const built = useIdSet("built");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const current = f.results.find((c) => c.id === selectedId) ?? null;

  return (
    <main className="proto proto-b">
      <ProtoHeader which="B" />

      <ProtoFilters f={f} count={f.results.length} />

      {f.results.length === 0 && (
        <p className="empty">Nothing matches those filters.</p>
      )}

      <div className="pb-grid">
        {f.results.map((c) => (
          <button
            key={c.id}
            className="pb-card"
            data-sel={current?.id === c.id}
            data-built={built.has(c.id)}
            onClick={() => setSelectedId(c.id)}
          >
            <span className="pb-name">
              {c.name}
              {f.owned.has(c.id) && <span className="owned-dot">mine</span>}
            </span>
            <span className="pb-badges">
              <span className="star" data-r={c.rarity}>
                {c.rarity}★
              </span>
              <span className="el" data-el={c.element}>
                {c.element}
              </span>
              <span className="term-cat">{c.role ?? "no build"}</span>
            </span>
            <span className="pb-meta">
              {c.weapons[0] ?? "—"}
              <br />
              <span className="check-detail">{c.sets[0] ?? "—"}</span>
            </span>
          </button>
        ))}
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
