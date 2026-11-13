---
name: Resonance Codex
description: A soft, lit, glassy Wuthering Waves companion in pastel pink and lemon, with chamfered panels, the game's own element colours as data, and six player-selectable palettes.
colors:
  resonance-rose: "#c43f7a"
  rose-ink: "#8e2a56"
  rose-mist: "#ffd9e8"
  lemon-flash: "#f6c744"
  lemon-ink: "#8a6a07"
  lemon-mist: "#fff2c2"
  petal-page: "#fff6fa"
  paper-raised: "#ffffff"
  blush-sunken: "#fdecf3"
  blush-line: "#f8d7e4"
  rose-line-strong: "#efb3cc"
  good-green: "#3f9168"
  danger-red: "#cc4a4a"
  rarity-5-ink: "#85620a"
  rarity-5-bg: "#fff2c2"
  rarity-5-line: "#f0c040"
  rarity-4-ink: "#5b3a92"
  rarity-4-bg: "#ece2fb"
  rarity-4-line: "#c0a6ec"
  rarity-3-ink: "#2c5c86"
  rarity-3-bg: "#e0eefb"
  rarity-3-line: "#a5cbea"
  cost-4-ink: "#8c4b17"
  cost-4-bg: "#ffe3cd"
  cost-3-ink: "#1d6748"
  cost-3-bg: "#d6f0e3"
  cost-1-ink: "#5d5a66"
  cost-1-bg: "#ecebef"
  element-aero: "#2fae83"
  element-electro: "#8a63d9"
  element-fusion: "#e2683f"
  element-glacio: "#3a9bd8"
  element-havoc: "#cf3f77"
  element-spectro: "#c99a14"
  stat-crit: "#e0383e"
  stat-atk: "#e07a1f"
  stat-hp: "#2f9e5c"
  stat-def: "#b8892f"
  stat-energy-regen: "#2f8fd8"
  stat-healing: "#1fa5a0"
typography:
  display:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.55
  lead:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.4
  small:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  chip:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.4
  stat:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  hero:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 600
    lineHeight: 1.2
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.09em"
rounded:
  panel: "14px"
  chamfer: "18px"
  row: "5px"
  control: "9px"
  hairline: "2px"
  pill: "999px"
spacing:
  shell-pad: "16px"
  card-y: "15px"
  card-x: "17px"
  gap: "6px"
components:
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.rose-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  tab-selected:
    backgroundColor: "{colors.rose-mist}"
    textColor: "{colors.rose-ink}"
  chip:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.rose-ink}"
    rounded: "{rounded.pill}"
    padding: "5px 13px"
  chip-on:
    backgroundColor: "{colors.rose-mist}"
    textColor: "{colors.rose-ink}"
  card:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.chamfer}"
    padding: "15px 17px"
  callout:
    backgroundColor: "{colors.lemon-mist}"
    textColor: "{colors.lemon-ink}"
    rounded: "{rounded.chamfer}"
    padding: "12px 15px"
  search:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  char-row:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.row}"
    padding: "12px 15px"
---

# Design System: Resonance Codex

## Overview

**Creative North Star: "The Resonance Panel"**

A calm in-game menu rendered in pastel. Surfaces are frosted glass with a lit top edge, panels are cut on one diagonal the way Wuthering Waves cuts its own, and controls are soft pills. Everything is quiet: small uppercase accent headings, pale tinted fills, thin borders, generous padding. It is a lookup tool used beside a running game, so the page recedes and the facts (names, ranks, stats, costs, elements) carry the colour. Pink means "you can act here"; everything that describes the game has its own hue.

The look belongs to the player. Every colour is a CSS custom property, the app ships five built-in palettes plus custom ones, and a dark mode. Nothing is allowed to hardcode a colour, because anything hardcoded breaks on the other palettes. Values below describe the default **Pink & lemon** palette in light mode; dark mode keeps the same hues on a deep plum base (`#1c1118`).

**Key Characteristics:**
- Frosted glass for the nav, cards and callouts only. Long lists get the lit edge and shadow without the blur.
- Chamfered panels (two opposite corners cut) and pill-shaped controls.
- Small, uppercase, letter-spaced accent headings instead of large black ones.
- Colour is data: rarity, Echo cost, Sonata piece count, element, weapon type and stat name each have a fixed scale reused everywhere.
- Light by default, with a true dark counterpart; palette-agnostic by construction.

## Colors

A rose and lemon pair on near-white blush, with mixed-from-token tints for everything else.

### Primary
- **Resonance Rose** (#c43f7a): The accent. Section headings, selected borders, the queue rank pill, the built-row blade. Never used for body text on a tint; use Rose Ink there.
- **Rose Ink** (#8e2a56): Text and icons that sit on Rose Mist or on the page as the page heading. Clears 4.5:1 where Rose does not.
- **Rose Mist** (#ffd9e8): Selected tab, active chip, soft accent fills.

### Secondary
- **Lemon Flash** (#f6c744): The second voice. Callout borders, the theme toggle, the "lemon" chip tone.
- **Lemon Ink** (#8a6a07): Text on Lemon Mist.
- **Lemon Mist** (#fff2c2): Callout and theme-toggle fill.

### Neutral
- **Petal Page** (#fff6fa): The page base under three soft radial washes mixed from accent, lemon and background.
- **Paper Raised** (#ffffff): Cards, rows, chips, search.
- **Blush Sunken** (#fdecf3): Filter panels, the tab group track, hover on rows.
- **Blush Line** (#f8d7e4) and **Rose Line Strong** (#efb3cc): Borders, light and heavy.
- Text is near-neutral with a tenth of the accent mixed in (`color-mix(accent 10%, #171318)`). Dim is 70% of that toward the page; faint is 62%. Faint is for 13px and up only.

### Status and data scales
- **Good Green** (#3f9168) and **Danger Red** (#cc4a4a): a stat that clears its target, a stat that falls short.
- **Rarity** mirrors the gacha: 5★ gold (#f0c040 line), 4★ purple (#c0a6ec), 3★ blue (#a5cbea). Each has a bg, ink and line.
- **Echo cost** runs warm to cool: 4-cost amber, 3-cost green, 1-cost grey.
- **Sonata piece count** marks the cheap outlier: 3-piece green, 5-piece grey.

### Element, weapon and stat hues
Colour that says what a thing is, not what you can do with it. These are fixed, game-derived scales and do not follow the palette; they are the one place a hex is allowed in the stylesheet, as `--el-c`, `--rc`, `--wc` and `--sc`.
- **Element** (Aero green, Electro violet, Fusion orange, Glacio blue, Havoc rose, Spectro gold): set once by `data-el`, read as a 3px edge on rows, a top bar and rule on the detail pane, and a top edge on build cards. Built and selected rows take the full-strength hue.
- **Weapon rarity** edge (5 star gold, 4 star purple, 3 star blue) on weapon rows and pane, and **weapon type** pills (Sword blue, Broadblade red, Pistols teal, Gauntlets amber, Rectifier violet).
- **Stat names** inside advice text (`StatText`): CRIT red, ATK orange, HP green, DEF tan, Energy Regen blue, Healing teal, skill-type DMG violet, element DMG in the element hue. Each is mixed toward `--text` (about 58%) so one token holds contrast in both modes, and each is bold, so colour is never the only cue.
- **Rank one** in a ranked list is lemon; the rest stay accent.
- **Lemon diamond** before every section heading is the second, non-accent note on the page.
- **Header rule**: a 132px run of the six element colours at the left end of the masthead underline.

### Named Rules
**The Palette Is Not Ours Rule.** Never write a hex in a component, except the fixed game scales above. Derive shades with `color-mix(in srgb, var(--accent) 30%, transparent)`. The five palettes and the player's custom colours are the source of truth.
**The Ink On Tint Rule.** On an `--accent-soft` or `--lemon-soft` background, text is `--accent-ink` or `--lemon-ink`, never the raw accent.
**The Three Scales Rule.** Rarity, Echo cost and piece count are different numbers with different colour scales. Do not reuse one scale for another.
**The Pink Is For Action Rule.** Buttons, chips, tabs, focus and selection use the accent. Descriptive colour (element, weapon, stat) never does, so a pink thing is something you can press.

## Typography

**Display Font:** Chakra Petch, 600 and 700, self-hosted through `next/font` as `--font-display`, with tabular numerals. It carries names and numbers only: the masthead title, character and weapon names, build headings, target values, rank pills.

**Body and Label Font:** the system UI stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`).

**Character:** Plain and fast to read, with one instrument-panel face for the things you look up. Hierarchy comes from size, weight and case; the display face is kept to names and numbers so prose stays in the system face.

### Hierarchy
- **Display** (Chakra Petch 700, 1.4rem, -0.015em): The masthead title (1.65rem from 600px), detail-pane names and build headings.
- **Headline** (700, 1.4rem, -0.015em): Headings that stay in the system face, in Rose Ink.
- **Title** (600, 1rem): Row names and card titles.
- **Body** (400, 0.85 to 0.9rem, 1.55): Prose and panel intros, in dim text. Prose is capped narrower than the 1240px shell.
- **Label** (700, 0.75rem, 0.09em, uppercase): `h2.section` headings, in Resonance Rose.
- **Pill text** (700, 0.75rem): Badges, rarity, cost, piece count, in ink colour.

### Named Rules
**The Quiet Heading Rule.** Headings are small, uppercase, letter-spaced and accent-coloured, not large and black.
**The 12px Floor Rule.** Nothing is set below 0.75rem. On phones (coarse pointer or under 600px) secondary labels and footnotes rise to 0.8125rem and skill-level inputs to 16px so the browser does not zoom.
**The 4.5 Rule.** Every text colour clears 4.5:1 on the surface it sits on, at 12px, in all palettes and both modes.

## Layout

One centred shell, max 1240px, 16px side padding. The masthead holds the logo, title, a sync badge and the theme and sign-in buttons. A sticky glass nav sits under it: one row of six tabs, about 50px tall: Now, My plan, Routine, Browse, Story, Settings. Browse folds the four reference tabs (Characters, Weapons, Echoes, Glossary) into one; inside it a chip row switches between them, and Browse opens wherever you last were. Every reference tab keeps its own URL (#weapons), and Browse is lit while any of them is open. On a narrow phone the row scrolls sideways and fades at the edge. Lists are rows, not card grids. On wide screens (about 900px and up) an opened row's detail shows in a side pane (Characters, Weapons, Sonata sets and Echoes); on phones it opens as a modal sheet. Now sits in two columns from 900px (Next to build, Today with its tickable daily items); Routine and My plan are capped at 860px and 1000px so a row never runs the full shell. Nothing pushes the list down the page.

Spacing is tight and uniform: 6px between chips, 7px between rows, 11px between cards, 15 to 17px card padding. The layout must work at 375px; three-column rows need an explicit stacking breakpoint. Breakpoints observed: 430, 460, 560, 600, 860, 900, 1000 and 1100px. On phones every tappable control is at least 40px tall (tabs 44px). Under 600px the masthead drops its tagline and tightens its padding.

## Elevation & Depth

Hybrid: glass plus light. Cards and callouts are translucent surfaces (72% of the raised colour in light, 78% in dark) with a backdrop blur of 14 to 16px and saturation 1.5, a bright inner top stroke, and two soft shadows. Because a translucent card separates from the page by barely more than 1:1, the **border carries the panel edge**, not the blur. In dark mode the shadow is pure black and does almost nothing, so a glow mixed from the accent does the separating, which is also how the game marks anything active.

### Shadow Vocabulary
- **Glass card** (`inset 0 1px 0 var(--glass-sheen), 0 8px 24px -12px shadow 28%, 0 2px 6px -3px shadow 18%`): cards and callouts.
- **Nav** (`inset 0 1px 0 sheen, 0 6px 18px -14px shadow 50%`): the sticky bar.
- **Group indicator** (`0 1px 3px rgba(0,0,0,.07)`): the sliding pill.

### Named Rules
**The Only Eleven Rule.** Blur is for the nav, cards and callouts. Never the 61, 114 or 187 row lists; no tab blurs more than eleven elements.
**The No Glass Without Fallback Rule.** Browsers without `backdrop-filter`, and players with `prefers-reduced-transparency`, get the opaque surfaces back.

## Shapes

Pills for anything you press (tabs, chips, search, toggles, badges: 999px). Panels use a 14px radius with **two opposite corners cut** (top-left and bottom-right, 18px bevel), done with `corner-shape: bevel` rather than `clip-path` so the shadow and sheen survive. Four cut corners read as an octagon; the diagonal is the point. Long-list rows are near-square (5px) with one small 13px top-left cut and a 3px blade down the leading edge, 4px and full accent once marked built. Borders are 1px, 1.5px on the search field.

## Components

### Tabs
The one exception to "pills for anything you press": primary navigation is plain text tabs on the nav's bottom rule, so a row of tabs does not read as the same control as the pill chips under it. Dim text, no fill; hover fills Blush Sunken and shows a Rose Line Strong underline; selected is Rose Ink with a 2px Resonance Rose underline and no glow.

### Chips
Pill, 1px border, dim text, 0.8rem. On: Rose Mist fill, Resonance Rose border, Rose Ink, weight 600. A lemon tone swaps in Lemon Mist, Lemon Flash and Lemon Ink.

### Cards and callouts
Glass panels with the diagonal chamfer. Callouts are Lemon Mist with a Lemon Flash border; a leading `<strong>` is the callout's own heading line.

### Character, weapon and echo rows
Full-width buttons: name left, then badges, then a chevron. Hover lifts 1px and the blade brightens to the accent; hover is on the toggle, not the row, so an open row does not lift while you read it. Built rows get an accent border and the full-height blade.

### Search
Pill field, 1.5px border, 1rem text, focus swaps the border to the accent. Placeholder is faint.

### Badges and pills
0.72rem bold ink on a tinted fill with a matching 1px border. Rarity, cost and piece count each read their own token trio. The "N mine" ownership badge is lemon (Lemon Mist, Lemon Ink, a Lemon Flash ring), not accent, because it is not pressable.

### Queue rank pill
A 24px circle in solid accent with white 0.78rem bold numerals.

### Now tab
Two cards: **Next to build** (first queued Resonator, its first unticked step, a six-cell meter and a count, the step's note, then Open build and "N more queued") and **Today** (daily and weekly items left, Open routine). The build card takes its character's element through `data-el`. Now is the first tab in Mine and the landing tab once there is a queue or ticked routine. Nothing is estimated; it says what is left. Daily ticks clear at 04:00 on the chosen server clock and weekly ones on Monday at 04:00; the hour and offsets are the maintainer's knowledge, not read from a repo source.

### Sync badge and Mine note
A diamond dot and label in the masthead: gray On this device, pulsing lemon Syncing, green Synced, red Not synced. A lemon-outlined note at the top of the Mine tabs says once where progress is stored, with an Export a backup button, and is dismissed per device. After that, and for as long as nothing is synced, it stays as one quiet line ("Saved on this device only", Export a backup). Irreversible resets (Reset every check, Select none) use a two-tap confirm button that re-labels itself in place for four seconds, not a modal.

### Empty results
A filtered list with no matches names what is filtering and offers Clear filters.

### First steps
A browser with no stored tab (a first visit) opens on Now. With an empty queue, Now says in one line what it will show once a Resonator is queued, then lists three numbered steps (queue the one you are building, tick today's routine, mark what you own, which is marked optional), each with a button and a checkmark once done. Owned is last because nothing waits on it. My plan shows one card with Browse Characters instead of its jump bar and queue heading.

## Do's and Don'ts

### Do:
- **Do** write every colour as a token and derive tints with `color-mix` (Palette Is Not Ours Rule).
- **Do** test any new screen on Forest & cream and Amber & slate, in dark mode, and at 375px.
- **Do** put small facts in pill badges with a tinted background, a matching 1px border and bold ink text.
- **Do** keep copy short and specific, with no em dashes: "17 builds want this", not "popular choice".
- **Do** declare `color-scheme` per theme so dialogs, scrollbars and form controls follow dark mode.
- **Do** use `data-el`, `data-r` and `data-wt` to colour what a thing is, and keep the accent for what you can press.
- **Do** keep motion on one scale (`--fast` 140ms, `--med` 240ms, `--ease` cubic-bezier(.22,.61,.36,1)) and let `prefers-reduced-motion` zero the durations rather than delete the rules.

### Don't:
- **Don't** hardcode a hex in a component, or add Tailwind, shadcn or a utility-class layer.
- **Don't** blur the long lists, or put `overflow-x: auto` on a block whose glow must show without padding it back out.
- **Don't** cut all four corners of a panel.
- **Don't** set text below 0.75rem, use `--text-faint` below 13px, use `--accent` as text on an accent tint, or spend the accent on descriptive colour.
- **Don't** make headings large and black, or anything loud.
- **Don't** put a `transform` on an ancestor of a `background-attachment: fixed` element.
