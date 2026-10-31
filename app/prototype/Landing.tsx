"use client";

import { CHARACTERS } from "@/data/characters";
import { DEFAULT_PLAN } from "@/data/plan";
import { useIdSet, usePersistentState } from "@/lib/storage";
import { useOwned } from "@/lib/owned";

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

/**
 * What the detail pane shows before you have picked anybody.
 *
 * The first version of this prototype opened on whoever sorted first, which
 * meant the app always greeted you with Aalto whether or not you had any
 * interest in him — a decision made by the alphabet and presented as though
 * it were yours. Nothing is selected now, and the pane spends the space on
 * the two shortlists that are actually about you instead.
 */
export default function Landing({ onPick }: { onPick: (id: string) => void }) {
  const owned = useOwned();
  const built = useIdSet("built");
  const [plan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);

  const queued = plan.map((id) => BY_ID.get(id)).filter(Boolean);
  const mine = CHARACTERS.filter((c) => owned.has(c.id));

  return (
    <div className="pl">
      <h2>{CHARACTERS.length} Resonators</h2>
      <p className="pl-lede">
        Pick a name on the left, or search by weapon, echo or sonata to narrow
        the list first. {owned.owned.length} marked as yours,{" "}
        {built.ids.length} as built.
      </p>

      {queued.length > 0 && (
        <section className="pl-sec">
          <h3 className="section">Next in your plan</h3>
          <div className="pl-picks">
            {queued.map(
              (c, i) =>
                c && (
                  <button
                    key={c.id}
                    className="pl-pick"
                    onClick={() => onPick(c.id)}
                  >
                    <span className="rank-pill">{i + 1}</span>
                    {c.name}
                    <span className="el" data-el={c.element}>
                      {c.element}
                    </span>
                  </button>
                )
            )}
          </div>
        </section>
      )}

      {mine.length > 0 && (
        <section className="pl-sec">
          <h3 className="section">Characters you own</h3>
          <div className="pl-picks">
            {mine.map((c) => (
              <button
                key={c.id}
                className="pl-pick"
                onClick={() => onPick(c.id)}
              >
                {c.name}
                <span className="el" data-el={c.element}>
                  {c.element}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {queued.length === 0 && mine.length === 0 && (
        <p className="check-detail">
          Mark characters as yours in Settings and they will be waiting here.
        </p>
      )}
    </div>
  );
}
