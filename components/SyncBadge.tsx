"use client";

import { useSync } from "@/lib/sync";

const LABEL = {
  off: "On this device",
  syncing: "Syncing",
  synced: "Synced",
  error: "Not synced",
} as const;

const TITLE = {
  off: "Your progress is saved in this browser only. Sign in to keep it across devices.",
  syncing: "Sending your latest changes.",
  synced: "Your progress is saved to your account.",
  error: "The last save to your account failed. It retries on your next change.",
} as const;

/**
 * Where your progress is living. Local-first means every edit already
 * worked; this only says whether it has also left the device.
 */
export default function SyncBadge() {
  const { state } = useSync();
  return (
    <span className="sync-badge" data-state={state} title={TITLE[state]} role="status">
      <span className="sync-dot" aria-hidden="true" />
      <span className="sync-label">{LABEL[state]}</span>
    </span>
  );
}
