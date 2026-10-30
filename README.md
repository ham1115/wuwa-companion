# Resonance Codex

A Wuthering Waves companion app. Pastel pink and yellow, light by default, with a dark counterpart.

## Tabs

Grouped three ways: **Reference** is game data that is the same for everyone, **Mine** is your own progress, **Setup** is the owned list, backup and reset. The nav stays pinned to the top as you scroll.

- **Characters** — all 61 Resonators. Search by name, weapon, echo or set. Filter by element, role, rarity, or "mine only". Expand any character for ranked weapons, Sonata sets, main Echo options, main stats per cost slot, substat priority and ascension materials. Each also carries a **My build** block — pick the weapon and Sonata set you actually run, and type your current stats in to see them checked against the targets — and **target stats at Lv.90** — what a finished build should read on the in-game stat screen. **Queue** adds them to My plan; also mark as built and add notes.
- **Weapons** — 114 weapons, 3★ and up. Search name, stat or effect; filter by type, rarity, or "for my characters". Each entry opens to base ATK, substat, effect text, and **Wanted by** — every character that ranks it, with their ranking position, owned characters highlighted. Weapons nothing wants are labelled as fodder.
- **Echoes** — two views. **Sonata sets** (37) shows each set's piece requirement, 2-piece and full bonuses, every character that runs it, and every Echo that can roll it grouped by cost. **Echoes** (187) lists the whole roster; searching a Sonata name returns every Echo that rolls it. Cost-4 entries carry their Echo Skill text.
- **My plan** — an ordered build queue. Reorder with Up/Down, remove, and work it top to bottom. Each entry reads its build live from the character database, so nothing is duplicated. Each entry also shows its Lv.90 stat targets. A **shopping list** at the top sums every ascension material the whole queue still needs and groups it by source — which boss drops it and where that boss is, or which region you gather it in — with the Waveplate cost of a claim at each activity. Materials behind story you have not ticked off are marked locked. Characters whose "Character to Lv.80" step is ticked drop off the list.
- **Glossary** — 61 lore and systems terms across seven categories, with related-term links. Spoilers past Chapter 1 are tagged and blurred until tapped — or until your Story progress passes the act that reveals them, at which point they un-blur on their own.
- **Story** — the real chapter and act list: the Prologue plus Chapters I–IV, 33 numbered acts and 16 segues, interludes and side stories, each with its in-game title and the version it shipped in. The two longest Chapter I acts list their named quest steps. Numbered acts fill in order — ticking Act V marks Acts I–IV too, and un-ticking clears everything after — while segues tick on their own, because they do not gate anything. Also holds a **Right now** list you write yourself.
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
| `data/materials.ts` | Where all 38 ascension materials come from, and what a claim costs |
| `data/palettes.ts` | The five colour presets |
| `data/progress.ts` | Chapters, acts, daily and weekly routine |

`OWNED` in `data/characters.ts`, `DEFAULT_PLAN` in `data/plan.ts` and `PRIORITY_NOW` in `data/progress.ts` are all deliberately empty: they are the defaults a new visitor gets. Everything personal lives in the browser, or in an opt-in profile.

## Theming

## Signing in (optional)

The app works completely without an account and that is the default: everything lives in the
browser, and anyone you share the URL with gets a blank slate. Signing in only turns on sync, so
the same progress appears on your phone and your desktop.

Storage is local-first (`lib/storage.ts`). Every edit writes to localStorage first and a debounced
push follows, so nothing in the UI waits on the network. `lib/sync.tsx` reconciles per key, newest
wins: the server's copy if it is newer, this browser's if it is, whichever side has it when only one
does. `applyRemote` writes a pulled value *without* re-stamping its timestamp, which is what keeps a
pull from looking like a local edit and bouncing straight back up.

Auth is Clerk (`middleware.ts` protects nothing — sign-in is optional), data is Neon Postgres
(`db/schema.sql`, one row per user and key). `app/api/state` is the whole sync surface and refuses
anonymous callers. `tab` is deliberately not synced.

Clerk currently runs a **development** instance, because the Vercel Marketplace provisioned one key
pair and the app has no domain of its own yet. Sign-in works, but the session lives in a querystring
token rather than a cookie, since the app and `clerk.accounts.dev` are cross-site — so a browser
that blocks third-party state, iOS Safari especially, may not keep you signed in.
[docs/custom-domain.md](docs/custom-domain.md) is the runbook for fixing that properly by putting
the Frontend API on a subdomain of our own.

Scripts: `node --env-file=.env.local scripts/migrate.mjs` applies the schema,
`scripts/test-merge.mjs` exercises the upsert against the real database, `scripts/inspect.mjs`
prints what the table holds.

Two devices editing the same key while apart is the one lossy case — the later edit wins that whole
key. Per-key rows keep it to the one key rather than the whole save.

**Settings → Colours** offers five built-in presets, four pickers — accent, background, text and secondary — and your own saved presets, all stored per browser. A saved preset keeps the four colours plus the built-in preset underneath, and re-derives per mode, so one entry works in both light and dark. Under that: colours are CSS custom properties at the top of `app/globals.css`. Light mode (`:root`) is pastel pink with lemon accents; dark mode (`:root[data-theme="dark"]`) keeps the same hues on a dark plum base. Element pill colours are defined under `.el[data-el="…"]`; rarity, cost and piece-count pills read `--r5-*` / `--r4-*` / `--r3-*` and `--c4-*` / `--c3-*` / `--c1-*`, each defined once per theme. Presets in `data/palettes.ts` override a subset of those tokens as inline styles on `:root`, layered over whichever base theme is active. A custom accent, background or text colour is expanded into its tokens in `lib/theme.ts`: the accent into three, the background into five (page, raised, sunken and both border weights), the text into three. The text ramp is clamped on measured WCAG luminance, not on HSL lightness, because lightness is not brightness — yellow and blue at the same `l` are nowhere near the same contrast. It is also derived *after* the backgrounds, against whichever of the three surfaces is least forgiving, so a custom background re-aims it rather than invalidating it. A custom background is held inside a per-mode lightness band, because the pills, tints and soft accents are not re-derived from it and a light mode on a near-black page would simply hide them.

## Sources and accuracy

Character build parameters come from [prydwen.gg](https://www.prydwen.gg/wuthering-waves/) build guides — reviewed patch 3.6, captured 22 October 2026; the Lv.90 stat targets were captured 30 October 2026. Only the structured parameters are reproduced: weapon/echo/set rankings, main-stat slots, substat order, ascension materials and the Lv.90 stat targets. Prydwen's written guides, reviews, rotations and tier-list commentary are their own work and are not included — read them at prydwen.gg.

Known gaps:

- **Lily** is a version 3.8 character who has not shipped. Kuro's own Resonator Archive preview confirms Spectro Pistols and a healing support role; everything else circulating is beta leaks that contradict each other, so her card records nothing further and she has no stat targets.
- Everything else has all seven stat targets.
- Glossary definitions are written from general knowledge and may lag the current patch.

Story data comes from the [Wuthering Waves Wiki](https://wutheringwaves.fandom.com/wiki/Main_Quest) Main Quest list, checked 30 October 2026. Chapter II's title follows Kuro's own 2.0 patch notes — "All Silent Souls Can Sing" — rather than the wiki's page heading, which still carries an older translation.

**The in-game screens win any disagreement.** When the app and the game differ, trust the game and edit the data file.
