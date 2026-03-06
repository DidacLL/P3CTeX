# pxLST — Agent Reference

> **Purpose**: Single-source context for AI agents working on pxLST or authoring documents with it.
> Read this instead of the full source. Compact, complete, token-aware.
> **Last updated:** 2026-03-04 (v0.1 Foundation + Inline & Annex Sprint)

---

## 1 Overview

pxLST provides professional code listing environments for P3CTeX documents.
Core features: Darcula-themed syntax highlighting via `listings`, 4 visual style renderers, 7 pre-defined languages (including Catalan pseudocode), a named preset system, UTF-8 accent support, and `tcolorbox` framing.

All public commands live in `pxLST.sty`; all expl3 internals and colour/language/style definitions live in `pxLST.code.tex`.
The central design challenge (solved): tcolorbox verbatim environments need all option values **fully resolved at environment-open time** — macros referencing expl3 variables are NOT expanded by `listings`. Solution: the `pxlst@configure` PGF key + `\__pxlst_apply_lstset:` (see §9).

---

## 2 File Map

| File | Role |
|------|------|
| `tex/latex/pxLST.sty` | Package loader + LaTeX2e public API (3 envs + 4 commands) + P3CTeX branded preset registration |
| `tex/code/pxLST.code.tex` | Expl3 internals: keys, Darcula colours, display macros, lstset baseline, 4 style defs, 7 language defs, renderers, preset system, `pxlst@configure` TCB key, probe |
| `tex/doc/pxLST.tex` | User manual (12 pp, pdflatex, T1 fontenc, uses pxLST directly) |
| `tex/examples/P3CTeX-example.tex` | Example document — §8 demonstrates pxLST (Java dark, algoritme framed, YAML light, Bash plain) |
| `tex/tests/pxLST.test.tex` | Main regression (10 scenarios: envs, global config, local scope, file input, unknow key) |
| `tex/tests/pxLST.languages.test.tex` | All 7 language definitions + accent rendering |
| `tex/tests/pxLST.styles.test.tex` | All 4 style renderers + probe harness (PXLST_ASSERT: log tokens) |
| `tex/tests/pxLST.presets.test.tex` | Preset save/use roundtrip, 3 built-in presets, unknown-preset warning |
| `tex/tests/pxLST.package-option.test.tex` | Load-time `\usepackage[key=val]{pxLST}` options |
| `tex/tests/pxLST.float.test.tex` | pxCodeBox/pxCodeBreak with labels, cross-refs (`\ref{cdbx:<label>}`) |
| `tex/tests/pxLST.file-input.test.tex` | `\pxLSTinput` with Java and YAML fixtures |
| `tex/tests/run-pxLST-tests.ps1` | PowerShell gate runner (all 7 tests, exit 0 = pass) |
| `tex/tests/sample.java` | Test fixture: Fibonacci class (12 lines) |
| `tex/tests/sample.yaml` | Test fixture: P3CTeX config YAML (5 lines) |

---

## 3 Public API

### 3.1 Commands

| Command | Signature | Purpose |
|---------|-----------|---------|
| `\pxLSTsetup` | `{key=val,...}` | Set keys globally or within group |
| `\pxLSTsavepreset` | `{name}{keys}` | Store a named option bundle |
| `\pxLSTusepreset` | `{name}` | Apply a stored preset |
| `\pxLSTinput` | `[opts]{filename}` | Input external file as listing |
| `\pxList` | `[opts]{item1,item2,...}` | Inline list + optional collection for annex (clist) |
| `\pxListItems` | `[opts]{i1}{i2}...` | Same; up to 8 items (trailing `{}` for fewer); items may contain commas |
| `\pxCodeInline` | `[opts]{s1}{s2}...` | Inline code snippets + optional collection; up to 8 (trailing `{}`); not verbatim |
| `\printPxListAnnex` | `[opts]` | Output collected list items at call site (keys: `annex-id`, `title`) |
| `\printPxCodeAnnex` | `[opts]` | Output collected code snippets at call site (keys: `annex-id`, `title`) |

**Naming:** The **pxCode environment** (`\begin{pxCode}...\end{pxCode}`) is unchanged. The new inline/annex code command is **\pxCodeInline** (design doc referred to it as `\pxCode`; name avoids clashing with the environment). Full spec: `workflow/pxlst-inline-annex-design.md`; user manual §5: inline list and code, and annex.

### 3.2 Environments

| Environment | Arguments | Purpose |
|-------------|-----------|---------|
| `pxCode` | `[opts]{label}` | Simple inline listing; title bar shows `label` |
| `pxCodeBox` | `[opts]{label}{title}{note}{caption}` | Listing + right comment panel + label |
| `pxCodeBreak` | `[opts]{label}{title}{note}{caption}` | Same as pxCodeBox but forces `breakable=true` |

**Cross-reference note:** `pxCodeBox` and `pxCodeBreak` insert `\label{cdbx:<label>}`. Reference with `\ref{cdbx:<label>}`, NOT `\ref{lst:<label>}`.

**Verbatim constraint:** `pxCode`, `pxCodeBox`, `pxCodeBreak` are defined via `\newtcblisting` (not `\NewDocumentEnvironment`) because they contain verbatim content. This is non-negotiable.

---

## 4 Key Family (`pxLST`)

Set via `\pxLSTsetup{...}`, per-environment `[options]`, or `preset=<name>`.

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `style` | tl | `dark` | Visual renderer: `dark` \| `framed` \| `light` \| `plain` |
| `language` | tl | `pxJava` | Any `\lstdefinelanguage` name |
| `numbers` | tl | `left` | Line-number side: `left` \| `right` \| `none` |
| `caption` | tl | `` | Caption text (stored; NOT auto-float) |
| `label` | tl | `` | Cross-ref label string (without prefix) |
| `float` | tl | `` | Float placement (empty = inline) |
| `breakable` | bool | `true` | tcolorbox page-break; forced true in pxCodeBreak |
| `fontsize` | tl | `\footnotesize` | Font size command in basicstyle |
| `linespread` | tl | `1.2` | `\linespread` factor in basicstyle |
| `tabsize` | int | `4` | Tab width in spaces |
| `preset` | code | — | Apply named preset via `\pxLST_use_preset:n` |
| `probe` | bool | `false` | Emit `PXLST_ASSERT:` diagnostic log lines |
| `unknown` | code=`{}` | — | Silently ignores unrecognised keys |
| `collect` | bool | `true` | If true, append to annex collection; if false, inline only (list/code annex) |
| `annex-id` | tl | `` | Scope name for annex; empty = default (document-wide) |
| `scope` | tl | `document` | Reserved (per-document only in v1) |
| `title` | tl | `` | Optional section title for `\printPxListAnnex` / `\printPxCodeAnnex` |

**Scope:** All `\l_pxlst_*` variables are **local** (expl3 convention). `\pxLSTsetup` at document level is effectively global. Inside a `pxCode` environment group, local options revert after `\end{pxCode}`.

---

## 5 Darcula Colour Palette

Defined in `pxLST.code.tex` via `\definecolor{darcula-*}{RGB}{...}`.

| Name | RGB | Use |
|------|-----|-----|
| `darcula-bg` | 40, 44, 52 | Background (dark/framed styles) |
| `darcula-fg` | 255, 255, 255 | Default text |
| `darcula-keyword` | 240, 150, 20 | Keywords |
| `darcula-string` | 152, 195, 121 | String literals |
| `darcula-tag` | 80, 250, 180 | Annotations, tags |
| `darcula-comment` | 97, 200, 190 | Comments |
| `darcula-number` | 210, 210, 210 | Numbers |
| `darcula-type` | 102, 153, 204 | Types |
| `darcula-function` | 207, 138, 255 | Function names |
| `darcula-operator` | 255, 192, 144 | Operators, delimiters |

These colours are available to document authors as soon as `pxLST` is loaded (they live in global xcolor namespace).

---

## 6 Style Renderers

Each `style=<name>` value selects a combination of tcolorbox appearance and lstdefinestyle.

| Style | colback | colframe | coltext | lstdefinestyle |
|-------|---------|----------|---------|----------------|
| `dark` | `darcula-bg!90!` | `darcula-bg!60!` | `darcula-fg` | `pxlst@dark` |
| `framed` | `darcula-bg!90!` | `darcula-comment!60!` | `darcula-fg` | `pxlst@framed` |
| `light` | `white` | `gray!25!` | `black` | `pxlst@light` |
| `plain` | `white` | `gray!15!` | `black` | `pxlst@plain` |

**lstdefinestyle mapping:**
- `pxlst@dark` / `pxlst@framed`: full Darcula syntax colours; `pxlst@framed` adds `frame=leftline, rulecolor=\color{darcula-comment}`.
- `pxlst@light`: Darcula tones at 70-80% mixed with black for readability on white.
- `pxlst@plain`: monochrome; `commentstyle=\itshape\color{gray!70!black}`, everything else black, `numbers=none`.

**Display macros** (set by `\__pxlst_set_style_vars:`, used by `pxlst@configure`):

| Macro | Typical values |
|-------|---------------|
| `\pxlst@colback@v` | `darcula-bg!90!` / `white` |
| `\pxlst@colframe@v` | varies by style |
| `\pxlst@coltext@v` | `darcula-fg` / `black` |
| `\pxlst@lstyle@v` | `pxlst@dark` etc. |
| `\pxlst@lang@v` | `pxJava` etc. |
| `\pxlst@numbers@v` | `left` / `right` / `none` |
| `\pxlst@tabsize@v` | `4` etc. |
| `\pxlst@basicstyle@v` | `\footnotesize\linespread{1.2}\ttfamily` |

These are **regular LaTeX2e macros** (not expl3 tl variables), set via `\def` (group-scoped) or `\edef`. They exist so that tcolorbox can reference them by name in option values.

---

## 7 Language Definitions

All defined via `\lstdefinelanguage` in `pxLST.code.tex`. The **global `\lstset` baseline** (also in `.code.tex`) sets `inputencoding=utf8`, `extendedchars=true`, `breaklines=true`, and a full literate map for accented characters.

| Language | Base | Keyword levels | Notable |
|----------|------|----------------|---------|
| `pxJava` | Java | KW1=types+modifiers, KW2=common methods | `moredelim=[l][\itshape\color{darcula-tag}]{@}` for annotations |
| `pxProlog` | Prolog | KW3=functions | Custom literate for `(` `)` `.` `,` `:-` `<` `>` with Darcula colors |
| `pxOWL` | — | KW1=OWL Manchester keywords, KW3=`rdf,owl` | `morecomment=[l]{\#\ }`, custom `:` `.` literate |
| `pxTAD` | — | KW1=control, KW2=ADT constructs, KW3=empty | `morecomment=[l]{//}`, custom `.` `,` `:` `<` `>` literate |
| `pxYAML` | — | KW1=`true,false,null,yes,no` | `sensitive=false`, custom `:` `,` `[` `]` `>` `|` literate |
| `algoritme` | — | KW1=Catalan control keywords | Math symbol literate: `{<--}→$\leftarrow$`, `{<=}→$\leq$`, `{*}→$\times$`, etc. |
| `pxBash` | bash | — | `columns=flexible`; inherits global UTF-8 literate |

**UTF-8 literate map** (global `\lstset`): covers acute/grave/umlaut/circumflex on `a-z A-Z`, plus `ç Ç ñ Ñ ¿ ¡`. pxProlog, pxTAD, algoritme include per-language duplicates for safety.

**Literate pitfall in expl3 source:** `:` is catcode 11 (letter) in expl3 mode. A control sequence like `\bfseries:` would be tokenized as a single (undefined) cs. Use `\bfseries{}:` to prevent `:` from being absorbed into the preceding command name.

---

## 8 Preset System

**Storage:** `\l_pxlst_presets_prop` — local property list (effective scope = current group or document level).

**Internal API:**
- `\pxLST_save_preset:nn {name}{keys}` — stores preset
- `\pxLST_use_preset:n {name}` — retrieves via `\prop_get:NnNTF`, then calls `\exp_args:NV \pxLST_set_options:n`
- Unknown preset: emits `pxLST warning: Unknown preset '<name>'` (non-fatal)

**Override semantics:** Keys after `preset=` in the same option list override preset values (standard l3keys left-to-right). E.g., `\pxLSTsetup{preset=darcula, language=pxBash}` uses darcula's style/numbers but language=pxBash.

**Built-in presets (always available):**

| Preset | Bundle |
|--------|--------|
| `darcula` | `style=dark, language=pxJava, numbers=left, breakable=true` |
| `minimal` | `style=plain, language=pxJava, numbers=none` |
| `academic` | `style=light, language=pxJava, numbers=left, fontsize=\small` |

**P3CTeX branded presets** (registered only when `\documentclass{P3CTeX}` is loaded):

| Preset | Bundle |
|--------|--------|
| `p3c-code` | `style=dark, language=pxJava, numbers=left, breakable=true` |
| `p3c-alg` | `style=framed, language=algoritme, numbers=left, breakable=false` |
| `p3c-plain` | `style=plain, language=pxJava, numbers=none, breakable=false` |

Detection via `\@ifclassloaded{P3CTeX}` in `pxLST.sty`, before `\ProcessKeysOptions`.

---

## 9 Environment Mechanism (Critical Design)

This section explains the dynamic option dispatch system — essential background for anyone modifying pxLST.

### 9.1 The Problem

`\newtcblisting{pxCode}[2][]{ language=\pxlst@lang@v, ... }` **does not work**: the `listings` package does not expand `\pxlst@lang@v` — it tries to find a language literally named `\pxlst@lang@v`.

### 9.2 The Solution: Two-Stage Dispatch

**Stage 1 — `pxlst@configure` PGF key** (defined in `.code.tex` via `\tcbset`):

```
pxlst@configure/.code={
  (1) \tl_if_blank:nF {#1} { \pxLST_set_options:n {#1} }
  (2) \tcbset{ colback=\pxlst@colback@v, colframe=..., coltext=... }
  (3) \__pxlst_apply_lstset:
}
```

Used in every `\newtcblisting`: `pxlst@configure={#1}, listing~only, ...`.

The `\tcbset` inside step (2) overrides the current box's tcolorbox keys in-place. This works because `.code` handlers run during option processing of the box.

**Stage 2 — `\__pxlst_apply_lstset:`** (defined in `.code.tex`):

```
\cs_new_protected:Npn \__pxlst_apply_lstset: {
  \edef \pxlst@callbuf {
    \noexpand\lstset{
      style=\pxlst@lstyle@v,
      language=\pxlst@lang@v,
      numbers=\pxlst@numbers@v,
      tabsize=\pxlst@tabsize@v
    }
  }
  \pxlst@callbuf
  \lstset{basicstyle=\pxlst@basicstyle@v}
}
```

The `\edef` **fully expands** the display macros (`\pxlst@lang@v` → `pxJava`) into a token list, then that token list is executed as `\lstset{language=pxJava,...}` with literal strings. `basicstyle` is passed separately because it contains unexpandable commands (`\footnotesize`, `\linespread`, `\ttfamily`).

### 9.3 Scope Isolation

- `\l_pxlst_*` variables: **local** → automatically restored at `\end{pxCode}` group close.
- `\pxlst@*@v` macros: set via `\def` (not `\gdef`) → group-scoped → restored automatically.
- Result: `\begin{pxCode}[style=light]{label}` does NOT affect the global `style` setting.

### 9.4 `\pxLST_set_options:n` Central Function

```
\pxLST_set_options:n {<options>}
  → \keys_set:nn {pxLST} {<options>}     % set \l_pxlst_* variables
  → \__pxlst_set_style_vars:              % update \pxlst@*@v display macros
  → \__pxlst_probe_emit:                  % emit PXLST_ASSERT: if probe=true
```

Always call `\pxLST_set_options:n` (not `\keys_set:nn` directly) to ensure display macros stay in sync.

---

## 10 pxCORE Integration

| Usage | Effect |
|-------|--------|
| `\usepackage{pxCORE}` | pxLST **not** loaded (`\l_pxcore_lst_use_bool = false` by default) |
| `\usepackage[LST]{pxCORE}` | pxLST loaded |
| `\usepackage[default]{pxCORE}` | ALL modules loaded, including pxLST |
| `\documentclass[fake,default]{P3CTeX}` | pxLST loaded (default includes LST=true) |

Changes made to `tex/code/pxCORE.code.tex`:
- Added `LST .bool_set:N = \l_pxcore_lst_use_bool` with `initial:n=false`
- Extended `default .meta:n` to include `LST=true`
- Added `\bool_if:NT \l_pxcore_lst_use_bool { \RequirePackage{pxLST} }` after TAB block

---

## 11 Testing Infrastructure

**Gate runner:** `tex/tests/run-pxLST-tests.ps1` — sets `TEXINPUTS`, runs all 7 tests twice each, exit 0 = all PASS. Supports `-CleanArtifacts`.

**Build commands** (from `tex/`):
```
# Test gate
& tests\run-pxLST-tests.ps1

# Single test (set TEXINPUTS first)
$env:TEXINPUTS = ".;./latex;./code;./tests;"
pdflatex -halt-on-error -interaction=nonstopmode tests/pxLST.test.tex

# Doc build
$env:TEXINPUTS = ".;./latex;./code;"
pdflatex -halt-on-error -interaction=nonstopmode doc/pxLST.tex

# Example build (from tex/examples/)
$env:TEXINPUTS = ".;../latex;../code;"
pdflatex -halt-on-error -interaction=nonstopmode P3CTeX-example.tex
```

**Probe harness** (used in `pxLST.styles.test.tex`):
Override `\__pxlst_apply_lstset:` to emit `PXLST_ASSERT:STYLE=<x>`, `PXLST_ASSERT:COLBACK=<x>`, etc. to the log.
**Critical:** Must use `\makeatletter` BEFORE `\ExplSyntaxOn` so that `\pxlst@*@v` macros (which contain `@`) are accessible.

```latex
\makeatletter
\ExplSyntaxOn
\cs_new_eq:NN \__pxlst_apply_lstset_orig: \__pxlst_apply_lstset:
\cs_set_protected:Npn \__pxlst_apply_lstset: {
  \iow_term:x { PXLST_ASSERT:STYLE=\pxlst@lstyle@v }
  \__pxlst_apply_lstset_orig:
}
\ExplSyntaxOff
\makeatother
```

**Gate 5 (opt-in)** verification snippet:
```latex
\makeatletter
\ExplSyntaxOn
\bool_if:NTF \l_pxcore_lst_use_bool
  { \iow_term:n { GATE5:LST_LOADED=true } }
  { \iow_term:n { GATE5:LST_LOADED=false } }
\cs_if_exist:NTF \pxCode
  { \iow_term:n { GATE5:FAIL } }
  { \iow_term:n { GATE5:PASS } }
\ExplSyntaxOff
\makeatother
```

---

## 12 Gotchas & Traps

| # | Trap | Detail |
|---|------|--------|
| 1 | **No macro expansion in `\lstset`** | `\lstset{language=\myMacro}` does NOT expand `\myMacro`. Always use `\edef` to pre-expand into a literal string before calling `\lstset`. |
| 2 | **`listing only` collapses in expl3 `.sty`** | In `\ProvidesExplPackage` files, space = catcode 9 (ignored). Multi-word TCB keys need `~`: `listing~only`, `drop~lifted~shadow`, `outer~arc`, `title~after~break`, `listing~and~comment`, `comment~outside~listing`, `listing~above~comment`. |
| 3 | **`.code n args` does not exist in PGF** | The correct handler for a single-argument code key is `.code` (not `.code n args={1}{...}`). `.code 2 args` exists for 2-arg handlers. |
| 4 | **`\bfseries:` in expl3 literate maps** | In expl3 mode, `:` is catcode 11 (letter). In `\lstdefinelanguage{...}` literate entries, `{\bfseries:-\color{darcula-fg}}` is tokenized as `\bfseries:` (undefined cs) + `- \color{darcula-fg}`. Fix: use `\bfseries{}:`. |
| 5 | **`\pxlst@*@v` inaccessible in `\ExplSyntaxOn` without `\makeatletter`** | In user documents, `@` is catcode 12 outside `\makeatletter`. Inside `\ExplSyntaxOn`, `\pxlst@lstyle@v` is tokenized as `\pxlst` + `@` + `lstyle@v`. Always use `\makeatletter`/`\makeatother` around any `\ExplSyntaxOn` block that references these macros. |
| 6 | **`upquote` package + OT1 encoding** | `upquote` requires T1 fontenc. If loaded without it, `\textquotedbl` is unavailable → fatal error when any `"` appears in listing content. Do NOT add `\RequirePackage{upquote}` to pxLST.sty unless T1 is guaranteed. Also remove `upquote=true` from `\lstdefinelanguage` entries. |
| 7 | **`pxlst@configure` is stored, not executed, at definition time** | The `.code` handler is stored when `\tcbset{pxlst@configure/.code={...}}` runs. The functions it references (`\pxLST_set_options:n`, etc.) don't need to exist yet. Safe to define `pxlst@configure` before the functions it calls. |
| 8 | **Cross-ref label prefix** | `pxCodeBox`/`pxCodeBreak` insert `\label{cdbx:<label>}` (not `lst:<label>`). Cross-references must use `\ref{cdbx:mybox}`. This is a **pxLST-specific** convention; document authors must be told. |
| 9 | **`preset` key fires `\pxLST_use_preset:n` which calls `\pxLST_set_options:n`** | If `\pxLST_set_options:n` has NOT been defined yet (forward reference at load time), `\keys_define:nn` stores the body literally and executes it at use time — safe. But if the preset key is used before the preset storage function exists, it will fail. Order in `.code.tex`: define `\pxLST_use_preset:n` BEFORE registering built-in presets. |
| 10 | **P3CTeX branded presets not available in `article` class** | `\pxLSTusepreset{p3c-code}` in an `article` document logs a warning and is a no-op. This is correct behaviour; document it or test for it with `\cs_if_exist:cTF`. |
| 11 | **`\tcbset` inside `.code` handler overrides PER-BOX, not globally** | Calling `\tcbset{colback=white}` inside a `/.code` handler during option processing of a `\begin{pxCode}[style=light]{...}` changes that box's colback only, for the duration of that group. This is the correct and intended behaviour. |
| 12 | **`basicstyle` passed separately from the edef block** | `\footnotesize\linespread{1.2}\ttfamily` contains non-expandable commands. The `\edef` in `\__pxlst_apply_lstset:` would fail if `\noexpand\footnotesize` is missing. Safest: pass `basicstyle` in a separate `\lstset{basicstyle=\pxlst@basicstyle@v}` call where the macro token is passed unexpanded (listings accepts it as a token list). |

---

## 13 Dependency Stack

```
expl3
xparse, l3keys2e
listings
listingsutf8         (UTF-8 input in listings; note: "First Aid no longer applied" is informational, not an error)
xcolor [table]       (Darcula colours + colortbl for tcb)
tcolorbox
  \tcbuselibrary{listings, listingsutf8, breakable, xparse, skins}
```

**NOT included:** `upquote` (OT1 issue), `float` package (not needed; uses tcolorbox anchoring), `amssymb` (math symbols in `algoritme` use standard LaTeX math mode).

---

*End of reference. This document is the single context source for pxLST agent work.*
