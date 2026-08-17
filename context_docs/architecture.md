# Portfolio Cartography — Architecture

## Introduction

The cartography is not a single system. It is the superposition of several independent models that collaborate.

Each model has a single responsibility and can evolve without affecting the others.

This separation keeps the architecture clean, prevents logic duplication, and enables future extensions.

---

## Architecture Overview

```
Portfolio Cartography

├── Conceptual Model
│     ├── Nodes
│     ├── Connections
│     └── Hierarchical layers
│
├── Navigation Model
│     ├── Active state
│     ├── Anchor point
│     ├── Territory translation
│     └── Design editor
│
├── Visual Model
│     ├── Typography
│     ├── Opacity
│     ├── Edges
│     ├── Hover
│     ├── Animations
│     └── Noise overlay
│
└── Content Model
      ├── Descriptions
      ├── Related projects
      └── Portfolio content
```

---

# 1. Conceptual Model

## Responsibility

The core of the project.

Contains exclusively the meaning of the cartography.

Defines:

- which concepts exist;
- how they relate to each other;
- what hierarchical level each one occupies;
- what each concept represents within the conceptual territory.

This model knows absolutely nothing about positions, animations, interaction, or graphic representation.

Its only responsibility is describing the conceptual structure of the system.

## Components

### Nodes

15 concepts forming the cartography:

- **System** — organizing principle, conceptual center of gravity
- **Archaeology** — understanding existing systems (Foucauldian sense)
- **Architecture** — designing, configuring and shaping systems
- **Information** — organizing meaning
- **Experience** — organizing lived interaction
- **Accessibility** — organizing participation
- **Research**, **Context**, **Community**, **Narrative**, **User** — operational concepts (Archaeology territory)
- **Flow**, **Interface**, **Quality**, **Design** — operational concepts (Architecture territory)

Full node data (positions, connections, layer assignments) is defined in `domain.md`.

### Connections

A single global graph. 45 directed edges.

Connections never depend on the active state. There are no alternative graphs.

### Hierarchical Layers

Each node belongs to a hierarchical layer. The layer expresses conceptual importance only.

It does not determine behavior. It does not determine position. It determines visual hierarchy through typography and opacity.

| Layer | Nodes | Role |
|-------|-------|------|
| 1 | System | Central |
| 2 | Archaeology, Architecture | Perspectives |
| 3 | Information, Experience, Accessibility | Articulation |
| 4 | Research, Community, Narrative, Context, User, Interface, Flow, Quality, Design | Operational |

### Fundamental Principle

> The Conceptual Model describes the territory, not how to traverse it.

---

# 2. Navigation Model

## Responsibility

Answers a single question:

> From what perspective is the user currently observing the cartography?

Does not modify the territory. Does not modify the relationships. Does not generate new layouts.

Only changes the point from which the same map is interpreted.

## Components

### Active State

Represents the current perspective.

6 states (5 perspectives + neutral):

| State | Central Node | Anchor Position |
|-------|-------------|-----------------|
| Neutral (`null`) | System | (52.61, 41.82) |
| Archaeology | Archaeology | (52.61, 41.82) |
| Architecture | Architecture | (52.61, 41.82) |
| Experience | Experience | (52.61, 41.82) |
| Information | Information | (52.61, 41.82) |
| Accessibility | Accessibility | (52.61, 41.82) |

Each node has 6 position properties, one per state: `pos`, `posAr`, `posArc`, `posExp`, `posInf`, `posAcc`.

### Anchor Point

A single fixed position within the canvas: `(52.61, 41.82)`.

When the active state changes, the corresponding position property is selected for each node, and the entire territory translates until the state's central node sits at the anchor.

### Territory Translation

When a state is activated, the complete cartography translates as a rigid body.

Preserved:

- relative positions between nodes;
- distances;
- visual structure;
- spatial composition.

Not produced:

- reorganization;
- graph recalculation;
- layout generation.

### State Toggle

- Click on a perspective node activates its state.
- Click on the same node again returns to neutral.
- Click on System returns to neutral.
- Click outside any node (in edit mode off) returns to neutral.

### Layout Persistence

The design editor (edit / save / reset buttons) was removed. Only layout loading remains.

- On boot, `loadLayout()` reads the `concept_layout` key from `localStorage`.
- If present, it overwrites each node's six position properties (`pos`, `posAr`, `posArc`, `posExp`, `posInf`, `posAcc`) with the saved values.
- There is currently no UI or API to write layouts back to storage.
- The editor control CSS (`.editor-controls`) still exists in `style.css` but is never instantiated.

### Drag Interaction Model

A physical interaction layer that allows temporary perturbation of the conceptual territory.

**Core principle:**

> The territory can be manipulated, but its underlying structure remains stable.

The user can grab any node and move it freely. The graph does not reorganize. Only spatial positions change temporarily. The node naturally returns to its original position after release.

**Lifecycle:**

```
Resting
   ↓
Dragging
   ↓
Released
   ↓
Floating
   ↓
Returning
   ↓
Resting
```

**States:**

| State | Behavior |
|-------|----------|
| Resting | Default state. Node at its conceptual position. |
| Dragging | Node follows cursor. Connected edges deform. |
| Floating | After release, node drifts with residual impulse. Slow autonomous oscillations. |
| Returning | Spring physics pull node back to origin. Slow start, accelerates, decelerates near target. |

**Parameters:**

| Parameter | Value | Description |
|-----------|-------|-------------|
| `DRAG_THRESHOLD` | 4px | Movement before click becomes drag |
| `FRICTION` | 0.94 | Velocity decay during floating |
| `RETURN_ACCEL` | 0.03 | Spring acceleration toward origin |
| `RETURN_DAMPING` | 0.065 | Velocity damping during return |
| `RETURN_SNAP` | 0.15 | Offset threshold that snaps the node back to rest |
| `FLOAT_AMPLITUDE` | 2.0 | Oscillation amplitude during floating |
| `FLOAT_SPEED` | 0.4 | Frequency of the drift oscillation while floating |
| `IMPULSE_FACTOR` | 0.3 | Velocity multiplier on release |
| `BORDER_ZONE` | 0.15 | 15% viewport margin for border resistance |
| `MAX_VELOCITY_PCT` | 0.04 | Max release velocity as % of viewport |

**Border resistance:**

Nodes cannot leave the viewport. A proportional resistance zone (15% from each edge) dampens movement near borders. The closer to the edge, the stronger the resistance.

**Return physics:**

Uses a discrete spring model (not exponential decay). The node starts slow, accelerates toward origin, and decelerates smoothly near the target. No oscillation, no bounce.

**Separation from navigation:**

Drag interaction is independent from navigation states. Dragging does not change `activeState`, does not move nodes to the anchor, does not modify the conceptual hierarchy. It is a purely physical interaction layer.

**Multiple node interaction:**

The user can temporarily perturb several nodes simultaneously. Each node independently follows its own lifecycle. The system can exist in a temporarily disturbed state before returning to equilibrium.

### Fundamental Principle

> Navigation modifies the observer's perspective, not the territory's structure.

---

# 3. Visual Model

## Responsibility

Determines how the current system state is visually represented.

Does not know the meaning of concepts. Only interprets states and applies visual rules.

## Components

### Typography

Four typographic layers. All nodes use `var(--text-primary)`. No semantic color coding, badges, or icons.

| Layer | font-size | font-weight | letter-spacing |
|-------|-----------|-------------|----------------|
| 1 | clamp(1.6rem, 2.4vw, 2.8rem) | 600 | 0.08em |
| 2 | clamp(1.3rem, 1.6vw, 1.8rem) | 500 | 0.06em |
| 3 | clamp(1.1rem, 1.3vw, 1.5rem) | 450 | 0.05em |
| 4 | clamp(0.95rem, 1.0vw, 1.3rem) | 400 | 0.04em |

### Opacity

Expresses conceptual depth. Does not represent categories or states.

Base opacity varies by layer, with a sinusoidal pulse derived from each node's hash.

| Layer | Base opacity | Pulse amplitude |
|-------|-------------|-----------------|
| 1 | 1.0 | 0.0 |
| 2 | 0.90 | 0.04 |
| 3 | 0.75 | 0.06 |
| 4 | 0.55 | 0.08 |

Pulse frequency: `0.15 + (hash % 25) / 100`. Phase derived from node hash.

### Edges (SVG)

45 directed edges rendered as SVG lines. Opacity and stroke-width are determined by the minimum layer of the two connected nodes.

| Min layer | stroke-width | opacity |
|-----------|-------------|---------|
| 1 | 1.6 | 0.45 |
| 2 | 1.2 | 0.32 |
| 3 | 1.0 | 0.24 |
| 4 | 0.8 | 0.16 |

Edge color: `var(--line-idle)`. Line cap: round. CSS transition: opacity 0.6s ease.

Connection strength is calculated per edge:
- Structural nodes (System, Archaeology, Architecture): strength 1.0
- Articulation nodes (Information, Experience, Accessibility): strength 0.8
- All others: strength 0.6

### Hover

Reveals local structure.

- **Hovered node**: full opacity (1.0).
- **Directly connected nodes**: opacity preserved, boosted by connection strength (`base * (1 + 0.35 * strength)`).
- **All other nodes**: opacity reduced to 25% of base.
- **Connected edges**: opacity increased (`baseOp + 0.35 * strength`, max 0.9).
- **Unconnected edges**: opacity reduced to 20% of base.

Hover effects only apply when no state is active and not in edit mode.

### Animations

**Position interpolation:**
- Exponential lerp toward target position.
- Speed: 0.015 (neutral) / 0.015 (active state).

**Float (sinusoidal offset):**
- Amplitude per node derived from hash: `ax = 2 + (hash % 5)`, `ay = 3 + ((hash >> 4) % 6)`.
- Frequency: `fx = 0.2 + (hash % 40) / 100`, `fy = 0.25 + ((hash >> 4) % 45) / 100`.
- Phase: `px = (hash % 628) / 100`, `py = ((hash >> 8) % 628) / 100`.
- Reduced to 30% amplitude during active state.

**Opacity pulse:**
- Sinusoidal modulation: `base + amplitude * sin(t * freq + phase)`.
- Parameters derived from node hash.

**CSS transitions:**
- Node opacity: 0.5s ease.
- Node color: 0.5s ease.
- Edge opacity: 0.6s ease.

**Noise overlay:**
- Canvas 2D Value Noise (256×256, cell size 16px).
- Bilinear interpolation with Hermite smoothing.
- Applied as tiled background on a fixed div.
- `mix-blend-mode: multiply`, opacity 0.06.
- `pointer-events: none`, z-index 10000.

### Fundamental Principle

> The Visual Model decides how the cartography looks, never what it means.

---

# 4. Content Model

## Responsibility

Connects the cartography with the portfolio.

Each node can act as an entry point to related content.

Content does not belong to the graph. It belongs to the portfolio. The cartography only serves as an access interface.

## Possible Components

- Descriptions
- Projects
- Articles
- Research
- Internal links
- External resources

## Status

Not yet implemented. This model is reserved for future integration.

### Fundamental Principle

> The Content Model extends the cartography, but does not modify its conceptual structure.

---

# Relationship Between Models

The four models form independent layers.

```
Conceptual Model
        │
        ▼
Navigation Model
        │
        ▼
Visual Model
        │
        ▼
Render
```

The Content Model remains decoupled and connects only when a node requires displaying additional information.

This architecture prevents unnecessary dependencies between meaning, navigation, and representation.

---

# Architectural Principles

## 1. Separation of Responsibilities

Each model has a single, clearly defined responsibility.

## 2. Single Conceptual Territory

There is one graph. No territory variants. Connections never depend on active state.

## 3. Perspective-Based Navigation

Changing state does not modify the territory. Only changes the perspective from which it is observed.

## 4. Spatial Persistence

The cartography maintains a single spatial organization. Navigation never rebuilds the map. Only translates the ensemble to position the selected node at a fixed point.

## 5. Representation Does Not Alter Meaning

Visual hierarchy, animations, opacity, and interaction effects are reading mechanisms. They are not part of the conceptual structure.

## 6. Three Independent Layers (Implementation)

1. **Conceptual Structure** — the graph itself (WORDS + CONNECTIONS)
2. **Navigation State** — current active concept (`activeState`)
3. **Visual Behavior** — opacity, emphasis, hover states, animations

The graph exists once. States interpret it. Visual systems reveal it.

---

# Removed Concepts

**Structure**, **Production**, and **Technology** were intentionally removed from the cartography. Do not reintroduce.

---

# Current Development Stage

## Stage 1 — Conceptual Sandbox / Cartographic Definition

The project is in an exploratory phase. The main objective is defining a coherent conceptual cartography with meaningful semantic relationships and perspective-based reorganizations.

**First version of the conceptual network is complete.** The full cartography with 15 nodes, 45 connections, 6 perspective states, drag interaction, border resistance, and spring-based return physics is functional and documented.

The project was refactored into an importable library (`cartography`): `createCartography({ container, config })` with a `destroy()` method, split into `config.js`, `data/`, `state.js`, `interaction.js`, and `visual.js`. It is integrated as an atmospheric hero layer in the portfolio web app.

Current focus:

- movement language
- interaction softness
- spatial rhythm
- perspective behavior
- typographic presence
- atmospheric balance
- conceptual coherence
- emotional tone

Not yet focused on:

- full implementation
- production architecture
- complete UX flows
- responsive refinement
- accessibility polish
- final integration

## Design Philosophy

The system should communicate: **thought in motion**.

Interaction should feel: organic, calm, breathable, spatial, relational, atmospheric, alive but restrained.

Composition should prioritize: negative space.

Motion should feel: slow, ambient, and almost biological.

The system should never feel: aggressive, flashy, highly reactive, over-animated, chaotic, overly technical, gamified.

## Strategic Direction

The cartography is NOT intended to fully replace the portfolio architecture.

Preferred direction: **Cartographic Layer** — the cartography becomes a conceptual and atmospheric layer integrated into the portfolio rather than the entire interface structure.

The portfolio remains navigable, readable, stable, professional.

The cartography introduces: conceptual depth, spatial interaction, perspective reading, systems-oriented identity.

## Integration Criteria

The cartography should only begin partial integration once:

- behavioral consistency exists
- interaction language stabilizes
- spatial logic becomes clear
- perspective coherence is defined
- atmospheric identity feels coherent
- movement principles stop changing drastically

Key indicator: the process shifts from discovery to refinement — calibration, rhythm adjustment, subtle refinement, consistency, tuning — rather than searching for entirely different directions.

## Planned Integration Points

- Atmospheric hero section
- Background cartographic layer
- Subtle conceptual transitions
- Section-responsive perspective behavior
- Partial spatial interaction

The cartography should initially function as: infrastructure, presence, and atmosphere. NOT as the primary navigational mechanism.

---

# Project Overview

This cartography is part of a personal UX/UI portfolio.

The portfolio itself is the primary product. The cartography functions as an interpretive layer that reveals how the author thinks about systems, design, research, architecture, and human structures.

Portfolio positioning: *"Understanding systems before designing interfaces."*

The project originates from a trajectory combining:

- Fine Arts / Public Art
- Institutional analysis / Community-oriented work
- UX/UI / Information Architecture
- QA thinking

The portfolio communicates:

- systems thinking
- relational structures
- human complexity
- contextual analysis
- symbolic and technological dimensions
- editorial clarity
- organic interaction

---

# Technical Stack

| | |
|---|---|
| **Stack** | Vite + vanilla JS (no frameworks) — importable library (`cartography`) |
| **Font** | Inter (200–700) via Google Fonts |
| **Library API** | `createCartography({ container, config? })` → `{ nodeMap, lineEls, words, config, destroy }` |
| **Exports** | `defaults`, `WORDS`, `CONNECTIONS`, `STATE_NODES` |
| **Styles** | `src/style.css` — exported as `cartography/style.css` |
| **Noise** | Canvas 2D Value Noise (256×256), multiply blend, opacity 0.06 |
| **Render** | `requestAnimationFrame` loop |
| **Data** | `WORDS[]` (15 nodes, 6 positions each), `CONNECTIONS[]` (45 edges) |

### File Structure

```
src/
├── index.js           — library entry: createCartography() + exports
├── config.js          — defaults (anchor, drag physics, typography, opacity, edges)
├── data/
│   ├── index.js       — data barrel
│   ├── nodes.js       — WORDS (15 nodes × 6 positions), noise, float params, loadLayout
│   ├── edges.js       — CONNECTIONS (45 edges), adjacency list, connection strength
│   └── stateNodes.js  — STATE_NODES (5 perspectives)
├── state.js           — Navigation Model (activeState, getTargetPos, resize handling)
├── interaction.js     — Drag + Hover + state clicks
├── visual.js          — Visual Model (DOM build, animation loop, edges, opacity)
└── style.css          — styles (exported as cartography/style.css)

demo/
├── index.html         — dev entry (vite root: demo/)
└── main.js            — boots createCartography
```

### Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview build
```

---

# Pending

- **Responsive behavior** (≤768px): not yet defined. Currently reduces opacity of secondary nodes in neutral state and hides the tagline.
- **Content Model**: not yet implemented.
