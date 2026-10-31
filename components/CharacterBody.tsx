"use client";

import type { Character } from "@/data/characters";
import StatLine from "./StatLine";
import MyBuild from "./MyBuild";
import Targets from "./Targets";
import Teams from "./Teams";
import SkillPriority from "./SkillPriority";
import NotMine from "./NotMine";

/**
 * Everything the list shows about one character.
 *
 * Lifted out of the row so the tab can render it in two places without the
 * two drifting apart: inside the row on a phone, where it unfolds under the
 * name, and in the pane beside the list on a desktop.
 *
 * The five short reference lists are wrapped in .char-quick purely so the
 * pane can put them into columns. Inside a row that wrapper does nothing at
 * all, which is the point — the phone layout is byte for byte what it was.
 */
export default function CharacterBody({
  c,
  isBuilt,
  onBuilt,
  isQueued,
  onQueue,
  note,
  noteOpen,
  onNoteToggle,
  onNote,
}: {
  c: Character;
  isBuilt: boolean;
  onBuilt: () => void;
  isQueued: boolean;
  onQueue: () => void;
  note: string;
  noteOpen: boolean;
  onNoteToggle: () => void;
  onNote: (t: string) => void;
}) {
  return (
    <div className="char-body">
      {/*
        * First, not last. These three are the only things in here you act on
        * rather than read, and a character's build runs to about 3,000px —
        * queueing someone meant scrolling past every weapon, stat, team and
        * material to reach the button for it.
        */}
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

      {/* Right under the button that caused it, so queueing someone you have
        * not pulled says so straight away rather than on another tab. */}
      {isQueued && <NotMine entries={[{ id: c.id, name: c.name }]} />}

      {c.role === null ? (
        <p className="term-def">{c.substats}</p>
      ) : (
        <>
          <div className="char-quick">
            <section className="char-blk">
              <h2 className="section">Weapons: best first</h2>
              <ol className="ranked">
                {c.weapons.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ol>
            </section>

            <section className="char-blk">
              <h2 className="section">Sonata sets</h2>
              <ol className="ranked">
                {c.sets.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>

            <section className="char-blk">
              <h2 className="section">Main echo options</h2>
              <ol className="ranked">
                {c.echoes.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ol>
            </section>

            <section className="char-blk">
              <h2 className="section">Main stats</h2>
              <div className="stat-grid">
                {c.stats.map((s, i) => (
                  <StatLine key={i} text={s} />
                ))}
              </div>
            </section>

            <section className="char-blk">
              <h2 className="section">Substat priority</h2>
              <p className="term-def">{c.substats}</p>
            </section>
          </div>

          <SkillPriority id={c.id} />

          <Targets id={c.id} />

          <Teams id={c.id} />

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
    </div>
  );
}
