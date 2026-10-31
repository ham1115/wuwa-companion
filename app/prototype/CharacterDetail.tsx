"use client";

import type { Character } from "@/data/characters";
import StatLine from "@/components/StatLine";
import SkillPriority from "@/components/SkillPriority";
import Targets from "@/components/Targets";
import Teams from "@/components/Teams";
import MyBuild from "@/components/MyBuild";

/**
 * One character's whole build, laid out for a pane rather than for a column.
 *
 * The short ranked lists go into CSS columns, because a three-item list is a
 * terrible use of 900px and there are six of them. Everything below that has
 * a layout of its own already — the skill order, the stat targets, the teams
 * and the editable loadout are the real components off the Characters tab,
 * not stand-ins, so what you are judging is the arrangement and nothing else.
 */
export default function CharacterDetail({ c }: { c: Character }) {
  return (
    <article className="pd">
      <header className="pd-head">
        <h2>{c.name}</h2>
        <span className="star" data-r={c.rarity}>
          {c.rarity}★
        </span>
        <span className="el" data-el={c.element}>
          {c.element}
        </span>
        <span className="term-cat">{c.role ?? "no build"}</span>
        <span className="term-cat">{c.weaponType}</span>
      </header>

      {c.role === null ? (
        <p className="term-def">{c.substats}</p>
      ) : (
        <>
          <div className="pd-cols">
            <section className="pd-blk">
              <h3 className="section">Weapons: best first</h3>
              <ol className="ranked">
                {c.weapons.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ol>
            </section>

            <section className="pd-blk">
              <h3 className="section">Sonata sets</h3>
              <ol className="ranked">
                {c.sets.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>

            <section className="pd-blk">
              <h3 className="section">Main echo options</h3>
              <ol className="ranked">
                {c.echoes.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ol>
            </section>

            <section className="pd-blk">
              <h3 className="section">Main stats</h3>
              <div className="stat-grid">
                {c.stats.map((s, i) => (
                  <StatLine key={i} text={s} />
                ))}
              </div>
            </section>

            <section className="pd-blk">
              <h3 className="section">Substat priority</h3>
              <p className="term-def">{c.substats}</p>
            </section>

            {c.materials.length > 0 && (
              <section className="pd-blk">
                <h3 className="section">Ascension materials</h3>
                <p className="term-def">
                  {c.materials.join(" · ")}
                  <br />
                  <span className="check-detail">
                    Plus the generic frequency cores and Shell Credits.
                  </span>
                </p>
              </section>
            )}
          </div>

          <SkillPriority id={c.id} />
          <Targets id={c.id} />
          <Teams id={c.id} />
          <MyBuild c={c} />
        </>
      )}
    </article>
  );
}
