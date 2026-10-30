"use client";

import { useState } from "react";
import { CHAPTERS, CHAPTER_DISCLAIMER } from "@/data/progress";
import { useIdSet, usePersistentState } from "@/lib/storage";

/**
 * Every numbered act in story order. The game gates these behind the ones
 * before them, so progress through them is always a prefix of this list.
 * Segues, interludes and side stories are left out — they tick on their own.
 */
const ACT_ORDER = CHAPTERS.flatMap((c) =>
  c.acts.filter((a) => !a.optional).map((a) => a.id)
);

const ALL_ACTS = CHAPTERS.flatMap((c) => c.acts);

export default function Quests() {
  const acts = useIdSet("acts");
  // Your own short list of what to do next. Starts empty; nothing is shipped.
  const [priority, setPriority] = usePersistentState<string[]>("priority-now", []);
  const [editing, setEditing] = useState(false);

  /**
   * A numbered act sets progress to that point: ticking fills in every act
   * before it, un-ticking clears it and everything after. Segues and the like
   * are independent, so they just toggle.
   */
  function setProgress(id: string, optional?: boolean) {
    if (optional) {
      acts.toggle(id);
      return;
    }
    const i = ACT_ORDER.indexOf(id);
    if (i < 0) return;
    const keepOptional = acts.ids.filter((x) => !ACT_ORDER.includes(x));
    const upTo = ACT_ORDER.slice(0, acts.has(id) ? i : i + 1);
    acts.set([...upTo, ...keepOptional]);
  }

  const doneActs = ALL_ACTS.filter((a) => acts.has(a.id)).length;
  const mainDone = ACT_ORDER.filter((id) => acts.has(id)).length;

  return (
    <section>
      <p className="panel-intro">
        {mainDone} of {ACT_ORDER.length} numbered acts complete, {doneActs} of{" "}
        {ALL_ACTS.length} entries counting segues and interludes.
      </p>

      <div className="callout">
        <strong>Right now</strong>
        {editing ? (
          <>
            <textarea
              className="note-area"
              placeholder={"One per line, e.g.\nFinish the Chronosorter\nPush the main quest"}
              value={priority.join("\n")}
              onChange={(e) =>
                setPriority(e.target.value.split("\n").map((l) => l.trimStart()))
              }
              autoFocus
            />
            <div className="queue-controls">
              <button
                className="mini"
                data-on
                onClick={() => {
                  setPriority(priority.filter((l) => l.trim() !== ""));
                  setEditing(false);
                }}
              >
                Done
              </button>
            </div>
          </>
        ) : priority.length > 0 ? (
          <>
            <ol>
              {priority.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ol>
            <div className="queue-controls">
              <button className="mini" onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
          </>
        ) : (
          <div className="queue-controls">
            <button className="mini" onClick={() => setEditing(true)}>
              Write what you are doing next
            </button>
          </div>
        )}
      </div>

      {CHAPTERS.map((c) => {
        const done = c.acts.filter((a) => acts.has(a.id)).length;
        return (
          <div key={c.id} className="card">
            <div className="build-head">
              <h3>
                {c.label}: {c.title}
              </h3>
              <span
                className="badge"
                data-status={done === c.acts.length ? "done" : done > 0 ? "active" : "queued"}
              >
                {c.version}
              </span>
            </div>
            <p className="build-role">
              {c.region}
              {c.unlocks ? ` — unlocks ${c.unlocks.join(", ")}` : ""}
            </p>
            <p className="progress-line">
              {done} of {c.acts.length} entries
            </p>

            {c.acts.map((a) => (
              <button
                key={a.id}
                className="check"
                data-done={acts.has(a.id)}
                onClick={() => setProgress(a.id, a.optional)}
              >
                <span className="box">{acts.has(a.id) ? "✓" : ""}</span>
                <span className="check-body">
                  <span className="check-label">
                    {a.label}: {a.title}
                    {a.optional && <span className="side-pill">side</span>}
                    {a.version && <span className="ver-pill">{a.version}</span>}
                  </span>
                  {a.note && <span className="check-detail">{a.note}</span>}
                  {a.parts && (
                    <span className="check-detail">
                      Steps: {a.parts.join(" → ")}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        );
      })}

      <p className="footnote">{CHAPTER_DISCLAIMER}</p>
    </section>
  );
}
