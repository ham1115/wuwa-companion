"use client";

import { useMemo, useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { ECHOES, SONATA_SETS, type Echo, type SonataSet } from "@/data/echoes";
import { useOwned } from "@/lib/owned";
import Modal from "./Modal";

/** Sonata name -> characters whose build lists it. */
const RUN_BY = (() => {
  const map = new Map<string, { id: string; name: string }[]>();
  for (const c of CHARACTERS) {
    for (const s of c.sets) {
      const list = map.get(s) ?? [];
      list.push({ id: c.id, name: c.name });
      map.set(s, list);
    }
  }
  return map;
})();

/** Sonata name -> echoes that can roll it. */
const ROLLED_BY = (() => {
  const map = new Map<string, Echo[]>();
  for (const e of ECHOES) {
    for (const s of e.sets) {
      const list = map.get(s) ?? [];
      list.push(e);
      map.set(s, list);
    }
  }
  for (const list of map.values()) list.sort((a, b) => b.cost - a.cost);
  return map;
})();

export default function Echoes() {
  const [view, setView] = useState<"sets" | "echoes">("sets");

  return (
    <section>
      <div className="chips">
        <button className="chip" data-on={view === "sets"} onClick={() => setView("sets")}>
          Sonata sets ({SONATA_SETS.length})
        </button>
        <button className="chip" data-on={view === "echoes"} onClick={() => setView("echoes")}>
          Echoes ({ECHOES.length})
        </button>
      </div>

      {view === "sets" ? <SetsView /> : <EchoesView />}

      <p className="footnote">
        Set bonuses and Echo data from the{" "}
        <a href="https://www.prydwen.gg/wuthering-waves/echoes" target="_blank" rel="noreferrer">
          prydwen.gg echo database
        </a>
        , captured 22 October 2026. Skill text is kept for cost-4 Echoes, the
        ones you choose for the main slot.
      </p>
    </section>
  );
}

function SetsView() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [mineOnly, setMineOnly] = useState(false);
  const owned = useOwned();

  /* Found in the whole list rather than the filtered one, so typing in the
   * search box does not close the sheet that is already open. */
  const current = open ? SONATA_SETS.find((s) => s.name === open) ?? null : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SONATA_SETS.filter((s) => {
      if (mineOnly) {
        const run = RUN_BY.get(s.name) ?? [];
        if (!run.some((c) => owned.has(c.id))) return false;
      }
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.full.toLowerCase().includes(q) ||
        (s.two ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, mineOnly, owned.owned]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <p className="panel-intro">
        Showing {results.length} sets. Six of them are <strong>3-piece</strong>,
        not 5. Check the badge before you commit five Echoes.
      </p>

      <div className="search-row">
        <input
          className="search"
          type="search"
          placeholder="Search set name or bonus…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search sonata sets"
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
      </div>

      {results.length === 0 && <p className="empty">No set matches that.</p>}

      {results.map((s) => (
        <SetRow
          key={s.name}
          s={s}
          isOpen={open === s.name}
          onToggle={() => setOpen(s.name)}
          isOwned={owned.has}
        />
      ))}

      {/* One sheet for the whole list rather than a body per row: a set's
        * bonuses are a paragraph, and 20 of them unfolding in place pushed
        * the rest of the list a long way down to read one. */}
      <Modal
        open={current !== null}
        onClose={() => setOpen(null)}
        label={current ? `${current.name} sonata set` : "Sonata set"}
      >
        {current && (
          <>
            <header className="sheet-head">
              <h2>{current.name}</h2>
              <span className="pieces" data-p={current.pieces}>
                {current.pieces}-pc
              </span>
            </header>
            <SetBody s={current} isOwned={owned.has} />
          </>
        )}
      </Modal>
    </>
  );
}

function SetRow({
  s,
  isOpen,
  onToggle,
  isOwned,
}: {
  s: SonataSet;
  isOpen: boolean;
  onToggle: () => void;
  isOwned: (id: string) => boolean;
}) {
  const run = RUN_BY.get(s.name) ?? [];
  const mine = run.filter((c) => isOwned(c.id));
  const rolled = ROLLED_BY.get(s.name) ?? [];

  return (
    <article className="char-row" data-sel={isOpen}>
      <button className="char-toggle" onClick={onToggle} aria-haspopup="dialog">
        <span className="char-name">{s.name}</span>
        {mine.length > 0 && <span className="owned-dot">{mine.length} of mine</span>}
        <span className="pieces" data-p={s.pieces}>
          {s.pieces}-pc
        </span>
        <span className="term-cat">{rolled.length} echoes</span>
      </button>
    </article>
  );
}

/** A sonata set's bonuses, who runs it, and the Echoes that roll it. */
function SetBody({
  s,
  isOwned,
}: {
  s: SonataSet;
  isOwned: (id: string) => boolean;
}) {
  const run = RUN_BY.get(s.name) ?? [];
  const rolled = ROLLED_BY.get(s.name) ?? [];
  const byCost = {
    4: rolled.filter((e) => e.cost === 4),
    3: rolled.filter((e) => e.cost === 3),
    1: rolled.filter((e) => e.cost === 1),
  };

  return (
    <div className="char-body">
      {s.two && (
        <>
          <h2 className="section">2-piece</h2>
          <p className="term-def">{s.two}</p>
        </>
      )}
      <h2 className="section">{s.pieces}-piece</h2>
      <p className="term-def">{s.full}</p>

      <h2 className="section">
        {run.length > 0 ? "Run by" : "Not listed in any build"}
      </h2>
      {run.length > 0 && (
        <div className="related">
          {run.map((c) => (
            <span key={c.id} className="wanted-pill" data-mine={isOwned(c.id)}>
              {c.name}
            </span>
          ))}
        </div>
      )}

      <h2 className="section">Echoes that roll it: {rolled.length}</h2>
      {([4, 3, 1] as const).map((cost) =>
        byCost[cost].length > 0 ? (
          <div className="stat-line" key={cost}>
            <span className="cost" data-cost={cost}>
              {cost} cost
            </span>
            <span>{byCost[cost].map((e) => e.name).join(", ")}</span>
          </div>
        ) : null
      )}
    </div>
  );
}

function EchoesView() {
  const [query, setQuery] = useState("");
  const [cost, setCost] = useState<1 | 3 | 4 | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  /* Found in the whole list rather than the filtered one, so typing in the
   * search box does not close the sheet that is already open. */
  const current = open ? ECHOES.find((e) => e.name === open) ?? null : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ECHOES.filter((e) => {
      if (cost !== "all" && e.cost !== cost) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.sets.some((s) => s.toLowerCase().includes(q)) ||
        (e.skill ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, cost]);

  return (
    <>
      <p className="panel-intro">
        Showing {results.length} Echoes. Search matches set names too, so typing
        a Sonata lists every Echo that rolls it.
      </p>

      <div className="search-row">
        <input
          className="search"
          type="search"
          placeholder="Search Echo name, set or skill…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search echoes"
        />
      </div>

      <div className="chips">
        <button className="chip" data-on={cost === "all"} onClick={() => setCost("all")}>
          All costs
        </button>
        {([4, 3, 1] as const).map((c) => (
          <button key={c} className="chip" data-on={cost === c} onClick={() => setCost(c)}>
            {c} cost
          </button>
        ))}
      </div>

      {results.length === 0 && <p className="empty">No Echo matches that.</p>}

      {results.map((e) => (
        <article className="char-row" key={e.name} data-sel={open === e.name}>
          <button
            className="char-toggle"
            onClick={() => setOpen(e.name)}
            aria-haspopup="dialog"
          >
            <span className="char-name">{e.name}</span>
            <span className="cost" data-cost={e.cost}>
              {e.cost} cost
            </span>
            <span className="term-cat">{e.echoClass}</span>
            <span className="term-cat">{e.sets.length} sets</span>
          </button>
        </article>
      ))}

      {/* 187 rows, and an Echo is a sentence and a few pills. Unfolding one in
        * place moved everything under it for very little; a sheet moves
        * nothing. */}
      <Modal
        open={current !== null}
        onClose={() => setOpen(null)}
        label={current ? `${current.name} echo` : "Echo"}
      >
        {current && (
          <>
            <header className="sheet-head">
              <h2>{current.name}</h2>
              <span className="cost" data-cost={current.cost}>
                {current.cost} cost
              </span>
              <span className="term-cat">{current.echoClass}</span>
            </header>
            <div className="char-body">
              {current.skill && (
                <>
                  <h2 className="section">Echo skill</h2>
                  <p className="term-def">{current.skill}</p>
                </>
              )}
              <h2 className="section">Rolls these sets</h2>
              <div className="related">
                {current.sets.map((s) => (
                  <span key={s} className="wanted-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
