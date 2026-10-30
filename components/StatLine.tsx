/**
 * One "4 cost: CRIT Rate > ATK%" row. Cost slots get the same colour as the
 * cost pills in the Echoes tab, so "4 cost" means the same thing everywhere.
 */
export default function StatLine({ text }: { text: string }) {
  const [slot, ...rest] = text.split(": ");
  const cost = slot.match(/^([134]) cost$/)?.[1];

  return (
    <div className="stat-line">
      {cost ? (
        <span className="cost" data-cost={cost}>
          {slot}
        </span>
      ) : (
        <span className="stat-slot">{slot}</span>
      )}
      <span>{rest.join(": ")}</span>
    </div>
  );
}
