"use client";

import type { Profile } from "@/data/profile";
import { PREFIX } from "./storage";

/**
 * Writes a profile's four pieces of personal progress into this browser.
 * Ticked checklists, notes and story progress are left alone, so loading a
 * profile adds context without wiping what the viewer has already done.
 *
 * Returns how many keys were written. Caller reloads so every hook re-reads.
 */
export function loadProfile(p: Profile): number {
  if (typeof window === "undefined") return 0;
  const pairs: [string, unknown][] = [
    ["owned", p.owned],
    ["plan", p.plan],
    ["account-notes", p.accountNotes],
    ["priority-now", p.priorityNow],
  ];
  let n = 0;
  for (const [k, v] of pairs) {
    try {
      window.localStorage.setItem(PREFIX + k, JSON.stringify(v));
      n++;
    } catch {
      // storage blocked — the rest of the app still works
    }
  }
  return n;
}
