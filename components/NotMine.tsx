"use client";

import { useOwned } from "@/lib/owned";

/**
 * Says when something in the plan is not marked as one of yours, and offers
 * to mark it.
 *
 * It deliberately does not claim the character for you. Queueing says what
 * you intend to build, and planning for someone you are still saving pulls
 * for is normal. Setting "mine" from a queue would quietly put a character
 * you do not have into the Mine-only filter, into the weapons "For my
 * characters" list, and into every team that marks who you can field today.
 * Those answers would then be wrong with nothing on screen to explain it.
 *
 * So it tells you instead, where you will see it, and offers the one-tap
 * version of what you probably meant.
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
          ? `${missing[0].name} is not one of your characters`
          : `${missing.length} of these are not your characters`}
      </strong>
      You can still plan {missing.length === 1 ? "the build" : "their builds"}.
      The materials are counted either way. But any filter that shows only
      your characters will skip them.
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
