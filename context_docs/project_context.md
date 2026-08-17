# Project Context

This  proyect will be part of my web portfolio. This is not intended to look like:
- generic SaaS
- startup landing page
- UX bootcamp portfolio
- experimental art project

The portfolio should communicate:
- systems thinking
- relational structures
- human complexity
- contextual analysis
- symbolic and technological dimensions
- editorial clarity
- organic interaction

Key concepts:
- systems before interfaces
- human systems before digital systems
- symbolic + technological structures
- organic but structured motion
- breathable layouts
- typography as relational object
- perspective-based readings

Main interaction:
A conceptual cartography where words form a territory that reorganizes itself based on interpretative perspectives.

Important:
avoid excessive visual effects, noisy motion, or futuristic aesthetics.

---

## Technical

| | |
|---|---|
| **Stack** | Vite + vanilla JS (no frameworks) — importable library (`cartography`) |
| **Font** | Inter (200–700) via Google Fonts |
| **Library API** | `createCartography({ container, config? })` → `{ nodeMap, lineEls, words, config, destroy }` |
| **Entry (demo)** | `demo/index.html` → `demo/main.js` (vite root: `demo/`) |
| **Styles** | `src/style.css` — exported as `cartography/style.css` |
| **Noise** | Canvas 2D Value Noise (256×256), multiply blend, opacity 0.06 |
| **Render** | `requestAnimationFrame` loop |
| **Data** | `WORDS[]` (15 nodes, 6 positions each), `CONNECTIONS[]` (45 edges) |

### Modules

| Module | Responsibility |
|--------|---------------|
| `index.js` | Library entry — createCartography(), destroy(), re-exports |
| `config.js` | Defaults — anchor, drag physics, typography, opacity, edges |
| `data/nodes.js` | Conceptual Model — WORDS, positions, noise, float params, loadLayout |
| `data/edges.js` | CONNECTIONS, adjacency list, connection strength |
| `data/stateNodes.js` | STATE_NODES (5 perspectives) |
| `state.js` | Navigation Model — activeState, getTargetPos, resize handling |
| `visual.js` | Visual Model — DOM construction, animation loop, edges, opacity |
| `interaction.js` | Drag + Hover + state clicks |

### Commands
```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview build
```