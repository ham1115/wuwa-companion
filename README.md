# Resonance Codex

A Wuthering Waves companion app. Pastel pink and yellow, light by default, with a dark counterpart.

## Tabs

- **Characters** — all 61 Resonators. Search by name, weapon, echo or set. Filter by element, role, rarity, or "mine only". Expand any character for ranked weapons, Sonata sets, main Echo options, main stats per cost slot, substat priority and ascension materials. Each also carries **target stats at Lv.90** — what a finished build should read on the in-game stat screen. **Queue** adds them to My plan; also mark as built and add notes.
- **Weapons** — 114 weapons, 3★ and up. Search name, stat or effect; filter by type, rarity, or "for my characters". Each entry opens to base ATK, substat, effect text, and **Wanted by** — every character that ranks it, with their ranking position, owned characters highlighted. Weapons nothing wants are labelled as fodder.
- **Echoes** — two views. **Sonata sets** (37) shows each set's piece requirement, 2-piece and full bonuses, every character that runs it, and every Echo that can roll it grouped by cost. **Echoes** (187) lists the whole roster; searching a Sonata name returns every Echo that rolls it. Cost-4 entries carry their Echo Skill text.
- **My plan** — an ordered build queue. Reorder with Up/Down, remove, and work it top to bottom. Each entry reads its build live from the character database, so nothing is duplicated. Each entry also shows its Lv.90 stat targets. A **shopping list** at the top sums every ascension material the whole queue still needs; characters whose "Character to Lv.80" step is ticked drop off it.
- **Glossary** — 61 lore and systems terms across seven categories, with related-term links. Spoilers past Chapter 1 are tagged and blurred until tapped.
- **Story** — chapter and act progress tracker, plus a **Right now** list you write yourself. Acts fill in order: ticking Act 5 marks Acts 1–4 too, and un-ticking it clears everything after, because the game gates acts behind the ones before them.
- **Routine** — daily and weekly checklist. Daily items clear themselves when the date changes.
- **Settings** — edit which characters you own, reset any section (or everything) with a confirm step, export your progress to JSON, and import it back on another device.

### Reverse lookups

Two questions a returning player asks constantly, both answered without a dedicated screen:

- *"I pulled this weapon — who wants it?"* → Weapons tab, open the weapon, read **Wanted by**.
- *"Who runs this Sonata set?"* → Echoes tab → Sonata sets → open the set → **Run by**.
- *"Which Echoes roll this set?"* → same place, **Echoes that roll it**, grouped by cost.

### Colour coding

Three different numbers appear as small pills in the same rows, so each has its own scale:

- **Rarity** mirrors the in-game gacha colours — 5★ gold, 4★ purple, 3★ blue.
- **Echo cost** runs warm to cool — 4-cost amber (the main slot), 3-cost green, 1-cost grey.
- **Sonata piece count** marks the cheap outlier — 3-piece green, 5-piece grey.

Cost slots in a character's main-stat rows use the Echo-cost colours too, so "4 cost" means the same thing in every tab.

### Not every set needs five pieces

Six Sonata sets are **3-piece**: Dream of the Lost, Crown of Valor, Law of Harmony, Flamewing's Shadow, Thread of Severed Fate, Shadow of Shattered Dreams. The Echoes tab badges each set with its real requirement — check it before committing five Echoes.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

**From the dashboard**

1. Push this folder to a GitHub repo.
2. Go to vercel.com/new and import the repo.
3. Leave every setting at its default — Vercel detects Next.js automatically.
4. Deploy.

**From the CLI**

```bash
npx vercel
```

Then `npx vercel --prod` to promote. No environment variables, no database, no build configuration.

## Where your data lives

Everything you check off or type is stored in your browser's `localStorage` under the `wuwa-companion:` prefix. It never leaves your device, is not synced between devices, and clearing site data erases it. Every read and write is wrapped so the app still works in private windows or with storage blocked.

Progress survives closing the tab and survives redeploys. It does **not** cross devices or browsers. Note that Vercel preview deployments get their own URLs, which are separate origins and therefore separate storage — use the stable production URL.

To move progress between devices: **Settings → Export to JSON**, then paste it into the same box on the other device and hit **Import**.

## Sharing it with other players

Just send the URL. **The app ships blank** — no owned characters, no queue, no notes, no "Right now" list — so every visitor starts on an empty slate and nothing personal is baked into the code. Your ticks and notes are never visible to anyone else.

Nothing in the repository describes any particular account.

## Development note

Do not run `npm run build` while `npm run dev` is running on the same folder — they share `.next` and the dev server will start throwing `TypeError: a[d] is not a function`. Fix: stop the dev server, `rm -rf .next`, start it again.

## Editing the content

All content is plain TypeScript data — no CMS, no fetching at runtime.

| File | Holds |
|---|---|
| `data/characters.ts` | All 61 character build parameters, plus the `OWNED` list |
| `data/weapons.ts` | All 114 weapons with stats and effects |
| `data/echoes.ts` | 37 Sonata sets and all 187 Echoes |
| `data/glossary.ts` | Terms, categories, spoiler flags, related links |
| `data/plan.ts` | The queue's checklist shape and the shared build rules |
| `data/targets.ts` | Recommended endgame stats at Lv.90 for 60 characters |
| `data/progress.ts` | Chapters, acts, daily and weekly routine |

`OWNED` in `data/characters.ts`, `DEFAULT_PLAN` in `data/plan.ts` and `PRIORITY_NOW` in `data/progress.ts` are all deliberately empty: they are the defaults a new visitor gets. Everything personal lives in the browser, or in an opt-in profile.

## Theming

Colours are CSS custom properties at the top of `app/globals.css`. Light mode (`:root`) is pastel pink with lemon accents; dark mode (`:root[data-theme="dark"]`) keeps the same hues on a dark plum base. Element pill colours are defined under `.el[data-el="…"]`; rarity, cost and piece-count pills read `--r5-*` / `--r4-*` / `--r3-*` and `--c4-*` / `--c3-*` / `--c1-*`, each defined once per theme.

## Sources and accuracy

Character build parameters come from [prydwen.gg](https://www.prydwen.gg/wuthering-waves/) build guides — reviewed patch 3.6, captured 22 October 2026; the Lv.90 stat targets were captured 30 October 2026. Only the structured parameters are reproduced: weapon/echo/set rankings, main-stat slots, substat order, ascension materials and the Lv.90 stat targets. Prydwen's written guides, reviews, rotations and tier-list commentary are their own work and are not included — read them at prydwen.gg.

Known gaps:

- **Lily** has no published build yet (upcoming character); the card says so, and she has no stat targets.
- **Jingran** has only one published stat target (HP), and **Camellya** has no HP target. Both reflect prydwen's pages as captured, not a parsing gap.
- **Act names past Chapter I Act 7** in the Story tab are placeholder structure. Only "Jinzhou Rising" is confirmed.
- Glossary definitions are written from general knowledge and may lag the current patch.

**The in-game screens win any disagreement.** When the app and the game differ, trust the game and edit the data file.
