"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Glossary from "@/components/Glossary";
import Plan from "@/components/Plan";
import Characters from "@/components/Characters";
import Weapons from "@/components/Weapons";
import Echoes from "@/components/Echoes";
import Quests from "@/components/Quests";
import Routine from "@/components/Routine";
import Settings from "@/components/Settings";
import BackToTop from "@/components/BackToTop";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { usePersistentState } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { SyncProvider } from "@/lib/sync";

/*
 * useLayoutEffect is the right hook for putting the scroll position back —
 * it runs before the browser paints, so the new tab is never seen at the old
 * tab's offset — but React warns about it on the server, where it cannot run.
 * On the server there is nothing to lay out, so useEffect stands in.
 */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Eight flat tabs mixed reference data with personal tracking. Grouping them
 * means at most four tabs are on screen at once, and it is obvious which half
 * of the app you are in.
 */
const GROUPS = [
  {
    id: "reference",
    label: "Reference",
    hint: "Game data, the same for everyone",
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

/**
 * Which tab a URL is asking for, or null if it is not asking for one. The tab
 * lives in the hash rather than the path so a link is a plain anchor into the
 * same single page, with no routing and nothing for the server to resolve.
 */
function tabFromUrl(): TabId | null {
  if (typeof window === "undefined") return null;
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return GROUP_OF.has(id) ? (id as TabId) : null;
}

/**
 * The index an arrow key moves to, or null for a key that is not navigation.
 * Wraps at both ends, which is what a tablist is expected to do.
 *
 * Returns the index rather than the item because the two tab lists have
 * different element types, and the index is what focusing needs anyway.
 */
function nextIndexByKey(
  ids: readonly string[],
  currentId: string,
  key: string
): number | null {
  const i = ids.indexOf(currentId);
  if (i < 0) return null;
  const last = ids.length - 1;
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return i === last ? 0 : i + 1;
    case "ArrowLeft":
    case "ArrowUp":
      return i === 0 ? last : i - 1;
    case "Home":
      return 0;
    case "End":
      return last;
    default:
      return null;
  }
}

/** Moves focus to the nth tab button inside a tablist. */
function focusTab(list: HTMLElement, index: number) {
  list.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus();
}

const GROUP_OF = new Map<string, string>(
  GROUPS.flatMap((g) => g.tabs.map((t) => [t.id, g.id] as [string, string]))
);

export default function Page() {
  return (
    <SyncProvider>
      <Codex />
    </SyncProvider>
  );
}

function Codex() {
  const [tab, setStoredTab] = usePersistentState<TabId>("tab", "characters");
  const theme = useTheme();

  // Avoid rendering persisted UI state until after hydration.
  const [mounted, setMounted] = useState(false);

  /*
   * On load the URL beats the stored tab. Someone following a link to
   * #weapons means it, and the tab they happened to leave open in this
   * browser last time should not override them. With no tab in the URL we
   * write the stored one in, so the address bar always says where you are and
   * the page is linkable from the moment it opens.
   */
  useEffect(() => {
    const fromUrl = tabFromUrl();
    if (fromUrl) setStoredTab(fromUrl);
    else window.history.replaceState(null, "", `#${tab}`);
    setMounted(true);
    // Deliberately once, on mount: this reconciles the two sources of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Every tab change pushes history, so back returns to the previous tab
   * rather than leaving the site. Guarded against pushing a duplicate when
   * the change came from the URL in the first place.
   *
   * The incoming panel animates itself on mount — see .panel in globals.css.
   * A view transition would have cross-faded the outgoing one as well, but
   * startViewTransition aborts with InvalidStateError on every tab of this
   * page, measured 6 times out of 6, while succeeding on a plain page in the
   * same browser. Whatever the snapshot objects to, a mount animation needs
   * no snapshot and cannot fail the same way.
   */
  const commitTab = useCallback(
    (next: TabId, push: boolean) => {
      setStoredTab(next);
      if (push && tabFromUrl() !== next) {
        window.history.pushState(null, "", `#${next}`);
      }
    },
    [setStoredTab]
  );

  const setTab = useCallback(
    (next: TabId) => commitTab(next, true),
    [commitTab]
  );

  /* Back and forward move between tabs, which is what the address bar implies. */
  useEffect(() => {
    const sync = () => {
      const fromUrl = tabFromUrl();
      // No push: the history entry being moved to is already the current one.
      if (fromUrl) commitTab(fromUrl, false);
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [commitTab]);

  /*
   * Where each tab was left.
   *
   * Switching tabs used to keep the window's scroll position, so leaving the
   * Characters list 2400px down and opening the Glossary landed you 2400px
   * into the glossary with the first term above the viewport. Each tab now
   * keeps its own place: one you have not opened starts at the top, and one
   * you come back to is where you left it.
   */
  const scrollMemory = useRef<Partial<Record<TabId, number>>>({});
  const shownTab = useRef(tab);

  useEffect(() => {
    // Bound once and reading the ref, so it always records against the tab
    // actually on screen — including the scroll the restore below causes.
    const record = () => {
      scrollMemory.current[shownTab.current] = window.scrollY;
    };
    window.addEventListener("scroll", record, { passive: true });
    return () => window.removeEventListener("scroll", record);
  }, []);

  useBeforePaint(() => {
    const previous = shownTab.current;
    shownTab.current = tab;
    if (previous === tab) return;
    // Explicitly instant. Scrolling is smooth now, and animating 2400px on
    // every tab change would be worse than the jump it replaces.
    window.scrollTo({ top: scrollMemory.current[tab] ?? 0, behavior: "instant" });
  }, [tab]);

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
            Wuthering Waves companion: 61 character builds, glossary, story,
            routine.
          </p>
        </div>
        <div className="masthead-controls">
          <button
            className="theme-toggle"
            onClick={theme.toggleMode}
            aria-label="Toggle colour theme"
          >
            {theme.mode === "dark" ? "Light" : "Dark"}
          </button>
          {/* Signing in is optional: it only turns on sync across devices. */}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="theme-toggle">Sign in</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <nav className="nav" aria-label="Sections">
        {/*
          * The selected group is painted by one sliding element rather than by
          * each button's own background, so switching moves the indicator
          * instead of cross-fading it out of one button and into another —
          * which at this size read as the pill teleporting.
          */}
        <div
          className="groups"
          role="tablist"
          aria-label="Section groups"
          onKeyDown={(e) => {
            const i = nextIndexByKey(
              GROUPS.map((g) => g.id),
              group.id,
              e.key
            );
            if (i === null) return;
            e.preventDefault();
            setTab(GROUPS[i].tabs[0].id);
            focusTab(e.currentTarget, i);
          }}
          style={
            {
              "--group-count": GROUPS.length,
              "--group-index": Math.max(
                0,
                GROUPS.findIndex((g) => g.id === group.id)
              ),
            } as React.CSSProperties
          }
          data-ready={mounted}
        >
          {GROUPS.map((g) => (
            <button
              key={g.id}
              className="group"
              role="tab"
              aria-selected={mounted && group.id === g.id}
              /* Roving tabindex: a tablist is one tab stop, and the arrow keys
               * move within it. Three separate stops is what it was before. */
              tabIndex={mounted && group.id === g.id ? 0 : -1}
              title={g.hint}
              onClick={() => setTab(g.tabs[0].id)}
            >
              {g.label}
            </button>
          ))}
        </div>

        {group.tabs.length > 1 && (
          <div
            className="tabs"
            role="tablist"
            aria-label={group.label}
            onKeyDown={(e) => {
              const ids = group.tabs.map((t) => t.id);
              const i = nextIndexByKey(ids, tab, e.key);
              if (i === null) return;
              e.preventDefault();
              setTab(ids[i]);
              focusTab(e.currentTarget, i);
            }}
          >
            {group.tabs.map((t) => (
              <button
                key={t.id}
                className="tab"
                role="tab"
                aria-selected={mounted && tab === t.id}
                tabIndex={mounted && tab === t.id ? 0 : -1}
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
        /* Keyed on the tab so every switch mounts a fresh element, which is
         * what gives the CSS something to animate in. */
        <div className="panel" key={tab}>
          {tab === "characters" && <Characters />}
          {tab === "weapons" && <Weapons />}
          {tab === "echoes" && <Echoes />}
          {tab === "builds" && <Plan />}
          {tab === "glossary" && <Glossary />}
          {tab === "quests" && <Quests />}
          {tab === "routine" && <Routine />}
          {tab === "settings" && <Settings />}
        </div>
      )}

      <BackToTop />
    </main>
  );
}
