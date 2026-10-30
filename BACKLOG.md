# Backlog

Captured 30 October 2026. Items 1–12 are done, sync included. Item 13 — moving Clerk onto a real
domain — is the only thing in flight: decided on 31 October 2026 and waiting on the claim, since
most of its steps need your accounts rather than code.

---

## Done

Shipped 30 October 2026.

### 1. Remove the "don't level Lv.1 characters" rule ✅
Gone from `BUILD_RULES`, and from the Story tab's "Right now" list, where it also appeared.

### 2. Different colours per Echo cost and per rarity ✅
Rarity pills now mirror the in-game gacha colours (5★ gold, 4★ purple, 3★ blue). Echo cost gets its own warm-to-cool scale (4 amber, 3 green, 1 grey), and Sonata piece-count marks the cheap 3-piece outlier in green. Cost slots in main-stat rows use the same colours via a new shared `StatLine` component, so "4 cost" reads identically in every tab. Tokens are `--r5-*`/`--r4-*`/`--r3-*` and `--c4-*`/`--c3-*`/`--c1-*`, defined once per theme.

### 3. Story acts shouldn't be skippable ✅
Progress is now always a prefix of `ACT_ORDER`: ticking an act fills in everything before it, un-ticking clears everything after. Works across chapter boundaries.

### 4. Ship blank for other players ✅
`OWNED`, `DEFAULT_PLAN`, `ACCOUNT_NOTES` and `PRIORITY_NOW` are all gone or empty. A loadable profile was built first, then removed on request because the card showed a real name to every visitor — the repository now describes no particular account at all. The Story tab's "Right now" list became an editable field instead, so the feature survived.

### 5. Recommended stat targets ✅
`data/targets.ts` holds prydwen's "Best Endgame Stats (Level 90)" for 60 of the 61 characters, shown on every Characters card and every My plan entry. Ranges and their "(before set bonuses)" qualifiers are kept as published. Seven low-damage supports carry prydwen's note that only Energy Regen really matters for them.

A first pass reported Jingran and Camellya as having incomplete data upstream. That was wrong — the scraper only read the first `<ul>` and ignored headings, so it missed Camellya's and Denia's HP (in an `<h6>`) and six of Jingran's seven stats (in a second `<ul>`). Fixed; all 60 now carry all seven, plus prydwen's explanation of what moves each range.

Only genuine gap left: Lily, who has not shipped.

### 5b. Real chapter and act names ✅
The Story tab used to show "Act 1, Act 2, Act 3" placeholders past Chapter I. It now carries the Prologue and Chapters I–IV with their in-game titles, regions and versions — 33 numbered acts and 16 segues, interludes and side stories. Segues tick independently of the sequence, since they gate nothing.

---

## Data to add

### 6. Where materials come from, and what they cost ✅
`data/materials.ts` maps all 38 ascension materials to a source, from the wiki's item and boss pages. The Plan's shopping list is no longer a flat column of names — it groups needs by **the boss that drops them** (with the boss's location and region) and by **the region you gather them in**, and lists what a claim costs at each activity.

Claim costs, confirmed from the wiki's challenge pages: Boss Challenge 60, Weekly Challenge 60, Tacet Field 60, Forgery Challenge 40, Simulation Training 40.

**It knows what you cannot reach yet.** Each region is tied to the act that opens it, so a material behind unplayed story is marked `locked` and called out at the top. With the sample queue it correctly reports that Rinascita is the wall, and that both of Phrolova's blockers sit behind it — Fenrico for Truth in Lies and "Afterlife" as a Rinascita gathering material.

**What it deliberately does not do:** estimate run counts. Drops per claim scale with boss level and no table is published, so a "7 more runs" figure would be fabricated. The cost per claim is real; the run count is not guessed.

Two data fixes fell out of this: "Novas" was a typo for **Nova** (a Black Shores specialty), and "Afterlife" is a Rinascita **gathering** material, not a boss drop as previously assumed.

## Features

### 7. Record what each character is actually using ✅
A **My build** block on every Characters card and My plan entry: two pickers for the weapon and the Sonata set, each listing the recommended options first and then everything else that fits the character. Picking something off the recommended list says so, without nagging — a complete off-meta set still beats an incomplete recommended one.

### 8. Input your current stats and compare to recommended ✅
Under the same block: one field per target, with the published figure beside it. A figure that clears the low end of the range is ticked in green; one that falls short shows the gap in red. Stored per character, every field optional.

The floor is the first number in the published value, so "60-75%+" passes at 60 and "220%-230%" at 220. The top of a range is a stretch goal, not a pass mark.

### 9. Story progress reveals matching glossary spoilers ✅
A term can now name the act that makes it common knowledge (`revealedBy`). Tick that act in Story and the term un-blurs on its own, swapping its "spoiler" tag for "you've been here". Manual tap-to-reveal still works for everything else.

The backlog worried this would need guesswork. It did not: each spoiler term names its own chapter, so all four story-gated terms could be tied to a specific act. Whimpering Wastes stays manual — it is an endgame mode, not story content, so no act unlocks it.

Fixed along the way: the region was recorded as "Lahalloo", which is not its name. It is **Lahai-Roi**, released in 3.0, sitting beneath the Roya Frostlands. Added a Roya Frostlands entry too, since the Story tab now names it.

### 10. Theme customization ✅
**Settings → Colours.** Five presets — Pink & lemon, Seafoam & sand, Lavender & honey, Slate & amber, Forest & cream — plus a colour picker for your own accent, which overrides whichever preset is selected.

**Extended afterwards on request:** the text colour is pickable too. One picked colour becomes body text, the dimmer labels and the faintest captions. The first attempt clamped HSL lightness and was wrong — lightness is not brightness, so a yellow pick landed body text at 2.58:1, under AA's 4.5:1, and flooring only the base put the faint caption at 33% lightness on a 9% background. The ramp now binary-searches lightness against measured WCAG luminance, targeting the contrast the base themes already achieve (7 / 4.5 / 2.7) rather than a stricter standard. Verified across 7,560 picks × every surface in both modes: worst case lands exactly on target, with all three steps still visually distinct. When a pick has to be moved, the panel says so and why.

**Extended again:** the background is pickable too, becoming five tokens — the page, the cards above it, the wells below, and both border weights — spaced by the base themes' own gaps so depth survives. This forced the text ramp to move: it had been aimed at a fixed worst-case surface, which a custom background invalidates, so it is now derived after the backgrounds and against whichever of the three is least forgiving. Verified over 35,640 background × text combinations per mode; worst case lands exactly on 7 / 4.5 / 2.7 throughout. The background is held inside a per-mode lightness band, since the pills and soft accents are not re-derived from it — a near-black light mode would hide them rather than invert them, and the panel says so.

**Extended a third time:** your own presets. The four pickers (accent, background, text and now secondary) can be named and saved, listed beside the built-in five, applied or deleted. A saved entry stores the four colours plus the built-in preset underneath it, because a partial preset would otherwise look different depending on what was selected when it was applied, and it re-derives per mode so one entry works in light and dark.

Two things fell out of building it. Presets had to become a true single-select list: with all four colours set, a built-in preset sets nothing still visible, so clicking one appeared to do nothing — picking a built-in now clears the custom colours. And `lemon-soft` had to join the surfaces the text ramp aims at, because callouts are painted with it and in dark mode it is lighter than the cards are, which makes it the binding surface rather than an afterthought.

**A real React bug surfaced too:** `usePersistentState` called `write()` inside the `setValue` updater, and React runs updaters during render — so the listener notifications that keep components in sync were firing mid-render ("Cannot update a component while rendering a different component"). Applying a preset writes four keys at once, which made it reproduce every time. The hook now keeps the current value in a ref and writes from the event handler.

A preset only overrides the tokens that give it its character (backgrounds, borders, accent, secondary) and layers over the base light or dark theme, so text contrast stays solved in one place instead of five. A custom accent gives one colour, so the tint behind it and the darker shade for text on that tint are derived from its hue — any colour stays readable in both modes.

**Found and fixed a real bug doing this:** `usePersistentState` kept a separate copy per component, so the theme state in the page header and the copy in Settings would fight — picking a palette then toggling light/dark reverted the palette, because the header's stale copy won. Writers now notify every other holder of the same key. The owned-list hook had the same latent problem.

### 11. UI/UX pass ✅
- **Tabs are grouped.** Eight flat tabs became three groups — *Reference* (Characters, Weapons, Echoes, Glossary), *Mine* (My plan, Story, Routine) and *Setup* (Settings) — so at most four tabs are on screen and it is clear which half of the app you are in. The open group follows the open tab, so a restored tab restores its group.
- **The nav sticks to the top**, so switching section never means scrolling back up first.
- **Secondary filters fold away.** Characters opened with three rows of chips above the list; element and role now sit behind a `Filters` button that shows how many are active, with a Clear beside it. Same for the weapon type filter. Search and the highest-value toggles stay visible.
- **Back-to-top button** appears past 900px of scroll.
- **Phone rows no longer wrap.** Under 430px the row's class label is hidden, since it was pushing the chevron onto its own line and is repeated in the expanded body anyway.

---

## Done, continued

### 12. Cross-device sync — done ✅
Optional sign-in that syncs progress across devices; anonymous visitors keep browser-only storage.

- **Decided:** Clerk for auth, Neon Postgres for data, login optional not required.
- **Provisioned** (30 October 2026, by the account owner): `clerk-crimson-saddle` and
  `neon-fuchsia-ridge`, both Available on `hambyte/wuwa-companion`. `CLERK_SECRET_KEY`,
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `DATABASE_URL` and the rest are set for Production,
  Preview and Development.
- **Skills installed** by the integrations and committed: `clerk-setup`, `clerk-nextjs-patterns`,
  `neon-postgres` and others under `.claude/skills/`.

Note for anyone repeating this: `vercel integration add <name> --yes` does **not** work — CLI 65.7.0
has no `--yes` on `add`. It exists only on `accept-terms`, and only for `neon`. Both integrations
need a browser consent step, so `vercel integration open <name>` is the reliable route.

Both sit inside free tiers at this scale. Only people who actually register count toward Clerk's user limit.

**Built** (30 October 2026): `middleware.ts`, `ClerkProvider` in the layout, `/sign-in` and
`/sign-up`, the `user_state` table (`db/schema.sql`), `app/api/state` and `lib/sync.tsx`.
`lib/storage.ts` is local-first: every edit writes to localStorage first and a debounced push
follows, so nothing in the UI waits on the network.

The merge is per key and newest wins — the server's copy if it is newer, this browser's if it is,
and whichever side has it when only one does. So a first sign-in pushes a full browser up, a fresh
device pulls it all down, and two devices editing different parts never collide. `scripts/test-merge.mjs`
exercises the upsert against the real database: 9 checks, including that an older push does **not**
overwrite a newer row and that a replayed push is a no-op.

Two devices editing the *same* key while apart is the one lossy case: the later edit wins that whole
key. Per-key rows keep it to the one key rather than the whole save. Noted rather than solved; the
fix would be set-union semantics for the id-set keys.

**Verified signed in** (30 October 2026, by the account owner). First sign-in uploaded all 13 keys
with their real contents; `tab` stayed local and the orphaned `account-notes` stayed out. A live
edit reached the server inside the debounce window, a deletion propagated, and deleting the local
copy and pressing Sync now pulled it back byte-identical — with the UI updating live and the
timestamp taken from the server rather than re-stamped, which is what stops a pull bouncing back as
a push. Signed out, the app is unchanged and `/api/state` returns 401.

One wrinkle worth knowing: Postgres `jsonb` normalises object key order, so a value that round-trips
comes back semantically identical but not string-identical. Nothing compares serialised values —
the merge is on timestamps — so it has no effect, but a naive string diff of local against server
will show a false mismatch.

**Production still runs development keys** — see item 13.

---

## In flight

### 13. Promote Clerk off development keys
Confirmed 30 October 2026 by fetching the live site: it serves `pk_test_...` via
`clerk.accounts.dev`. The Marketplace provisioned one development key pair and set it across
Production, Preview and Development, so the deployed app runs a Clerk development instance.

**What that actually costs us**

- 100-user cap. Irrelevant at this scale — it is shared with friends.
- Every cold load does a handshake: a cookieless request to the live site returns `307` with
  `X-Clerk-Auth-Status: handshake` and `X-Clerk-Auth-Reason: dev-browser-missing`, redirecting
  top-level to `tender-narwhal-52.clerk.accounts.dev/v1/client/handshake` and back. Measured 30
  October 2026, not inferred. It leaves `__clerk_db_jwt` and `__client_uat` as script-writable
  first-party cookies. **This is the one that could really bite:** the out-and-back is the pattern
  iOS Safari's bounce-tracking protection targets, and script-written cookies are capped at seven
  days there. Likely symptom is being signed out after a week away rather than being unable to
  sign in at all — still unverified on a real phone, which is the cheapest next test.
- Google sign-in uses Clerk's *shared* development OAuth credentials, so the consent screen is
  branded `accounts.dev` rather than this app.
- Not crawlable by search engines. No loss here; nobody wants this indexed.
- Clerk states plainly that development instances are not suitable for production workloads.

**What promoting needs**

Decided 30 October 2026: the domain is coming free for a year from the **GitHub Student Developer
Pack**, so this is no longer blocked. Take the Name.com offer and a `.dev` or `.app` — year one is
free either way, and those two are the cheapest to renew (~$12-15/year, against ~$50-70 for
`.tech`).

The full sequence, what only you can do, and the failure modes are written up in
[docs/custom-domain.md](docs/custom-domain.md). The short version: claim the domain, host its DNS
at Vercel, `clerk login` so the Marketplace-created app can be linked, `clerk deploy --domain` to
create the production instance, import its zone file with `vercel dns import`, then swap the
`Config`-typed Clerk env vars for the `pk_live_` / `sk_live_` pair and redeploy.

**No application code changes.** Clerk reads its keys from the environment and nothing in `app/`,
`lib/` or `middleware.ts` has the current URL baked in.

**The free alternative was tried and rejected, 30 October 2026.** Clerk's `frontendApiProxy` does
remove the cross-site hop — verified, handshake went same-origin and cookies came from our own host
— but setting `proxyUrl` also makes Clerk resolve its own script bundles through the proxy, which
404s. Sign-in was dead on production for a few minutes until it was reverted. It can be completed
by pinning `NEXT_PUBLIC_CLERK_JS_URL` and `NEXT_PUBLIC_CLERK_UI_URL`, which then works with no
console errors at all, but those map to `__internal_` props and hardcode the instance hostname, so
the failure mode is sign-in breaking silently later. Written up in full in
[docs/custom-domain.md](docs/custom-domain.md). On a production instance with a CNAME none of it is
needed, which is a better argument for the domain than the iOS risk was.

The prize is step 7 of that document: a CNAME putting the Frontend API on `clerk.<domain>`,
same-site with the app, which removes the cross-site handshake redirect entirely and leaves the
session as a normal `HttpOnly` cookie rather than a script-written one capped at seven days by
Safari — and so fixes the iOS risk rather than merely testing for it.

**Going ahead, 31 October 2026.** The proxy result settled it: the domain is not just insurance
against the iOS risk, it is the only supported code path. `resonancecodex.app` is the chosen name —
free as of the RDAP check that day, and free of the game's trademark, which matters because sign-in
will depend on the domain resolving. Steps 0 and 1 of the runbook are yours (calendar reminder,
then claim); the toolchain for steps 2 and 4 is confirmed ready.

---

## Suggested order

1. ~~Items 1–4 (quick wins)~~ — done
2. ~~Item 5 (stat targets)~~ — done
3. ~~Item 11 (UI/UX)~~ — done
4. ~~Items 7, 8, 9, 10~~ — done
5. ~~Item 12 (sync)~~ — done
6. ~~Item 6 (materials)~~ — done
7. Item 13 (Clerk on a real domain) — in flight, see [docs/custom-domain.md](docs/custom-domain.md)
