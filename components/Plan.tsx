"use client";

import { useMemo, useState } from "react";
import { CHARACTERS } from "@/data/characters";
import {
  ACCOUNT_NOTES,
  BUILD_RULES,
  DEFAULT_PLAN,
  PLAN_STEPS,
  parseMaterial,
} from "@/data/plan";
import { useIdSet, useNotes, usePersistentState } from "@/lib/storage";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

export default function Plan() {
  const [plan, setPlan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);
  const steps = useIdSet("build-steps");
  const notes = useNotes("plan-notes");
  const [showAccountNotes] = usePersistentState<boolean>("show-account-notes", true);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);

  const entries = plan.map((id) => BY_ID.get(id)).filter(Boolean);

  /** Everything the whole queue still needs, summed by material name. */
  const shoppingList = useMemo(() => {
    const totals = new Map<string, number>();
    for (const id of plan) {
      const c = BY_ID.get(id);
      if (!c) continue;
      // Skip characters whose levelling is already checked off.
      if (steps.has(`${id}:level`)) continue;
      for (const raw of c.materials) {
        const m = parseMaterial(raw);
        if (!m) continue;
        totals.set(m.name, (totals.get(m.name) ?? 0) + m.qty);
      }
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }, [plan, steps.ids]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {shoppingList.length > 0 && (
        <>
          <h2 className="section">Everything the queue still needs</h2>
          <div className="callout">
            <strong>Shopping list</strong>
            <ul>
              {shoppingList.map(([name, qty]) => (
                <li key={name}>
                  {qty}x {name}
                </li>
              ))}
            </ul>
            Plus generic frequency cores and Shell Credits per character.
            Characters whose “Character to Lv.80” step is ticked drop off this
            list.
          </div>
        </>
      )}

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
        const accountNotes = showAccountNotes ? ACCOUNT_NOTES[c.id] : undefined;
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
                {c.stats.map((s, i) => {
                  const [slot, ...rest] = s.split(": ");
                  return (
                    <div className="stat-line" key={i}>
                      <span className="stat-slot">{slot}</span>
                      <span>{rest.join(": ")}</span>
                    </div>
                  );
                })}
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

            {accountNotes && (
              <details className="more">
                <summary>Notes on this account</summary>
                <ul>
                  {accountNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </details>
            )}

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
