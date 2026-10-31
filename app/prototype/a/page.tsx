"use client";

import { useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { SyncProvider } from "@/lib/sync";
import { useIdSet } from "@/lib/storage";
import CharacterDetail from "../CharacterDetail";
import Landing from "../Landing";
import { ProtoFilters, ProtoHeader } from "../Chrome";
import { useCharacterFilter } from "../filters";
import "../prototype.css";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

export default function Page() {
  return (
    <SyncProvider>
      <LayoutA />
    </SyncProvider>
  );
}

/**
 * Prototype A: the names in a column, the build beside them.
 *
 * The page itself never scrolls. The list column has its own scrollbar and
 * the detail pane has another, so moving down the roster never moves the
 * build you are reading, and opening a character never moves the list.
 */
function LayoutA() {
  const f = useCharacterFilter();
  const built = useIdSet("built");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /*
   * Looked up in the whole roster rather than in the filtered results, so
   * typing a search does not close the character you are reading. Nothing is
   * selected until you say so: the pane opens on Landing instead of on
   * whoever the alphabet happens to put first.
   */
  const current = selectedId ? BY_ID.get(selectedId) ?? null : null;

  return (
    <main className="proto proto-a">
      <ProtoHeader which="A" />

      <div className="pa">
        <aside className="pa-list">
          <ProtoFilters f={f} count={f.results.length} />

          <div className="pa-scroll">
            {f.results.length === 0 && (
              <p className="empty">Nothing matches those filters.</p>
            )}
            {f.results.map((c) => (
              <button
                key={c.id}
                className="pa-row"
                data-sel={current?.id === c.id}
                data-built={built.has(c.id)}
                onClick={() => setSelectedId(c.id)}
              >
                <span className="pa-name">{c.name}</span>
                {f.owned.has(c.id) && <span className="owned-dot">mine</span>}
                <span className="star" data-r={c.rarity}>
                  {c.rarity}★
                </span>
                <span className="el" data-el={c.element}>
                  {c.element}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* On a phone this is a sheet over the list rather than a column
          * beside it, because there is no beside. */}
        <section className="pa-detail" data-open={current !== null}>
          <button className="pa-back" onClick={() => setSelectedId(null)}>
            ← All characters
          </button>
          {current ? (
            <CharacterDetail c={current} />
          ) : (
            <Landing onPick={setSelectedId} />
          )}
        </section>
      </div>
    </main>
  );
}
