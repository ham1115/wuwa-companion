"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, TERMS, type Category, type Term } from "@/data/glossary";
import { useIdSet, useNotes } from "@/lib/storage";

const BY_ID = new Map(TERMS.map((t) => [t.id, t]));

export default function Glossary() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Category | "all">("all");
  const [openNote, setOpenNote] = useState<string | null>(null);

  const learned = useIdSet("learned");
  const revealed = useIdSet("revealed");
  // Story progress un-blurs the terms that progress has already shown you.
  const acts = useIdSet("acts");
  const notes = useNotes("notes");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TERMS.filter((t) => {
      if (active !== "all" && t.category !== active) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
      );
    });
  }, [query, active]);

  const grouped = useMemo(() => {
    const map = new Map<Category, Term[]>();
    for (const t of results) {
      const list = map.get(t.category) ?? [];
      list.push(t);
      map.set(t.category, list);
    }
    return map;
  }, [results]);

  return (
    <section>
      <p className="panel-intro">
        {TERMS.length} terms. {learned.ids.length} marked as learned. Spoilers
        past Chapter 1 are blurred until you tap them.
      </p>

      {/* Only the search box is pinned here. The eight category chips wrap to
        * three lines on a phone, and a sticky bar that deep would cost more
        * of the screen than the scrolling it saves. */}
      <div className="sticky-controls">
        <div className="search-row">
          <input
            className="search"
            type="search"
            placeholder="Search terms and definitions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search glossary"
          />
        </div>
      </div>

      <div className="chips">
        <button
          className="chip"
          data-on={active === "all"}
          onClick={() => setActive("all")}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="chip"
            data-on={active === c.id}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {results.length === 0 && (
        <p className="empty">No term matches “{query}”.</p>
      )}

      {CATEGORIES.filter((c) => grouped.has(c.id)).map((cat) => (
        <div key={cat.id}>
          <h2 className="section">
            {cat.label}: {cat.blurb}
          </h2>
          {/* Wrapped so a wide window can set the terms in two columns. The
            * heading stays outside it, or it would be columnised with them. */}
          <div className="term-group">
          {grouped.get(cat.id)!.map((t) => {
            const isLearned = learned.has(t.id);
            const byStory = Boolean(t.revealedBy) && acts.has(t.revealedBy!);
            const isHidden =
              Boolean(t.spoiler) && !revealed.has(t.id) && !byStory;
            const noteText = notes.get(t.id);

            return (
              <article key={t.id} className="term" data-learned={isLearned}>
                {/*
                 * The category label that used to sit here said the same thing
                 * as the heading this term is filed under, and the two buttons
                 * that used to sit below the definition are now up here with
                 * it. Between them they were costing about 34px on every one
                 * of 62 terms, for a row of chrome under definitions nobody is
                 * acting on while they read.
                 */}
                <div className="term-head">
                  <h3 className="term-name">{t.term}</h3>
                  {t.spoiler && !byStory && (
                    <span className="spoiler-tag">spoiler</span>
                  )}
                  {byStory && <span className="side-pill">you&apos;ve been here</span>}

                  <span className="term-tools">
                    <button
                      className="mini"
                      data-on={isLearned}
                      aria-label={
                        isLearned
                          ? `${t.term} is marked as learned`
                          : `Mark ${t.term} as learned`
                      }
                      onClick={() => learned.toggle(t.id)}
                    >
                      {isLearned ? "✓ Learned" : "Learn"}
                    </button>
                    <button
                      className="mini"
                      data-on={Boolean(noteText)}
                      aria-label={
                        noteText
                          ? `Edit your note on ${t.term}`
                          : `Add a note on ${t.term}`
                      }
                      onClick={() =>
                        setOpenNote(openNote === t.id ? null : t.id)
                      }
                    >
                      {noteText ? "Note ✎" : "Note"}
                    </button>
                  </span>
                </div>

                <div className="spoiler-body" data-hidden={isHidden}>
                  <p className="term-def">{t.definition}</p>
                </div>

                {isHidden && (
                  <button
                    className="spoiler-reveal"
                    onClick={() => revealed.toggle(t.id)}
                  >
                    Reveal: past Chapter 1
                  </button>
                )}

                {!isHidden && t.related && t.related.length > 0 && (
                  <div className="related">
                    <span className="related-label">See also</span>
                    {t.related.map((rid) => {
                      const r = BY_ID.get(rid);
                      if (!r) return null;
                      return (
                        <button
                          key={rid}
                          onClick={() => {
                            setActive("all");
                            setQuery(r.term);
                          }}
                        >
                          {r.term}
                        </button>
                      );
                    })}
                  </div>
                )}

                {openNote === t.id && (
                  <textarea
                    className="note-area"
                    placeholder="Your note on this term…"
                    value={noteText}
                    onChange={(e) => notes.set(t.id, e.target.value)}
                    autoFocus
                  />
                )}

                {noteText && openNote !== t.id && (
                  <p className="check-detail">{noteText}</p>
                )}
              </article>
            );
          })}
          </div>
        </div>
      ))}

      {learned.ids.length > 0 && (
        <p className="footnote">
          <button className="mini" onClick={learned.clear}>
            Reset learned marks
          </button>
        </p>
      )}
    </section>
  );
}
