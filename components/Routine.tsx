"use client";

import { ROUTINE } from "@/data/progress";
import { useIdSet, usePersistentState } from "@/lib/storage";
import { useEffect } from "react";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function Routine() {
  const checks = useIdSet("routine");
  const [stamp, setStamp] = usePersistentState<string>("routine-day", today());

  // Daily items clear themselves when the calendar date changes.
  useEffect(() => {
    const now = today();
    if (stamp !== now) {
      ROUTINE.filter((r) => r.cadence === "daily").forEach((r) => {
        if (checks.has(r.id)) checks.toggle(r.id);
      });
      setStamp(now);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp, checks.hydrated]);

  const daily = ROUTINE.filter((r) => r.cadence === "daily");
  const weekly = ROUTINE.filter((r) => r.cadence === "weekly");
  const dailyDone = daily.filter((r) => checks.has(r.id)).length;

  return (
    <section>
      <p className="panel-intro">
        {dailyDone} of {daily.length} daily items done. Daily checks clear
        themselves when the date changes.
      </p>

      <h2 className="section">Daily</h2>
      {daily.map((r) => (
        <button
          key={r.id}
          className="check"
          data-done={checks.has(r.id)}
          onClick={() => checks.toggle(r.id)}
        >
          <span className="box">{checks.has(r.id) ? "✓" : ""}</span>
          <span className="check-body">
            <span className="check-label">{r.label}</span>
            <span className="check-detail">{r.detail}</span>
          </span>
        </button>
      ))}

      <h2 className="section">Weekly</h2>
      {weekly.map((r) => (
        <button
          key={r.id}
          className="check"
          data-done={checks.has(r.id)}
          onClick={() => checks.toggle(r.id)}
        >
          <span className="box">{checks.has(r.id) ? "✓" : ""}</span>
          <span className="check-body">
            <span className="check-label">{r.label}</span>
            <span className="check-detail">{r.detail}</span>
          </span>
        </button>
      ))}

      <div className="callout" style={{ marginTop: 20 }}>
        <strong>Combat keys</strong>
        <ul>
          <li>Basic Attack / Parry: left click</li>
          <li>Dodge: right click (left shift also works)</li>
          <li>Resonance Skill: E · Resonance Liberation: R · Echo Skill: Q</li>
          <li>Flash orange or yellow means attack it. No flash means dodge it.</li>
        </ul>
      </div>

      <p className="footnote">
        <button className="mini" onClick={checks.clear}>
          Reset every check
        </button>
      </p>
    </section>
  );
}
