# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Players of Wuthering Waves (Kuro Games), from casual to dedicated. The mix is deliberate: no single tier is the target. They use it on a phone beside the game and on a desktop between sessions. Jobs: look up how to build a Resonator, record how far their own account has got, and decide what to do next.

*Assumption, confirmed only as "mixed players":* returning players ask reverse questions often ("I pulled this weapon, who wants it?", "who runs this Sonata set?").

## Product Purpose

Resonance Codex is a companion tool for Wuthering Waves. It puts guides and game data in one place (Resonators, weapons, Echoes and Sonata sets, glossary, story acts), lets the player record their own progress against it (owned characters, builds, stats, build queue, story position, daily and weekly routine), and shows the gap between where they are and where a finished build should be. Success: a player opens it, finds the answer or the next task quickly, and trusts it enough to keep their progress in it.

## Positioning

It compares the player's own recorded build to published targets and turns a shortfall into a distance, not a verdict. It also sums the ascension materials a whole build queue still needs, grouped by where they come from, with story-locked sources flagged. A static guide site cannot do either without knowing the player's account.

## Operating Context

- Used alongside a live game, often one-handed on a phone.
- Content is plain TypeScript data files in the repo; no CMS and no runtime fetching.
- Progress is local-first (browser localStorage). Optional sign-in (Clerk, Neon Postgres) adds cross-device sync. The app works fully without an account.
- It ships blank: no owned characters, queue or notes are baked in, and nothing in the repo describes a real account. Share links open a specific tab.
- Hosted on Vercel. Clerk currently runs a development instance until a custom domain is claimed (see `docs/custom-domain.md`).

## Capabilities and Constraints

- Tabs, grouped Reference (same for everyone), Mine (own progress) and Setup: Characters (61), Weapons (114), Echoes and Sonata sets (187 and 37), My plan with shopping list, Glossary (61 terms, spoilers blurred until the player's story progress passes them), Story, Routine, Settings (owned list, export and import JSON, reset).
- Player-chosen colour palettes (five presets plus custom) with light and dark modes. The look is the player's to change, so product copy and structure must not depend on a particular palette.
- Data is reproduced as structured parameters only, sourced from prydwen.gg (build guides, targets, teams, skill order) and the Wuthering Waves Wiki (story, materials). Prose guides and tier commentary are their authors' work and are not copied.
- Does not estimate material run counts: drop tables are unpublished and a figure would be invented.
- Known gaps: Lily (unreleased) has no targets or teams; Baizhi and Verina have no published teams. Glossary definitions may lag the current patch.
- In-game screens win any disagreement with the app.
- Unreleased or leaked content is not recorded as fact.

## Brand Commitments

Name: Resonance Codex. It is an unofficial fan tool for Wuthering Waves, not affiliated with Kuro Games. Voice (from the existing design brief): short sentences, no em dashes, say the specific thing ("17 builds want this" beats "popular choice"), nothing loud.

## Evidence on Hand

Real game data in `data/*.ts`, with source and capture dates in `README.md`. Real in-game chapter and act names. No user testimonials, usage numbers or official Kuro assets are on hand; do not fabricate any. A cat sprite for the empty pane is parked pending an asset-licensing check (`BACKLOG.md` item 14).

## Product Principles

1. Reference data is the same for everyone; personal progress is private and never baked into the code.
2. Local-first: a player's edit must never wait on the network, and the app is fully usable without signing in.
3. Show the distance to a goal, not a verdict, and say plainly what the player is not at yet.
4. Do not invent facts the sources do not publish (run counts, leaks, unreleased kits). Mark gaps instead.
5. Respect spoilers: hide story reveals until the player's own progress passes them.

## Accessibility & Inclusion

Text must clear 4.5:1 contrast on the surface it sits on in every palette and in both modes, including small labels. Tab lists are keyboard-operable (arrow keys, Home, End). Honour `prefers-reduced-motion` and `prefers-reduced-transparency`. Must work at 375px wide.
