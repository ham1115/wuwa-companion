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
      // Just under the bar's own bottom edge, wherever it has got to.
      const line = (bar.current?.getBoundingClientRect().bottom ?? 0) + 16;
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
    const chrome = bar.current?.getBoundingClientRect().bottom ?? 0;
    /* Instant on purpose. These are four destinations a few hundred pixels
     * apart; animating between them is a wait, not continuity. */
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - chrome - 14,
      behavior: "instant",
    });
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
