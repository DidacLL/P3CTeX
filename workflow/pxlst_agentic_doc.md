# pxLST — Agent Reference (truthful)

> **Purpose**: single-source context for AI agents working on **the current**
> `pxLST` implementation in this repository.
>
> **Last updated**: 2026-03-16

## 1 Reality check (important)

- **All behavior is implemented in** `tex/latex/pxLST.sty`.
- `tex/code/pxLST.code.tex` is currently a **stub** (it contains only `\endinput`).
- This means any documentation claiming that internals (keys/presets/probe) live in `.code.tex` is **out of date**.

## 2 File map (current)

| File | Role |
|------|------|
| `tex/latex/pxLST.sty` | package implementation + public API |
| `tex/code/pxLST.code.tex` | stub (reserved for future split) |
| `tex/examples/P3CTeX-example.tex` | end-user showcase (uses `Code`/`CODE`/`CodeBox` etc.) |
| `tex/tests/run-pxLST-tests.ps1` | quality gate runner (PowerShell) |
| `tex/tests/pxLST*.test.tex` | regression tests aligned to the real API |
| `tex/tests/sample.java`, `tex/tests/sample.yaml` | fixtures for `\pxLSTinput` |

## 3 Public API (stable contract)

### 3.1 Configuration command

- **`\pxLSTsetup[<palette>]{<language>}[<lststyle>]`**
  - **`<palette>`**: palette name, default `dark` (built-ins: `dark`, `pastel`, `light`).
  - **`<language>`**: a `listings` language name (e.g. `pxJava`, `pxYAML`).
  - **`<lststyle>`**: a `listings` style name, default `pxlst` (package ships `pxlst`, `block`, `framed`, `plain`).
  - **Scoping**: normal TeX scoping (group-local if called inside a group).

### 3.2 Environments (verbatim)

All are implemented via `\newtcblisting` (verbatim-safe):

- **`Code`**: `\begin{Code}[<listing options>]{<title>} ... \end{Code}`
- **`CODE`**: same signature as `Code` (kept for compatibility / convenience)
- **`miniCode`**: `\begin{miniCode}[<width>] ... \end{miniCode}`
- **`CodeBox`**: `\begin{CodeBox}[<listing options>]{<id>}{<title>}{<tag>}{<caption>} ...`
  - Inserts `\label{cdbx:<id>}` in the title bar; refer with `\ref{cdbx:<id>}`.
- **`CodeBox*`**: same signature as `CodeBox` but **breakable** (page-spanning).

### 3.3 Commands

- **`\pxLSTinput[<language>]{<file>}`**: typeset an external file in a framed tcolorbox listing.
- **`\pxCodeInline[<language>]{<snippet>}`**: inline snippet using `\lstinline` in a small tcbox.
  - Not verbatim; special chars must be escaped normally.

## 4 Palette/color model (three-macro design)

- Palette selection is implemented by three explicit macros:
  - `\pxLSTpaletteDark`
  - `\pxLSTpalettePastel`
  - `\pxLSTpaletteLight`
- Each palette macro simply `\def`s the role commands and helper values:
  - role commands: `\pxDEFlstbg`, `\pxDEFlstfg`, `\pxDEFlstkeyword`, `\pxDEFlststring`,
    `\pxDEFlsttag`, `\pxDEFlstcomment`, `\pxDEFlstnumber`, `\pxDEFlsttype`,
    `\pxDEFlstfunction`, `\pxDEFlstoperator`
  - helper “value” macros used inside styles and frames:
    `\pxDEFlstbgv`, `\pxDEFlstfgv`, `\pxDEFlstnumberv`,
    `\pxDEFlstnumbervFifty`, `\pxDEFlstfgvFifty`, `\pxDEFlstfgvSeventyFive`
- The public entry point **`\pxLSTsetup[<palette>]{...}`** is the only supported way
  to choose a palette. Internally it dispatches to one of the palette macros above
  and then calls `\lstset{language=<language>, style=<lststyle>}`.
- **Guardrail** for future work: do **not** reintroduce expl3 tl-driven palette
  selection, dynamic string expansion, or `.code.tex` indirection layers for
  colors. New palettes must be implemented as additional `\pxLSTpalette...`
  macros that just `\def` the same `\pxDEFlst...` family with literal xcolor
  names.

## 5 Quality gate commands (deterministic)

From `tex/` (PowerShell):

```powershell
# run all pxLST tests
.\tests\run-pxLST-tests.ps1

# build the example (from tex/examples/)
cd .\examples
$env:TEXINPUTS=".;../latex;../code;"
pdflatex -halt-on-error -interaction=nonstopmode P3CTeX-example.tex
```

