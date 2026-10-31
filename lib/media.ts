"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether a media query matches right now, as state.
 *
 * Used where the two layouts are different React trees rather than the same
 * tree styled differently — the Characters tab renders one character's build
 * either inside its row or in a pane beside the list, and rendering both so
 * CSS can hide one would mount the heavier of them for nothing.
 *
 * The server snapshot is false, which would normally risk a hydration
 * mismatch. It does not here: the page renders a placeholder until it has
 * mounted, so no tab exists on the server to disagree with.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
