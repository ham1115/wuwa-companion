"use client";

import { useMemo, useState } from "react";
import { CHARACTERS, WEAPON_TYPES, type WeaponType } from "@/data/characters";
import { WEAPONS, baseWeaponName, type Weapon } from "@/data/weapons";
import Filters from "./Filters";
import { useOwned } from "@/lib/owned";
import { holdInPlace } from "@/lib/anchor";

/** weapon name -> characters that list it, in the order they rank it. */
const WANTED_BY = (() => {
  const map = new Map<string, { id: string; name: string; rank: number }[]>();
  for (const c of CHARACTERS) {
    c.weapons.forEach((w, i) => {
      const key = baseWeaponName(w);
      const list = map.get(key) ?? [];
      list.push({ id: c.id, name: c.name, rank: i + 1 });
      map.set(key, list);
    });
  }
  for (const list of map.values()) list.sort((a, b) => a.rank - b.rank);
  return map;
})();

export default function Weapons() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<WeaponType | "all">("all");
  const [rarity, setRarity] = useState<3 | 4 | 5 | "all">("all");
  const [mineOnly, setMineOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const owned = useOwned();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WEAPONS.filter((w) => {
      if (type !== "all" && w.type !== type) return false;
      if (rarity !== "all" && w.rarity !== rarity) return false;
      if (mineOnly) {
        const wanted = WANTED_BY.get(w.name) ?? [];
        if (!wanted.some((c) => owned.has(c.id))) return false;
      }
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.substat.toLowerCase().includes(q) ||
        w.passive.toLowerCase().includes(q)
      );
    }).sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
  }, [query, type, rarity, mineOnly, owned.owned]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section>
      <p className="panel-intro">
        {WEAPONS.length} weapons, 3★ and up. Showing {results.length}. Open one
        to see who wants it.
      </p>

      {/* The longest list in the app at 114 rows, and the one that gains most
        * from the search box staying put. */}
      <div className="sticky-controls">
        <div className="search-row">
          <input
            className="search"
            type="search"
            placeholder="Search name, stat or effect…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search weapons"
          />
        </div>

        <div className="chips">
          <button
            className="chip"
            data-tone="lemon"
            data-on={mineOnly}
            onClick={() => setMineOnly(!mineOnly)}
          >
            {mineOnly ? "★ For my characters" : "For my characters"}
          </button>
          {([5, 4, 3] as const).map((r) => (
            <button
              key={r}
              className="chip"
              data-on={rarity === r}
              onClick={() => setRarity(rarity === r ? "all" : r)}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      <Filters active={type !== "all" ? 1 : 0} onClear={() => setType("all")}>
        <div className="chips">
          <button className="chip" data-on={type === "all"} onClick={() => setType("all")}>
            All types
          </button>
          {WEAPON_TYPES.map((t) => (
            <button key={t} className="chip" data-on={type === t} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>
      </Filters>

      {results.length === 0 && <p className="empty">Nothing matches those filters.</p>}

      {results.map((w) => (
        <WeaponRow
          key={w.name}
          w={w}
          isOpen={open === w.name}
          onToggle={() => setOpen(open === w.name ? null : w.name)}
          isOwned={owned.has}
        />
      ))}

      <p className="footnote">
        Stats and effect text are Kuro Games&apos; in-game item data, collected
        from the{" "}
        <a href="https://www.prydwen.gg/wuthering-waves/weapons" target="_blank" rel="noreferrer">
          prydwen.gg weapon database
        </a>{" "}
        on 22 October 2026. Starter 1★ and 2★ weapons are left out.
      </p>
    </section>
  );
}

function WeaponRow({
  w,
  isOpen,
  onToggle,
  isOwned,
}: {
  w: Weapon;
  isOpen: boolean;
  onToggle: () => void;
  isOwned: (id: string) => boolean;
}) {
  const wanted = WANTED_BY.get(w.name) ?? [];
  const mine = wanted.filter((c) => isOwned(c.id));

  return (
    <article className="char-row">
      <button
        className="char-toggle"
        onClick={(e) => {
          holdInPlace(e.currentTarget);
          onToggle();
        }}
        aria-expanded={isOpen}
      >
        <span className="char-name">{w.name}</span>
        {mine.length > 0 && <span className="owned-dot">{mine.length} of mine</span>}
        <span className="star" data-r={w.rarity}>
          {w.rarity}★
        </span>
        <span className="term-cat">{w.type}</span>
        <span className="term-cat">{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div className="char-body">
          <div className="stat-grid">
            <div className="stat-line">
              <span className="stat-slot">ATK</span>
              <span>{w.atk} at Lv.90</span>
            </div>
            <div className="stat-line">
              <span className="stat-slot">Substat</span>
              <span>{w.substat}</span>
            </div>
          </div>

          <h2 className="section">Effect</h2>
          <p className="term-def">{w.passive}</p>

          <h2 className="section">
            {wanted.length > 0 ? "Wanted by" : "Not listed in any build"}
          </h2>
          {wanted.length > 0 ? (
            <div className="related">
              {wanted.map((c) => (
                <span
                  key={c.id}
                  className="wanted-pill"
                  data-mine={isOwned(c.id)}
                >
                  {c.name} · #{c.rank}
                </span>
              ))}
            </div>
          ) : (
            <p className="check-detail">
              No character in the database ranks this in their top four. Safe to
              treat as fodder.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
