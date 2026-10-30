# P3CTeX Website Visual Asset Catalog & AI Generation Prompts

**Document ID**: `P3CTEX-IMAGE-PROMPTS-V1`  
**Target Milestone**: Phase 0 Web & Offline Tooling Architecture  
**Design Reference**: [DidacLL/AAAAT Workshop Aesthetic](https://github.com/DidacLL/AAAAT)  
**Primary Engine Targets**: DALL-E 3, Midjourney v6, Google Imagen 3

---

## 1. Aesthetic Foundations & Style Guidelines

All visual assets across the P3CTeX documentation and generator tool share a coherent visual identity rooted in the craft of academic scientific typesetting:

- **Color Palette Tokens**:
  - **UOC Deep Primary Indigo**: `#000078` (`rgb(0, 0, 120)`)
  - **Vibrant Cyan Accent**: `#73edff` (`rgb(115, 237, 255)`)
  - **Oxford Academic Blue**: `#1d4ed8`
  - **TeX Seal Crimson**: `#be123c`
  - **Canvas Deep Slate**: `#0f172a`
  - **Parchment Surface**: `#f8fafc`
- **Artistic Influences**:
  - Clean vector technical schematics combined with warm analog craftsmanship (DidacLL's AAAAT workshop theme).
  - Isometric drafting grids, blueprint guidelines, golden ratio spirals, and mathematical notation.
  - Studio product lighting, crisp borders, high contrast, zero blurry text, matte finish.
- **Tone**:
  - Precise, authoritative, intellectual, encouraging, and developer-friendly.

---

## 2. Complete Visual Asset Inventory

| Slot ID | Placement Target | Recommended Aspect Ratio | Dimensions | Category |
|---|---|---|---|---|
| `IMG-HERO-01` | `index.html` (Hero Masthead) | 21:9 | 2048 × 878 | Primary Editorial Artwork |
| `IMG-BRAND-02` | `index.html` (Quickstart / Brand) | 3:1 | 1800 × 600 | Brand Identity & OpenGraph Banner |
| `IMG-PACPR-03` | `tutorials.html` (Preamble Hierarchy) | 16:9 | 1920 × 1080 | Academic Workflow Schematic |
| `IMG-CALC-04` | `showcases.html` (pxCALC Showcase) | 16:9 | 1600 × 900 | Mathematical Engine Infographic |
| `IMG-CMP-05` | `showcases.html` (pxCMP Showcase) | 16:9 | 1600 × 900 | Computer Science Architecture |
| `IMG-MEM-06` | `showcases.html` (pxMEM Showcase) | 16:9 | 1600 × 900 | Document Architecture & Memory |
| `IMG-SRC-07` | `showcases.html` (pxSRC Showcase) | 16:9 | 1600 × 900 | Resilient Figure Typesetting |
| `IMG-LST-08` | `showcases.html` (pxLST Showcase) | 16:9 | 1600 × 900 | Codebox Theme Comparison |
| `IMG-TAB-09` | `showcases.html` (pxTAB Showcase) | 16:9 | 1600 × 900 | Tabular Data Typography |
| `IMG-UML-10` | `showcases.html` (pxUML Showcase) | 16:9 | 1600 × 900 | Object-Oriented Software Modeling |
| `IMG-GEN-11` | `generator.html` (Tool Preview) | 16:10 | 1920 × 1200 | Web Application UI Mockup |
| `IMG-DOC-12` | `tutorials.html` (Setup & Installation) | 16:9 | 1600 × 900 | Toolchain & Workflow Infographic |

---

## 3. Detailed Slot Specifications & Generative Prompts

### Slot 1: IMG-HERO-01
- **Placement**: `index.html` (Hero Masthead Section)
- **Target Dimensions**: 2048 × 878 px (Aspect Ratio: 21:9)
- **Concept**: The Explorer Robot's LaTeX Workshop
- **Generative Prompt**:
> Wide panoramic banner illustration in warm analog retro-futuristic workshop style, inspired by classic technical encyclopedias and DidacLL's AAAAT workshop aesthetic. A friendly brass-and-copper explorer robot sitting at a warm wooden architect desk in an academic library, carefully sorting handwritten mathematical proofs and compiling glowing LaTeX documents. Technical blueprint lines in deep UOC indigo (#000078) and cyan (#73edff) floating faintly in the air. Soft ambient lighting, analog paper grain texture, high detail, 8k resolution, aspect ratio 21:9.

---

### Slot 2: IMG-BRAND-02
- **Placement**: `index.html` (Brand Identity & Quickstart Section)
- **Target Dimensions**: 1800 × 600 px (Aspect Ratio: 3:1)
- **Concept**: P3CTeX Brand Logo & Masthead Banner
- **Generative Prompt**:
> Wide architectural header banner (3:1 aspect ratio) for an advanced academic LaTeX typesetting suite named P3CTeX. Minimalist blueprint style on deep slate navy (#0f172a). Intricate geometric drafting lines, subtle golden ratio spirals, Greek mathematical symbols (\pi, \sum, \int), and delicate typographical guide grids. Clean vector aesthetic, high-contrast crisp ivory accents, subtle Cambridge blue gradient glow, modern scientific elegance, pristine editorial quality.

---

### Slot 3: IMG-PACPR-03
- **Placement**: `tutorials.html` (Continuous Assessment vs Final Report Workflow)
- **Target Dimensions**: 1920 × 1080 px (Aspect Ratio: 16:9)
- **Concept**: Continuous Assessment vs Practical Project Report
- **Generative Prompt**:
> Clean isometric technical workflow diagram comparing two academic document paths. On the left side: a lightweight "PAC" continuous assessment paper stream (single column, automatic anti-plagiarism header, streamlined Catalan typography). On the right side: a comprehensive "PR" formal practical report with an elegant dark blue geometric title cover, table of contents, and modular annexes. Isometric schematic style, blueprint grid background, crisp labels, clean vector art, UOC color palette (navy, cyan, slate gray), studio lighting.

---

### Slot 4: IMG-CALC-04
- **Placement**: `showcases.html` (pxCALC Worked Calculations)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Reusable Worked Calculation Engine
- **Generative Prompt**:
> Elegant infographic of an automated mathematical calculation engine. Showing physical variables (Voltage, Resistance, Capacitance) flowing into structured formula blocks, transforming through algebraic substitution stages, and outputting formatted scientific numbers with SI units (volts, ohms). Technical schematic styling, clean minimal layout, deep blue background with glowing cyan and gold highlight paths, crisp vector typography.

---

### Slot 5: IMG-CMP-05
- **Placement**: `showcases.html` (pxCMP Computation Diagrams)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Compiler Pipelines & State Automata
- **Generative Prompt**:
> Modern academic engineering illustration of compiler architecture and formal language tools. Showing interlocking Tombstone T-diagram pieces for compilers and interpreters docking seamlessly together, flanked by a pristine finite state automaton graph with directed transition arrows and a clean binary syntax parse tree. Floating glowing nodes, blueprint aesthetic, clean white and dark slate accents, high precision vector style, matte finish.

---

### Slot 6: IMG-MEM-06
- **Placement**: `showcases.html` (pxMEM Memory Chapters)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Thesis & Report Memory Architecture
- **Generative Prompt**:
> A publication showcase of a complete university bachelor or master thesis (TFG/TFM) produced with LaTeX. Multiple printed document pages fanned out in an elegant arc: an official university cover page with crest, an executive summary with evaluation rubrics, chapter headings, and detailed appendices. Photorealistic editorial mockup, clean studio lighting, soft shadows.

---

### Slot 7: IMG-SRC-07
- **Placement**: `showcases.html` (pxSRC Safe Figures)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Robust Image & Placeholder Inserter
- **Generative Prompt**:
> Concept art showing a bulletproof image container in academic typesetting: a resilient fallback placeholder card with dimensions and title preventing document compilation errors. Side-by-side with an elegant figure paired comparison. Isometric perspective, deep navy blue blueprint background, subtle cyan grid lines, warm ivory highlights.

---

### Slot 8: IMG-LST-08
- **Placement**: `showcases.html` (pxLST Code Listings)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Darcula Codebox Themes Showcase
- **Generative Prompt**:
> Side-by-side comparison of three professional code listing window frames with rounded corners and subtle drop shadows. Left window: Darcula dark theme with vibrant syntax highlighting. Center window: Elegant pastel theme. Right window: Clean high-contrast light theme. Code displays Java, Python, and C snippets with line numbers and file badges. Studio product render, floating perspective, 4k resolution.

---

### Slot 9: IMG-TAB-09
- **Placement**: `showcases.html` (pxTAB Branded Tables)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: List-Driven Table Styles Matrix
- **Generative Prompt**:
> An artistic visualization of scientific tabular data typesetting. Elegant publication-grade academic tables with horizontal booktabs rules, numeric alignment, and alternating subtle row shading. Hovering translucent data points and precision grid lines. Minimalist Swiss graphic design influence, high contrast, crisp typography, clean white and slate gray palette.

---

### Slot 10: IMG-UML-10
- **Placement**: `showcases.html` (pxUML Class Diagrams)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Object-Oriented Class & Sequence Model
- **Generative Prompt**:
> Clean architectural diagram of an object-oriented software system. Showing floating UML class blocks connected by crisp inheritance arrows and aggregation diamonds. Deep slate background with vibrant blue and cyan borders, sharp typography, minimalist engineering style, 16:9 aspect ratio.

---

### Slot 11: IMG-GEN-11
- **Placement**: `generator.html` (Interactive Tool UI Concept)
- **Target Dimensions**: 1920 × 1200 px (Aspect Ratio: 16:10)
- **Concept**: Interactive Generator Live Preview Mockup
- **Generative Prompt**:
> Isometric perspective mockup of a modern web application for generating LaTeX documents. Left side displays clean toggle switches, metadata input fields, and package cards. Right side shows a glowing real-time LaTeX code editor window with active syntax coloring and one-click copy and download buttons. Sleek modern desktop browser frame, dark and light mode harmony, subtle drop shadow, tech product photography aesthetic.

---

### Slot 12: IMG-DOC-12
- **Placement**: `tutorials.html` (Setup & Installation)
- **Target Dimensions**: 1600 × 900 px (Aspect Ratio: 16:9)
- **Concept**: Zero-Friction TeX Toolchain Setup
- **Generative Prompt**:
> Clean educational architectural diagram of an academic developer toolchain. An elegant glass drafting table showing interconnected software icons: MiKTeX, VS Code with LaTeX Workshop extension, terminal compiling with pdflatex, and a finished academic paper with crystal-clear vector diagrams and Arev fonts emerging smoothly. High-tech isometric vector artwork, deep navy and cyan glowing accent lines, soft lighting, 16:9 aspect ratio.
