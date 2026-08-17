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
| **Stack** | Vite + vanilla JS (no frameworks) |
| **Font** | Inter (200–700) via Google Fonts |
| **Entry** | `index.html` → `src/main.js` |
| **Styles** | `src/style.css` — CSS custom properties |
| **Noise** | Canvas 2D Value Noise (256×256), soft-light blend |
| **Render** | `requestAnimationFrame` loop |
| **Data** | `WORDS[]` (15 nodes), `CONNECTIONS[]` (45 edges) |

### Modules

| Module | Responsibility |
|--------|---------------|
| `data.js` | Conceptual Model — WORDS, CONNECTIONS, node connections, noise generation |
| `state.js` | Navigation Model — activeState, getTargetPos, toggleState |
| `visual.js` | Visual Model — DOM construction, animation loop, edges, opacity |
| `interaction.js` | Drag + Hover — physics, events, border resistance |
| `main.js` | Orchestrator — init sequence, wires modules together |

### Commands
```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview build
```