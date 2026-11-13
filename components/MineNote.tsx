"use client";

import { useSync } from "@/lib/sync";
import { exportAll, usePersistentState } from "@/lib/storage";
import { DEFAULT_PLAN } from "@/data/plan";

/** Hands the whole save to the browser as a file, without leaving the tab. */
function downloadBackup() {
  const blob = new Blob([exportAll()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resonance-codex-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Where your progress lives, said at the top of the tabs that hold it.
 * Local-first is invisible until it surprises someone (a new phone, cleared
 * site data), so this names it before it does. The first time it is a full
 * note; once dismissed, and for as long as nothing is synced, it stays as one
 * quiet line with the backup button in it, because "Got it" is not a backup.
 * Dismissal stays on this device.
 *
 * `afterQueue` holds the note back on a first visit, until there is a queued
 * Resonator to lose: a warning about data nobody has entered is noise.
 */
export default function MineNote({ afterQueue = false }: { afterQueue?: boolean }) {
  const [seen, setSeen, hydrated] = usePersistentState<boolean>("mine-note-seen", false);
  const [plan] = usePersistentState<string[]>("plan", DEFAULT_PLAN);
  const { state } = useSync();
  if (!hydrated) return null;
  if (afterQueue && plan.length === 0) return null;

  if (seen) {
    if (state !== "off") return null;
    return (
      <p className="mine-line">
        Saved on this device only.{" "}
        <button className="mini" onClick={downloadBackup}>
          Export a backup
        </button>
      </p>
    );
  }

  return (
    <aside className="mine-note" aria-label="Where your progress is saved">
      <p>
        {state === "off" ? (
          <>
            <strong>Your plan, ticks, and notes are saved in this browser.</strong>{" "}
            Clearing site data or switching device loses them. Export a backup
            here, or sign in, at the top right, to keep them with your account.
          </>
        ) : (
          <>
            <strong>Your plan, ticks, and notes are saved to your account.</strong>{" "}
            They follow you to any device you sign in on. The badge at the top
            shows when a save is still in flight.
          </>
        )}
      </p>
      <div className="mine-note-actions">
        {state === "off" && (
          <button className="mini" onClick={downloadBackup}>
            Export a backup
          </button>
        )}
        <button className="mini" onClick={() => setSeen(true)}>
          Got it
        </button>
      </div>
    </aside>
  );
}
