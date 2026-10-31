"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { CHARACTERS, WEAPON_TYPES, type WeaponType } from "@/data/characters";
import { WEAPONS, baseWeaponName, type Weapon } from "@/data/weapons";
import Filters from "./Filters";
import EmptyPane from "./EmptyPane";
import Modal from "./Modal";
import { useOwned } from "@/lib/owned";
import { useMediaQuery } from "@/lib/media";

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
  const wide = useMediaQuery("(min-width: 900px)");

  /* Looked up in the whole database rather than the filtered results, so
   * narrowing the list does not close the weapon being read. */
  const current = open ? WEAPONS.find((w) => w.name === open) ?? null : null;

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

  /*
   * Lifted into a variable so the split can put it over the column it
   * filters, rather than leaving a window-wide search box above a 300px
   * list. Same arrangement the Characters tab uses.
   */
  const controls = (
    <>
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
    </>
  );

  return (
    <section>
      <p className="panel-intro">
        {WEAPONS.length} weapons, 3★ and up. Showing {results.length}. Open one
        to see who wants it.
      </p>

      {!wide && controls}

      {results.length === 0 && <p className="empty">Nothing matches those filters.</p>}

      {/* The same split the Characters tab makes, for the same reason: 114
        * rows is a long way to push down the page to read one effect. */}
      {wide ? (
        <div className="char-split">
          <div className="char-list">
            {controls}
            {results.map((w) => {
              const mine = (WANTED_BY.get(w.name) ?? []).filter((c) =>
                owned.has(c.id)
              );
              return (
                <button
                  key={w.name}
                  className="char-pick"
                  data-sel={current?.name === w.name}
                  onClick={() => setOpen(w.name)}
                >
                  <span className="char-name">{w.name}</span>
                  {mine.length > 0 && (
                    <span className="owned-dot">{mine.length}</span>
                  )}
                  <span className="star" data-r={w.rarity}>
                    {w.rarity}★
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="char-detail">
            {current ? (
              <>
                <header className="char-detail-head">
                  <h2>{current.name}</h2>
                  <span className="star" data-r={current.rarity}>
                    {current.rarity}★
                  </span>
                  <span className="term-cat">{current.type}</span>
                </header>
                <WeaponBody w={current} isOwned={owned.has} />
              </>
            ) : (
              <EmptyPane title="Pick a weapon">
                {results.length} on the list beside this. Search takes the
                effect text too, so a mechanic finds the weapons that have it.
              </EmptyPane>
            )}
          </aside>
        </div>
      ) : (
        <>
          {results.map((w) => (
            <WeaponRow
              key={w.name}
              w={w}
              isSelected={open === w.name}
              onOpen={() => setOpen(w.name)}
              isOwned={owned.has}
            />
          ))}

          <Modal
            open={current !== null}
            onClose={() => setOpen(null)}
            label={current ? `${current.name} weapon` : "Weapon"}
          >
            {current && (
              <>
                <header className="sheet-head">
                  <h2>{current.name}</h2>
                  <span className="star" data-r={current.rarity}>
                    {current.rarity}★
                  </span>
                  <span className="term-cat">{current.type}</span>
                </header>
                <WeaponBody w={current} isOwned={owned.has} />
              </>
            )}
          </Modal>
        </>
      )}

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
  isSelected,
  onOpen,
  isOwned,
}: {
  w: Weapon;
  isSelected: boolean;
  onOpen: () => void;
  isOwned: (id: string) => boolean;
}) {
  const mine = (WANTED_BY.get(w.name) ?? []).filter((c) => isOwned(c.id));

  return (
    <article className="char-row" data-sel={isSelected}>
      <button className="char-toggle" onClick={onOpen} aria-haspopup="dialog">
        <span className="char-name">{w.name}</span>
        {mine.length > 0 && <span className="owned-dot">{mine.length} of mine</span>}
        <span className="star" data-r={w.rarity}>
          {w.rarity}★
        </span>
        <span className="term-cat">{w.type}</span>
        <span className="term-cat">▸</span>
      </button>
    </article>
  );
}

/**
 * One weapon's stats, effect and the characters that rank it. Shared by the
 * row it unfolds inside on a phone and the pane it fills on a desktop.
 */
function WeaponBody({
  w,
  isOwned,
}: {
  w: Weapon;
  isOwned: (id: string) => boolean;
}) {
  const wanted = WANTED_BY.get(w.name) ?? [];

  /*
   * What this weapon is actually competing with: the same type at the same
   * rarity, which is the set a character chooses from. Between four and
   * thirteen of them depending on the class, which is also what fills a pane
   * that a weapon's own two stat lines and one paragraph leave mostly empty.
   */
  const peers = useMemo(
    () =>
      WEAPONS.filter((o) => o.type === w.type && o.rarity === w.rarity).sort(
        (a, b) => b.atk - a.atk || a.name.localeCompare(b.name)
      ),
    [w.type, w.rarity]
  );
  /* Bars run from zero to the best in the group rather than from the group's
   * own floor: the differences are smaller that way, but they are the real
   * ones. 5-star Broadblades run 412 to 675, which is worth seeing honestly. */
  const peerMax = Math.max(...peers.map((o) => o.atk));

  return (
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
            <span key={c.id} className="wanted-pill" data-mine={isOwned(c.id)}>
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

      {peers.length > 1 && (
        <>
          <h2 className="section">
            The other {w.rarity}★ {w.type}
          </h2>
          <p className="check-detail">
            Base ATK at Lv.90, against the hardest-hitting of them. Everything
            here fits the same characters, so it is the list this one is
            actually competing with.
          </p>
          <div className="peers">
            {peers.map((o) => (
              <div
                key={o.name}
                className="peer"
                data-this={o.name === w.name}
                style={{ "--fill": `${(o.atk / peerMax) * 100}%` } as CSSProperties}
              >
                <span className="peer-name">{o.name}</span>
                <span className="peer-sub">{o.substat}</span>
                <span className="peer-atk">{o.atk}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
