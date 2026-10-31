"use client";

import { useMemo, useState } from "react";
import {
  CHARACTERS,
  ELEMENTS,
  ROLES,
  type Character,
  type Element,
  type Role,
} from "@/data/characters";
import { DEFAULT_PLAN } from "@/data/plan";
import { useOwned } from "@/lib/owned";
import Filters from "./Filters";
import Collapse from "./Collapse";
import CharacterBody from "./CharacterBody";
import ResonanceField from "./ResonanceField";
import { holdInPlace } from "@/lib/anchor";
import { useMediaQuery } from "@/lib/media";
import { useIdSet, useNotes, usePersistentState } from "@/lib/storage";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

/** Where the build stops unfolding inside the row and moves to its own pane. */
const SPLIT = "(min-width: 900px)";

export default function Characters() {
  const [query, setQuery] = useState("");
  const [el, setEl] = useState<Element | "all">("all");
  const [role, setRole] = useState<Role | "all">("all");
  const [rarity, setRarity] = useState<4 | 5 | "all">("all");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);

  const built = useIdSet("built");
  const notes = useNotes("char-notes");
  const owned = useOwned();
  const [plan, setPlan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);
  const wide = useMediaQuery(SPLIT);

  const toggleQueue = (id: string) =>
    setPlan((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHARACTERS.filter((c) => {
      if (el !== "all" && c.element !== el) return false;
      if (role !== "all" && c.role !== role) return false;
      if (rarity !== "all" && c.rarity !== rarity) return false;
      if (ownedOnly && !owned.has(c.id)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.sets.some((s) => s.toLowerCase().includes(q)) ||
        c.weapons.some((w) => w.toLowerCase().includes(q)) ||
        c.echoes.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [query, el, role, rarity, ownedOnly, owned.owned]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * Looked up in the whole roster rather than in the filtered results, so
   * narrowing the list does not close the character being read. Nothing is
   * selected until it is asked for: opening the tab on whoever sorts first
   * would be the alphabet making the choice and calling it yours.
   */
  const current = selected ? BY_ID.get(selected) ?? null : null;

  /** The props the body needs, which are the same in both layouts. */
  const bodyProps = (c: Character) => ({
    c,
    isBuilt: built.has(c.id),
    onBuilt: () => built.toggle(c.id),
    isQueued: plan.includes(c.id),
    onQueue: () => toggleQueue(c.id),
    note: notes.get(c.id),
    noteOpen: noteOpen === c.id,
    onNoteToggle: () => setNoteOpen(noteOpen === c.id ? null : c.id),
    onNote: (t: string) => notes.set(c.id, t),
  });

  /*
   * Lifted into a variable because the split puts it over the list column
   * rather than over the whole tab: a search box the width of the window
   * filtering a 300px column reads as belonging to neither.
   */
  const controls = (
    <>
        {/* Pinned under the nav: 61 rows is far enough that going back for the
          * search box was most of the work of using the filter. */}
        <div className="sticky-controls">
          <div className="search-row">
            <input
              className="search"
              type="search"
              placeholder="Search name, weapon, echo or set…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search characters"
            />
          </div>

          <div className="chips">
            <button
              className="chip"
              data-tone="lemon"
              data-on={ownedOnly}
              onClick={() => setOwnedOnly(!ownedOnly)}
            >
              {ownedOnly ? "★ Mine only" : "Mine only"}
            </button>
            <button className="chip" data-on={rarity === 5} onClick={() => setRarity(rarity === 5 ? "all" : 5)}>
              5★
            </button>
            <button className="chip" data-on={rarity === 4} onClick={() => setRarity(rarity === 4 ? "all" : 4)}>
              4★
            </button>
          </div>
        </div>

        <Filters
          active={(el !== "all" ? 1 : 0) + (role !== "all" ? 1 : 0)}
          onClear={() => {
            setEl("all");
            setRole("all");
          }}
        >
          <div className="chips">
            <button className="chip" data-on={el === "all"} onClick={() => setEl("all")}>
              All elements
            </button>
            {ELEMENTS.map((e) => (
              <button key={e} className="chip" data-on={el === e} onClick={() => setEl(e)}>
                {e}
              </button>
            ))}
          </div>

          <div className="chips">
            <button className="chip" data-on={role === "all"} onClick={() => setRole("all")}>
              All roles
            </button>
            {ROLES.map((r) => (
              <button key={r} className="chip" data-on={role === r} onClick={() => setRole(r)}>
                {r}
              </button>
            ))}
          </div>
        </Filters>
    </>
  );

  return (
    <section>
      <p className="panel-intro">
        {CHARACTERS.length} Resonators. Showing {results.length}.{" "}
        {built.ids.length} marked as built.
      </p>

      {!wide && controls}

      {results.length === 0 && <p className="empty">Nothing matches those filters.</p>}

      {/*
        * Two layouts over one piece of state. Narrow, the build unfolds inside
        * the row it belongs to, which is what this tab has always done. From
        * 900px there is room to put it beside the list instead, where the
        * names stay put while you read and opening a character stops pushing
        * the other sixty down the page.
        */}
      {wide ? (
        <div className="char-split">
          <div className="char-list">
            {controls}
            {results.map((c) => (
              <button
                key={c.id}
                className="char-pick"
                data-sel={current?.id === c.id}
                data-built={built.has(c.id)}
                onClick={() => setSelected(c.id)}
              >
                <span className="char-name">{c.name}</span>
                {owned.has(c.id) && <span className="owned-dot">mine</span>}
                <span className="star" data-r={c.rarity}>
                  {c.rarity}★
                </span>
                <span className="el" data-el={c.element}>
                  {c.element}
                </span>
              </button>
            ))}
          </div>

          <aside className="char-detail">
            {current ? (
              <>
                <header className="char-detail-head">
                  <h2>{current.name}</h2>
                  <span className="star" data-r={current.rarity}>
                    {current.rarity}★
                  </span>
                  <span className="el" data-el={current.element}>
                    {current.element}
                  </span>
                  <span className="term-cat">{current.role ?? "no build"}</span>
                  <span className="term-cat">{current.weaponType}</span>
                </header>
                <CharacterBody {...bodyProps(current)} />
              </>
            ) : (
              <Nobody showing={results.length} built={built.ids.length} />
            )}
          </aside>
        </div>
      ) : (
        results.map((c) => (
          <CharacterRow
            key={c.id}
            c={c}
            isOpen={selected === c.id}
            onToggle={() => setSelected(selected === c.id ? null : c.id)}
            isOwned={owned.has(c.id)}
            body={bodyProps(c)}
          />
        ))
      )}

      <p className="footnote">
        Build parameters sourced from{" "}
        <a href="https://www.prydwen.gg/wuthering-waves/" target="_blank" rel="noreferrer">
          prydwen.gg
        </a>{" "}
        character guides, reviewed patch 3.6 and captured 22 October 2026. Only
        the structured parameters are reproduced here. For the reasoning,
        rotations and tier-list commentary behind them, read their guides.
      </p>
    </section>
  );
}

/**
 * The pane before a character is picked. The field behind the words is a
 * decoration and nothing else, which is why it is aria-hidden and why the
 * counts are written out rather than left for it to imply.
 */
function Nobody({ showing, built }: { showing: number; built: number }) {
  return (
    <div className="char-nobody">
      <ResonanceField />
      <div className="char-nobody-say">
        <h2>Pick a Resonator</h2>
        <p>
          {showing} on the list{showing === 1 ? "" : " beside this"}
          {built > 0 ? `, ${built} of them marked as built` : ""}. The search
          box takes weapon, echo and sonata names too.
        </p>
      </div>
    </div>
  );
}

function CharacterRow({
  c,
  isOpen,
  onToggle,
  isOwned,
  body,
}: {
  c: Character;
  isOpen: boolean;
  onToggle: () => void;
  isOwned: boolean;
  body: Parameters<typeof CharacterBody>[0];
}) {
  return (
    <article className="char-row" data-built={body.isBuilt}>
      <button
        className="char-toggle"
        onClick={(e) => {
          holdInPlace(e.currentTarget);
          onToggle();
        }}
        aria-expanded={isOpen}
      >
        <span className="char-name">{c.name}</span>
        {isOwned && <span className="owned-dot">mine</span>}
        <span className="star" data-r={c.rarity}>
          {c.rarity}★
        </span>
        <span className="el" data-el={c.element}>
          {c.element}
        </span>
        <span className="term-cat">{c.role ?? "no build"}</span>
        <span className="term-cat">{isOpen ? "▾" : "▸"}</span>
      </button>

      <Collapse open={isOpen}>
        <CharacterBody {...body} />
      </Collapse>
    </article>
  );
}
