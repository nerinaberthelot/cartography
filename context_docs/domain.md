# Domain Data

Source of truth for nodes, connections, and positions. Refer to `architecture.md` for behavioral rules.

---

## Nodes

| ID | Text | Layer | Perspective | Role |
|----|------|-------|-------------|------|
| system | System | 1 | — | Hub articulador entre comprensión y construcción de sistemas |
| archaeology | Archaeology | 2 | archaeology | Lente interpretativa: investigación y comprensión |
| architecture | Architecture | 2 | architecture | Lente interpretativa: construcción y configuración |
| information | Information | 3 | both | Nodo relacional central: investigado, contextualizado, interpretado y organizado |
| experience | Experience | 3 | both | Nodo puente: comprensión a través de la interacción vivida |
| accessibility | Accessibility | 3 | both | Nodo articulador: organiza la participación en el sistema |
| narrative | Narrative | 4 | archaeology | Comprensión de sistemas existentes |
| community | Community | 4 | archaeology | Dimensión social |
| research | Research | 4 | archaeology | Indagación |
| context | Context | 4 | archaeology | Condiciones del sistema |
| user | User | 4 | archaeology | Destinatario |
| flow | Flow | 4 | architecture | Dinámicas del sistema — emerge de la organización pero lo moldea la experiencia |
| interface | Interface | 4 | architecture | Punto de contacto |
| quality | Quality | 4 | architecture | Métrica transversal en la construcción de sistemas |
| design | Design | 4 | architecture | Configuración intencional de sistemas |

---

## Connections

45 directed edges. The graph is global — it does not depend on active state.

- **Central edges**: System ↔ Archaeology, System ↔ Architecture (central: true)
- **Archaeology →**: Narrative, Research, Context, Community, User, Information
- **Architecture →**: Information, Flow, Interface, Quality, Design
- **Information →**: Research, Context, User, Interface
- **Flow →**: User, Quality, Experience, Interface, Design
- **Community →**: Narrative, Context, User
- **Narrative →**: Context
- **Experience →**: Design, User, Context, Narrative
- **Quality →**: Experience
- **Design →**: Accessibility, Interface
- **Interface →**: User, Narrative
- **Research →**: User, Experience, Context
- **Accessibility →**: User, Context, Information, Interface, Experience, Quality, Community

---

## Position States

Each node has 6 position properties. All states share the same anchor point: `(52.61, 41.82)`.

| State (activeState) | Position property | Central node |
|---------------------|-------------------|-------------|
| Neutral (`null`) | `pos` | System |
| Archaeology | `posAr` | Archaeology |
| Architecture | `posArc` | Architecture |
| Experience | `posExp` | Experience |
| Information | `posInf` | Information |
| Accessibility | `posAcc` | Accessibility |

---

## Territories (emerging conceptual reading)

### Understanding Existing Systems
Archaeology, Research, Context, Community, Narrative, User

### Articulating Systems
System, Information, Experience, Accessibility

### Shaping Systems
Architecture, Flow, Interface, Design, Quality

This territorial reading is conceptual guidance. Do not force visual clustering.
