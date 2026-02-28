## P3CTeX

Ultimate LaTeX repository for PEC solving at UOC.

---

### What is LaTeX?

**LaTeX** is a high-quality typesetting system widely used in academia for producing scientific and technical documents—theses, papers, reports, and coursework. Rather than a visual WYSIWYG editor, LaTeX uses a markup language: you write structured content and commands in plain text, and the compiler generates formatted PDF output. This approach ensures consistent typography, proper handling of mathematical notation, cross-references, citations, and bibliographies. LaTeX excels at producing publication-ready documents and is the de facto standard in computer science, mathematics, and engineering.

---

### Installation & Local Setup

Recommended configuration: **MiKTeX** (LaTeX distribution) + **IDE** (VS Code / TeXworks / TeXstudio).

#### 1. Install MiKTeX

1. Download MiKTeX from [miktex.org](https://miktex.org/download).
2. Run the installer and choose **Install for all users** or **Install just for me**.
3. Ensure **Install missing packages on-the-fly** is enabled (default).
4. Complete the installation and (if prompted) refresh the environment.

#### 2. Clone the P3CTeX repository

```powershell
git clone https://github.com/DidacLL/P3CTeX.git
cd P3CTeX
```

Save the full path to the repository root (e.g. `C:\Users\<user>\P3CTeX`).

#### 3. Register P3CTeX with MiKTeX

The repository follows the **TDS (TeX Directory Structure)**: classes and packages live under `tex/latex/`, and auxiliary code under `tex/code/`. To make MiKTeX find them:

**Option A — MiKTeX Console (recommended)**

1. Open **MiKTeX Console** (Start menu or `miktex-console`).
2. Go to **Settings** → **Directories**.
3. Click **Add** and select the **root of the cloned repository** (the folder that contains `tex/`).
4. Click **Apply** and refresh the filename database.

**Option B — Command line (`initexmf`)**

```powershell
initexmf --register-root="C:\path\to\P3CTeX"
initexmf --update-fndb
```

Replace `C:\path\to\P3CTeX` with your actual repository path.

**Option C — Per-document (portable use)**

If you prefer not to register a global root, add the repo to the input path when compiling:

```powershell
pdflatex --include-directory="C:\path\to\P3CTeX\tex\latex" --include-directory="C:\path\to\P3CTeX\tex\code" your-document.tex
```

Or set the `TEXINPUTS` environment variable before building:

```powershell
$env:TEXINPUTS = "C:\path\to\P3CTeX\tex\latex//;C:\path\to\P3CTeX\tex\code//;$env:TEXINPUTS"
pdflatex your-document.tex
```

#### 4. IDE configuration


| IDE           | Setup                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VS Code**   | Install the *LaTeX Workshop* extension; add the repo paths to `latex-workshop.latex.search.rootFiles` / custom build recipe with `--include-directory` if needed.                     |
| **TeXstudio** | **Options → Configure TeXstudio → Build** → add `--include-directory="C:\path\to\P3CTeX\tex\latex"` and `--include-directory="C:\path\to\P3CTeX\tex\code"` to the `pdflatex` command. |
| **TeXworks**  | Configure via the command-line options above or a custom build script.                                                                                                                |


#### 5. Verify the installation

Create a minimal document `test.tex`:

```latex
\documentclass{P3CTeX}
\PECTeXconfig{cover,toc,default}
\begin{document}
Hello from P3CTeX.
\end{document}
```

Then compile:

```powershell
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
- **Biblioteques independents `px*.sty`** (com `pxPRP`, `pxUML`, `pxSRC`):
ofereixen funcionalitats específiques (mapes de propietats, UML, sources,
etc.) amb una API pública \LaTeX2e i, quan cal, una implementació interna
basada en `expl3` als fitxers `*.code.tex`.

### Documentació dels paquets

Els manuals (font \LaTeX) viuen a `tex/doc/`:

- `tex/doc/pxGDX.tex`
- `tex/doc/pxPRP.tex`
- `tex/doc/pxUML.tex`
- `tex/doc/pxSRC.tex`
- `tex/doc/P3CTeX-architecture.tex`

