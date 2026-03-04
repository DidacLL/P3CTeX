# pxLST Foundation Sprint — Technical Memorandum

> **Audience:** AI agents resuming work on pxLST or the P3CTeX ecosystem.
> **Purpose:** Sprint retrospective — problems, decisions, discoveries. Token-aware.
> **Sprint date:** 2026-03-04. **Result:** 5/5 quality gates passed.

---

## 1 Sprint Scope

Created `pxLST` from scratch: a tcolorbox+listings package with Darcula palette, 4 styles, 7 languages, preset system, and pxCORE opt-in integration. No prior pxLST files existed; zero backward-compatibility constraints on the new package.

**Files created:** `pxLST.sty`, `pxLST.code.tex`, `pxLST.tex` (doc), 7 test files, 2 fixtures, 1 test runner, design spec, sign-off report.
**Files modified:** `pxCORE.code.tex` (5 lines, additive), `P3CTeX-example.tex` (57 lines, section appended).

---

## 2 Critical Problems Encountered & Solutions

### P1 — `listings` does not expand macros in option values
**Symptom:** `! Package Listings Error: language pxJava undefined` even though `\lstdefinelanguage{pxJava}` was defined.
**Root cause:** `\lstset{language=\pxlst@lang@v}` passes the **token** `\pxlst@lang@v` to `listings`, not the **string** `pxJava`. The listings package does not expand the macro before looking up the language name.
**Failed approach:** Passing `language=\pxlst@lang@v` via `\tcbset{listing options={language=\pxlst@lang@v}}` — same problem; tcolorbox ultimately calls `\lstset` with the unexpanded token.
**Solution:** `\__pxlst_apply_lstset:` uses `\edef` to fully expand the display macros into a literal `\lstset{language=pxJava,...}` call, then executes that call. `basicstyle` is passed in a separate `\lstset` call (unexpanded token list) since it contains unexpandable `\footnotesize\linespread{...}\ttfamily`.

**Pattern (memorise this):**
```latex
\edef\pxlst@callbuf{
  \noexpand\lstset{language=\pxlst@lang@v, style=\pxlst@lstyle@v, ...}
}
\pxlst@callbuf
\lstset{basicstyle=\pxlst@basicstyle@v}
```

### P2 — `listing only` collapses to `listingonly` in expl3 mode
**Symptom:** `! Package pgfkeys Error: I do not know the key '/tcb/listingonly'`.
**Root cause:** `\ProvidesExplPackage` sets space to catcode 9 (ignored) for the entire `.sty` file. Multi-word tcolorbox keys in `\newtcblisting` options lose their spaces: `listing only` → `listingonly`.
**Solution:** Use `~` (tilde) instead of spaces in all multi-word TCB key names inside `.sty` files: `listing~only`, `drop~lifted~shadow`, `outer~arc`, `title~after~break`, `listing~and~comment`, `comment~outside~listing`, `listing~above~comment`.
**Note:** This applies EVERYWHERE in the `.sty` file after `\ProvidesExplPackage`, not just in `\newtcblisting`.

### P3 — `.code n args={1}{...}` is not a valid PGF handler
**Symptom:** `Fatal error occurred` at the closing `}` of the `\tcbset{pxlst@configure/.code n args={1}{...}}` block.
**Root cause:** The PGF key handler `.code n args` does not exist. The correct handlers are `.code` (1 arg, `#1` = value), `.code 2 args` (2 args), etc. There is no generic `.code n args={n}{...}` form.
**Solution:** Use `/.code={...}` for single-argument handlers. The argument is `#1`.

### P4 — `\bfseries:` is an undefined control sequence in expl3 literate maps
**Symptom:** `Undefined control sequence` with message showing `\bfseries:`.
**Root cause:** In expl3 mode (when `pxLST.code.tex` is processed), `:` is catcode 11 (letter). In `\lstdefinelanguage{pxProlog}` literate entries like `{:-}{{\color{darcula-keyword}\bfseries:-\color{darcula-fg}}}2`, the `:` after `\bfseries` is absorbed into the command name → `\bfseries:` (undefined).
**Solution:** Add `{}` terminator: `\bfseries{}:-`. Applies to any control word immediately followed by `:` in literate replacement strings inside `.code.tex`.
**Affected entries in pxLST:** pxProlog `{:-}` and pxTAD `{:}` literals.

### P5 — `\pxlst@*@v` macros inaccessible inside `\ExplSyntaxOn` without `\makeatletter`
**Symptom:** `Undefined control sequence \pxlst` inside a test probe harness that uses `\ExplSyntaxOn`.
**Root cause:** In normal `.tex` documents, `@` is catcode 12 (other). Inside `\ExplSyntaxOn`, this doesn't change (`\ExplSyntaxOn` never touches `@`). So `\pxlst@lstyle@v` is tokenized as `\pxlst` (stops at `@`) + `@` + `lstyle@v` → `\pxlst` is undefined.
**Solution:** Always use `\makeatletter` BEFORE `\ExplSyntaxOn` when accessing `@`-containing macros, and `\makeatother` AFTER `\ExplSyntaxOff`.
```latex
\makeatletter
\ExplSyntaxOn
  ... \pxlst@lstyle@v ...  % now accessible
\ExplSyntaxOff
\makeatother
```

### P6 — `upquote` package causes `\textquotedbl unavailable in encoding OT1`
**Symptom:** All 7 test files failed with `! LaTeX Error: Command \textquotedbl unavailable in encoding OT1` triggered by any `"` character in listing content.
**Root cause:** The `upquote` package was added to `pxLST.sty` to support `upquote=true` in `pxBash`/`pxYAML` language definitions. The `upquote` package requires T1 font encoding; with OT1 (LaTeX default), it fails on any straight double quote.
**Solution:** Remove `\RequirePackage{upquote}` from `pxLST.sty`. Remove `upquote=true` from all `\lstdefinelanguage` entries. The visual difference (curly vs straight quotes) is cosmetic and not worth the encoding dependency.
**Decision:** Do NOT add `upquote` as a pxLST dependency. If users need it, they load it themselves with T1 encoding.

---

## 3 Key Architectural Decisions

### D1 — Two-stage dynamic option dispatch (the `pxlst@configure` + `\__pxlst_apply_lstset:` pattern)

**The challenge:** `\newtcblisting` is required for verbatim environments (no alternative). But `\newtcblisting` options are fixed at definition time — you cannot easily pass dynamic values at use time without expansion tricks.

**Options considered:**
A) Use `listing options = {language=\pxlst@lang@v}` in TCB — fails (no expansion by listings).
B) Use `\tcbset` before the environment — timing problem (can't inject before verbatim scan).
C) Define a `.code` key that calls `\tcbset` in-place — ✅ works.
D) Use `\lstset` before the environment (global) — messy, no scoping.

**Chosen:** C + `\edef` for expansion. The `.code` handler runs during tcolorbox option processing. The inner `\tcbset` in step 2 overrides the current box's options. The `\edef`-expanded `\lstset` in step 3 sets listing options with literal strings.

### D2 — `\def` (not `\gdef`) for display macros

The `\pxlst@*@v` macros are set via `\def` (group-scoped) in `\__pxlst_set_style_vars:`. This enables automatic scope isolation: local environment options revert at `\end{pxCode}` without explicit save/restore logic.

### D3 — `\l_*` local variables for all pxLST state

Following expl3 convention. `\pxLSTsetup` at document level is "effectively global" because it's called outside any group. Inside an environment, the local variables restore automatically. No `\g_*` globals needed for display state.

### D4 — `pxCodeBox` label convention: `cdbx:<label>` not `lst:<label>`

The tcolorbox title bar inserts `\label{cdbx:#2}` where `#2` is the label argument. This is a baked-in convention. Cross-references must use `\ref{cdbx:mybox}`. Document this prominently — it is non-obvious and causes confusion.

### D5 — Removed `upquote`, kept `listingsutf8`

The `listingsutf8` library is sufficient for UTF-8 input handling in listings. The `upquote` package was removed as a hard dependency (P6). The "First Aid for listings.sty no longer applied!" message that MiKTeX emits is informational only — not an error. Ignore it.

### D6 — Language literate maps: keep per-language accent maps for Prolog/TAD/algoritme

Some languages (pxProlog, pxTAD, algoritme) have their own per-language literate maps that duplicate the global UTF-8 map. This redundancy is intentional: per-language maps take precedence over global, ensuring consistency when a user redefines the global literate.

---

## 4 Key Discoveries (non-obvious, save time for future agents)

### E1 — expl3 `@` catcode: `.sty` files vs. document files

In a `.sty` file processed by `\ProvidesExplPackage`, `@` retains catcode 11 (letter) because LaTeX's `\makeatletter` is in effect during `\usepackage` processing. So `\def\pxlst@colback@v{...}` in `.sty`/`.code.tex` files correctly defines the full `@`-containing name.

In user `.tex` documents, `@` is catcode 12 unless `\makeatletter` is called. Inside `\ExplSyntaxOn` in a user document, `@` is STILL catcode 12 (expl3 does not change `@`). Therefore: `\pxlst@lstyle@v` → tokenized as `\pxlst` + `@` + `lstyle@v` → broken.

**Rule:** Any user document code that references `\pxlst@*@v` macros (e.g., probe harnesses) must wrap with `\makeatletter`/`\makeatother`.

### E2 — The `@` catcode in `.code.tex` specifically

`pxLST.code.tex` is loaded via `\file_input:n{pxLST.code.tex}` from within `pxLST.sty`. Since LaTeX processes `.sty` files with `@` as letter (catcode 11) and `\file_input:n` reads the file with current catcodes, `@` IS a letter in `.code.tex`. The `\def\pxlst@colback@v{...}` entries correctly define the full `@`-name.

This is different from a standalone `.tex` file where `@` is catcode 12.

### E3 — `\tcbset` inside `.code` handler: in-place box override

When tcolorbox processes `\begin{pxCode}[style=light]{label}`:
1. Options are parsed: `pxlst@configure={style=light}` fires its `.code` handler.
2. Inside the handler, `\tcbset{colback=white,...}` updates the **current box's** options.
3. The rest of the box options (arc, drop lifted shadow, etc.) from `\newtcblisting` are then processed.

The result: `colback=white` overrides the default for THIS box only. After `\end{pxCode}`, the global `\pxlst@colback@v` has reverted to `darcula-bg!90!` (via `\def` inside the group → group-scoped restore).

This is the fundamental correctness mechanism. Do not break it by using `\gdef` for display macros.

### E4 — PGF handler taxonomy (prevent repetition of P3)

| Handler | Arg count | Syntax |
|---------|-----------|--------|
| `.code` | 1 (`#1`) | `key/.code={body using #1}` |
| `.code 2 args` | 2 (`#1`,`#2`) | `key/.code 2 args={body using #1 and #2}` |
| `.value required` | — | marker, no code |
| `.default` | — | sets default value |

There is NO `.code n args={N}{body}` handler in PGF. This was invented/hallucinated during initial generation.

### E5 — Forward references in TCB `.code` handlers are safe

`\tcbset{pxlst@configure/.code={... \pxLST_set_options:n {#1} ...}}` stores the body as a token list at definition time. `\pxLST_set_options:n` does not need to exist yet. It will be defined later in `.code.tex`. This is safe because `.code` bodies are executed at use time (when `\begin{pxCode}[...]` is processed), by which time the full `.code.tex` has been loaded.

### E6 — "First Aid for listings.sty no longer applied!" is harmless

MiKTeX emits this message when loading `listingsutf8`. It is an informational notice that a compatibility patch is no longer needed (listings and listingsutf8 are now compatible without it). It is NOT an error or warning. Safe to ignore in logs.

### E7 — expl3 space handling in `.sty` files is pervasive

After `\ProvidesExplPackage`, EVERY space in the file is catcode 9 (ignored). This affects:
- `\newtcblisting{...}` option strings: multi-word keys MUST use `~`
- Content values (like title text `\textbf{...}`) are NOT affected by ignored spaces if they don't rely on inter-token spaces in command sequences (they mostly don't)
- BUT: `\small\hspace*{...}` in a title — the space between `\small` and `\hspace*` is normally a command-terminating space; with catcode 9 it's ignored, but since `\small` is a letter-sequence command and ends naturally at `\hspace`, this is fine

The main danger is ONLY multi-word KEY NAMES in tcolorbox/pgfkeys option parsing.

---

## 5 Test Probe Architecture

The `pxLST.styles.test.tex` probe pattern is the model for future pxLST diagnostic tests:

```latex
\makeatletter
\ExplSyntaxOn
% (1) Add a bool to control probe activation
\bool_new:N \g__pxlst_test_probe_bool
\cs_new_protected:Npn \__pxlst_test_probe_on:
  { \bool_gset_true:N \g__pxlst_test_probe_bool }
\cs_new_protected:Npn \__pxlst_test_probe_off:
  { \bool_gset_false:N \g__pxlst_test_probe_bool }
% (2) Save original function
\cs_new_eq:NN \__pxlst_apply_lstset_orig: \__pxlst_apply_lstset:
% (3) Replace with instrumented version
\cs_set_protected:Npn \__pxlst_apply_lstset: {
  \bool_if:NT \g__pxlst_test_probe_bool {
    \iow_term:x { PXLST_ASSERT:STYLE=\pxlst@lstyle@v }
    \iow_term:x { PXLST_ASSERT:COLBACK=\pxlst@colback@v }
    ... more assertions ...
  }
  \__pxlst_apply_lstset_orig:  % always call original
}
\ExplSyntaxOff
\makeatother
```

Turn on/off with:
```latex
\makeatletter\ExplSyntaxOn\__pxlst_test_probe_on:\ExplSyntaxOff\makeatother
```

Assertions are parsed from the `.log` file by the test runner or manually verified.

---

## 6 What NOT to Do (Anti-Patterns)

| Anti-Pattern | Why it Fails | What to do Instead |
|---|---|---|
| `\lstset{language=\myMacro}` | Listings doesn't expand macros | `\edef\buf{\noexpand\lstset{language=\myMacro}}\buf` |
| `listing only` in `.sty` expl3 block | Space is catcode 9 → `listingonly` | `listing~only` |
| `/.code n args={1}{body}` in `\tcbset` | PGF handler doesn't exist | `/.code={body}` |
| `\bfseries:` in literate text in `.code.tex` | `:` is letter in expl3; `\bfseries:` is one (undefined) cs | `\bfseries{}:` |
| `\RequirePackage{upquote}` without T1 fontenc | `\textquotedbl` unavailable in OT1 | Remove upquote from package; user loads T1 if needed |
| `\ExplSyntaxOn` + `\pxlst@lstyle@v` without `\makeatletter` | `@` is catcode 12; `\pxlst` is not the full macro name | Wrap with `\makeatletter`/`\makeatother` |
| Using `\gdef` for `\pxlst@*@v` display macros | Global → no scope isolation for local environment options | Use `\def` (group-scoped) |
| Passing `\basicstyle=\pxlst@basicstyle@v` inside `\edef` block | `\footnotesize`, `\linespread` are unexpandable → edef fails | Separate `\lstset{basicstyle=\pxlst@basicstyle@v}` call |
| `\ref{lst:mybox}` for pxCodeBox cross-ref | pxCodeBox inserts `\label{cdbx:mybox}` | `\ref{cdbx:mybox}` |

---

## 7 Quality Gate Results (for history)

| Gate | Test | Result | Notes |
|------|------|--------|-------|
| 1 — Test | `run-pxLST-tests.ps1` | 7/7 PASS | After 3 fix iterations (P1-P6) |
| 2 — Doc | `pdflatex doc/pxLST.tex` | 12 pp, exit 0 | First attempt passed |
| 3 — Example | `pdflatex P3CTeX-example.tex` | 15 pp, exit 0 | First attempt passed |
| 4 — Backward compat | `run-pxTAB-tests.ps1` | 8/8 PASS | pxCORE edit was additive-only |
| 5 — Opt-in | `pxLST-optin-gate.tex` | GATE5:PASS | `\l_pxcore_lst_use_bool = false` confirmed |

---

## 8 Future Sprint Hooks

When extending pxLST, the recommended insertion points:

| Feature | Where to Add |
|---------|-------------|
| New language `pxSQL` | `pxLST.code.tex` after the 7th language definition |
| New style `monokai` | `pxLST.code.tex`: add `\lstdefinestyle{pxlst@monokai}` + new case in `\__pxlst_set_style_vars:` |
| Minted backend | Parallel `.code.tex` function `\__pxlst_apply_minted_opts:` + `backend` key in `\keys_define:nn{pxLST}` |
| New pxCORE module (e.g. pxANX) | Follow the TAB/LST pattern exactly in `pxCORE.code.tex` |
| Dedicated `listing` float counter | Add `\newfloat{listing}{htbp}{lol}` guard in `pxLST.sty` after `\ProcessKeysOptions` |
| More keywords for existing language | `\lstdefinelanguage{pxJava}[Custom]{pxJava}{ morekeywords={...} }` (dialect pattern) |

---

*End of memorandum.*
