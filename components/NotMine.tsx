"use client";

import { useOwned } from "@/lib/owned";

/**
 * Says when something in the plan is not marked as one of yours, and offers
 * to mark it.
 *
 * It deliberately does not claim the character for you. Queueing is a
 * statement about what you intend to build, and planning for someone you are
 * still saving pulls for is a normal thing to do — so setting "mine" from a
 * queue would quietly put a character you do not have into the Mine-only
 * filter, into the weapons "For my characters" list, and into every team that
 * marks the members you can field today. Those answers would then be wrong in
 * a way nothing on screen explains.
 *
 * So it tells you instead, where you will see it, with the one-tap version of
 * what you probably meant.
 */
export default function NotMine({
  entries,
}: {
  entries: { id: string; name: string }[];
}) {
  const owned = useOwned();
  const missing = entries.filter((e) => !owned.has(e.id));
  if (missing.length === 0) return null;

  return (
    <div className="callout" data-tone="warn">
      <strong>
        {missing.length === 1
          ? `${missing[0].name} is not marked as one of yours`
          : `${missing.length} of these are not marked as yours`}
      </strong>
      Queueing plans a build; it does not claim the character, so you can line
      one up before you have pulled them. The materials still count toward the
      shopping list either way — but the &ldquo;mine&rdquo; filters here and on
      the Weapons tab will leave{" "}
      {missing.length === 1 ? "them" : "them"} out until you say otherwise.
      <div className="term-actions">
        {missing.map((m) => (
          <button
            key={m.id}
            className="mini"
            onClick={() => owned.toggle(m.id)}
          >
            {missing.length === 1 ? "Mark as mine" : `Mark ${m.name} as mine`}
          </button>
        ))}
      </div>
    </div>
  );
}
