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
 * version of what you probably meant. It is one quiet line, not an alert:
 * queueing someone you do not own is a normal thing to do, and the queue is
 * what this tab is for.
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
    <p className="mine-line">
      <span>
        {missing.length === 1
          ? `${missing[0].name} is not marked as yours.`
          : `${missing.length} of these are not marked as yours.`}{" "}
        Their builds and materials still count, but “For my characters”
        filters skip them.
      </span>
      <button
        className="mini"
        onClick={() => missing.forEach((m) => owned.toggle(m.id))}
      >
        {missing.length === 1 ? "Mark as mine" : "Mark all as mine"}
      </button>
    </p>
  );
}
