"use client";

import ConfirmButton from "./ConfirmButton";
import { SERVERS, type ServerId } from "@/lib/resetClock";
import { useRoutine } from "@/lib/routine";

export default function Routine() {
  const { checks, daily, weekly, dailyDone, server, setServer } = useRoutine();

  return (
    <section className="routine">
      <p className="panel-intro routine-intro">
        <strong>
          {dailyDone} of {daily.length} daily items done.
        </strong>{" "}
        Daily checks clear at 04:00, weekly ones on Monday at 04:00. Not your
        server? Change the reset clock below.
      </p>

      <label className="mine-field">
        <span className="target-label">Reset clock</span>
        <select
          className="picker"
          value={server}
          onChange={(e) => setServer(e.target.value as ServerId)}
        >
          {SERVERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

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
        <strong>Combat keys on PC</strong>
        <ul>
          <li>Basic Attack / Parry: left click</li>
          <li>Dodge: right click (left shift also works)</li>
          <li>Resonance Skill: E · Resonance Liberation: R · Echo Skill: Q</li>
          <li>Flash orange or yellow means attack it. No flash means dodge it.</li>
        </ul>
      </div>

      <p className="footnote">
        <ConfirmButton className="mini" onConfirm={checks.clear}>
          Reset every check
        </ConfirmButton>
      </p>
    </section>
  );
}
