/**
 * Cross-reference check over data/.
 *
 * Everything in the database joins by string: a character lists "Static Mist
 * (R1)", baseWeaponName strips the rank, and the result is looked up in the
 * weapons table. Nothing errors when that lookup misses — the weapon simply
 * stops appearing under "Wanted by", the Shopping List quietly drops a
 * material, a team renders a blank slot. A silent wrong answer is the worst
 * kind for a reference app, so this turns one into a failed build.
 *
 * Run on its own with `npm run check-data`, and automatically before every
 * build by the prebuild script.
 *
 * The data files carry nothing but type imports, so they compile on their own
 * and this needs no runner beyond the TypeScript already in devDependencies.
 */

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "node_modules", ".cache", "check-data");

const FILES = [
  "characters",
  "weapons",
  "echoes",
  "skills",
  "targets",
  "teams",
  "materials",
  "plan",
];

rmSync(out, { recursive: true, force: true });
execFileSync(
  process.execPath,
  [
    require.resolve("typescript/bin/tsc"),
    ...FILES.map((f) => path.join(root, "data", `${f}.ts`)),
    "--outDir",
    out,
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--moduleResolution",
    "node",
    "--skipLibCheck",
  ],
  { stdio: "inherit" }
);

const load = (name) => require(path.join(out, `${name}.js`));
const { CHARACTERS } = load("characters");
const { WEAPONS, baseWeaponName } = load("weapons");
const { ECHOES, SONATA_SETS } = load("echoes");
const { SKILL_PRIORITY } = load("skills");
const { TARGETS } = load("targets");
const { TEAMS } = load("teams");
const { MATERIALS } = load("materials");
const { DEFAULT_PLAN, parseMaterial } = load("plan");

const ids = new Set(CHARACTERS.map((c) => c.id));
const weapons = new Map(WEAPONS.map((w) => [w.name, w]));
const sonatas = new Set(SONATA_SETS.map((s) => s.name));
const echoes = new Set(ECHOES.map((e) => e.name));

const problems = [];
const fail = (kind, detail) => problems.push({ kind, detail });

for (const [label, list] of [
  ["character id", CHARACTERS.map((c) => c.id)],
  ["weapon name", WEAPONS.map((w) => w.name)],
  ["echo name", ECHOES.map((e) => e.name)],
  ["sonata name", SONATA_SETS.map((s) => s.name)],
]) {
  const seen = new Set();
  const dupes = new Set();
  for (const v of list) (seen.has(v) ? dupes : seen).add(v);
  for (const v of dupes) fail(`duplicate ${label}`, v);
}

for (const c of CHARACTERS) {
  for (const raw of c.weapons) {
    const name = baseWeaponName(raw);
    const found = weapons.get(name);
    if (!found) fail("weapon not in the database", `${c.id} -> ${raw}`);
    // A weapon a character cannot equip is a transcription slip, not a build.
    else if (found.type !== c.weaponType) {
      fail(
        "weapon is the wrong type",
        `${c.id} uses ${c.weaponType} -> ${found.name} is ${found.type}`
      );
    }
  }

  for (const s of c.sets) {
    if (!sonatas.has(s)) fail("sonata not in the database", `${c.id} -> ${s}`);
  }

  for (const e of c.echoes) {
    if (!echoes.has(e)) fail("echo not in the database", `${c.id} -> ${e}`);
  }

  for (const m of c.materials) {
    const parsed = parseMaterial(m);
    if (!parsed) fail("material will not parse", `${c.id} -> ${m}`);
    else if (!MATERIALS[parsed.name]) {
      fail("material has no source", `${c.id} -> ${parsed.name}`);
    }
  }
}

for (const id of Object.keys(SKILL_PRIORITY)) {
  if (!ids.has(id)) fail("skill order for an unknown character", id);
}
for (const id of Object.keys(TARGETS)) {
  if (!ids.has(id)) fail("stat targets for an unknown character", id);
}
for (const [owner, teams] of Object.entries(TEAMS)) {
  if (!ids.has(owner)) fail("teams for an unknown character", owner);
  for (const team of teams) {
    for (const slot of team.slots) {
      for (const member of [slot.character, ...(slot.alternates ?? [])]) {
        if (!ids.has(member)) {
          fail("team names an unknown character", `${owner}/${team.name} -> ${member}`);
        }
      }
    }
  }
}
for (const id of DEFAULT_PLAN) {
  if (!ids.has(id)) fail("the default plan names an unknown character", id);
}

/* Not errors. Printed so a patch that forgets half its update is visible. */
const noSkillOrder = CHARACTERS.filter((c) => !SKILL_PRIORITY[c.id]);
const noTargets = CHARACTERS.filter((c) => !TARGETS[c.id]);
const noTeams = CHARACTERS.filter((c) => !TEAMS[c.id]);
const unwanted = WEAPONS.filter(
  (w) => !CHARACTERS.some((c) => c.weapons.some((x) => baseWeaponName(x) === w.name))
);

const captures = FILES.map((f) => {
  const match = readFileSync(path.join(root, "data", `${f}.ts`), "utf8").match(
    /captured (\d{1,2} \w+ \d{4})/
  );
  return match ? `${f} ${match[1]}` : null;
}).filter(Boolean);

console.log(
  `\ncheck-data  ${CHARACTERS.length} characters · ${WEAPONS.length} weapons · ` +
    `${ECHOES.length} echoes · ${SONATA_SETS.length} sonatas\n`
);

if (problems.length > 0) {
  const byKind = new Map();
  for (const p of problems) byKind.set(p.kind, [...(byKind.get(p.kind) ?? []), p.detail]);
  for (const [kind, details] of byKind) {
    console.error(`  ${kind} (${details.length})`);
    for (const d of details) console.error(`    ${d}`);
  }
  console.error(`\n  ${problems.length} problem(s). The data is inconsistent.\n`);
  process.exit(1);
}

const list = (cs) => (cs.length === 0 ? "none" : cs.map((c) => c.id).join(", "));
console.log("  no dangling references.\n");
console.log("  coverage, for information:");
console.log(`    no skill order:  ${list(noSkillOrder)}`);
console.log(`    no stat targets: ${list(noTargets)}`);
console.log(`    no teams:        ${list(noTeams)}`);
console.log(`    weapons no build wants: ${unwanted.length} of ${WEAPONS.length}`);
console.log(`\n  captured: ${captures.join(" · ")}\n`);
