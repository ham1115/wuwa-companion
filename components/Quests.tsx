"use client";

import { CHAPTERS, CHAPTER_DISCLAIMER, PRIORITY_NOW } from "@/data/progress";
import { useIdSet } from "@/lib/storage";

export default function Quests() {
  const acts = useIdSet("acts");

  const totalActs = CHAPTERS.reduce((n, c) => n + c.acts.length, 0);
  const doneActs = CHAPTERS.reduce(
    (n, c) => n + c.acts.filter((a) => acts.has(a.id)).length,
    0
  );

  return (
    <section>
      <p className="panel-intro">
        {doneActs} of {totalActs} acts marked complete.
      </p>

      <div className="callout">
        <strong>Right now</strong>
        <ol>
          {PRIORITY_NOW.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </div>

      {CHAPTERS.map((c) => {
        const done = c.acts.filter((a) => acts.has(a.id)).length;
        return (
          <div key={c.id} className="card">
            <div className="build-head">
              <h3>{c.label}</h3>
              <span className="badge" data-status={done === c.acts.length ? "done" : "queued"}>
                {c.version}
              </span>
            </div>
            {c.unlocks && (
              <p className="build-role">Unlocks: {c.unlocks.join(" · ")}</p>
            )}
            <p className="progress-line">
              {done} of {c.acts.length} acts
            </p>

            {c.acts.map((a) => (
              <button
                key={a.id}
                className="check"
                data-done={acts.has(a.id)}
                onClick={() => acts.toggle(a.id)}
              >
                <span className="box">{acts.has(a.id) ? "✓" : ""}</span>
                <span className="check-body">
                  <span className="check-label">
                    {a.label}
                    {a.title ? ` — ${a.title}` : ""}
                  </span>
                  {a.note && <span className="check-detail">{a.note}</span>}
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
