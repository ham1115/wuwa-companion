"use client";

import { DURATION } from "@/components/Collapse";

/**
 * Hold an element still on screen while the page re-lays-out around it.
 *
 * The queue on My plan is an accordion — the only one left, now that
 * Characters, Weapons and Echoes all open into a sheet instead — so opening
 * a card closes the previous one, and closing it takes its whole body out of
 * the page above the reader's scroll position. The browser leaves scrollY on
 * the same number regardless, so everything below slides up by that amount
 * underneath the viewport.
 *
 * Measured when Characters still worked this way: tapping a header that sat
 * at the top of the screen left that header 1,807px above it, with a row two
 * further down the list on screen instead. The row you had opened was not
 * visible at all. My plan measured 1,971px.
 *
 * It only looked like it was remembering which section you were reading
 * because every body is the same shape, so the height that vanished above
 * was close to the height that appeared below.
 *
 * The correction runs for as long as the collapse animation does rather than
 * once at the end of it. Both bodies change height on every frame for the
 * whole of DURATION, so a single adjustment would be right for one frame and
 * wrong for the fourteen after it.
 */
export function holdInPlace(el: HTMLElement) {
  if (typeof window === "undefined") return;

  const top = () => el.getBoundingClientRect().top;
  const wanted = top();
  const started = performance.now();
  /* Slack past the animation: the unmount that follows it settles a frame or
   * two later, and that last reflow moves the page too. */
  const until = started + DURATION + 80;

  let running = true;

  /*
   * Anything the reader does themselves wins immediately — otherwise a flick
   * of the wheel during the animation would be fought frame by frame by this
   * loop. scrollBy does not raise any of these, so correcting cannot cancel
   * itself.
   */
  const yield_ = () => {
    running = false;
  };
  const events = ["wheel", "touchmove", "keydown"] as const;
  for (const name of events) {
    window.addEventListener(name, yield_, { passive: true });
  }

  const stop = () => {
    for (const name of events) window.removeEventListener(name, yield_);
  };

  const step = () => {
    if (!running) return stop();
    const drift = top() - wanted;
    // Sub-pixel drift is below what anyone can see and costs a reflow to fix.
    if (Math.abs(drift) >= 1) window.scrollBy({ top: drift, behavior: "instant" });
    if (performance.now() < until) requestAnimationFrame(step);
    else stop();
  };

  requestAnimationFrame(step);
}
