"use client";

import { useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { PALETTES } from "@/data/palettes";
import { Show, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useOwned } from "@/lib/owned";
import { useTheme } from "@/lib/theme";
import { useSync } from "@/lib/sync";
import {
  exportAll,
  importAll,
  resetEverything,
  resetGroup,
  type StorageGroup,
} from "@/lib/storage";

/**
 * What a picker shows before a custom colour is set: the colour actually in
 * use, so opening the swatch does not suggest a colour the app is not using.
 * For the accent that is the preset's own, since a preset sets one; the
 * presets leave text alone, so the text swatch shows the base theme's.
 */
const BASE_ACCENT: Record<"light" | "dark", string> = {
  light: "#c43f7a",
  dark: "#ff9ac6",
};
const BASE_INK: Record<"light" | "dark", string> = {
  light: "#3f2733",
  dark: "#fbeaf2",
};
const BASE_BG: Record<"light" | "dark", string> = {
  light: "#fff6fa",
  dark: "#1c1118",
};
const BASE_LEMON: Record<"light" | "dark", string> = {
  light: "#f6c744",
  dark: "#ffd978",
};

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
  const sync = useSync();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [payload, setPayload] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [charQuery, setCharQuery] = useState("");
  const [paletteName, setPaletteName] = useState("");

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
        A preset changes the accent and the background tint. Underneath it you
        can set the accent, the background and the text colour yourself, and
        each one layers over whichever preset is picked.
      </p>

      <div className="palette-grid">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            className="palette"
            data-on={theme.paletteId === p.id && !theme.activeSavedId}
            onClick={() => theme.choosePreset(p.id)}
          >
            <span className="palette-swatches">
              <span style={{ background: p.swatch[0] }} />
              <span style={{ background: p.swatch[1] }} />
            </span>
            {p.label}
          </button>
        ))}
      </div>

      {theme.saved.length > 0 && (
        <>
          <p className="target-label">Your own</p>
          <div className="palette-grid">
            {theme.saved.map((p) => (
              <div className="palette-own" key={p.id}>
                <button
                  className="palette"
                  data-on={theme.activeSavedId === p.id}
                  onClick={() => theme.applySaved(p.id)}
                >
                  <span className="palette-swatches">
                    {[p.accent, p.bg, p.lemon, p.ink]
                      .filter(Boolean)
                      .map((c, i) => (
                        <span key={i} style={{ background: c }} />
                      ))}
                  </span>
                  {p.name}
                </button>
                <button
                  className="mini palette-drop"
                  onClick={() => theme.deleteSaved(p.id)}
                  aria-label={`Delete the preset ${p.name}`}
                  title={`Delete ${p.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mine-row">
        <label className="mine-field">
          <span className="target-label">Accent</span>
          <input
            type="color"
            className="colour-input"
            value={
            theme.accent ||
            theme.palette[theme.mode].accent ||
            BASE_ACCENT[theme.mode]
          }
            onChange={(e) => theme.setAccent(e.target.value)}
            aria-label="Custom accent colour"
          />
          <span className="check-detail">
            Headings, badges, the selected tab. The tint behind it and the
            shade for text on that tint come from the hue.
          </span>
        </label>

        <label className="mine-field">
          <span className="target-label">Background</span>
          <input
            type="color"
            className="colour-input"
            value={
              theme.bg || theme.palette[theme.mode].bg || BASE_BG[theme.mode]
            }
            onChange={(e) => theme.setBg(e.target.value)}
            aria-label="Custom background colour"
          />
          <span className="check-detail">
            The page, the cards above it, the wells below, and both border
            weights — spaced as the built-in themes space them.
          </span>
        </label>

        <label className="mine-field">
          <span className="target-label">Text</span>
          <input
            type="color"
            className="colour-input"
            value={
            theme.ink ||
            theme.palette[theme.mode].text ||
            BASE_INK[theme.mode]
          }
            onChange={(e) => theme.setInk(e.target.value)}
            aria-label="Custom text colour"
          />
          <span className="check-detail">
            Body text, plus the dimmer labels and faint captions worked out
            from it. The hue carries into both modes; how light it ends up is
            chosen per mode so it always reads.
          </span>
        </label>

        <label className="mine-field">
          <span className="target-label">Secondary</span>
          <input
            type="color"
            className="colour-input"
            value={
              theme.lemon ||
              theme.palette[theme.mode].lemon ||
              BASE_LEMON[theme.mode]
            }
            onChange={(e) => theme.setLemon(e.target.value)}
            aria-label="Custom secondary colour"
          />
          <span className="check-detail">
            Callouts and the second pill colour — the one the presets pair
            against the accent.
          </span>
        </label>
      </div>

      {theme.bgAdjusted && (
        <div className="callout">
          <strong>That background was pulled back</strong>
          Its hue is yours, but {theme.mode} mode was kept {theme.mode}. Every
          pill, tint and soft accent in this mode is built to sit on a{" "}
          {theme.mode === "light" ? "pale" : "dark"} page, and they are not
          re-derived from your pick — so a{" "}
          {theme.mode === "light" ? "dark" : "pale"} background here would make
          them vanish rather than invert. Switch to{" "}
          {theme.mode === "light" ? "dark" : "light"} mode for that.
        </div>
      )}

      {theme.inkAdjusted && (
        <div className="callout">
          <strong>That text colour was pulled back</strong>
          Its hue is yours, but it was {theme.mode === "light"
            ? "darkened"
            : "lightened"}{" "}
          and desaturated so body text still reads against the{" "}
          {theme.mode} background. Pick something{" "}
          {theme.mode === "light" ? "darker" : "lighter"} to see the exact
          colour you chose.
        </div>
      )}

      <div className="colour-sample" aria-hidden="true">
        <strong>Sample</strong>
        <span className="sample-dim">A dimmer label, as used on cards</span>
        <span className="sample-faint">And the faintest caption line</span>
        <span className="badge" data-status="active">
          Accent badge
        </span>
      </div>

      <div className="save-row">
        <input
          className="search save-name"
          type="text"
          placeholder="Name these colours to keep them…"
          value={paletteName}
          onChange={(e) => setPaletteName(e.target.value)}
          aria-label="Name for your own preset"
          maxLength={32}
        />
        <button
          className="chip"
          data-on={paletteName.trim() !== "" && theme.hasCustomColours}
          disabled={paletteName.trim() === "" || !theme.hasCustomColours}
          onClick={() => {
            theme.savePalette(paletteName);
            setPaletteName("");
          }}
        >
          Save as my preset
        </button>
      </div>
      <p className="check-detail">
        Saves the four colours above under that name, in this browser. Reusing
        a name overwrites that preset, so you can tweak and re-save it. Light
        and dark are not stored — each saved preset works in both, because the
        colours are re-derived per mode.
      </p>

      <div className="chips">
        {theme.accent && (
          <button className="chip" onClick={() => theme.setAccent("")}>
            Drop the custom accent
          </button>
        )}
        {theme.ink && (
          <button className="chip" onClick={() => theme.setInk("")}>
            Drop the custom text colour
          </button>
        )}
        {theme.bg && (
          <button className="chip" onClick={() => theme.setBg("")}>
            Drop the custom background
          </button>
        )}
        {theme.lemon && (
          <button className="chip" onClick={() => theme.setLemon("")}>
            Drop the custom secondary
          </button>
        )}
        {theme.customised && (
          <button className="chip" onClick={theme.reset}>
            Back to pink &amp; lemon
          </button>
        )}
      </div>

      <h2 className="section">Sync across devices</h2>

      <Show when="signed-out">
        <p className="panel-intro">
          Everything above is stored in this browser only. Signing in copies it
          to your account so the same progress shows up on your phone and your
          desktop. It is entirely optional — the app works exactly as it does
          now without it, and anyone you share the URL with still gets a blank
          slate.
        </p>
        <div className="chips">
          <SignInButton mode="modal">
            <button className="chip" data-on>
              Sign in to sync
            </button>
          </SignInButton>
        </div>
        <p className="check-detail">
          Your progress is not uploaded until you sign in, and signing out
          leaves this browser&apos;s copy in place.
        </p>
      </Show>

      <Show when="signed-in">
        <div className="card">
          <div className="build-head">
            <h3>Sync</h3>
            <span
              className="badge"
              data-status={
                sync.state === "error"
                  ? "blocked"
                  : sync.state === "synced"
                    ? "done"
                    : "active"
              }
            >
              {sync.state === "syncing" && "Syncing…"}
              {sync.state === "synced" && "Up to date"}
              {sync.state === "error" && "Not synced"}
              {sync.state === "off" && "Off"}
            </span>
          </div>
          <p className="build-role">
            Changes are saved in this browser first and sent a moment later, so
            nothing waits on the network. Each part of the app syncs on its own
            and the most recent change wins.
          </p>
          {sync.error && (
            <p className="check-detail">
              Last attempt failed: {sync.error}. It will try again on your next
              change, or use the button.
            </p>
          )}
          {sync.lastSyncedAt && (
            <p className="check-detail">
              Last synced{" "}
              {new Date(sync.lastSyncedAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
              .
            </p>
          )}
          <div className="queue-controls">
            <button className="mini" onClick={() => void sync.syncNow()}>
              Sync now
            </button>
            <SignOutButton>
              <button className="mini">Sign out</button>
            </SignOutButton>
          </div>
        </div>
        <p className="check-detail">
          Signing out stops syncing and leaves this browser&apos;s copy exactly
          as it is. Your account keeps its copy for the next sign-in.
        </p>
      </Show>

      <h2 className="section">Back up or move your progress</h2>
      <p className="panel-intro">
        Works signed out, and gives you a copy you hold yourself — export here,
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
