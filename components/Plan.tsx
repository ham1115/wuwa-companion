"use client";

import { useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { BUILD_RULES, DEFAULT_PLAN, PLAN_STEPS } from "@/data/plan";
import { useIdSet, useNotes, usePersistentState } from "@/lib/storage";
import { MAX_LEVEL, useLoadout } from "@/lib/loadout";
import ShoppingList from "./ShoppingList";
import StatLine from "./StatLine";
import MyBuild from "./MyBuild";
import Targets from "./Targets";
import Teams from "./Teams";
import SkillPriority from "./SkillPriority";
import Collapse from "./Collapse";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

export default function Plan() {
  const [plan, setPlan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);
  const steps = useIdSet("build-steps");
  const notes = useNotes("plan-notes");
  const [noteOpen, setNoteOpen] = useState<string | null>(null);
  /**
   * The character that has just been set to Lv.90, if any. Hitting the cap is
   * the only thing that volunteers a character for leaving the queue, and even
   * then it only asks — plenty of characters sit at 90 with their echoes still
   * half-finished, so the answer is genuinely not knowable from the level.
   */
  const [maxed, setMaxed] = useState<string | null>(null);
  const loadout = useLoadout();

  /*
   * Which queued character is expanded.
   *
   * Every card used to be open at once, and a card is the whole build sheet:
   * the materials, the stat targets, the teams, the editable loadout and the
   * checklist. Four queued characters came to 14,733px on a phone — eighteen
   * screens, about 3,100px each — so reaching the third one meant scrolling
   * past two complete build sheets belonging to characters you were not
   * working on.
   *
   * null is not "nothing open": it means nobody has chosen yet, so the queue's
   * first character is open, which is the one the order says you are working
   * on. The empty string is an explicit "all closed".
   */
  const [open, setOpen] = useState<string | null>(null);

  const entries = plan.map((id) => BY_ID.get(id)).filter(Boolean);
  const openId = open ?? entries[0]?.id ?? null;

  function move(id: string, dir: -1 | 1) {
    setPlan((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(id: string) {
    setPlan((prev) => prev.filter((x) => x !== id));
    setMaxed((m) => (m === id ? null : m));
    // Hand the open card back to whoever is first in the queue now, rather
    // than leaving it pointing at an id that is no longer in the list.
    setOpen((o) => (o === id ? null : o));
  }

  return (
    <section>
      <p className="panel-intro">
        {entries.length} in the queue, worked top to bottom. Add characters from
        the Characters tab; their builds are read straight from the database.
      </p>

      {entries.length === 0 && (
        <p className="empty">
          Queue is empty. Open the Characters tab and hit “Queue” on anyone.
        </p>
      )}

      <ShoppingList plan={plan} />

      <div className="callout">
        <strong>Rules that save resources</strong>
        <ul>
          {BUILD_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      {entries.map((c, idx) => {
        if (!c) return null;
        const done = PLAN_STEPS.filter((s) => steps.has(`${c.id}:${s.key}`)).length;
        const noteText = notes.get(c.id);
        const status =
          done === PLAN_STEPS.length ? "done" : done > 0 ? "active" : "queued";
        const isOpen = openId === c.id;

        return (
          <div key={c.id} className="card" data-open={isOpen}>
            {/* The head keeps everything you need to read the queue without
              * opening anything: the position, the name, how far along the
              * checklist is, the element and the role. */}
            <button
              className="build-head build-toggle"
              onClick={() => setOpen(isOpen ? "" : c.id)}
              aria-expanded={isOpen}
            >
              <span className="rank-pill">{idx + 1}</span>
              <span className="build-name">{c.name}</span>
              <span className="badge" data-status={status}>
                {done} / {PLAN_STEPS.length}
              </span>
              <span className="el" data-el={c.element}>
                {c.element}
              </span>
              <span className="term-cat">{c.role ?? "no build"}</span>
              <span className="term-cat build-chevron">
                {isOpen ? "▾" : "▸"}
              </span>
            </button>

            <Collapse open={isOpen}>
              <div className="queue-controls">
                <button className="mini" onClick={() => move(c.id, -1)} disabled={idx === 0}>
                  ↑ Up
                </button>
                <button
                  className="mini"
                  onClick={() => move(c.id, 1)}
                  disabled={idx === entries.length - 1}
                >
                  ↓ Down
                </button>
                <button className="mini" onClick={() => remove(c.id)}>
                  Remove
                </button>
              </div>

              <dl className="kv">
                <dt>Weapon</dt>
                <dd>{c.weapons[0] ?? "—"}</dd>
                <dt>Sonata</dt>
                <dd>{c.sets.join(" / ") || "—"}</dd>
                <dt>Main echo</dt>
                <dd>{c.echoes[0] ?? "—"}</dd>
                <dt>Substats</dt>
                <dd>{c.substats || "—"}</dd>
                {c.materials.length > 0 && (
                  <>
                    <dt>Materials</dt>
                    <dd>{c.materials.join(" · ")}</dd>
                  </>
                )}
              </dl>

              {c.stats.length > 0 && (
                <div className="stat-grid">
                  {c.stats.map((s, i) => (
                    <StatLine key={i} text={s} />
                  ))}
                </div>
              )}

              <SkillPriority id={c.id} />

              <Targets id={c.id} />

              <Teams id={c.id} />

              <MyBuild c={c} onLevelMaxed={setMaxed} />

              {maxed === c.id && loadout.get(c.id).level === MAX_LEVEL && (
                <div className="card maxed-card">
                  <strong>{c.name} is Lv.90. Finished with them?</strong>
                  <p className="check-detail">
                    Levelling is done, but the build may not be: echoes, weapon
                    and skills all carry on past 90. Taking them off the queue
                    keeps everything you have filled in here.
                  </p>
                  <div className="queue-controls">
                    <button className="mini" data-on onClick={() => remove(c.id)}>
                      Built, take them off
                    </button>
                    <button className="mini" onClick={() => setMaxed(null)}>
                      Still building
                    </button>
                  </div>
                </div>
              )}

              <h2 className="section">Checklist</h2>
              {PLAN_STEPS.map((s) => {
                const k = `${c.id}:${s.key}`;
                return (
                  <button
                    key={k}
                    className="check"
                    data-done={steps.has(k)}
                    onClick={() => steps.toggle(k)}
                  >
                    <span className="box">{steps.has(k) ? "✓" : ""}</span>
                    <span className="check-body">
                      <span className="check-label">{s.label}</span>
                      {s.detail && <span className="check-detail">{s.detail}</span>}
                    </span>
                  </button>
                );
              })}

              <div className="term-actions">
                <button
                  className="mini"
                  data-on={Boolean(noteText)}
                  onClick={() => setNoteOpen(noteOpen === c.id ? null : c.id)}
                >
                  {noteText ? "My note ✎" : "Add my note"}
                </button>
              </div>

              {noteOpen === c.id && (
                <textarea
                  className="note-area"
                  placeholder="Current level, what is missing, what dropped…"
                  value={noteText}
                  onChange={(e) => notes.set(c.id, e.target.value)}
                  autoFocus
                />
              )}

              {noteText && noteOpen !== c.id && (
                <p className="check-detail">{noteText}</p>
              )}
            </Collapse>
          </div>
        );
      })}
    </section>
  );
}
