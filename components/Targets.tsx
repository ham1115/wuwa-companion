import {
  LOW_DAMAGE_NOTE,
  LOW_DAMAGE_SUPPORTS,
  TARGETS,
  TARGETS_DISCLAIMER,
} from "@/data/targets";

/**
 * What a finished Lv.90 build should read on the in-game stat screen.
 * Renders nothing when a character has no published numbers.
 */
export default function Targets({ id }: { id: string }) {
  const rows = TARGETS[id];
  if (!rows || rows.length === 0) return null;

  const lowDamage = LOW_DAMAGE_SUPPORTS.has(id);

  return (
    <>
      <h2 className="section">Target stats at Lv.90</h2>
      {lowDamage && <p className="build-role">{LOW_DAMAGE_NOTE}</p>}
      <div className="target-grid">
        {rows.map((r) => (
          <div className="target" key={r.label}>
            <span className="target-label">{r.label}</span>
            <span className="target-value">{r.value}</span>
            {r.note && <span className="target-note">{r.note}</span>}
          </div>
        ))}
      </div>
      <p className="check-detail">{TARGETS_DISCLAIMER}</p>
    </>
  );
}
