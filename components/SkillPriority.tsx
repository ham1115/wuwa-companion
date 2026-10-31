"use client";

import {
  SKILL_NAMES,
  SKILL_PRIORITY,
  SKILL_PRIORITY_DISCLAIMER,
  type SkillKey,
} from "@/data/skills";
import { MAX_SKILL_LEVEL, useLoadout } from "@/lib/loadout";

/**
 * Which forte to spend upgrade materials on first, and how far along each one
 * already is. Renders nothing when a character has no published order.
 *
 * The order comes from the guides and the levels come from you, which is what
 * lets the card answer the question the order on its own cannot: given where
 * this character actually is, what should the next materials go into.
 */
export default function SkillPriority({ id }: { id: string }) {
  const loadout = useLoadout();
  const orders = SKILL_PRIORITY[id];
  if (!orders || orders.length === 0) return null;

  const levels = loadout.get(id).skills ?? {};
  const levelOf = (key: SkillKey) => levels[key];
  const isMaxed = (key: SkillKey) => (levelOf(key) ?? 0) >= MAX_SKILL_LEVEL;

  const recorded = Object.keys(levels).length;
  const maxed = (Object.keys(SKILL_NAMES) as SkillKey[]).filter(isMaxed).length;

  return (
    <>
      <h2 className="section">Skill upgrade order</h2>
      <div className="skill-orders">
        {orders.map((o, i) => {
          /*
           * The next thing to spend on: the highest-priority forte not yet at
           * ten. With nothing recorded that is simply the first in the list,
           * which is what this showed before it could be edited. Once a
           * character is part-built it moves along on its own, so finishing
           * one skill is enough to be told what the next one is.
           */
          const next = o.order.find((key) => !isMaxed(key)) ?? null;

          return (
            <div className="skill-order" key={i}>
              {o.style && <span className="skill-style">{o.style}</span>}
              <ol className="skill-chain">
                {o.order.map((key, rank) => (
                  <li
                    className="skill-step"
                    key={key}
                    data-next={key === next}
                    data-maxed={isMaxed(key)}
                  >
                    <span className="skill-rank">{rank + 1}</span>
                    <span className="skill-label">{SKILL_NAMES[key]}</span>
                    <input
                      className="skill-level"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={MAX_SKILL_LEVEL}
                      step={1}
                      placeholder="–"
                      aria-label={`${SKILL_NAMES[key]} level`}
                      value={levelOf(key) ?? ""}
                      onChange={(e) =>
                        loadout.setSkillLevel(id, key, e.target.value)
                      }
                    />
                  </li>
                ))}
              </ol>
              {next ? (
                <p className="skill-next">
                  Next: <strong>{SKILL_NAMES[next]}</strong>
                  {recorded > 0 && `. ${maxed} of ${o.order.length} maxed.`}
                </p>
              ) : (
                <p className="skill-next" data-done="true">
                  All five at {MAX_SKILL_LEVEL}. Nothing left to pour into this one.
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="check-detail">{SKILL_PRIORITY_DISCLAIMER}</p>
    </>
  );
}
