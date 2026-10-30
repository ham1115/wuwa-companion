"use client";

import { useEffect, useMemo, useState } from "react";
import Glossary from "@/components/Glossary";
import Plan from "@/components/Plan";
import Characters from "@/components/Characters";
import Weapons from "@/components/Weapons";
import Echoes from "@/components/Echoes";
import Quests from "@/components/Quests";
import Routine from "@/components/Routine";
import Settings from "@/components/Settings";
import BackToTop from "@/components/BackToTop";
import { usePersistentState } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

/**
 * Eight flat tabs mixed reference data with personal tracking. Grouping them
 * means at most four tabs are on screen at once, and it is obvious which half
 * of the app you are in.
 */
const GROUPS = [
  {
    id: "reference",
    label: "Reference",
    hint: "Game data — the same for everyone",
    tabs: [
      { id: "characters", label: "Characters" },
      { id: "weapons", label: "Weapons" },
      { id: "echoes", label: "Echoes" },
      { id: "glossary", label: "Glossary" },
    ],
  },
  {
    id: "mine",
    label: "Mine",
    hint: "Your progress, stored in this browser",
    tabs: [
      { id: "builds", label: "My plan" },
      { id: "quests", label: "Story" },
      { id: "routine", label: "Routine" },
    ],
  },
  {
    id: "setup",
    label: "Setup",
    hint: "Owned list, backup, reset",
    tabs: [{ id: "settings", label: "Settings" }],
  },
] as const;

type TabId = (typeof GROUPS)[number]["tabs"][number]["id"];

const GROUP_OF = new Map<string, string>(
  GROUPS.flatMap((g) => g.tabs.map((t) => [t.id, g.id] as [string, string]))
);

export default function Page() {
  const [tab, setTab] = usePersistentState<TabId>("tab", "characters");
  const theme = useTheme();

  // Avoid rendering persisted UI state until after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The open group follows the open tab, so a restored tab restores its group.
  const group = useMemo(
    () => GROUPS.find((g) => g.id === GROUP_OF.get(tab)) ?? GROUPS[0],
    [tab]
  );

  return (
    <main className="shell">
      <header className="masthead">
        <div>
          <h1>Resonance Codex</h1>
          <p>
            Wuthering Waves companion — 61 character builds, glossary, story,
            routine.
          </p>
        </div>
        <button
          className="theme-toggle"
          onClick={theme.toggleMode}
          aria-label="Toggle colour theme"
        >
          {theme.mode === "dark" ? "Light" : "Dark"}
        </button>
      </header>

      <nav className="nav" aria-label="Sections">
        <div className="groups" role="tablist" aria-label="Section groups">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              className="group"
              role="tab"
              aria-selected={mounted && group.id === g.id}
              title={g.hint}
              onClick={() => setTab(g.tabs[0].id)}
            >
              {g.label}
            </button>
          ))}
        </div>

        {group.tabs.length > 1 && (
          <div className="tabs" role="tablist" aria-label={group.label}>
            {group.tabs.map((t) => (
              <button
                key={t.id}
                className="tab"
                role="tab"
                aria-selected={mounted && tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {!mounted ? (
        <p className="empty">Loading your saved progress…</p>
      ) : (
        <>
          {tab === "characters" && <Characters />}
          {tab === "weapons" && <Weapons />}
          {tab === "echoes" && <Echoes />}
          {tab === "builds" && <Plan />}
          {tab === "glossary" && <Glossary />}
          {tab === "quests" && <Quests />}
          {tab === "routine" && <Routine />}
          {tab === "settings" && <Settings />}
        </>
      )}

      <BackToTop />
    </main>
  );
}
