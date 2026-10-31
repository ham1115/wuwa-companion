"use client";

import { useEffect, useRef, useState } from "react";

export type PlanSection = { id: string; label: string; count?: number };

/**
 * A jump bar for the My plan tab.
 *
 * The tab answers four different questions — who you are building, what that
 * costs in materials, what a claim costs in Waveplate, and the rules that
 * save you both — and the first three come to more than a thousand pixels of
 * reading before the queue itself. As one column there was nothing to say
 * which part you wanted or where it began.
 *
 * Which section you are in is "the last heading that has passed under the
 * bar", not "a heading inside a band". The band was tried first and is wrong
 * here: these headings are 18px tall and sit hundreds of pixels apart, so for
 * most of the page none of them was inside it and the bar simply held
 * whatever it had last been told, including at the very top of the page.
 */
export default function PlanNav({ sections }: { sections: PlanSection[] }) {
  const bar = useRef<HTMLElement>(null);
  /* Set by a click, and honoured by the spy for long enough that the scroll
   * it causes cannot immediately overrule it. See jump(). */
  const pinnedUntil = useRef(0);
  const [active, setActive] = useState<string | null>(null);
  const [present, setPresent] = useState<string[]>([]);

  /* Sections come and go — the shopping list renders nothing once the queue
   * needs nothing — and a button must never point at a heading that is not
   * on the page. The key is the dependency so that a fresh array on every
   * render does not restart any of this. */
  const key = sections.map((s) => `${s.id}:${s.count ?? ""}`).join("|");

  useEffect(() => {
    setPresent(sections.filter((s) => document.getElementById(s.id)).map((s) => s.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const presentKey = present.join("|");

  /*
   * Deliberately a second effect: the first one is what decides whether the
   * bar renders at all, so the ref it measures against is still null while
   * that one runs.
   */
  useEffect(() => {
    const ids = presentKey ? presentKey.split("|") : [];
    if (ids.length < 2) return;

    /*
     * Read straight from the scroll event rather than through a
     * requestAnimationFrame. Five rect reads against a layout the browser has
     * just done for the scroll itself is cheaper than the frame of latency,
     * and it cannot be left stale by a browser that has decided to stop
     * scheduling frames — which is a real state, not a hypothetical one.
     */
    const read = () => {
      if (performance.now() < pinnedUntil.current) return;
      const doc = document.documentElement;
      /*
       * At the end of the document, "the last heading that passed under the
       * bar" stops being answerable: the page runs out of scroll before the
       * last sections can reach the top. Measured here with the queue first,
       * the maximum scroll is 3,033px while Claim costs starts at 3,343 and
       * Rules at 3,621 — neither can ever be the top-most thing, so the bar
       * would sit on "What to farm" while you read the rules. At the bottom
       * the question becomes which of the sections on screen is last.
       */
      const atEnd = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
      const line = atEnd
        ? window.innerHeight
        : (bar.current?.getBoundingClientRect().bottom ?? 0) + 16;

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [presentKey]);

  const shown = sections.filter((s) => present.includes(s.id));
  if (shown.length < 2) return null;

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    /*
     * Where the bar will be once it is stuck, not where it is now. Measured
     * from its current rect, a jump made from the top of the page — where
     * the bar is still 293px down in normal flow — left the heading 317px
     * below the chrome instead of 14.
     */
    const navH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
        10
      ) || 0;
    const chrome = navH + (bar.current?.getBoundingClientRect().height ?? 0);

    /* Instant on purpose. These are four destinations a few hundred pixels
     * apart; animating between them is a wait, not continuity. */
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - chrome - 14,
      behavior: "instant",
    });

    /*
     * The last sections cannot reach the top of the screen — the page runs
     * out of scroll first — so the scroll this causes would land at the
     * bottom and the spy would answer "Rules" to a click on "Claim costs".
     * The click is the better answer to what you are now reading, so it wins
     * for as long as its own scrolling lasts.
     */
    setActive(id);
    pinnedUntil.current = performance.now() + 500;
  };

  return (
    <nav className="plan-nav" ref={bar} aria-label="Sections of this plan">
      {shown.map((s) => (
        <button
          key={s.id}
          className="chip"
          data-on={active === s.id}
          aria-current={active === s.id ? "true" : undefined}
          onClick={() => jump(s.id)}
        >
          {s.label}
          {s.count !== undefined && (
            <span className="plan-nav-count">{s.count}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
