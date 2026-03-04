# pxTAB — Comprehensive Backlog & Institutional Memory

> **Document type:** Institutional memory & development backlog  
> **Package:** pxTAB (part of P3CTeX)  
> **Author:** Auto-generated from 18 development iteration artefacts  
> **Date:** 2026-03-04  
> **Status:** Living document — update after every sprint

---

## 1. Development Timeline

| # | Iteration | Date | Scope | Outcome | Key Files Changed |
|---|-----------|------|-------|---------|-------------------|
| 1 | Initial Implementation | 2026-02 | Package creation: 5 styles (plain, header, striped, boxed, grid), 4 commands (`\pxTable`, `\pxTableFromList`, `\pxTableRow`, `\pxTABsetup`) | **Blocked** — table body not rendering (only first word per row emitted as plain text) | `pxTAB.sty`, `pxTAB.code.tex` |
| 2 | Recursive Debug Recovery | 2026-02 | Multi-agent debugging loop targeting table-body rendering failure | **Resolved** — root cause identified as wrong catcode for `&` alignment token in expl3 context; fixed with `\c_alignment_token` + `\scantokens` re-scanning | `pxTAB.code.tex`, `pxTAB.test.tex` |
| 3 | Plain-Text Hotfix | 2026-02 | Follow-up stabilisation of row-emission path | **Stable** — alignment-token emission strategy hardened | `pxTAB.code.tex` |
| 4 | Refinement Cycle — Iteration 1 | 2026-03-01 | API audit, test hardening (`tabwidth` alias, `align=r`, warning paths, matrix edge cases), user manual (`tex/doc/pxTAB.tex`), pxTAB examples in `P3CTeX-example.tex` | **Signed off** — all tests green, documentation complete | `pxTAB.code.tex`, `pxTAB.sty`, `pxTAB.test.tex`, `pxTAB.package-option.test.tex`, `tex/doc/pxTAB.tex`, `P3CTeX-example.tex` |
| 5 | Refinement Cycle — Iteration 2 | 2026-03-01 | Attempted composed styles (header-boxed, header-grid, header-striped) + centering + dispatch refactor — all in one diff | **Reverted** — expl3 "Illegal parameter number" errors; full rollback to Iteration 1 baseline | *(all changes discarded)* |
| 6 | Post-fix Iteration | 2026-03-02 | Fixed boxed/grid trailing empty-row geometry regression; stabilised terminal rule emission | **Resolved** — reworked tabular emission to controlled inline flow | `pxTAB.code.tex`, `pxTAB.layout-size.test.tex` |
| 7 | Iteration 4 — Design Only | 2026-03-02 | Design pass for composed styles, centering, float wrappers; produced stepwise rollout plan | **Plan approved** — no code changes; specification documents produced | `pxtab-ergonomics-design-iteration4.md`, `pxtab-handy-commands-spec.md` |
| 8 | Iteration 5 — Alignment Bugfix | 2026-03-02 | Fixed `align=l` / `align=r` not taking effect | **Resolved** — root cause: `\str_case:nnF` does not expand its first argument; fix: `\str_case:xnF` with `\tl_to_str:N` | `pxTAB.code.tex`, `pxTAB.align-bug.test.tex` |
| 9 | Refinement Multi-Agent | 2026-03-02 | Implemented centering key + float wrapper (`caption`, `label`, `float` keys) per stepwise rollout plan | **Signed off** — all features working, tests passing | `pxTAB.code.tex`, `pxTAB.sty`, `pxTAB.test.tex` |
| 10 | Composed Styles | 2026-03-02 | Added header-boxed, header-grid, header-striped styles (one commit per style) | **Signed off** — all 8 styles operational | `pxTAB.code.tex`, `pxTAB.test.tex`, `pxTAB.style-probe.test.tex` |
| 11 | Last Sprint | 2026-03-03 | Fixed striped background gaps; added paragraph-cell mode (`cellmode`, `paragraphcells`, `paragraphcoltype` keys); refactored `\pxTableMatrix` to shared pipeline | **Signed off** — final stabilisation complete | `pxTAB.code.tex`, `pxTAB.sty`, `pxTAB.test.tex`, `pxTAB.layout-size.test.tex`, `pxTAB.style-probe.test.tex`, `tex/doc/pxTAB.tex` |
| 12 | Refinement Sprint | 2026-03-04 | Ergonomic presets (`\pxTABsavepreset`/`\pxTABusepreset`/`preset` key, 3 built-in + 5 P3CTeX branded), pxTBL integration (3 functions renamed to `\__pxtab_pxtbl_*`, variables properly declared, `\pxTBLtop` partially routed through shared infra), documentation completion (13 keys documented, 5 defaults fixed), `altrowbgcolor` typo fix (`blue!15gray`→`blue!5`), `emit_cell` expansion bugfix | **Signed off** — all 8 tests green, documentation 24pp, example 14pp | `pxTAB.code.tex`, `pxTAB.sty`, `tex/doc/pxTAB.tex`, `P3CTeX-example.tex`, `pxTAB.preset.test.tex`, `pxTAB.pxtbl.test.tex`, `run-pxTAB-tests.ps1` |

---

## 2. Bugs Encountered and Root Causes

### Bug 1 — Table Body Not Rendering

| Field | Detail |
|-------|--------|
| **Symptom** | Only the first word of each row appeared, emitted as plain text outside any tabular environment. The rest of the cell content and all subsequent columns were silently swallowed. |
| **Root Cause** | The `&` character (alignment token) has the wrong catcode inside expl3 code (`\ExplSyntaxOn` sets catcode of `&` to 12/other). The token list containing row content therefore stored literal `&` characters rather than alignment tokens, and `\tl_use:N` emitted them as printable characters instead of column separators. |
| **Fix Pattern** | Replace literal `&` with `\c_alignment_token` for all column separators assembled inside expl3 macros. Wrap the final tabular body emission in `\scantokens{ ... }` so that the output is re-scanned under document catcodes, restoring standard alignment semantics. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.test.tex` (basic 3×3 table renders all cells) |

### Bug 2 — Package Options Not Processed

| Field | Detail |
|-------|--------|
| **Symptom** | `\usepackage[style=header]{pxTAB}` loaded the package but the `style` key had no effect; tables rendered with the default `plain` style. |
| **Root Cause** | `\ProcessKeysOptions{ pxTAB }` was missing from `pxTAB.sty`. The key family was declared and `\file_input:n` loaded the code module, but the LaTeX2e option-processing hook was never invoked, so package-level options were silently discarded. |
| **Fix Pattern** | Added `\ProcessKeysOptions{ pxTAB }` in `pxTAB.sty` immediately after `\file_input:n { pxTAB.code.tex }`. |
| **Files Modified** | `pxTAB.sty` |
| **Regression Test** | `pxTAB.package-option.test.tex` |

### Bug 3 — `rowsep` Key Unused

| Field | Detail |
|-------|--------|
| **Symptom** | Custom row separators passed to `\pxTableFromList` via the `rowsep` key were ignored; the default `;` was always used. |
| **Root Cause** | `\seq_set_split:Nnn` was hard-coded with the literal `;` character instead of reading from `\l__pxtab_row_sep_tl`. The key correctly stored the user value, but the splitting operation never consulted it. |
| **Fix Pattern** | Changed splitting call to `\seq_set_split:NVV` using `\l__pxtab_row_sep_tl` as the separator argument. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.test.tex` (custom `rowsep` test case) |

### Bug 4 — Empty Table / First-Row Crashes

| Field | Detail |
|-------|--------|
| **Symptom** | Passing an empty string or a string with no valid rows to `\pxTableFromList` caused an unrecoverable low-level TeX error (attempt to use an empty sequence as a tabular preamble). |
| **Root Cause** | No input-validation guard existed before the pipeline attempted to derive `ncols` from the first row and build the tabular preamble. |
| **Fix Pattern** | Added early guards that check `\seq_count:N` before proceeding. On failure, emit `\msg_warning:nn { pxTAB } { empty-table }` or `{ empty-first-row }` and return without typesetting. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.test.tex` (empty-input and single-empty-row cases) |

### Bug 5 — Colspec Length Mismatch

| Field | Detail |
|-------|--------|
| **Symptom** | Undefined behaviour (garbled columns or TeX errors) when the user-supplied `colspec` had a different number of column descriptors than the actual number of data columns. |
| **Root Cause** | No validation compared `\tl_count:N \l__pxtab_colspec_tl` against the computed `ncols`. The mismatch propagated silently into the tabular preamble. |
| **Fix Pattern** | After computing `ncols`, compare against `colspec` length. On mismatch, emit `\msg_warning:nn { pxTAB } { colspec-mismatch }` and fall back to auto-generated colspec. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.test.tex` (colspec mismatch warning case) |

### Bug 6 — Boxed/Grid Trailing Empty Row

| Field | Detail |
|-------|--------|
| **Symptom** | Boxed and grid styles rendered an unwanted extra visual spacer (thin empty row) at the bottom of the table. |
| **Root Cause** | Interaction between the parser's trailing-row trim logic and the renderer's terminal rule emission: the parser left a trailing `\\` which, combined with the renderer's unconditional `\hline`, produced a zero-height row with a visible rule above it. |
| **Fix Pattern** | Stabilised `\\\hline` emission at the end of the body by introducing controlled inline flow in `\__pxtab_emit_tabular_with_body:N`. The terminal rule is now emitted only when the body does not already end with a rule command. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.layout-size.test.tex` (`no-trailing-empty-row-boxed`, `no-terminal-spacing-artifact-grid` probes) |

### Bug 7 — Alignment Options Not Working

| Field | Detail |
|-------|--------|
| **Symptom** | Setting `align=l` or `align=r` had no effect; all columns remained centred (`c`). |
| **Root Cause** | The alignment dispatch used `\str_case:nnF`, which does **not** expand its first argument. The stored value `\l__pxtab_align_tl` was compared as an unexpanded token list against the literal strings `l`, `r`, `c`, and never matched. |
| **Fix Pattern** | Generated the variant `\str_case:xnF` via `\cs_generate_variant:Nn` and invoked it with `\tl_to_str:N \l__pxtab_align_tl` as the first argument, ensuring full expansion before comparison. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.align-bug.test.tex` |

### Bug 8 — Expl3 Parameter-Number Warnings (Iteration 2 Failure)

| Field | Detail |
|-------|--------|
| **Symptom** | "Illegal parameter number in definition of `\__pxtab_...`" errors during compilation after a large-scale refactor of `\__pxtab_table_from_seq:n` and surrounding macros. |
| **Root Cause** | The diff modified multiple parameterised macros (`#1`, `#2`) simultaneously in a single large edit. Intermediate states were never compiled, so cascading parameter-reference errors went undetected until the full diff was applied. |
| **Fix Pattern** | Full revert to Iteration 1 baseline. The features were re-implemented across Iterations 7–10 using a **stepwise rollout**: one feature per commit, with a compilation gate after every change. |
| **Files Modified** | *(all changes discarded on revert)* |
| **Regression Test** | N/A (process lesson, not a code fix) |
| **Lesson Learned** | **Edit parameterised macros in very small, isolated steps with immediate compilation checks.** Never bundle multiple macro-signature changes in a single diff. |

### Bug 9 — Striped Background Gaps

| Field | Detail |
|-------|--------|
| **Symptom** | In striped, header-striped, and header-grid styles, the background colour appeared only behind the text content of each cell, leaving white gaps between columns. |
| **Root Cause** | When `tabular*` is used with `@{\extracolsep{\fill}}`, the intercolumn stretch glue is **not** covered by `\rowcolor`. The `\fill` glue sits outside the cells and is therefore not painted by the colour machinery. |
| **Fix Pattern** | For the affected renderers (striped, header-striped, header-grid) when auto colspec + inline mode + explicit width applies: build paragraph-style column specifiers (e.g. `p{<width>}`) and emit via `tabular` (not `tabular*`). Added `\ignorespaces` after `\rowcolor` to prevent spurious leading space. A styled helper function centralises the colspec + environment selection logic. |
| **Files Modified** | `pxTAB.code.tex` (3 renderers + styled helper) |
| **Regression Test** | `pxTAB.style-probe.test.tex` (striped probes: `\rowcolor` present, no `\cellcolor`, no stray `\crcr`), `pxTAB.test.tex` §33 |

### Bug 10 — Matrix Command Bypassing Shared Pipeline

| Field | Detail |
|-------|--------|
| **Symptom** | `\pxTableMatrix` did not honour paragraph mode, centering, float wrapper, or other keys that were implemented in the shared preparation pipeline. |
| **Root Cause** | `\pxTableMatrix` had its own independent render path that constructed and emitted the tabular directly, bypassing `\pxTAB_prepare_table_from_current_rows:` and all downstream processing. |
| **Fix Pattern** | Refactored `\pxTableMatrix` to populate `\l__pxtab_rows_seq` from the matrix input, then call `\pxTAB_prepare_table_from_current_rows:` — the same entry point used by all other public commands. |
| **Files Modified** | `pxTAB.code.tex` |
| **Regression Test** | `pxTAB.test.tex`, `pxTAB.layout-size.test.tex` |

### Bug 11 — Layout-Size Test Fragility

| Field | Detail |
|-------|--------|
| **Symptom** | Layout-size tests using `\hbox_set:Nn` around full table output triggered "Missing `\endgroup` inserted." errors, making the test harness itself unreliable. |
| **Root Cause** | Wrapping a complete table (which may include `\begin{table}` floats, `\centering`, or other group-sensitive commands) inside `\hbox_set:Nn` creates a mismatched grouping context. |
| **Fix Pattern** | Replaced fragile boxing-based measurement with probe-based assertions that inspect the emitted token stream for expected markers (rules, colour commands, environment names) without capturing the full table in a box. |
| **Files Modified** | `pxTAB.layout-size.test.tex` |
| **Regression Test** | Self (the test file is the regression test) |

### Bug 12 — emit_cell Premature X-Expansion

| Field | Detail |
|-------|--------|
| **Symptom** | Striped, header-striped, and header-grid tables crashed with "Undefined color ''" when `altrowtextcolor` was empty (the default). |
| **Root Cause** | `\__pxtab_emit_cell:nnn` was defined as expandable (`\cs_new:Npn`). During body construction via `\tl_put_right:Nx`, the function was fully expanded in x-expansion context. The conditional `\tl_if_blank:eTF` for `altrowtextcolor` evaluated during expansion, producing an empty colour argument that crashed xcolor. Existing tests masked this because the probe harness inadvertently redefined the function as `\cs_set_protected:Npn`. |
| **Fix Pattern** | Changed `\cs_new:Npn` to `\cs_new_protected:Npn` for `\__pxtab_emit_cell:nnn`. The protected attribute prevents expansion during `\tl_put_right:Nx`; the function is stored as a macro call and executed at typesetting time. |
| **Files Modified** | `pxTAB.code.tex` (line 285) |
| **Regression Test** | `pxTAB.preset.test.tex` (striped table with default empty `altrowtextcolor`) |

---

## 3. Solutions and Fix Patterns

A concise reference for recurring problem categories and their proven resolutions.

| Problem Category | Fix Pattern | Key Insight |
|---|---|---|
| **Catcode issues with alignment tokens** | Use `\c_alignment_token` and `\scantokens` re-scanning | expl3's `\ExplSyntaxOn` changes the catcode of `&` to 12 (other); tokens assembled in this context are inert unless explicitly corrected. |
| **Key/option not taking effect** | Verify `\ProcessKeysOptions` is present; verify expansion in `\str_case` dispatch | Unexpanded token-list comparisons are the most common expl3 key-handling pitfall. Always use `x`-type or `e`-type variants for string comparison. |
| **Background colour gaps in tables** | Check layout mode (`tabular` vs `tabular*`) | `@{\extracolsep{\fill}}` creates intercolumn stretch glue that `\rowcolor` cannot paint. Switch to paragraph-column `tabular` when full-width colour is required. |
| **Trailing row artefacts** | Stabilise terminal rule emission in the renderer | A bare `\\` before `\hline` at the body's end produces a zero-height row. The emitter must conditionally suppress redundant terminators. |
| **Command bypassing shared pipeline** | Audit all public entry points | Every public command must route through the shared preparation function (`\pxTAB_prepare_table_from_current_rows:`). An independent render path will silently miss newly added features. |
| **Test fragility with boxing** | Use probe-based assertions | Avoid `\hbox_set:Nn` around full tables. Instead, assert on emitted token markers (e.g., presence of `\rowcolor`, absence of `\crcr`). |
| **Parameter-number errors in large diffs** | Small, isolated diffs with immediate compilation | Never edit multiple parameterised macros (`#1`, `#2`) in a single diff. Compile after every change. |
| **Sequence splitting ignoring key** | Wire `\seq_set_split` to the key's token list | Use `V`-type variants (`\seq_set_split:NVV`) to read stored values instead of hard-coded literals. |
| **Empty-input crashes** | Guard with `\seq_count:N` before pipeline entry | Emit a user-facing `\msg_warning:nn` and return early rather than letting the error propagate to low-level TeX internals. |
| **Premature expansion of cell emitter** | Use `\cs_new_protected:Npn` for functions that contain conditionals and are called via `\tl_put_right:Nx` | Functions containing `\tl_if_blank:eTF` or similar conditionals must be protected to prevent premature evaluation during x-expansion context. |

---

## 4. Known Limitations (Deferred Work)

The following are **acknowledged limitations** of the current pxTAB implementation. Each is documented here so that future agents do not waste cycles rediscovering them.

1. **No `longtable` integration for paragraph mode.** Paragraph-cell tables cannot break across pages in pxTAB. For page-breaking tables, use pxTBL's `\pxTBLlong` command instead.

2. **Equal-width paragraph columns only.** When `cellmode=paragraph` is active with auto colspec, all columns receive equal width (`\textwidth / ncols`). Heterogeneous per-column widths require an explicit `colspec` key.

3. **Explicit `colspec` overrides paragraph auto-layout.** This is by design: if the user provides a `colspec`, it is used verbatim. The paragraph-mode width calculation does not apply.

4. **Cells containing commas need bracing.** Since commas are the default column separator, cell content such as `Smith, John` must be written as `{Smith, John}` to prevent mis-parsing.

5. **Literal `;` in cells breaks `\pxTableFromList` parsing.** The semicolon is the default row separator. Cells containing `;` require either changing `rowsep` or bracing the content.

6. **Minor overfull/underfull warnings in documentation.** Long expl3 macro names in `pxTAB.tex` occasionally trigger overfull `\hbox` warnings. This is cosmetic and does not affect user-facing output.

7. **Striped fix uses paragraph-style columns internally.** For striped/header-striped/header-grid styles with auto colspec + inline mode + explicit width, the emitter builds `p{...}` columns and uses `tabular` instead of `tabular*`. Line-breaking behaviour inside cells may differ slightly from pure `tabular*` output.

8. **No structured error for unknown keys.** The current key tree declares `unknown .code:n = { }`, which silently discards unrecognised keys. No warning is emitted.

9. **Double-centering risk.** If a user manually writes `\centering` in the surrounding scope AND sets `centering=true`, the table receives redundant centering commands. This is harmless but inelegant.

10. **Float wrapper not exhaustively tested.** The `float`, `caption`, and `label` keys work for standard placements but have not been tested with deeply nested table environments or extreme float specifiers (e.g. `[!p]` in two-column mode).

11. **pxTBL star variant uses hard-coded colours.** The `\rowcolors*{1}{blue!25!}{}` colour in pxTBL star variants is not configurable via pxTAB keys. Users needing colour customisation should use pxTAB commands with the `preset` system instead.

12. **pxTBL `[gap]` argument silently ignored by longtable commands.** `\pxTBLlong` and `\pxTBL` accept a `[gap]` optional argument but do not include it in the `longtable` colspec. This is a pre-existing inconsistency, now documented.

13. **Preset names are global, unprotected.** A user-defined preset named `formal` will overwrite the built-in `formal` preset. No namespace protection or collision warning.

---

## 5. Do-Not-Repeat List

**Critical constraints for all future development agents.** Violating any of these items risks reintroducing bugs that required significant effort to diagnose and fix.

1. **Do NOT reintroduce `tabular*` for striped/header-striped/header-grid when (auto colspec + inline + explicit width).** The striped-background fix (Bug 9) deliberately avoids `tabular*` in this configuration because `@{\extracolsep{\fill}}` creates uncolourable intercolumn glue. Any change that re-routes these styles through `tabular*` under those conditions will reintroduce the background-gap defect.

2. **Do NOT re-implement `cellmode` / `paragraphcells` / `paragraphcoltype` or re-derive effective-width rules.** These keys and their interaction logic were carefully designed during the Last Sprint. Consult `pxtab-paragraph-cells-design.md` for the authoritative specification. Re-derivation risks introducing inconsistencies.

3. **Do NOT let `\pxTableMatrix` bypass `\pxTAB_prepare_table_from_current_rows:`.** The matrix command was refactored (Bug 10) to use the shared pipeline. Any shortcut that emits the tabular directly will silently bypass paragraph mode, centering, float wrappers, and future features.

4. **Do NOT revert layout-size tests to fragile `\hbox_set:Nn`-around-whole-table capture.** This approach is fundamentally incompatible with tables that contain floats or grouping-sensitive commands (Bug 11). Use probe-based assertions instead.

5. **Do NOT bundle multiple features in a single large diff.** This was the root cause of the Iteration 2 revert (Bug 8). The proven workflow is: one feature → compile → test → commit → next feature.

6. **Do NOT remove probe assertions for striped/header-striped/header-grid.** The probes in `pxTAB.style-probe.test.tex` verify that `\rowcolor` is present, `\cellcolor` is absent, and no stray `\crcr` appears. These are the regression sentinels for Bug 9.

7. **Do NOT define `\__pxtab_emit_cell:nnn` as expandable.** It must use `\cs_new_protected:Npn`. If expandable, x-expansion during body construction causes premature evaluation of conditionals, crashing on empty colour values (Bug 12).

8. **Do NOT use `\clist_gclear:N` / `\clist_gset:Nn` for local-scope variables.** The pxTBL `list` function originally used global operations on `\l_*` variables. Always match the scope prefix (`\l_` = local operations, `\g_` = global operations).

9. **Do NOT remove the `\@ifclassloaded{P3CTeX}` guard for branded presets.** The five `p3c-*` presets depend on pxGDX colour names (`primaryColor`, `secondaryColor`, etc.) which are only defined when P3CTeX is loaded. Removing the guard would cause "Undefined color" errors in standalone mode.

---

## 6. Backlog Items for Future Sprints

Prioritised by impact-to-risk ratio (highest first).

| Priority | Item | Description | Impact | Risk | Notes |
|----------|------|-------------|--------|------|-------|
| **P1** | Unknown key warning | Change `unknown .code:n = { }` to emit `\msg_warning:nn { pxTAB } { unknown-key }`. Gate behind an opt-in `warn-unknown-keys` boolean key so existing documents are unaffected. | High (debugging ergonomics) | Low | Single-point change in key declaration tree. |
| **P2** | Style dispatch refactor | Replace the nested `\tl_if_eq:NnTF` chain in the style dispatcher with a `\str_case:xnF` dispatch map for clarity and maintainability. | Medium (maintainability) | Moderate | Must follow Do-Not-Repeat #5: edit parameterised macros in small, isolated steps with compilation gates. |
| **P3** | Visual regression test page | Create a single test file that renders all 8 styles × {natural width, explicit width} × {inline, paragraph mode} in a grid layout. Compile and visually inspect after every sprint. | High (catch regressions) | None | No code changes; test-only artefact. |
| **P4** | Layout-mode probe | Add a probe in `pxTAB.style-probe.test.tex` that asserts whether `tabular` or `tabular*` was used for each style × width combination. | Medium (catch layout-mode regressions) | None | Extends existing probe harness. |
| **P5** | Heterogeneous column widths | Allow per-column width specifications in paragraph mode via a new `colwidths` key (e.g. `colwidths={0.3,0.7}` for a 30/70 split). | Medium (user flexibility) | Moderate | Requires parsing a comma-separated width list and building a mixed `p{...}` colspec. Must not conflict with explicit `colspec`. |
| **P6** | `longtable` integration | Support page-breaking tables in pxTAB, analogous to pxTBL's `\pxTBLlong`. Requires a new `long` boolean key and a `longtable`-based emission path. | High (long documents) | High | New environment, different pagination model, interactions with float wrapper and centering. |
| **P7** | `booktabs`-flavoured variant | Add a style variant (e.g. `style=booktabs`) using `\toprule`, `\midrule`, `\bottomrule` instead of `\hline`. | Medium (professional typography) | Low–Moderate | Requires `booktabs` as an optional dependency. Straightforward renderer addition following existing style pattern. |
| ~~**P8**~~ | ~~P3CTeX-level table presets~~ | **Completed** in Refinement Sprint (iteration 12). Implemented as branded presets (`p3c-header`, `p3c-data`, `p3c-rubric`, `p3c-minimal`, `p3c-exam`) auto-registered when P3CTeX class is loaded. | — | — | — |
| **P9** | Configurable pxTBL star colours | Replace hard-coded `blue!25!` in `\rowcolors*` with a configurable colour key. | Medium (user flexibility) | Low | Single-point change in the three pxTBL compat functions. |
| **P10** | Preset composition | Allow `preset={base, overlay}` chaining so users can layer presets. | Low (ergonomics) | Moderate | Requires parsing comma-separated preset names and applying them in order. |

---

## 7. Current Package State Summary

As of the completion of the Refinement Sprint (2026-03-04), pxTAB has the following capabilities:

### Public Commands (9 + 3 legacy)

| Command | Purpose |
|---------|---------|
| `\pxTABsetup{key=value,...}` | Set package options globally or within group |
| `\pxTABsavepreset{name}{key=value,...}` | Save a named preset for reuse |
| `\pxTABusepreset{name}` | Apply a saved preset |
| `\pxTable[options]{row1}{row2}...{rowN}` | Table from braced rows (comma-separated cells) |
| `\pxTableFromList[options]{data}` | Table from delimited string (rows by `;`, cells by `,`) |
| `\pxTableRow[options]{row}` | Single-row convenience table |
| `\pxTableHeadBody[options]{header}{body-list}` | Header row + body as delimited list |
| `\pxTableHeadBodyRows[options]{header}{row1}{row2}...` | Header + body as braced rows |
| `\pxTableMatrix[options]{nrows}{ncols}{flat-cells}` | Matrix from flat cell list (shared pipeline) |
| *Legacy pxTBL:* `\pxTBL`, `\pxTBLlong`, `\pxTBLtop` | pxTBL compatibility commands (group-scoped) |

### Styles (8)

| Style | Description |
|-------|-------------|
| `plain` | No rules, no header styling (default) |
| `header` | Coloured first row (headerbgcolor, headertextcolor, headerfont) |
| `striped` | Alternating row background colours (altrowbgcolor) |
| `boxed` | Outer frame (`|c|c|` + hline top/bottom) |
| `grid` | Full grid (vertical rules + hline between all rows) |
| `header-boxed` | Composed: header styling within a boxed frame |
| `header-grid` | Composed: header styling within a full grid |
| `header-striped` | Composed: header styling with alternating stripes |

### Keys (27+)

Organised by category:

- **Presets:** `preset`
- **Style shortcuts:** `striped`, `boxed`, `grid`, `header`, `header-striped`, `header-boxed`, `header-grid`
- **Convenience:** `setheader`, `setheader-striped`, `setheader-boxed`, `setheader-grid`
- **Style/colour:** `style`, `headerbgcolor`, `headertextcolor`, `altrowbgcolor`/`altrowcolor`, `altrowtextcolor`, `headerfont`, `bodyfont`, `rulecolor`, `rulewidth`
- **Layout:** `tabcolsep`, `arraystretch`/`rowstretch`, `width`/`tabwidth`, `fontsize`/`size`, `align`/`alignment`, `colspec`, `centering`
- **Float wrapper:** `caption`, `label`, `float`
- **Parsing:** `rowsep`, `cellsep`, `probe`
- **Paragraph mode:** `cellmode`, `paragraphcells`, `paragraphcoltype`
- **Aliases:** `verbose`, `paragraph`

### Test Gate (8 files)

| Test File | Coverage |
|-----------|----------|
| `pxTAB.test.tex` | Core functionality, all styles, edge cases |
| `pxTAB.package-option.test.tex` | Package-level option processing |
| `pxTAB.align-bug.test.tex` | Alignment key regression |
| `pxTAB.layout-size.test.tex` | Trailing-row artefacts, layout geometry |
| `pxTAB.style-probe.test.tex` | Striped background integrity, token-level probes |
| `pxTAB.raw-tabular.test.tex` | Baseline: raw tabular without pxTAB |
| `pxTAB.preset.test.tex` | Preset save/use, built-in and branded presets |
| `pxTAB.pxtbl.test.tex` | pxTBL compatibility commands |

### Documentation

- **User manual:** `tex/doc/pxTAB.tex` — 24 pages covering all commands, keys, styles, presets, P3CTeX integration, and pxTBL legacy commands
- **Examples:** Integrated into `P3CTeX-example.tex` (14pp)

### Architecture Invariants

- All public commands route through `\pxTAB_prepare_table_from_current_rows:`
- Striped/header-striped/header-grid use `tabular` (not `tabular*`) for auto colspec + inline + explicit width
- Alignment dispatch uses `\str_case:xnF` (expanded variant)
- Probe-based testing (no `\hbox_set:Nn` around full tables)
- One feature per commit, compile gate after every change
- Presets stored in `\g__pxtab_presets_prop` (global prop list)
- P3CTeX branded presets auto-registered via `\@ifclassloaded{P3CTeX}` before `\ProcessKeysOptions`
- pxTBL functions in `\__pxtab_pxtbl_*` namespace; user commands group-scoped
- `\__pxtab_emit_cell:nnn` is protected (not expandable)

---

*End of document. Update this file after every pxTAB development sprint.*
