"use client";

import { useMemo, useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { ECHOES, SONATA_SETS, type Echo, type SonataSet } from "@/data/echoes";
import { useOwned } from "@/lib/owned";
import Modal from "./Modal";
import EmptyPane from "./EmptyPane";
import { useMediaQuery } from "@/lib/media";
import StatText from "./StatText";

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

/**
 * Echo name -> the builds that put it in the main slot, each carrying the main
 * stat that build rolls at this Echo's cost and the Sonata it pairs with.
 *
 * The stat is matched on the Echo's own cost, not assumed to be 4: sixteen of
 * the references are to cost-3 Echoes, and a cost-3 main slot wants the 3-cost
 * line. Characters are kept in roster order, which is alphabetical.
 */
const MAIN_FOR = (() => {
  const costOf = new Map(ECHOES.map((e) => [e.name, e.cost]));
  const map = new Map<
    string,
    { id: string; name: string; stat: string | null; set: string | null }[]
  >();

  for (const c of CHARACTERS) {
    for (const n of c.echoes) {
      const cost = costOf.get(n);
      const line = cost
        ? c.stats.find((s) => s.startsWith(`${cost} cost:`))
        : undefined;
      const list = map.get(n) ?? [];
      list.push({
        id: c.id,
        name: c.name,
        stat: line ? line.slice(line.indexOf(":") + 1).trim() : null,
        set: c.sets[0] ?? null,
      });
      map.set(n, list);
    }
  }
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
        ones you choose for the main slot. Who wants an Echo in that slot, and
        the main stat beside each name, are read off the character build sheets
        rather than the Echo database.
      </p>
    </section>
  );
}

function SetsView() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [mineOnly, setMineOnly] = useState(false);
  const owned = useOwned();
  const wide = useMediaQuery("(min-width: 900px)");

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

  const controls = (
    <>
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

    </>
  );

  const noMatch = results.length === 0 ? <p className="empty">No set matches that.</p> : null;

  const body = current ? <SetBody s={current} isOwned={owned.has} /> : null;

  if (wide) {
    return (
      <>
      <p className="panel-intro">
        Showing {results.length} sets. Six of them are <strong>3-piece</strong>,
        not 5. Check the badge before you commit five Echoes.
      </p>

        <div className="char-split">
          <div className="char-list">
            <div className="sticky-controls">{controls}</div>
            {noMatch}
            {results.map((s) => {
              const run = RUN_BY.get(s.name) ?? [];
              const mine = run.filter((c) => owned.has(c.id));
              const rolled = ROLLED_BY.get(s.name) ?? [];
              return (
                <button
                  key={s.name}
                  className="char-pick"
                  data-sel={open === s.name}
                  onClick={() => setOpen(s.name)}
                >
                  <span className="char-name">{s.name}</span>
                  {mine.length > 0 && <span className="owned-dot">{mine.length}</span>}
                  <span className="pieces" data-p={s.pieces}>
                    {s.pieces}-pc
                  </span>
                  <span className="term-cat">{rolled.length}</span>
                </button>
              );
            })}
          </div>
          <aside className="char-detail">
            {current ? (
              <>
                <header className="char-detail-head">
                  <h2>{current.name}</h2>
                  <span className="pieces" data-p={current.pieces}>
                    {current.pieces}-pc
                  </span>
                </header>
                {body}
              </>
            ) : (
              <EmptyPane title="Pick a set">
                {results.length} on the list beside this. The number on the right
                is how many Echoes roll it.
              </EmptyPane>
            )}
          </aside>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="panel-intro">
        Showing {results.length} sets. Six of them are <strong>3-piece</strong>,
        not 5. Check the badge before you commit five Echoes.
      </p>

      {controls}
      {noMatch}

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
            {body}
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
        {mine.length > 0 && <span className="owned-dot">{mine.length} mine</span>}
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
      {/* In a grid, not loose siblings: .stat-line carries no margin of its
        * own anywhere in the app, so three of them in a row sat edge to edge
        * and read as one block with lines through it. */}
      <div className="cost-rows">
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
    </div>
  );
}

function EchoesView() {
  const [query, setQuery] = useState("");
  const [cost, setCost] = useState<1 | 3 | 4 | "all">("all");
  const [mainOnly, setMainOnly] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const owned = useOwned();
  const wide = useMediaQuery("(min-width: 900px)");

  /* Found in the whole list rather than the filtered one, so typing in the
   * search box does not close the sheet that is already open. */
  const current = open ? ECHOES.find((e) => e.name === open) ?? null : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ECHOES.filter((e) => {
      if (cost !== "all" && e.cost !== cost) return false;
      const wants = MAIN_FOR.get(e.name) ?? [];
      if (mainOnly && wants.length === 0) return false;
      if (mineOnly && !wants.some((c) => owned.has(c.id))) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.sets.some((s) => s.toLowerCase().includes(q)) ||
        (e.skill ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, cost, mainOnly, mineOnly, owned.owned]); // eslint-disable-line react-hooks/exhaustive-deps

  const controls = (
    <>
      <div className="search-row">
        <input
          className="search"
          type="search"
          placeholder="Search Echo name, set, or skill…"
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

      {/* The two that answer "which one do I actually go and farm". Separated
        * from the cost row above because they cut the list by a different
        * question: cost is what an Echo is, these are whether you want it. */}
      <div className="chips">
        <button
          className="chip"
          data-on={mainOnly}
          onClick={() => setMainOnly(!mainOnly)}
        >
          {mainOnly ? "★ Main-slot picks" : "Main-slot picks"}
        </button>
        <button
          className="chip"
          data-tone="lemon"
          data-on={mineOnly}
          onClick={() => setMineOnly(!mineOnly)}
        >
          {mineOnly ? "★ For my characters" : "For my characters"}
        </button>
      </div>

    </>
  );

  const noMatch = results.length === 0 ? <p className="empty">No Echo matches that.</p> : null;

  if (wide) {
    return (
      <>
      <p className="panel-intro">
        Showing {results.length} Echoes. Search matches set names too, so typing
        a Sonata lists every Echo that rolls it. Only {MAIN_FOR.size} are picked
        for anyone&apos;s main slot, which is the filter below.
      </p>

        <div className="char-split">
          <div className="char-list">
            <div className="sticky-controls">{controls}</div>
            {noMatch}
            {results.map((e) => {
              const mine = (MAIN_FOR.get(e.name) ?? []).filter((c) => owned.has(c.id));
              return (
                <button
                  key={e.name}
                  className="char-pick"
                  data-sel={open === e.name}
                  onClick={() => setOpen(e.name)}
                >
                  <span className="char-name">{e.name}</span>
                  {mine.length > 0 && <span className="owned-dot">{mine.length}</span>}
                  <span className="cost" data-cost={e.cost}>
                    {e.cost} cost
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

              <EchoWants e={current} isOwned={owned.has} />

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
            ) : (
              <EmptyPane title="Pick an Echo">
                {results.length} on the list beside this. Search takes the skill
                text and the Sonata names too.
              </EmptyPane>
            )}
          </aside>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="panel-intro">
        Showing {results.length} Echoes. Search matches set names too, so typing
        a Sonata lists every Echo that rolls it. Only {MAIN_FOR.size} are picked
        for anyone&apos;s main slot, which is the filter below.
      </p>

      {controls}
      {noMatch}

      {results.map((e) => {
        const mine = (MAIN_FOR.get(e.name) ?? []).filter((c) =>
          owned.has(c.id)
        );
        return (
          <article className="char-row" key={e.name} data-sel={open === e.name}>
            <button
              className="char-toggle"
              onClick={() => setOpen(e.name)}
              aria-haspopup="dialog"
            >
              <span className="char-name">{e.name}</span>
              {mine.length > 0 && (
                <span className="owned-dot">{mine.length} mine</span>
              )}
              <span className="cost" data-cost={e.cost}>
                {e.cost} cost
              </span>
              <span className="term-cat">{e.echoClass}</span>
              <span className="term-cat">{e.sets.length} sets</span>
            </button>
          </article>
        );
      })}


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

              <EchoWants e={current} isOwned={owned.has} />

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

/**
 * Who puts this Echo in their main slot, and what each of them rolls on it.
 *
 * The main stat is the thing you need before you start farming, and until now
 * it lived only on the character's own build sheet — so working out what to
 * roll meant knowing who wanted the Echo first, which is backwards from how
 * you actually use the tab. Owned characters are floated to the top, since
 * those are the rolls that decide whether you keep a drop.
 */
function EchoWants({ e, isOwned }: { e: Echo; isOwned: (id: string) => boolean }) {
  const wants = MAIN_FOR.get(e.name) ?? [];

  const sorted = useMemo(() => {
    const mine = wants.filter((c) => isOwned(c.id));
    const rest = wants.filter((c) => !isOwned(c.id));
    return [...mine, ...rest];
  }, [wants, isOwned]);

  if (wants.length === 0) {
    return (
      <>
        <h2 className="section">Not a main-slot pick</h2>
        <p className="check-detail">
          No build in the database chooses this one for the main slot. It is
          still worth keeping for its Sonata below, where only the set matters
          and the Echo itself does not.
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="section">
        Main slot for {wants.length}
        {wants.length === 1 ? " build" : " builds"}
      </h2>
      <p className="check-detail">
        The {e.cost}-cost main stat each of them rolls on it, and the Sonata
        they pair it with.
      </p>
      <div className="echo-wants">
        {sorted.map((c) => (
          <div className="echo-want" key={c.id} data-mine={isOwned(c.id)}>
            <span className="echo-want-who">{c.name}</span>
            <span className="echo-want-stat">
              {c.stat ? <StatText text={c.stat} /> : "no main stat recorded"}
            </span>
            {c.set && <span className="echo-want-set">{c.set}</span>}
          </div>
        ))}
      </div>
    </>
  );
}
