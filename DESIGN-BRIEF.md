# Design brief for external AI tools

A paste-in brief for v0, Lovable, Figma Make or any other AI design tool, so
what comes back looks like Resonance Codex instead of a generic dashboard.

## Why this file exists

Every mainstream AI UI tool emits **React + Tailwind + shadcn/ui**. This app has
none of those. The whole dependency list is Next, React, Clerk and Neon, and the
styling is 3,392 lines of hand-written CSS driven by 80 custom properties.

So nothing these tools produce can be pasted into this repo. That is not a
reason to avoid them, but it does decide what they are good for here:

| Use it for | Do not use it for |
| --- | --- |
| Exploring a layout you cannot picture | Generating code to commit |
| Seeing three versions of a screen fast | Anything touching the palette system |
| Breaking a blank-page stall | Components that must theme correctly |

The workflow is: generate in the tool, look at it, then have the layout rebuilt
here in real CSS. The brief below makes that rebuild cheap, because the output
comes back using the same vocabulary the app already has.

## Paste this into the tool

Everything inside the fence is the brief. Copy it whole, then add what you want
on the end ("now design the team builder screen").

```text
Design for an existing app. Match these rules exactly.

STACK
Plain CSS only. No Tailwind, no shadcn, no component library, no CSS-in-JS and
no utility classes. Write real CSS rules with semantic class names. Assume
React function components with plain className strings.

COLOUR
Never hardcode a colour. Every colour is a CSS custom property, because the app
ships six user-selectable palettes and a dark mode, and anything hardcoded
breaks on five of them.

  Surfaces   --bg  --bg-raised  --bg-sunken  --border  --border-strong
  Text       --text  --text-dim  --text-faint
  Accent     --accent  --accent-soft  --accent-ink
  Second     --lemon  --lemon-soft  --lemon-ink
  Status     --good  --danger
  Rarity     --r5-bg/-ink/-line, --r4-*, --r3-*
  Echo cost  --c4-bg/-ink/-line, --c3-*, --c1-*
  Geometry   --radius: 14px   --maxw: 1240px   --shell-pad: 16px
  Motion     --fast: 140ms   --med: 240ms   --ease: cubic-bezier(.22,.61,.36,1)

Derive new shades with color-mix(in srgb, var(--accent) 30%, transparent)
rather than inventing hex values. The palette is the single source of truth.

CONTRAST
Every text colour must clear 4.5:1 against the surface it actually sits on,
including at 12px and including on all six palettes. --text-faint is for 13px
and up only; below that use --text-dim. On an --accent-soft background use
--accent-ink for text, never --accent.

LOOK
Soft, rounded, slightly glassy. Pale tinted backgrounds, 14px radii, 1px
borders in --border, generous padding. Small facts are pill-shaped badges with
a tinted background, a matching 1px border and ink-coloured bold text at
0.72rem. Headings are small, uppercase, letter-spaced and accent-coloured, not
large and black. Body text is 0.85 to 0.9rem. Nothing is loud.

STRUCTURE
Lists of things are rows, not cards in a grid. A row is a full-width button:
name on the left, then badges, then a chevron. Opening a row shows its detail
in a side pane on wide screens and a modal sheet on phones, never by pushing
the rest of the list down the page.

WRITING
No em dashes. Short sentences. Say the specific thing, not the marketing
version: "17 builds want this" beats "popular choice".

REUSE THESE CLASS NAMES where they fit, rather than inventing new ones:
  .card .panel .chip .chips .mini .badge
  .char-row .char-toggle .char-body .char-split .char-list .char-detail
  .star .cost .pieces .owned-dot .wanted-pill .rank-pill
  .stat-grid .stat-line .stat-slot .kv .ranked .related
  .search .search-row .sticky-controls .filter-panel
  .term-cat .term-def .check-detail .footnote .empty .panel-intro
```

## Rules the app learned the hard way

Worth adding to the brief if the tool keeps getting one of these wrong. Each
cost real debugging time.

- `overflow-x: auto` silently forces `overflow-y: auto` too, which clips glows
  and shadows flat. Pad the block and pull it back with a negative margin.
- A `transform` on any ancestor makes `background-attachment: fixed` resolve
  against that ancestor instead of the viewport. It looks like a mystery band
  of lighter colour.
- `position: sticky` cannot escape its parent's box. If a sticky bar scrolls
  away, the wrapper is too short; `display: contents` dissolves it.
- A single large blur with a negative spread traces the border radius and reads
  as a boxy halo. Two stops with different falloffs read as light.
- `color-scheme` must be declared or the browser paints dialogs, scrollbars and
  form controls light even in dark mode.

## Checking what comes back

Before rebuilding anything a tool produced, check it against the three things
that have actually gone wrong in this app before:

1. **Does it survive a palette change?** Switch to Forest & cream and Amber &
   slate. Hardcoded colour shows up immediately.
2. **Does small text pass 4.5:1?** The 11 to 12px labels are where it fails,
   and it failed twice in one session.
3. **Does it work at 375px?** Three-column rows need an explicit stacking
   breakpoint; they do not wrap usefully on their own.
