"use client";

import { useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { PALETTES } from "@/data/palettes";
import { useOwned } from "@/lib/owned";
import { useTheme } from "@/lib/theme";
import {
  exportAll,
  importAll,
  resetEverything,
  resetGroup,
  type StorageGroup,
} from "@/lib/storage";

const GROUP_LABELS: { id: StorageGroup; label: string; detail: string }[] = [
  { id: "characters", label: "Characters", detail: "Built marks, per-character notes, and your owned list" },
  { id: "plan", label: "My plan", detail: "The queue, its checklists and notes" },
  { id: "glossary", label: "Glossary", detail: "Learned marks, revealed spoilers and term notes" },
  { id: "story", label: "Story", detail: "Chapter and act ticks" },
  { id: "routine", label: "Routine", detail: "Daily and weekly checks" },
  { id: "display", label: "Display", detail: "Theme and last open tab" },
];

export default function Settings() {
  const owned = useOwned();
  const theme = useTheme();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [payload, setPayload] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [charQuery, setCharQuery] = useState("");

  function wipe(fn: () => number, what: string) {
    const n = fn();
    setMessage(`Cleared ${what} (${n} ${n === 1 ? "entry" : "entries"}). Reloading…`);
    setConfirming(null);
    setTimeout(() => window.location.reload(), 600);
  }

  function doExport() {
    setPayload(exportAll());
    setMessage("Exported below. Copy it somewhere safe.");
  }

  function doImport() {
    try {
      const n = importAll(payload);
      setMessage(`Imported ${n} entries. Reloading…`);
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Import failed.");
    }
  }

  const charResults = CHARACTERS.filter((c) =>
    c.name.toLowerCase().includes(charQuery.trim().toLowerCase())
  );

  return (
    <section>
      <p className="panel-intro">
        Everything here affects only this browser. The app ships blank — no
        owned characters, no queue, no progress — so sharing the URL gives each
        player an empty slate. Nothing you tick is visible to anyone else.
      </p>

      {message && <div className="callout">{message}</div>}

      <h2 className="section">Which characters do you own?</h2>
      <p className="panel-intro">
        {owned.owned.length} selected. This drives the “mine” badges and every
        “for my characters” filter.
      </p>

      <div className="search-row">
        <input
          className="search"
          type="search"
          placeholder="Find a character to toggle…"
          value={charQuery}
          onChange={(e) => setCharQuery(e.target.value)}
          aria-label="Find character"
        />
      </div>

      <div className="chips">
        <button className="chip" onClick={owned.clear} disabled={owned.owned.length === 0}>
          Select none
        </button>
      </div>

      <div className="owned-grid">
        {charResults.map((c) => (
          <button
            key={c.id}
            className="chip"
            data-on={owned.has(c.id)}
            onClick={() => owned.toggle(c.id)}
          >
            {owned.has(c.id) ? "✓ " : ""}
            {c.name}
          </button>
        ))}
      </div>
      {charResults.length === 0 && <p className="empty">No character by that name.</p>}

      <h2 className="section">Colours</h2>
      <p className="panel-intro">
        Presets change the accent and the background tint; light and dark keep
        their own readable text and borders either way.
      </p>

      <div className="palette-grid">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            className="palette"
            data-on={theme.paletteId === p.id}
            onClick={() => theme.setPaletteId(p.id)}
          >
            <span className="palette-swatches">
              <span style={{ background: p.swatch[0] }} />
              <span style={{ background: p.swatch[1] }} />
            </span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mine-row">
        <label className="mine-field">
          <span className="target-label">Or pick your own accent</span>
          <input
            type="color"
            className="colour-input"
            value={theme.accent || "#c43f7a"}
            onChange={(e) => theme.setAccent(e.target.value)}
            aria-label="Custom accent colour"
          />
        </label>
      </div>
      <p className="check-detail">
        A custom accent overrides the preset&apos;s. The tint behind it and the
        darker shade for text on that tint are worked out from the hue, so any
        colour stays readable in both modes.
      </p>

      <div className="chips">
        {theme.accent && (
          <button className="chip" onClick={() => theme.setAccent("")}>
            Drop the custom accent
          </button>
        )}
        {theme.customised && (
          <button className="chip" onClick={theme.reset}>
            Back to pink &amp; lemon
          </button>
        )}
      </div>

      <h2 className="section">Back up or move your progress</h2>
      <p className="panel-intro">
        This is how you get your progress onto another device — export here,
        paste it there.
      </p>
      <div className="chips">
        <button className="chip" onClick={doExport}>
          Export to JSON
        </button>
        <button className="chip" onClick={doImport} disabled={!payload.trim()}>
          Import from the box
        </button>
      </div>
      <textarea
        className="note-area"
        style={{ minHeight: 140, fontFamily: "ui-monospace, monospace", fontSize: "0.78rem" }}
        placeholder="Exported JSON appears here. Paste a previous export in to restore it."
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />

      <h2 className="section">Reset</h2>
      {GROUP_LABELS.map((g) => (
        <div key={g.id} className="card">
          <div className="build-head">
            <h3>{g.label}</h3>
          </div>
          <p className="build-role">{g.detail}</p>
          {confirming === g.id ? (
            <div className="queue-controls">
              <button className="mini" data-on onClick={() => wipe(() => resetGroup(g.id), g.label)}>
                Yes, clear it
              </button>
              <button className="mini" onClick={() => setConfirming(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="queue-controls">
              <button className="mini" onClick={() => setConfirming(g.id)}>
                Clear {g.label}
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="card danger-card">
        <div className="build-head">
          <h3>Everything</h3>
        </div>
        <p className="build-role">
          Clears all of the above. Cannot be undone — export first if you want it
          back.
        </p>
        {confirming === "all" ? (
          <div className="queue-controls">
            <button className="mini" data-on onClick={() => wipe(resetEverything, "everything")}>
              Yes, wipe everything
            </button>
            <button className="mini" onClick={() => setConfirming(null)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="queue-controls">
            <button className="mini" onClick={() => setConfirming("all")}>
              Reset the whole app
            </button>
          </div>
        )}
      </div>

      <p className="footnote">
        To share it, just send the URL. Visitors start blank and never load
        your data — nothing personal is baked into the app itself.
      </p>
    </section>
  );
}
