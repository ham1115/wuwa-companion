"use client";

import Link from "next/link";
import { ELEMENTS, ROLES } from "@/data/characters";
import type { useCharacterFilter } from "./filters";

type Filter = ReturnType<typeof useCharacterFilter>;

/** Masthead plus the bar that says this is not the real app. */
export function ProtoHeader({ which }: { which: "A" | "B" }) {
  return (
    <header className="proto-top">
      <div>
        <h1>Resonance Codex</h1>
        <p className="proto-sub">
          Prototype {which} —{" "}
          {which === "A"
            ? "list beside detail"
            : "card grid with a detail panel"}
          . Real data, real build components; nothing here is wired into the
          app.
        </p>
      </div>
      <nav className="proto-switch">
        <Link href="/prototype/a" data-on={which === "A"}>
          A
        </Link>
        <Link href="/prototype/b" data-on={which === "B"}>
          B
        </Link>
        <Link href="/" className="proto-back">
          Back to the app
        </Link>
      </nav>
    </header>
  );
}

/** Search and the filter chips, shared by both prototypes. */
export function ProtoFilters({ f, count }: { f: Filter; count: number }) {
  return (
    <div className="proto-filters">
      <input
        className="search"
        type="search"
        placeholder="Search name, weapon, echo or set…"
        value={f.query}
        onChange={(e) => f.setQuery(e.target.value)}
        aria-label="Search characters"
      />

      <div className="chips">
        <span className="proto-count">{count}</span>
        <button
          className="chip"
          data-tone="lemon"
          data-on={f.ownedOnly}
          onClick={() => f.setOwnedOnly(!f.ownedOnly)}
        >
          {f.ownedOnly ? "★ Mine only" : "Mine only"}
        </button>
        <button
          className="chip"
          data-on={f.rarity === 5}
          onClick={() => f.setRarity(f.rarity === 5 ? "all" : 5)}
        >
          5★
        </button>
        <button
          className="chip"
          data-on={f.rarity === 4}
          onClick={() => f.setRarity(f.rarity === 4 ? "all" : 4)}
        >
          4★
        </button>
      </div>

      <div className="chips">
        {ELEMENTS.map((e) => (
          <button
            key={e}
            className="chip"
            data-on={f.el === e}
            onClick={() => f.setEl(f.el === e ? "all" : e)}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="chips">
        {ROLES.map((r) => (
          <button
            key={r}
            className="chip"
            data-on={f.role === r}
            onClick={() => f.setRole(f.role === r ? "all" : r)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
