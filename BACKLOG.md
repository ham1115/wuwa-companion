# Backlog

Captured 30 October 2026. Items 1–4 are done; the rest are estimates assuming one focused sitting each.

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
`OWNED`, `DEFAULT_PLAN`, `ACCOUNT_NOTES` and `PRIORITY_NOW` are all empty now. The personal version moved to `data/profile.ts` and loads only when someone presses **Settings → Start from someone else's progress → Load this profile**, which writes the four keys and leaves checklists and story ticks alone.

---

## Data to add

### 5. Recommended stat targets
Per-character target numbers, e.g. Crit 70% / 250%, ATK thresholds, ER targets.

**Concrete lead:** prydwen character pages have a **"Best Endgame Stats (Level 90)"** section — I saw it while scraping and did not extract it. Same scrape approach as the existing data, so this is mostly mechanical. **~1–2 hours.**

### 6. Where materials come from, and what they cost
For each ascension material: which boss / Tacet Field / region drops it, and the Waveplate cost per run. Would turn the plan's shopping list into an actual farming route with a total Waveplate price.

**Caveat:** I don't have this data and I'm not sure how cleanly it scrapes — prydwen has an interactive map, which may not expose structured data. Budget research time before committing. **Half a day, uncertain.**

---

## Features

### 7. Record what each character is actually using
Set the real Echo set and weapon per character, picked from the existing databases, stored per character. Pairs naturally with #8.
**~1 hour.**

### 8. Input your current stats and compare to recommended
Optional per-character stat entry shown side by side with the targets from #5, so gaps are visible.
**Depends on #5 landing first. ~2 hours after that.**

### 9. Story progress reveals matching glossary spoilers
Ticking a chapter should auto-unblur the glossary terms belonging to it.

**Needs work on the data model:** glossary terms carry a boolean `spoiler` today, not a chapter. Tagging every term by chapter is partly guesswork beyond Chapter 1 — may need the tags to be editable rather than fixed. **~1–2 hours.**

### 10. Theme customization
Let people pick their own colours, or choose from preset palettes. The groundwork is already there — every colour is a CSS custom property on `:root` in `app/globals.css`, so a picker writing to those variables would work without touching components.
**~1–2 hours.**

### 11. UI/UX pass
Current design is fine; the problems are structural.

- **Tabs have no grouping.** Eight flat tabs mixing reference data with personal tracking. Natural split: *Database* (Characters, Weapons, Echoes) / *Mine* (My plan, Story, Routine) / *Settings*.
- **Everything is scroll.** Filters scroll away; long lists have no jump-to; expanded cards push content far down. Candidates: sticky filter bar, letter or element jump links, collapse-others-on-expand, maybe a two-column layout on wide screens.

**~2–3 hours, and worth sketching before building.**

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
2. Item 5 (stat targets — cheap, and item 8 needs it)
3. Item 11 (UI/UX — affects everything added after)
4. Items 7, 9, 10
5. Item 12 (sync) when you want it
6. Item 6 (materials) last — least certain payoff for the research cost
