"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CHARACTERS } from "@/data/characters";
import { ECHOES, type Echo } from "@/data/echoes";
import { WEAPONS, baseWeaponName, type Weapon } from "@/data/weapons";
import { SyncProvider } from "@/lib/sync";
import { ProtoHeader } from "../Chrome";
import "../prototype.css";

/** Weapon name -> the characters that rank it, best first. */
const WANTED_BY = (() => {
  const map = new Map<string, { name: string; rank: number }[]>();
  for (const c of CHARACTERS) {
    c.weapons.forEach((w, i) => {
      const key = baseWeaponName(w);
      map.set(key, [...(map.get(key) ?? []), { name: c.name, rank: i + 1 }]);
    });
  }
  for (const list of map.values()) list.sort((a, b) => a.rank - b.rank);
  return map;
})();

type Column = {
  key: string;
  label: string;
  /** What the column sorts on. Strings sort by locale, numbers by value. */
  value: (id: string) => string | number;
  cell: (id: string) => ReactNode;
  numeric?: boolean;
};

export default function Page() {
  return (
    <SyncProvider>
      <LayoutC />
    </SyncProvider>
  );
}

/**
 * Prototype C: what Weapons and Echoes could do with a desktop window.
 *
 * Deliberately two answers rather than one, because these two tabs are not
 * the Characters tab. A character's body runs to about 2,000px, which is why
 * putting it beside the list mattered so much there. A weapon's body is two
 * stat lines, a paragraph and a row of names — a few hundred pixels. The
 * question here is therefore less "where does the body go" and more "what is
 * this data shaped like", and 114 weapons with a rarity, a type, a base ATK
 * and a substat are shaped like a table.
 *
 * Beside: the Characters treatment, for consistency.
 * Table:  sortable columns, which is what the data actually is.
 */
function LayoutC() {
  const [set, setSet] = useState<"weapons" | "echoes">("weapons");
  const [mode, setMode] = useState<"beside" | "table">("beside");
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({
    key: "name",
    dir: 1,
  });

  const weaponById = useMemo(
    () => new Map(WEAPONS.map((w) => [w.name, w])),
    []
  );
  const echoById = useMemo(() => new Map(ECHOES.map((e) => [e.name, e])), []);

  const columns: Column[] = useMemo(() => {
    if (set === "weapons") {
      const w = (id: string) => weaponById.get(id)!;
      return [
        {
          key: "name",
          label: "Name",
          value: (id) => id,
          cell: (id) => <strong>{id}</strong>,
        },
        {
          key: "rarity",
          label: "Rarity",
          numeric: true,
          value: (id) => w(id).rarity,
          cell: (id) => (
            <span className="star" data-r={`${w(id).rarity}★`}>
              {w(id).rarity}★
            </span>
          ),
        },
        {
          key: "type",
          label: "Type",
          value: (id) => w(id).type,
          cell: (id) => <span className="term-cat">{w(id).type}</span>,
        },
        {
          key: "atk",
          label: "ATK at 90",
          numeric: true,
          value: (id) => w(id).atk,
          cell: (id) => w(id).atk,
        },
        {
          key: "substat",
          label: "Substat",
          value: (id) => w(id).substat,
          cell: (id) => w(id).substat,
        },
        {
          key: "wanted",
          label: "Wanted by",
          numeric: true,
          value: (id) => (WANTED_BY.get(id) ?? []).length,
          cell: (id) => {
            const n = (WANTED_BY.get(id) ?? []).length;
            return n === 0 ? <span className="pc-none">—</span> : n;
          },
        },
      ];
    }
    const e = (id: string) => echoById.get(id)!;
    return [
      {
        key: "name",
        label: "Name",
        value: (id) => id,
        cell: (id) => <strong>{id}</strong>,
      },
      {
        key: "cost",
        label: "Cost",
        numeric: true,
        value: (id) => e(id).cost,
        cell: (id) => (
          <span className="cost" data-cost={e(id).cost}>
            {e(id).cost} cost
          </span>
        ),
      },
      {
        key: "class",
        label: "Class",
        value: (id) => e(id).echoClass,
        cell: (id) => <span className="term-cat">{e(id).echoClass}</span>,
      },
      {
        key: "sets",
        label: "Rolls these sets",
        value: (id) => e(id).sets.join(", "),
        cell: (id) => (
          <span className="pc-sets">{e(id).sets.join(" · ")}</span>
        ),
      },
    ];
  }, [set, weaponById, echoById]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ids =
      set === "weapons"
        ? WEAPONS.filter(
            (w) =>
              !q ||
              w.name.toLowerCase().includes(q) ||
              w.substat.toLowerCase().includes(q) ||
              w.passive.toLowerCase().includes(q)
          ).map((w) => w.name)
        : ECHOES.filter(
            (e) =>
              !q ||
              e.name.toLowerCase().includes(q) ||
              e.sets.some((s) => s.toLowerCase().includes(q)) ||
              (e.skill ?? "").toLowerCase().includes(q)
          ).map((e) => e.name);

    const col = columns.find((c) => c.key === sort.key) ?? columns[0];
    return [...ids].sort((a, b) => {
      const va = col.value(a);
      const vb = col.value(b);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb));
      return cmp * sort.dir;
    });
  }, [set, query, columns, sort]);

  const current = sel && rows.includes(sel) ? sel : null;

  const detail = current
    ? set === "weapons"
      ? <WeaponDetail w={weaponById.get(current)!} />
      : <EchoDetail e={echoById.get(current)!} />
    : null;

  const toggleSort = (key: string) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }
    );

  return (
    <main className="proto proto-c" data-mode={mode}>
      <ProtoHeader which="C" />

      <div className="pc-bar">
        <input
          className="search"
          type="search"
          placeholder={
            set === "weapons"
              ? "Search name, substat or effect…"
              : "Search Echo name, set or skill…"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        <div className="chips">
          <button
            className="chip"
            data-on={set === "weapons"}
            onClick={() => {
              setSet("weapons");
              setSel(null);
              setSort({ key: "name", dir: 1 });
            }}
          >
            Weapons ({WEAPONS.length})
          </button>
          <button
            className="chip"
            data-on={set === "echoes"}
            onClick={() => {
              setSet("echoes");
              setSel(null);
              setSort({ key: "name", dir: 1 });
            }}
          >
            Echoes ({ECHOES.length})
          </button>
        </div>
        <div className="chips pc-modes">
          <button
            className="chip"
            data-on={mode === "beside"}
            onClick={() => setMode("beside")}
          >
            Beside
          </button>
          <button
            className="chip"
            data-on={mode === "table"}
            onClick={() => setMode("table")}
          >
            Table
          </button>
        </div>
      </div>

      <p className="proto-sub pc-note">
        {mode === "beside"
          ? "The Characters treatment: names in a column, the entry beside them. Consistent, and a short body leaves the pane mostly empty."
          : "Columns you can sort. Click a heading — ATK, cost, or how many characters want a weapon — then a row to read the rest."}{" "}
        Showing {rows.length}.
      </p>

      {mode === "beside" ? (
        <div className="pc-beside">
          <div className="pc-list">
            {rows.map((id) => (
              <button
                key={id}
                className="pa-row"
                data-sel={current === id}
                onClick={() => setSel(id)}
              >
                <span className="pa-name">{id}</span>
                {set === "weapons" ? (
                  <span className="star" data-r={`${weaponById.get(id)!.rarity}★`}>
                    {weaponById.get(id)!.rarity}★
                  </span>
                ) : (
                  <span className="cost" data-cost={echoById.get(id)!.cost}>
                    {echoById.get(id)!.cost}
                  </span>
                )}
              </button>
            ))}
          </div>
          <aside className="pc-detail">
            {detail ?? (
              <p className="empty">
                Pick one on the left. A weapon is two stat lines, an effect and
                the characters that want it — which is the point this layout
                has to answer for.
              </p>
            )}
          </aside>
        </div>
      ) : (
        <>
          <div className="pc-tablewrap">
            <table className="pc-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      data-num={c.numeric || undefined}
                      aria-sort={
                        sort.key === c.key
                          ? sort.dir === 1
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <button onClick={() => toggleSort(c.key)}>
                        {c.label}
                        <span className="pc-arrow">
                          {sort.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : ""}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((id) => (
                  <tr
                    key={id}
                    data-sel={current === id}
                    onClick={() => setSel(id)}
                  >
                    {columns.map((c) => (
                      <td key={c.key} data-num={c.numeric || undefined}>
                        {c.cell(id)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {current && (
            <div
              className="pb-scrim"
              role="presentation"
              onClick={() => setSel(null)}
            />
          )}
          <section className="pb-panel" data-open={current !== null}>
            {current && (
              <>
                <button className="pa-back" onClick={() => setSel(null)}>
                  ← Close
                </button>
                {detail}
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function WeaponDetail({ w }: { w: Weapon }) {
  const wanted = WANTED_BY.get(w.name) ?? [];
  return (
    <article className="pd">
      <header className="pd-head">
        <h2>{w.name}</h2>
        <span className="star" data-r={`${w.rarity}★`}>
          {w.rarity}★
        </span>
        <span className="term-cat">{w.type}</span>
      </header>

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

      <h3 className="section">Effect</h3>
      <p className="term-def">{w.passive}</p>

      <h3 className="section">
        {wanted.length > 0 ? "Wanted by" : "Not listed in any build"}
      </h3>
      {wanted.length > 0 ? (
        <div className="related">
          {wanted.map((c) => (
            <span key={c.name} className="wanted-pill">
              {c.name} · #{c.rank}
            </span>
          ))}
        </div>
      ) : (
        <p className="check-detail">
          No character in the database ranks this in their top four.
        </p>
      )}
    </article>
  );
}

function EchoDetail({ e }: { e: Echo }) {
  return (
    <article className="pd">
      <header className="pd-head">
        <h2>{e.name}</h2>
        <span className="cost" data-cost={e.cost}>
          {e.cost} cost
        </span>
        <span className="term-cat">{e.echoClass}</span>
      </header>

      {e.skill && (
        <>
          <h3 className="section">Echo skill</h3>
          <p className="term-def">{e.skill}</p>
        </>
      )}

      <h3 className="section">Rolls these sets</h3>
      <div className="related">
        {e.sets.map((s) => (
          <span key={s} className="wanted-pill">
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
