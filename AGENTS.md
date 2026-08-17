# Project: Concept — Portfolio Cartography

## Git workflow
- No commit unless the user explicitly says so
- Before committing, run `git status`, `git diff`, `git log --oneline -10`
- Write concise commit messages in Spanish or English matching repo style
- Only stage intended files, never commit secrets
- After committing, ask if user wants to push
- Never force-push or use `-i` interactive
- If hooks reject a commit, fix and make a new commit (never amend)

## Stack
Vite + vanilla JS (no frameworks). Node required.

## Project structure
- `src/index.js` — entry point, exposes `createCartography()` + `destroy()`
- `src/config.js` — defaults; `src/data/*` — WORDS, CONNECTIONS, STATE_NODES
- `src/interaction.js` — drag/press interactions; `src/state.js` — navigation state
- `src/visual.js` — DOM build + animation
- `src/style.css` — styles (exported as `cartography/style.css`)
- `demo/index.html` — Vite dev entry point (vite root is `demo/`)
- `context_docs/` — project documentation

## Core data
- **WORDS[]**: 16 nodes, each with 6 position properties: `pos`, `posAr`, `posArc`, `posExp`, `posInf`, `posAcc`
- **CONNECTIONS[]**: 45 directed edges (global, not state-dependent)
- **STATE_NODES**: `['archaeology', 'architecture', 'experience', 'accessibility', 'information']`
- **Anchor point**: all states converge to `(52.61, 41.82)`

## Key conventions
- Keep three layers separated: Conceptual Structure (WORDS/CONNECTIONS), Navigation State (activeState), Visual Behavior (opacity/animation)
- No semantic color coding, badges, or icons — typography-only hierarchy
- No reintroduce: Structure, Production, Technology (removed concepts)
- All positions are percentages (x%, y% in 0-100 range)
- Float/opacity params derived from hash of node id
