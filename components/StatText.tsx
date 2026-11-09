import { Fragment } from "react";

/**
 * A line of build advice with its stat names picked out in colour, so
 * "CRIT Rate = CRIT DMG > ATK%" can be scanned for the one you are after
 * rather than read word by word. Each name is also bold, so colour is never
 * the only thing telling them apart.
 */
const ELEMENTS = "Aero|Electro|Fusion|Glacio|Havoc|Spectro";
const NAME = new RegExp(
  [
    "CRIT Rate",
    "CRIT DMG",
    "Energy Regen",
    "Healing Bonus",
    `(?:${ELEMENTS}) DMG`,
    "(?:Basic Attack|Heavy Attack|Resonance Skill|Liberation|Intro Skill|Echo Skill) DMG%?",
    "ATK%?",
    "HP%?",
    "DEF%?",
  ].join("|"),
  "g"
);

function kind(name: string): string {
  if (name.startsWith("CRIT")) return "crit";
  if (name.startsWith("Energy")) return "er";
  if (name.startsWith("Healing")) return "heal";
  if (name.startsWith("ATK")) return "atk";
  if (name.startsWith("HP")) return "hp";
  if (name.startsWith("DEF")) return "def";
  const el = name.match(new RegExp(`^(${ELEMENTS}) DMG`))?.[1];
  return el ?? "skill";
}

export default function StatText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(NAME)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <span key={at} className="stat-name" data-stat={kind(m[0])}>
        {m[0]}
      </span>
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return (
    <>
      {out.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </>
  );
}
