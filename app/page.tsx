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
import Now from "@/components/Now";
import Characters from "@/components/Characters";
import Weapons from "@/components/Weapons";
import Echoes from "@/components/Echoes";
import Quests from "@/components/Quests";
import Routine from "@/components/Routine";
import Settings from "@/components/Settings";
import BackToTop from "@/components/BackToTop";
import Logo from "@/components/Logo";
import { CHARACTERS } from "@/data/characters";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { PREFIX, usePersistentState } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { SyncProvider } from "@/lib/sync";
import SyncBadge from "@/components/SyncBadge";
import MineNote from "@/components/MineNote";

/*
 * useLayoutEffect is the right hook for putting the scroll position back —
 * it runs before the browser paints, so the new tab is never seen at the old
 * tab's offset — but React warns about it on the server, where it cannot run.
 * On the server there is nothing to lay out, so useEffect stands in.
 */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Nine flat tabs mixed reference data with personal tracking. Grouping them
 * means at most four tabs are on screen at once, and it is obvious which half
 * of the app you are in. Mine leads: it is where a returning player comes to
 * work, and its first tab, Now, is where the app opens.
 */
const GROUPS = [
  {
    id: "mine",
    label: "Mine",
    hint: "Your progress, stored in this browser",
    tabs: [
      { id: "now", label: "Now" },
      { id: "builds", label: "My plan" },
      { id: "quests", label: "Story" },
      { id: "routine", label: "Routine" },
    ],
  },
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
 * True when there is nothing to come back to: no stored tab, so this browser
 * has never been used. Such a visitor starts on Now, whose first-steps card
 * says what the app is for, rather than on a bare 61-row list.
 */
function isFirstVisit(): boolean {
  try {
    return window.localStorage.getItem(`${PREFIX}tab`) === null;
  } catch {
    return false;
  }
}

/** True once the player has a build queued or a routine tick to come back to. */
function hasProgress(): boolean {
  try {
    const nonEmpty = (key: string) => {
      const raw = window.localStorage.getItem(`${PREFIX}${key}`);
      const v = raw ? JSON.parse(raw) : null;
      return Array.isArray(v) && v.length > 0;
    };
    return nonEmpty("plan") || nonEmpty("routine");
  } catch {
    return false;
  }
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

const REFERENCE_TABS = GROUPS[1].tabs.map((t) => t.id as TabId);

/**
 * What the nav row shows. Nine tabs were more choices than a first-time player
 * can sort, so the four reference tabs are folded into one, Browse, with the
 * four of them as a switcher inside it. Each id and URL is unchanged: #weapons
 * still opens Weapons, and Browse is simply lit while any of them is open.
 */
const NAV: { id: string; label: string; tabs: readonly TabId[] }[] = [
  { id: "now", label: "Now", tabs: ["now"] },
  { id: "builds", label: "My plan", tabs: ["builds"] },
  { id: "routine", label: "Routine", tabs: ["routine"] },
  { id: "browse", label: "Browse", tabs: REFERENCE_TABS },
  { id: "quests", label: "Story", tabs: ["quests"] },
  { id: "settings", label: "Settings", tabs: ["settings"] },
];

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
    else {
      // Opened with no tab in the address: someone with a queue or a routine
      // started wants to know what is next, not where they last browsed. A
      // first-ever visit also lands there: Now explains what to do first.
      const start: TabId = hasProgress() || isFirstVisit() ? "now" : tab;
      setStoredTab(start);
      window.history.replaceState(null, "", `#${start}`);
    }
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

  /*
   * The list tabs pin their search box directly under the nav, and the nav is
   * not one height: two bands on a phone, one from 820px up, and taller again
   * if a label ever wraps. Measuring the real element is the only offset that
   * is right in all of them — guess it and the bar either laps the nav or
   * floats below it with a stripe of list showing through the gap.
   */
  const navRef = useRef<HTMLElement>(null);

  // On a phone the tab row scrolls sideways, and arriving on a tab by link
  // left it half off the right edge. Bring it into view along the row only,
  // and only as far as needed: centring it pushed Now off the left edge the
  // moment you opened My plan. block "nearest" never scrolls the page itself.
  useEffect(() => {
    if (!mounted) return;
    navRef.current
      ?.querySelector<HTMLElement>('.tabs [aria-selected="true"]')
      ?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [tab, mounted]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const write = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    write();
    const observer = new ResizeObserver(write);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The open group follows the open tab, so a restored tab restores its group.
  const group = useMemo(
    () => GROUPS.find((g) => g.id === GROUP_OF.get(tab)) ?? GROUPS[0],
    [tab]
  );

  // Browse opens wherever you last were inside it, not always on Characters.
  const lastBrowse = useRef<TabId>("characters");
  if (REFERENCE_TABS.includes(tab)) lastBrowse.current = tab;
  const navId = NAV.find((n) => n.tabs.includes(tab))?.id ?? "now";
  const openNav = (n: (typeof NAV)[number]) =>
    setTab(n.id === "browse" ? lastBrowse.current : n.tabs[0]);

  return (
    <main className="shell">
      <header className="masthead">
        <div className="masthead-name">
          <Logo className="logo" />
          <h1>Resonance Codex</h1>
          <p>
            Wuthering Waves companion: {CHARACTERS.length} character builds,
            glossary, story, routine.
          </p>
        </div>
        <div className="masthead-controls">
          <SyncBadge />
          <button
            className="theme-toggle"
            onClick={theme.toggleMode}
            aria-label={theme.mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
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

      <nav className="nav" aria-label="Sections" ref={navRef}>
        {/*
          * One row, six tabs. The row scrolls sideways if a narrow phone needs
          * it, fades at the edge while there is more, and brings the selected
          * tab into view.
          */}
        <div
          className="tabs"
          role="tablist"
          aria-label="Sections"
          onKeyDown={(e) => {
            const ids = NAV.map((n) => n.id);
            const i = nextIndexByKey(ids, navId, e.key);
            if (i === null) return;
            e.preventDefault();
            openNav(NAV[i]);
            focusTab(e.currentTarget, i);
          }}
        >
          {NAV.map((n) => (
            <button
              key={n.id}
              className="tab"
              role="tab"
              aria-selected={mounted && navId === n.id}
              tabIndex={mounted && navId === n.id ? 0 : -1}
              onClick={() => openNav(n)}
            >
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {!mounted ? (
        <p className="empty">Loading your saved progress…</p>
      ) : (
        /* Keyed on the tab so every switch mounts a fresh element, which is
         * what gives the CSS something to animate in. */
        <div className="panel" key={tab}>
          {/* On Now the first-run steps come first and the storage note after
           * them: the steps are the invitation, the note is the fine print. */}
          {group.id === "mine" && tab !== "now" && <MineNote />}
          {group.id === "reference" && (
            <div
              className="browse-switch"
              role="tablist"
              aria-label="Browse"
              onKeyDown={(e) => {
                const i = nextIndexByKey(REFERENCE_TABS, tab, e.key);
                if (i === null) return;
                e.preventDefault();
                setTab(REFERENCE_TABS[i]);
                focusTab(e.currentTarget, i);
              }}
            >
              {group.tabs.map((t) => (
                <button
                  key={t.id}
                  className="chip"
                  role="tab"
                  data-on={tab === t.id}
                  aria-selected={tab === t.id}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          {tab === "characters" && <Characters />}
          {tab === "weapons" && <Weapons />}
          {tab === "echoes" && <Echoes />}
          {tab === "now" && (
            <>
              <Now onGo={setTab} />
              <MineNote afterQueue />
            </>
          )}
          {tab === "builds" && <Plan onGo={setTab} />}
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
