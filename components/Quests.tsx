"use client";

import { CHAPTERS, CHAPTER_DISCLAIMER, PRIORITY_NOW } from "@/data/progress";
import { useIdSet, usePersistentState } from "@/lib/storage";

/**
 * Every act in story order. The game gates acts behind the ones before them,
 * so progress is always a prefix of this list — never a scatter of ticks.
 */
const ACT_ORDER = CHAPTERS.flatMap((c) => c.acts.map((a) => a.id));

export default function Quests() {
  const acts = useIdSet("acts");
  // Loaded from a profile in Settings, not shipped in the code.
  const [priority] = usePersistentState<string[]>("priority-now", PRIORITY_NOW);

  /**
   * Clicking an act sets progress to that point: ticking fills in every act
   * before it, un-ticking clears it and everything after.
   */
  function setProgress(id: string) {
    const i = ACT_ORDER.indexOf(id);
    if (i < 0) return;
    acts.set(ACT_ORDER.slice(0, acts.has(id) ? i : i + 1));
  }

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

      {priority.length > 0 && (
        <div className="callout">
          <strong>Right now</strong>
          <ol>
            {priority.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      )}

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
                onClick={() => setProgress(a.id)}
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

      <p className="footnote">
        Acts fill in order — ticking one marks everything before it, since the
        game will not let you clear an act out of sequence. {CHAPTER_DISCLAIMER}
      </p>
    </section>
  );
}
