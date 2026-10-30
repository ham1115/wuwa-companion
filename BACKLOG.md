# Backlog

Captured 30 October 2026. Items 1–5 and 7–11 are done; the rest are estimates assuming one focused sitting each.

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

### 6. Where materials come from, and what they cost
For each ascension material: which boss / Tacet Field / region drops it, and the Waveplate cost per run. Would turn the plan's shopping list into an actual farming route with a total Waveplate price.

**Caveat:** I don't have this data and I'm not sure how cleanly it scrapes — prydwen has an interactive map, which may not expose structured data. Budget research time before committing. **Half a day, uncertain.**

---

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

A preset only overrides the tokens that give it its character (backgrounds, borders, accent, secondary) and layers over the base light or dark theme, so text contrast stays solved in one place instead of five. A custom accent gives one colour, so the tint behind it and the darker shade for text on that tint are derived from its hue — any colour stays readable in both modes.

**Found and fixed a real bug doing this:** `usePersistentState` kept a separate copy per component, so the theme state in the page header and the copy in Settings would fight — picking a palette then toggling light/dark reverted the palette, because the header's stale copy won. Writers now notify every other holder of the same key. The owned-list hook had the same latent problem.

### 11. UI/UX pass ✅
- **Tabs are grouped.** Eight flat tabs became three groups — *Reference* (Characters, Weapons, Echoes, Glossary), *Mine* (My plan, Story, Routine) and *Setup* (Settings) — so at most four tabs are on screen and it is clear which half of the app you are in. The open group follows the open tab, so a restored tab restores its group.
- **The nav sticks to the top**, so switching section never means scrolling back up first.
- **Secondary filters fold away.** Characters opened with three rows of chips above the list; element and role now sit behind a `Filters` button that shows how many are active, with a Clear beside it. Same for the weapon type filter. Search and the highest-value toggles stay visible.
- **Back-to-top button** appears past 900px of scroll.
- **Phone rows no longer wrap.** Under 430px the row's class label is hidden, since it was pushing the chevron onto its own line and is repeated in the expanded body anyway.

---

## In flight

### 12. Cross-device sync — blocked
Optional sign-in that syncs progress across devices; anonymous visitors keep browser-only storage.

- **Decided:** Clerk for auth, Neon Postgres for data, login optional not required.
- **Done:** project linked to `hambyte/wuwa-companion`; Marketplace discovery run.
- **Blocked on:** provisioning, which changes the Vercel account, so it needs to be run by the account owner:

```bash
vercel integration add clerk --yes --no-claim
vercel integration add neon --yes --no-claim
```

Both sit inside free tiers at this scale. Only people who actually register count toward Clerk's user limit.

After provisioning, the real work is rewriting `lib/storage.ts` — which every tab depends on — to be local-first with server sync, plus a merge on first sign-in. **Several hours. Biggest item here.**

---

## Suggested order

1. ~~Items 1–4 (quick wins)~~ — done
2. ~~Item 5 (stat targets)~~ — done
3. ~~Item 11 (UI/UX)~~ — done
4. ~~Items 7, 8, 9, 10~~ — done
5. Item 12 (sync) when you want it
6. Item 6 (materials) last — least certain payoff for the research cost
