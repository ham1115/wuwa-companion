"use client";

import { CHARACTERS } from "@/data/characters";
import { DEFAULT_PLAN, PLAN_STEPS } from "@/data/plan";
import { useIdSet, usePersistentState } from "@/lib/storage";
import { useRoutine } from "@/lib/routine";
import { useOwned } from "@/lib/owned";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

/**
 * What to do next, from state that already exists: the build queue's first
 * character and its first unticked step, and what is left on today's routine.
 * Nothing is estimated and nothing is scored; it says what is left.
 */
export default function Now({ onGo }: { onGo: (tab: "builds" | "routine" | "characters" | "settings") => void }) {
  const [plan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);
  const steps = useIdSet("build-steps");
  const routine = useRoutine();
  const owned = useOwned();

  const queue = plan.map((id) => BY_ID.get(id)).filter((c): c is NonNullable<typeof c> => !!c);
  const next = queue[0];
  const nextStep = next
    ? PLAN_STEPS.find((s) => !steps.has(`${next.id}:${s.key}`))
    : undefined;
  const stepsDone = next
    ? PLAN_STEPS.filter((s) => steps.has(`${next.id}:${s.key}`)).length
    : 0;

  const dailyLeft = routine.daily.length - routine.dailyDone;
  const weeklyLeft = routine.weekly.length - routine.weeklyDone;

  return (
    <section className="now-grid">
      <div>
      <h2 className="section">{next ? "Next to build" : "Get started"}</h2>
      {next ? (
        <div className="card" data-el={next.element}>
          <div className="build-head">
            <h3>{next.name}</h3>
            <span className="star" data-r={next.rarity}>
              {next.rarity}★
            </span>
            <span className="el" data-el={next.element}>
              {next.element}
            </span>
          </div>
          {nextStep ? (
            <>
              <p className="now-step">{nextStep.label}</p>
              <div className="now-progress">
                <span className="now-meter" aria-hidden="true">
                  {PLAN_STEPS.map((s) => (
                    <span key={s.key} data-done={steps.has(`${next.id}:${s.key}`)} />
                  ))}
                </span>
                <span className="now-count">
                  {stepsDone} of {PLAN_STEPS.length} steps ticked
                </span>
              </div>
              {nextStep.detail && <p className="now-detail">{nextStep.detail}</p>}
            </>
          ) : (
            <p className="term-def">
              Every step is ticked. Take {next.name} out of the queue in My plan
              to move on to the next one.
            </p>
          )}
          <div className="term-actions now-actions">
            <button className="mini" onClick={() => onGo("builds")}>
              Open build
            </button>
            {queue.length > 1 && (
              <span className="check-detail">{queue.length - 1} more queued</span>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="term-def">
            Pick a Resonator to build and this page shows what is left to do for
            it, measured against published targets. Browse has every
            Resonator, weapon, Echo, and glossary term. Three steps to get going:
          </p>
          <ol className="now-start">
            <li data-done={false} data-primary="true">
              <span className="now-start-text">Queue the one you are building</span>
              <button className="mini" data-primary="true" onClick={() => onGo("characters")}>
                Choose a Resonator
              </button>
            </li>
            <li data-done={routine.dailyDone > 0}>
              <span className="now-start-text">Tick off today&apos;s routine</span>
              <button className="now-link" onClick={() => onGo("routine")}>
                Open routine
              </button>
            </li>
            <li data-done={owned.owned.length > 0}>
              <span className="now-start-text">
                Mark the Resonators you own <span className="check-detail">(optional)</span>
              </span>
              <button className="now-link" onClick={() => onGo("settings")}>
                Open Settings
              </button>
            </li>
          </ol>
        </div>
      )}

      </div>

      <div>
        <h2 className="section">Today</h2>
        <div className="card">
          <p className="term-def">
            {dailyLeft === 0
              ? "Daily list done."
              : `${dailyLeft} of ${routine.daily.length} daily items left.`}
          </p>
          {/* Until something is queued the first-steps card is the one job on
              this page; the daily list waits behind a summary. */}
          <details className="now-fold" open={!!next} key={next ? "open" : "first-run"}>
            <summary className="now-fold-summary">
              {next ? "Daily items" : "Show daily items"}
            </summary>
          <div className="now-ticks">
            {routine.daily.map((r) => {
              const on = routine.checks.has(r.id);
              return (
                <button
                  key={r.id}
                  className="now-tick"
                  data-done={on}
                  aria-pressed={on}
                  onClick={() => routine.checks.toggle(r.id)}
                >
                  <span className="box" aria-hidden="true">
                    {on ? "✓" : ""}
                  </span>
                  <span className="now-tick-label">{r.label}</span>
                </button>
              );
            })}
          </div>
          </details>
          <div className="term-actions now-actions">
            {next && (
              <button className="mini" onClick={() => onGo("routine")}>
                Open routine
              </button>
            )}
            {weeklyLeft > 0 && (
              <span className="check-detail">
                {weeklyLeft} of {routine.weekly.length} weekly items left
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
