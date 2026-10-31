import {
  SKILL_NAMES,
  SKILL_PRIORITY,
  SKILL_PRIORITY_DISCLAIMER,
} from "@/data/skills";

/**
 * Which forte to spend upgrade materials on first. Renders nothing when a
 * character has no published order, the same way Targets does for one with no
 * published numbers.
 *
 * Shown as a ranked order rather than a flat list, because the whole value is
 * in the positions: the first is where the materials go and the last is the
 * one to leave at level one.
 */
export default function SkillPriority({ id }: { id: string }) {
  const orders = SKILL_PRIORITY[id];
  if (!orders || orders.length === 0) return null;

  return (
    <>
      <h2 className="section">Skill upgrade order</h2>
      <div className="skill-orders">
        {orders.map((o, i) => (
          <div className="skill-order" key={i}>
            {o.style && <span className="skill-style">{o.style}</span>}
            <ol className="skill-chain">
              {o.order.map((key, rank) => (
                <li className="skill-step" key={key} data-rank={rank + 1}>
                  <span className="skill-rank">{rank + 1}</span>
                  <span className="skill-label">{SKILL_NAMES[key]}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <p className="check-detail">{SKILL_PRIORITY_DISCLAIMER}</p>
    </>
  );
}
