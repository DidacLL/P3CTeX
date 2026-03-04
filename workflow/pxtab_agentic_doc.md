# pxTAB — Agent Reference

> **Purpose**: Single-source context for AI agents working on pxTAB.
> Read this instead of the full source. Compact, complete, token-aware.
> **Last updated:** 2026-03-04 (post refinement sprint)

---

## 1 Overview

pxTAB builds tables from comma-separated data with predefined styles, a key-driven API, and a reusable preset system.
Target audience: students / course authors who want tables without raw `tabular`.
All public commands are LaTeX2e macros in `pxTAB.sty`; all expl3 internals live in `pxTAB.code.tex`.
When loaded via the P3CTeX class, branded presets using pxGDX design-system colours are auto-registered.

---

## 2 File Map

| File | Role |
|------|------|
| `tex/latex/pxTAB.sty` | Package loader + LaTeX2e public API (9 commands) + P3CTeX branded preset registration |
| `tex/code/pxTAB.code.tex` | Expl3 internals: keys, parsing, colspec, renderers, emission, preset infrastructure, pxTBL compat functions |
| `tex/doc/pxTAB.tex` | User manual (24 pp, pdflatex) |
| `tex/examples/P3CTeX-example.tex` | Example document using P3CTeX class (includes pxTAB + preset demos) |
| `tex/tests/pxTAB.test.tex` | Main regression (all styles, commands, paragraph mode) |
| `tex/tests/pxTAB.style-probe.test.tex` | Token-level probes (rowcolor, cellcolor, crcr) |
| `tex/tests/pxTAB.layout-size.test.tex` | Geometry/layout checks (width, size, paragraph colwidth) |
| `tex/tests/pxTAB.package-option.test.tex` | Package load-time options |
| `tex/tests/pxTAB.raw-tabular.test.tex` | Baseline: raw tabular without pxTAB |
| `tex/tests/pxTAB.align-bug.test.tex` | Regression for align=l/r |
| `tex/tests/pxTAB.preset.test.tex` | Preset save/use roundtrip, built-in presets, override semantics |
| `tex/tests/pxTAB.pxtbl.test.tex` | pxTBL legacy commands (compilation + argument variations) |
| `tex/tests/run-pxTAB-tests.ps1` | PowerShell gate runner (all 8 tests) |

---

## 3 Public API (9 commands)

| Command | Signature | Purpose |
|---------|-----------|---------|
| `\pxTABsetup` | `{key=val,...}` | Set options globally or within group |
| `\pxTABsavepreset` | `{name}{keys}` | Store a named bundle of key-value settings (global) |
| `\pxTABusepreset` | `{name}` | Apply a stored preset (local effect via `\keys_set`) |
| `\pxTable` | `[opts]{row1}{row2}...{rowN}` | Table from braced rows (comma-sep cells) |
| `\pxTableFromList` | `[opts]{data}` | Table from delimited string (`;` rows, `,` cells) |
| `\pxTableRow` | `[opts]{row}` | Single-row table |
| `\pxTableHeadBody` | `[opts]{header}{body-list}` | Header row + body as delimited list |
| `\pxTableHeadBodyRows` | `[opts]{header}{row1}{row2}...` | Header + body as braced rows |
| `\pxTableMatrix` | `[opts]{nrows}{ncols}{flat-cells}` | Matrix from flat cell list |

### 3.1 pxTBL Legacy Commands (positional arguments, not key-driven)

| Command | Signature | Purpose |
|---------|-----------|---------|
| `\pxTBLtop` | `*[maxwidth]{numcols}[gap]{headers}[prefix]{body}` | Paragraph-column table in float |
| `\pxTBLlong` | `*[maxwidth]{numcols}[gap]{headers}[prefix]{body}` | Page-breaking longtable |
| `\pxTBL` | `*[maxwidth]{numcols}[gap]{headers}[prefix]{body}` | Comma-list convenience longtable |

Star variant adds alternating row colours (`\rowcolors*`). All three are group-scoped and use the `\__pxtab_pxtbl_*` namespace internally.

---

## 4 Key Family (`pxTAB`)

Set via `\pxTABsetup{...}`, per-command `[options]`, or `preset=<name>`.

### 4.1 Style & Colours

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `style` | choice | `plain` | `plain` / `header` / `striped` / `boxed` / `grid` / `header-boxed` / `header-grid` / `header-striped` |
| `headerbgcolor` | tl | `blue!15` | Header row background |
| `headertextcolor` | tl | `blue!70!black` | Header row text colour |
| `altrowbgcolor` | tl | `blue!5` | Alternating row bg (striped styles) |
| `altrowcolor` | meta | — | Alias → `altrowbgcolor` |
| `altrowtextcolor` | tl | `{}` | Alternating row text colour |
| `headerfont` | tl | `\bfseries` | Header font command |
| `bodyfont` | tl | `{}` | Body font command |
| `rulecolor` | tl | `black!55` | Rule colour (boxed/grid) |
| `rulewidth` | dim | `0.4pt` | Rule width |

### 4.2 Style Shortcuts (meta keys, no argument)

`striped`, `boxed`, `grid`, `header`, `header-striped`, `header-boxed`, `header-grid` — each equivalent to `style=<name>`.

### 4.3 Quick Header Setup (meta keys with colour argument)

| Key | Equivalent |
|-----|-----------|
| `setheader=<colour>` | `style=header, headerbgcolor=<colour>` |
| `setheader-striped=<colour>` | `style=header-striped, headerbgcolor=<colour>` |
| `setheader-boxed=<colour>` | `style=header-boxed, headerbgcolor=<colour>` |
| `setheader-grid=<colour>` | `style=header-grid, headerbgcolor=<colour>` |

### 4.4 Layout

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `tabcolsep` | dim | `6pt` | Column separation |
| `arraystretch` | tl | `1.2` | Row stretch factor |
| `rowstretch` | meta | — | Alias → `arraystretch` |
| `width` | code | `natural` | `natural` (fit) or explicit dim (e.g. `\linewidth`) |
| `tabwidth` | meta | — | Alias → `width` |
| `centering` | bool | `false` | `\centering` before tabular |
| `fontsize` | tl | `{}` | Font size command |
| `size` | meta | — | Alias → `fontsize` |
| `align` | choice | `c` | `l` / `c` / `r` for auto colspec |
| `alignment` | meta | — | Alias → `align` |
| `colspec` | tl | `{}` | Explicit column spec (overrides auto) |

### 4.5 Float

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `caption` | tl | `{}` | Caption text (activates `table` wrapper) |
| `label` | tl | `{}` | `\ref` label |
| `float` | tl | `H` | Placement specifier |

### 4.6 Parsing

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `rowsep` | tl | `;` | Row separator (list commands) |
| `cellsep` | tl | `,` | Cell separator |
| `probe` | bool | `false` | Debug logging |

### 4.7 Paragraph Mode

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `cellmode` | choice | `inline` | `inline` or `paragraph` (p/m columns) |
| `paragraphcells` | choice | — | Bool alias: true→paragraph, false→inline |
| `paragraphcoltype` | choice | `m` | `p` (top) or `m` (centre) |
| `verbose` | meta | — | Alias → `cellmode=paragraph` |
| `paragraph` | meta | — | Alias → `cellmode=paragraph` |

### 4.8 Presets

| Key | Type | Default | Semantics |
|-----|------|---------|-----------|
| `preset` | code | (none) | Apply a named preset's key bundle |

---

## 5 Preset System

**Storage:** `\g__pxtab_presets_prop` — global property list mapping names to key-value strings.

**Internal API:**
- `\pxTAB_save_preset:nn {name} {keys}` — stores preset (global)
- `\pxTAB_use_preset:n {name}` — applies preset (local effect via `\keys_set:nn`)

**Override semantics:** Keys appearing after `preset=` in the same option list override preset values (natural l3keys left-to-right processing).

**Built-in presets (always available):**

| Preset | Key Bundle |
|--------|-----------|
| `formal` | `style=header, headerbgcolor=blue!15, headertextcolor=blue!70!black, headerfont=\sffamily\bfseries, centering=true, arraystretch=1.3` |
| `zebra` | `style=header-striped, headerbgcolor=blue!15, headertextcolor=blue!70!black, altrowbgcolor=blue!5, headerfont=\bfseries, centering=true` |
| `minimal` | `style=plain, arraystretch=1.0, tabcolsep=4pt` |

**P3CTeX branded presets (only when P3CTeX class is loaded):**

| Preset | Style | Palette |
|--------|-------|---------|
| `p3c-header` | header | primaryColor header, lighterColor text |
| `p3c-data` | header-striped | primaryColor header, secondaryColor!15 stripes |
| `p3c-rubric` | header-grid | darkColor header, paragraph mode |
| `p3c-minimal` | plain | neutralColor rules, compact |
| `p3c-exam` | header-striped | darkColor header, lightColor!30 stripes, serif bold |

Detection: `\@ifclassloaded{P3CTeX}` in `pxTAB.sty`, before `\ProcessKeysOptions`.

---

## 6 Data Pipeline

```
1  Public command called
2  Rows → \l__pxtab_rows_seq
3  Trailing empty rows trimmed  (\__pxtab_trim_trailing_empty_rows:)
4  Column count from first row  (\__pxtab_prepare_ncols:TF → \l__pxtab_ncols_int)
5  Colspec validated/built      (\__pxtab_validate_or_build_colspec:n)
     ├─ colspec key non-empty → use as-is
     ├─ cellmode=paragraph   → \__pxtab_build_paragraph_colspec:n
     ├─ boxed/grid           → \__pxtab_build_auto_box_colspec:nN
     └─ else                 → \__pxtab_build_auto_colspec:n (from align)
6  Style renderer dispatched    (\__pxtab_table_from_seq:n → \str_case)
7  Rows → \l__pxtab_body_tl via append helpers
8  Tabular emitted              (\__pxtab_emit_tabular_with_body:N)
     ├─ visual setup (tabcolsep, arraystretch, rulecolor, fontsize, centering)
     └─ tabular vs tabular* (width)
9  Optional float wrapper       (\__pxtab_wrap_in_table:nnn)
```

---

## 7 Style Renderer Map

| Style | Renderer | Notes |
|-------|----------|-------|
| `plain` | `\__pxtab_render_table_plain:n` | No rules, no header styling |
| `header` | `\__pxtab_render_table_header:n` | Coloured first row |
| `striped` | `\__pxtab_render_table_striped:n` | Alternating row colours |
| `boxed` | `\__pxtab_render_table_boxed:n` | Outer frame |
| `grid` | `\__pxtab_render_table_grid:n` | Full grid |
| `header-boxed` | `\__pxtab_render_table_header_boxed:n` | Header + boxed frame |
| `header-grid` | `\__pxtab_render_table_header_grid:n` | Header + full grid |
| `header-striped` | `\__pxtab_render_table_header_striped:n` | Header + striped body |

**Shared helpers:**

| Helper | Role |
|--------|------|
| `\__pxtab_append_row_to_body:nnnn` | Append row (text colour, font) |
| `\__pxtab_append_row_styled_to_body:nnnnn` | Same + `\rowcolor` prefix |
| `\__pxtab_emit_cell:nnn` | Emit single cell content (**must be protected**) |
| `\__pxtab_emit_tabular_with_body:N` | Visual setup + emit tabular |
| `\__pxtab_apply_visual_setup:` | Set tabcolsep, arraystretch, rulecolor, fontsize, centering |
| `\__pxtab_wrap_in_table:nnn` | Optional float wrapper |

---

## 8 pxTBL Compat Layer

Three legacy functions in `\__pxtab_pxtbl_*` namespace:

| Function | Route | Notes |
|----------|-------|-------|
| `\__pxtab_pxtbl_tophead:nnnnnnn` | Shared infra (Option A) | Uses `\__pxtab_pxtbl_build_gap_colspec:nnn`, `\centering`, `\__pxtab_wrap_in_table:nnn` |
| `\__pxtab_pxtbl_toplong:nnnnnnn` | Dedicated longtable (Option B) | `longtable` incompatible with pxTAB pipeline |
| `\__pxtab_pxtbl_list:nnnnnnn` | Delegates to toplong (Option B) | Comma-list convenience wrapper |

**Variables:** `\l__pxtab_pxtbl_colwidth_dim`, `\l__pxtab_pxtbl_header_clist`, `\l__pxtab_pxtbl_body_clist`, `\l__pxtab_pxtbl_colspec_tl`

**Known quirks:**
- Star variant uses hard-coded `blue!25!` colour (not configurable)
- `[gap]` argument silently ignored by `toplong` and `list`
- Star semantics differ: `tophead*` colours odd rows only; `toplong*`/`list*` colour all rows

---

## 9 Key Internals

### 9.1 Key Macros

| Macro | Purpose |
|-------|---------|
| `\pxTAB_set_options:n` | Set package keys |
| `\pxTAB_prepare_table_from_current_rows:` | Main entry: validate → colspec → dispatch |
| `\pxTAB_save_preset:nn` | Store preset in global prop list |
| `\pxTAB_use_preset:n` | Apply preset (local key setting) |
| `\pxTAB_table_from_list:n` | Parse delimited list → prepare |
| `\pxTAB_table_matrix:nnn` | Build rows from flat list → prepare |
| `\pxTAB_rows_from_list:n` | Parse list → `\l__pxtab_rows_seq` |
| `\pxTAB_rows_prepend:n` | Prepend header row |
| `\__pxtab_prepare_ncols:TF` | Set `\l__pxtab_ncols_int` from first row |
| `\__pxtab_validate_or_build_colspec:n` | Validate or auto-generate colspec |
| `\__pxtab_table_from_seq:n` | Style dispatch (`str_case` on style) |
| `\__pxtab_width_is_natural:TF` | Test natural vs explicit width |
| `\__pxtab_prepare_layout_mode:` | Decide tabular vs tabular* |

### 9.2 Key Variables

| Variable | Purpose |
|----------|---------|
| `\l__pxtab_rows_seq` | Sequence of rows |
| `\l__pxtab_ncols_int` | Column count |
| `\l__pxtab_style_tl` | Current style name |
| `\l__pxtab_colspec_tl` | Computed/user colspec |
| `\l__pxtab_body_tl` | Accumulated tabular body |
| `\l__pxtab_width_tl` | Width value |
| `\l__pxtab_cellmode_tl` | `inline` or `paragraph` |
| `\l__pxtab_use_tabularx_bool` | Use tabular* flag |
| `\l__pxtab_center_bool` | Centering flag |
| `\l__pxtab_paragraph_colwidth_dim` | Per-column width (paragraph mode) |
| `\g__pxtab_presets_prop` | Global preset storage |

---

## 10 Testing Infrastructure

**Gate runner:** `tex/tests/run-pxTAB-tests.ps1` — runs all 8 test files, exit 0 = all pass. Supports `-CleanArtifacts`.

**Build command** (from `tex/tests/`):
```
pdflatex -interaction=nonstopmode --include-directory=../latex --include-directory=../code <test>.tex
```

**Doc build** (from `tex/`):
```
pdflatex -interaction=nonstopmode doc/pxTAB.tex
```

**Assertion patterns:**

| Pattern | Where |
|---------|-------|
| `PXTAB_ASSERT PASS` / `FAIL` | Main test, preset test, probes |
| `PXTAB-CHECK PASS` / `FAIL` | layout-size tests |
| `PXTAB_ALIGN_ASSERT:PASS` | align-bug test |
| `PXTAB_ASSERT PASS: pxtbl-NN` | pxTBL integration tests |

**Probe harness** (`pxTAB.style-probe.test.tex`): overrides `\__pxtab_emit_tabular_with_body:N` and `\__pxtab_append_row_to_body:nnnn`, captures body tl, asserts content via `\__pxtab_probe_assert_body_contains:n`.

---

## 11 Gotchas & Traps

| # | Trap | Detail |
|---|------|--------|
| 1 | **Catcode alignment** | `&` must be `\c_alignment_token` (catcode 4) inside expl3. Body re-scanned via `\scantokens`. |
| 2 | **tabular\* + rowcolor gap** | `@{\extracolsep{\fill}}` glue not covered by `\rowcolor`. Striped/header-striped/header-grid with explicit width + auto colspec + inline → switches to paragraph colspec + `tabular`. |
| 3 | **str_case expansion** | `\str_case:nnF` does NOT expand. Use `\str_case:xnF` for tl variables. |
| 4 | **Body tl scoping** | `\l__pxtab_body_tl` must be used inside the group it was built in. After `\group_end:` → empty. |
| 5 | **Parameter number sensitivity** | Editing expl3 `#1`/`#2` macros in large diffs → "Illegal parameter number". Edit parameterised macros in isolation; compile immediately. |
| 6 | **Shared pipeline** | ALL pxTAB public commands must route through `\pxTAB_prepare_table_from_current_rows:`. No per-command render paths. pxTBL commands are exempt (positional-argument API). |
| 7 | **Test boxing fragility** | Do NOT wrap pxTAB tables in `\hbox_set:Nn` — triggers "Missing \endgroup inserted." Use probes. |
| 8 | **Trailing empty rows** | Parser trims trailing empties, but terminal `\\\hline` in boxed/grid needs care. |
| 9 | **Explicit colspec overrides all** | Non-empty `colspec` key → used as-is. Paragraph mode, auto-box, `align` all ignored. |
| 10 | **Float activation** | `table` wrapper activates when ANY of `caption`/`label`/`float` is non-empty. `centering` emits inside float. |
| 11 | **emit_cell must be protected** | `\__pxtab_emit_cell:nnn` MUST use `\cs_new_protected:Npn`. If expandable, x-expansion during body construction causes premature evaluation of conditional branches, crashing on empty `altrowtextcolor`. |
| 12 | **Preset key is not a default** | The `preset` key has no `.initial:n`. It only applies when explicitly set. Presets are global definitions but their effect is local to the current group. |

---

## 12 Relationship to pxTBL

pxTBL was a separate, older set of commands for paragraph-style and longtable tables. As of the refinement sprint, the three pxTBL commands are now fully integrated into pxTAB's codebase under the `\__pxtab_pxtbl_*` namespace. They coexist with the key-driven pxTAB API.

| Aspect | pxTAB | pxTBL (integrated) |
|--------|-------|-------|
| API | Key-driven `[options]` | Positional arguments |
| Commands | `\pxTable`, etc. (9 commands) | `\pxTBLtop`, `\pxTBL`, `\pxTBLlong` |
| Page-breaking | No | Yes (`\pxTBLlong`, `\pxTBL`) |
| Presets | Yes | No (positional args) |
| Pipeline | Shared `\pxTAB_prepare_table_from_current_rows:` | `tophead` partial; `toplong`/`list` dedicated longtable |
| Scoping | Per-group | Per-group (group-wrapped in .sty) |

---

*End of reference. This document is the single context source for pxTAB agent work.*
