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
import StatLine from "./StatLine";
import MyBuild from "./MyBuild";
import Targets from "./Targets";
import { useIdSet, useNotes, usePersistentState } from "@/lib/storage";

export default function Characters() {
  const [query, setQuery] = useState("");
  const [el, setEl] = useState<Element | "all">("all");
  const [role, setRole] = useState<Role | "all">("all");
  const [rarity, setRarity] = useState<4 | 5 | "all">("all");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);

  const built = useIdSet("built");
  const notes = useNotes("char-notes");
  const owned = useOwned();
  const [plan, setPlan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);

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

  return (
    <section>
      <p className="panel-intro">
        {CHARACTERS.length} Resonators. Showing {results.length}.{" "}
        {built.ids.length} marked as built.
      </p>

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

      {results.length === 0 && <p className="empty">Nothing matches those filters.</p>}

      {results.map((c) => (
        <CharacterRow
          key={c.id}
          c={c}
          isOpen={open === c.id}
          onToggle={() => setOpen(open === c.id ? null : c.id)}
          isBuilt={built.has(c.id)}
          onBuilt={() => built.toggle(c.id)}
          isQueued={plan.includes(c.id)}
          onQueue={() => toggleQueue(c.id)}
          isOwned={owned.has(c.id)}
          note={notes.get(c.id)}
          noteOpen={noteOpen === c.id}
          onNoteToggle={() => setNoteOpen(noteOpen === c.id ? null : c.id)}
          onNote={(t) => notes.set(c.id, t)}
        />
      ))}

      <p className="footnote">
        Build parameters sourced from{" "}
        <a href="https://www.prydwen.gg/wuthering-waves/" target="_blank" rel="noreferrer">
          prydwen.gg
        </a>{" "}
        character guides, reviewed patch 3.6 and captured 22 October 2026. Only
        the structured parameters are reproduced here — for the reasoning,
        rotations and tier-list commentary behind them, read their guides.
      </p>
    </section>
  );
}

function CharacterRow({
  c,
  isOpen,
  onToggle,
  isBuilt,
  onBuilt,
  isQueued,
  onQueue,
  isOwned,
  note,
  noteOpen,
  onNoteToggle,
  onNote,
}: {
  c: Character;
  isOpen: boolean;
  onToggle: () => void;
  isBuilt: boolean;
  onBuilt: () => void;
  isQueued: boolean;
  onQueue: () => void;
  isOwned: boolean;
  note: string;
  noteOpen: boolean;
  onNoteToggle: () => void;
  onNote: (t: string) => void;
}) {
  return (
    <article className="char-row" data-built={isBuilt}>
      <button className="char-toggle" onClick={onToggle} aria-expanded={isOpen}>
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

      {isOpen && (
        <div className="char-body">
          {c.role === null ? (
            <p className="term-def">{c.substats}</p>
          ) : (
            <>
              <h2 className="section">Weapons — best first</h2>
              <ol className="ranked">
                {c.weapons.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ol>

              <h2 className="section">Sonata sets</h2>
              <ol className="ranked">
                {c.sets.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>

              <h2 className="section">Main echo options</h2>
              <ol className="ranked">
                {c.echoes.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ol>

              <h2 className="section">Main stats</h2>
              <div className="stat-grid">
                {c.stats.map((s, i) => (
                  <StatLine key={i} text={s} />
                ))}
              </div>

              <h2 className="section">Substat priority</h2>
              <p className="term-def">{c.substats}</p>

              <Targets id={c.id} />

              <MyBuild c={c} />

              {c.materials.length > 0 && (
                <>
                  <h2 className="section">Ascension materials</h2>
                  <p className="term-def">
                    {c.materials.join(" · ")}
                    <br />
                    <span className="check-detail">
                      Plus the generic frequency cores and Shell Credits.
                    </span>
                  </p>
                </>
              )}

              <dl className="kv">
                <dt>Weapon type</dt>
                <dd>{c.weaponType}</dd>
              </dl>
            </>
          )}

          <div className="term-actions">
            <button className="mini" data-on={isQueued} onClick={onQueue}>
              {isQueued ? "✓ In plan" : "+ Queue"}
            </button>
            <button className="mini" data-on={isBuilt} onClick={onBuilt}>
              {isBuilt ? "✓ Built" : "Mark built"}
            </button>
            <button className="mini" data-on={Boolean(note)} onClick={onNoteToggle}>
              {note ? "Note ✎" : "Add note"}
            </button>
          </div>

          {noteOpen && (
            <textarea
              className="note-area"
              placeholder="Current level, what is missing, which echoes you have…"
              value={note}
              onChange={(e) => onNote(e.target.value)}
              autoFocus
            />
          )}

          {note && !noteOpen && <p className="check-detail">{note}</p>}
        </div>
      )}
    </article>
  );
}
