"use client";

import { useMemo } from "react";
import { CHARACTERS } from "@/data/characters";
import {
  MATERIALS,
  MATERIALS_NOTE,
  REGION_GATE,
  WAVEPLATE_COSTS,
} from "@/data/materials";
import { parseMaterial } from "@/data/plan";
import { useIdSet } from "@/lib/storage";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

type Need = { name: string; qty: number };

/**
 * Everything the queue still needs, grouped by where it comes from rather than
 * listed flat. Thirty material names in a column is not a plan; "these four
 * come off one boss in Rinascita, which you cannot reach yet" is.
 */
export default function ShoppingList({ plan }: { plan: string[] }) {
  const steps = useIdSet("build-steps");
  const acts = useIdSet("acts");

  const needs = useMemo(() => {
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
    return [...totals.entries()]
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);
  }, [plan, steps.ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = useMemo(() => {
    const bosses = new Map<
      string,
      { location: string; region: string; items: Need[] }
    >();
    const regions = new Map<string, Need[]>();
    const other: Need[] = [];

    for (const need of needs) {
      const src = MATERIALS[need.name];
      if (src?.kind === "boss") {
        const entry = bosses.get(src.boss) ?? {
          location: src.location,
          region: src.region,
          items: [],
        };
        entry.items.push(need);
        bosses.set(src.boss, entry);
      } else if (src?.kind === "gather") {
        regions.set(src.region, [...(regions.get(src.region) ?? []), need]);
      } else {
        other.push(need);
      }
    }
    return {
      bosses: [...bosses.entries()],
      regions: [...regions.entries()],
      other,
    };
  }, [needs]);

  if (needs.length === 0) return null;

  /** A region counts as reached once the act that opens it is ticked in Story. */
  const reached = (region: string) => {
    const gate = REGION_GATE[region];
    if (!gate?.act) return true;
    return acts.has(gate.act);
  };

  const lockedRegions = [
    ...new Set(
      [
        ...groups.bosses.map(([, b]) => b.region),
        ...groups.regions.map(([r]) => r),
      ].filter((r) => !reached(r))
    ),
  ];

  const bossCount = groups.bosses.length;

  return (
    <>
      <h2 className="section">Everything the queue still needs</h2>

      {lockedRegions.length > 0 && (
        <div className="callout" data-tone="warn">
          <strong>Behind story you have not played</strong>
          <ul>
            {lockedRegions.map((r) => (
              <li key={r}>
                <strong>{r}</strong> — {REGION_GATE[r]?.label}
              </li>
            ))}
          </ul>
          Nothing from those regions is farmable yet. Push the main quest; tick
          the acts in Story and this notice clears itself.
        </div>
      )}

      {bossCount > 0 && (
        <div className="card">
          <div className="build-head">
            <h3>From bosses</h3>
            <span className="badge" data-status="active">
              {bossCount * 60} Waveplate a round
            </span>
          </div>
          <p className="build-role">
            {bossCount === 1 ? "One boss" : `${bossCount} bosses`}, 60 Waveplate
            per claim. How many claims a quantity takes depends on the boss
            level, so that figure is one claim each — not the cost of finishing.
          </p>
          {groups.bosses.map(([boss, b]) => (
            <div className="source" key={boss} data-locked={!reached(b.region)}>
              <div className="source-head">
                <span className="source-name">{boss}</span>
                {!reached(b.region) && <span className="side-pill">locked</span>}
              </div>
              <p className="check-detail">
                {b.location} — {b.region}
              </p>
              <ul className="source-items">
                {b.items.map((i) => (
                  <li key={i.name}>
                    {i.qty}x {i.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {groups.regions.length > 0 && (
        <div className="card">
          <div className="build-head">
            <h3>Gathered in the open world</h3>
            <span className="badge" data-status="done">
              Free
            </span>
          </div>
          {groups.regions.map(([region, items]) => (
            <div className="source" key={region} data-locked={!reached(region)}>
              <div className="source-head">
                <span className="source-name">{region}</span>
                {!reached(region) && <span className="side-pill">locked</span>}
              </div>
              <ul className="source-items">
                {items.map((i) => {
                  const src = MATERIALS[i.name];
                  const vendor = src?.kind === "gather" ? src.vendor : undefined;
                  return (
                    <li key={i.name}>
                      {i.qty}x {i.name}
                      {vendor && (
                        <span className="check-detail">
                          {" "}
                          — also sold by {vendor}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {groups.other.length > 0 && (
        <div className="card">
          <div className="build-head">
            <h3>Elsewhere</h3>
          </div>
          <ul className="source-items">
            {groups.other.map((i) => {
              const src = MATERIALS[i.name];
              return (
                <li key={i.name}>
                  {i.qty}x {i.name}
                  {src?.kind === "quest" && (
                    <span className="check-detail"> — {src.detail}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="callout">
        <strong>What a claim costs</strong>
        <ul>
          {WAVEPLATE_COSTS.map((a) => (
            <li key={a.name}>
              <strong>{a.name}</strong> — {a.waveplate} Waveplate · {a.gives}
              {a.note ? ` (${a.note})` : ""}
            </li>
          ))}
        </ul>
        {MATERIALS_NOTE}
      </div>

      <p className="check-detail">
        Plus generic frequency cores and Shell Credits per character. Characters
        whose &ldquo;Character to Lv.80&rdquo; step is ticked drop off this list.
      </p>
    </>
  );
}
