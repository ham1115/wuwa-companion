"use client";

import { useEffect, useState, type ReactNode } from "react";

import { reducedMotion } from "@/lib/motion";

/**
 * Height animation for content that is conditionally rendered.
 *
 * The obvious way to animate a collapse is to leave the content mounted and
 * animate its height, but the Characters tab has 61 rows and each body carries
 * the full build, the stat targets, the teams and the editable loadout. Keeping
 * all of them mounted to animate one would cost far more than the animation is
 * worth, so this mounts on open and unmounts once the collapse has finished.
 *
 * The open direction deliberately uses no JavaScript timing. The usual trick —
 * mount collapsed, then expand a frame later — makes the content's visibility
 * depend on a requestAnimationFrame or a timer, and a browser fires neither
 * promptly in a page it considers hidden: a background tab, or a window behind
 * another one. The card would then sit at height zero until the browser got
 * round to it. `@starting-style` hands that problem to the browser instead, so
 * the element mounts already expanded and the engine supplies the collapsed
 * state to animate from. Where it is not supported the body simply appears,
 * which is what it did before any of this.
 *
 * Only the close direction needs a timer, and if that one is throttled the
 * worst case is an invisible zero-height element lingering a little longer.
 */

/** Must match --med in globals.css; the transition and the unmount share it. */
const DURATION = 240;

export default function Collapse({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (reducedMotion()) {
      setMounted(false);
      return;
    }
    const timer = setTimeout(() => setMounted(false), DURATION);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="collapse" data-open={open}>
      <div className="collapse-inner">{children}</div>
    </div>
  );
}
