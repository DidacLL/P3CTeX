# P3CTeX

```
   ________________________________________________________
  |///////////// PROCRASTRINAR ES LA UNICA ESPERANZA //////|
  |                                                      |/|
  | ██████╗ ███████╗ ██████╗   ████████╗███████╗██╗  ██╗ |/|
  | ██╔══██╗██╔════╝██╔════╝   ╚══██╔══╝██╔════╝╚██╗██╔╝ |/|
  | ██████╔╝█████╗  ██║           ██║   █████╗   ╚███╔╝  |/|
  | ██╔═══╝ ██╔══╝  ██║           ██║   ██╔══╝   ██╔██╗  |/|
  | ██║     ███████╗╚██████╗  ██╗ ██║   ███████╗██╔╝ ██╗ |/|
  | ╚═╝     ╚══════╝ ╚═════╝  ╚═╝ ╚═╝   ╚══════╝╚═╝  ╚═╝ |/|
  |       --   ULTIMATE UOC Template Generator   --      |/|
  |    PEC.TeX is an Open Source LaTeX repository        |/|
  |    based on official LaTeX styles defined by UOC.    |/|
  |    Designed for fastest and convenient lastminute    |/|
  |    performance on PAC or PR overkilling.             |/|
  |                                         PEC.TeX v0.1 |//
  |____________________________________________By ScVr!a_|/ 
```

---

## What is LaTeX?

**LaTeX** is a high-quality typesetting system widely used in academia for producing scientific and technical documents — theses, papers, reports, and coursework. Rather than a visual WYSIWYG editor, LaTeX uses a markup language: you write structured content and commands in plain text, and the compiler generates formatted PDF output. This approach ensures consistent typography, proper handling of mathematical notation, cross-references, citations, and bibliographies. LaTeX excels at producing publication-ready documents and is the de facto standard in computer science, mathematics, and engineering.

---

## Repository Structure

```
P3CTeX/
├── tex/
│   ├── latex/          # .cls and .sty files (document class + packages)
│   ├── code/           # expl3 internals (.code.tex)
│   ├── doc/            # Package manuals (LaTeX source)
│   ├── examples/       # Example documents
│   └── tests/          # Regression test suites + gate runners
├── workflow/           # Agentic development workflow documentation
├── scripts/            # Build utilities
├── LICENSE             # GPL v3
└── README.md
```

---

## User Guide

### Installation & Local Setup

Recommended configuration: **MiKTeX** (LaTeX distribution) + **IDE** (VS Code / TeXworks / TeXstudio).

#### 1. Install MiKTeX

1. Download MiKTeX from [miktex.org](https://miktex.org/download).
2. Run the installer and choose **Install for all users** or **Install just for me**.
3. Ensure **Install missing packages on-the-fly** is enabled (default).
4. Complete the installation and (if prompted) refresh the environment.

#### 2. Clone the P3CTeX repository

```bash
git clone https://github.com/DidacLL/P3CTeX.git
cd P3CTeX
```

Save the full path to the repository root (e.g. `C:\Users\<you>\P3CTeX` or `~/P3CTeX`).

#### 3. Register P3CTeX with MiKTeX

The repository follows the **TDS (TeX Directory Structure)**: classes and packages live under `tex/latex/`, and auxiliary code under `tex/code/`. To make MiKTeX find them:

**Option A — MiKTeX Console (recommended)**

1. Open **MiKTeX Console** (Start menu or `miktex-console`).
2. Go to **Settings** → **Directories**.
3. Click **Add** and select the **root of the cloned repository** (the folder that contains `tex/`).
4. Click **Apply** and refresh the filename database.

**Option B — Command line (`initexmf`)**

```bash
initexmf --register-root="/path/to/P3CTeX"
initexmf --update-fndb
```

Replace `/path/to/P3CTeX` with your actual repository path.

**Option C — Per-document (portable use)**

If you prefer not to register a global root, add the repo to the input path when compiling:

```bash
pdflatex --include-directory="<repo>/tex/latex" --include-directory="<repo>/tex/code" your-document.tex
```

Or set the `TEXINPUTS` environment variable before building:

```bash
# Unix / macOS
export TEXINPUTS="<repo>/tex/latex//<repo>/tex/code//:$TEXINPUTS"

# Windows PowerShell
$env:TEXINPUTS = "<repo>\tex\latex//;<repo>\tex\code//;$env:TEXINPUTS"
```

#### 4. IDE Configuration

| IDE           | Setup |
|---------------|-------|
| **VS Code**   | Install the *LaTeX Workshop* extension; add the repo paths to `latex-workshop.latex.search.rootFiles` / custom build recipe with `--include-directory` if needed. |
| **TeXstudio** | **Options → Configure TeXstudio → Build** → add `--include-directory` flags for `tex/latex` and `tex/code` to the `pdflatex` command. |
| **TeXworks**  | Configure via the command-line options above or a custom build script. |

#### 5. Verify the Installation

Create a minimal document `test.tex`:

```latex
\documentclass{P3CTeX}
\PECTeXconfig{cover,toc,default}
\begin{document}
Hello from P3CTeX.
\end{document}
```

Then compile:

```bash
pdflatex test.tex
```

If the PDF is generated without errors, the setup is correct.

**Troubleshooting:** If you see errors like `File 'P3CTeX.code.tex' not found`, the auxiliary code in `tex/code/` is not on the search path. Use **Option C** (per-document) with both `tex/latex` and `tex/code`, or set `TEXINPUTS` to include them before building.

---

### Arquitectura bàsica

- **Classe de document `P3CTeX.cls`**: defineix el comportament global del
  document (format, metadades de l'estudiant/assignatura, idiomes) i
  proporciona la interfície d'usuari principal per als estudiants de la UOC.
- **Paquet nucli `pxCORE.sty`**: centralitza el càrrega de paquets externs
  i l'activació de biblioteques independents mitjançant la família de claus
  `pxCORE` (per exemple, `UML`, `PRP`, ...). Les classes de document només
  parlen amb les biblioteques a través de `pxCORE`.
- **Biblioteques independents `px*.sty`** (com `pxPRP`, `pxUML`, `pxSRC`, `pxTAB`):
  ofereixen funcionalitats específiques (mapes de propietats, UML, sources,
  taules, etc.) amb una API pública LaTeX2e i, quan cal, una implementació interna
  basada en `expl3` als fitxers `*.code.tex`.

### Paquets disponibles

| Paquet | Descripció |
|--------|-----------|
| `P3CTeX.cls` | Classe de document principal |
| `pxCORE.sty` | Nucli de càrrega i configuració |
| `pxGDX.sty` | Sistema de disseny (colors corporatius, tipografia) |
| `pxPRP.sty` | Mapes de propietats |
| `pxUML.sty` | Diagrames UML |
| `pxSRC.sty` | Llistats de codi font |
| `pxTAB.sty` | Taules des de dades amb estils predefinits i presets |

### Documentació dels paquets

Els manuals (font LaTeX) viuen a `tex/doc/`:

| Manual | Contingut |
|--------|-----------|
| `tex/doc/P3CTeX.tex` | Classe de document |
| `tex/doc/P3CTeX-architecture.tex` | Arquitectura interna |
| `tex/doc/pxCORE.tex` | Paquet nucli |
| `tex/doc/pxGDX.tex` | Sistema de disseny |
| `tex/doc/pxPRP.tex` | Mapes de propietats |
| `tex/doc/pxUML.tex` | Diagrames UML |
| `tex/doc/pxSRC.tex` | Llistats de codi font |
| `tex/doc/pxTAB.tex` | Taules |

Un document d'exemple complet es troba a `tex/examples/P3CTeX-example.tex` (PDF precompilat a l'arrel: `P3CTeX-example.pdf`).

---

## Contributing

### Development Environment

1. Clone the repository and register it with your TeX distribution (see [User Guide](#user-guide) above).
2. Ensure `pdflatex` is available on your `PATH`.
3. **PowerShell** is required for running test gate scripts on Windows.

### Repository Conventions

- **English** for all in-code comments and identifiers.
- **Catalan** is used for documentation text and user-facing manual content where appropriate.
- All expl3 internals live in `.code.tex` files; user-facing commands stay in `.sty`/`.cls` files.
- One logical concern per commit; features must be independently revertible.

### Testing

Each package has a dedicated test suite under `tex/tests/`. Gate runner scripts validate all tests:

```bash
# Run pxTAB tests (from tex/ directory)
powershell -File tests/run-pxTAB-tests.ps1

# Build documentation (from tex/ directory, with TEXINPUTS=.;./latex;./code)
pdflatex -interaction=nonstopmode doc/pxTAB.tex

# Build example document (from tex/examples/)
pdflatex -interaction=nonstopmode P3CTeX-example.tex
```

All tests must pass before merging any changes. See the [quality gates](workflow/P3CTeX_development_workflow.md#6-quality-gates-non-negotiable) in the workflow document for the full list of acceptance criteria.

### Agentic Development Workflow

This project uses a **multi-agent AI-assisted development workflow** designed to work with any LLM-based coding assistant (Cursor, Copilot, Aider, or similar). The workflow structures package development into five sequential phases — **Design → Implementation → Testing → Documentation → Integration** — coordinated by an orchestrator agent that maintains a shared plan file and enforces quality gates at every phase boundary.

The approach is **model-agnostic**: it relies on structured prompts, frozen design specifications, and deterministic gate scripts rather than any specific LLM capability. Any contributor (human or AI-assisted) can follow the same workflow.

**Key principles:**

- **Separation of concerns** — design is frozen before implementation begins; tests exist before documentation references them.
- **Quality gates** — test suite, documentation build, example build, backward compatibility, and opt-in checks must all pass before sign-off.
- **Small change surface** — one feature per commit, independently revertible, with compilation checks after every macro edit.
- **Institutional memory** — bugs, root causes, and fix patterns are recorded in the memorandum to prevent recurrence.

**Workflow documentation** (in `workflow/`):

| Document | Purpose |
|----------|---------|
| [`P3CTeX_development_workflow.md`](workflow/P3CTeX_development_workflow.md) | Complete workflow definition: phases, agent roles, prompt templates, quality gates, lessons learned, runbook and plan-file templates |
| [`pxtab_agentic_doc.md`](workflow/pxtab_agentic_doc.md) | Token-optimised agent reference for pxTAB: file map, public API, key catalogue, data pipeline, internal architecture, testing infrastructure, gotchas |
| [`pxtab_memorandum.md`](workflow/pxtab_memorandum.md) | Institutional memory: full development timeline, bug catalogue with root causes, fix patterns, known limitations, do-not-repeat list, and prioritised backlog |

To start a new development sprint, copy the plan-file template from [`P3CTeX_development_workflow.md` §10](workflow/P3CTeX_development_workflow.md) and follow the orchestrator protocol in §4.

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
