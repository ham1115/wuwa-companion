"use client";

import { useEffect, useState } from "react";
import Glossary from "@/components/Glossary";
import Plan from "@/components/Plan";
import Characters from "@/components/Characters";
import Weapons from "@/components/Weapons";
import Echoes from "@/components/Echoes";
import Quests from "@/components/Quests";
import Routine from "@/components/Routine";
import Settings from "@/components/Settings";
import { usePersistentState } from "@/lib/storage";

const TABS = [
  { id: "characters", label: "Characters" },
  { id: "weapons", label: "Weapons" },
  { id: "echoes", label: "Echoes" },
  { id: "builds", label: "My plan" },
  { id: "glossary", label: "Glossary" },
  { id: "quests", label: "Story" },
  { id: "routine", label: "Routine" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Page() {
  const [tab, setTab] = usePersistentState<TabId>("tab", "characters");
  const [theme, setTheme] = usePersistentState<"dark" | "light">(
    "theme",
    "light"
  );

  // Avoid rendering persisted UI state until after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle colour theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </header>

      <div className="tabs" role="tablist" aria-label="Sections">
        {TABS.map((t) => (
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

      <p className="footnote">
        Everything you check off or write is stored in this browser only. It is
        never uploaded, and clearing site data erases it. Game details reflect
        public guides and may lag behind the current patch — the in-game screens
        win any disagreement.
      </p>
    </main>
  );
}
