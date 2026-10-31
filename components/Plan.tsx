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

  const entries = plan.map((id) => BY_ID.get(id)).filter(Boolean);

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

        return (
          <div key={c.id} className="card">
            <div className="build-head">
              <span className="rank-pill">{idx + 1}</span>
              <h3>{c.name}</h3>
              <span className="badge" data-status={status}>
                {done} / {PLAN_STEPS.length}
              </span>
              <span className="el" data-el={c.element}>
                {c.element}
              </span>
              <span className="term-cat">{c.role ?? "no build"}</span>
            </div>

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
                  Levelling is done, but the build may not be — echoes, weapon
                  and skills all carry on past 90. Taking them off the queue
                  keeps everything you have filled in here.
                </p>
                <div className="queue-controls">
                  <button className="mini" data-on onClick={() => remove(c.id)}>
                    Built — take them off
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
          </div>
        );
      })}
    </section>
  );
}
