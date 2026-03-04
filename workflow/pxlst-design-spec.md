# pxLST Design Specification — v0.1 (2026-03-04)

**Status:** FROZEN — do not modify after T2/T3 dispatch.
**Author:** API/Design Agent (Orchestrator), pxLST Foundation Sprint.

---

## 1. Key Family `pxLST` — Complete Specification

All keys belong to the `pxLST` key family (processed by `l3keys2e`).

### 1.1 Key Definitions Table

| Key | expl3 type | Default | Semantics |
|-----|-----------|---------|-----------|
| `style` | `tl_set:N` | `dark` | Visual style renderer: `dark` \| `framed` \| `light` \| `plain` |
| `language` | `tl_set:N` | `pxJava` | Listings language name (any `\lstdefinelanguage` name) |
| `numbers` | `tl_set:N` | `left` | Line number position: `left` \| `right` \| `none` |
| `caption` | `tl_set:N` | `` (empty) | Listing caption text; non-empty does NOT auto-trigger float in `pxCode` |
| `label` | `tl_set:N` | `` (empty) | Cross-reference label (inserted as `\label{lst:<value>}` when non-empty) |
| `float` | `tl_set:N` | `` (empty) | Float placement spec (`h`,`t`,`b`,`p`,`htbp`); empty = inline (no float) |
| `breakable` | `bool_set:N` | `true` | Allow tcolorbox page-break; `pxCodeBreak` forces `true` |
| `fontsize` | `tl_set:N` | `\footnotesize` | Font size command applied in `basicstyle` |
| `linespread` | `tl_set:N` | `1.2` | Numeric factor passed to `\linespread` in `basicstyle` |
| `tabsize` | `int_set:N` | `4` | Tab width in spaces |
| `preset` | `.code:n` | — | Apply named preset: calls `\pxLST_use_preset:n{#1}` |
| `probe` | `bool_set:N` | `false` | Emit `PXLST_ASSERT:` diagnostics to log via `\iow_term:x` |
| `unknown` | `.code:n = {}` | — | Silently ignore unrecognised keys |

### 1.2 Key Interaction Rules

- `style` changes the listing colour scheme AND the tcolorbox colback/colframe/coltext.
- `language` is independent of `style`; both apply to the same listing.
- `preset` is processed last in the key chain, so subsequent keys override preset values. **Implementation note:** `preset` is a `.code:n` key that calls `\pxLST_use_preset:n`. This means `\pxLSTsetup{preset=darcula, language=pxBash}` first applies the `darcula` preset (which may set `language=pxJava`), then overrides with `language=pxBash`. Order matters.
- `float` is orthogonal to `breakable`: if `float` is non-empty, `pxCodeBox`/`pxCodeBreak` wrap in a `table`-analogue float. `breakable` is ignored when `float` is non-empty (floats cannot break across pages in standard LaTeX).
- `caption` and `label` are stored but NOT automatically used in `pxCode`; they ARE used by `pxCodeBox`/`pxCodeBreak` to build the title bar and place `\label`.

### 1.3 Variable Names (expl3)

| Variable | Type | Scope | Purpose |
|----------|------|-------|---------|
| `\l_pxlst_style_tl` | tl | local | Current style name |
| `\l_pxlst_language_tl` | tl | local | Current language name |
| `\l_pxlst_numbers_tl` | tl | local | Line-number placement |
| `\l_pxlst_caption_tl` | tl | local | Caption text |
| `\l_pxlst_label_tl` | tl | local | Label string (without `lst:` prefix) |
| `\l_pxlst_float_tl` | tl | local | Float placement spec |
| `\l_pxlst_breakable_bool` | bool | local | Breakable flag |
| `\l_pxlst_fontsize_tl` | tl | local | Font size command |
| `\l_pxlst_linespread_tl` | tl | local | Line spread factor |
| `\l_pxlst_tabsize_int` | int | local | Tab size |
| `\l_pxlst_probe_bool` | bool | local | Probe flag |
| `\l_pxlst_presets_prop` | prop | local | Named preset store (key=name, value=option string) |
| `\l__pxlst_retrieved_tl` | tl | local | Scratch: preset retrieval buffer |

**Display variables** (regular LaTeX2e macros, set via `\def` inside groups — group-scoped restore):

| Macro | Set by | Purpose |
|-------|--------|---------|
| `\pxlst@colback@v` | `\__pxlst_set_style_vars:` | tcolorbox `colback` value |
| `\pxlst@colframe@v` | `\__pxlst_set_style_vars:` | tcolorbox `colframe` value |
| `\pxlst@coltext@v` | `\__pxlst_set_style_vars:` | tcolorbox `coltext` value |
| `\pxlst@lstyle@v` | `\__pxlst_set_style_vars:` | listings `style=` value |
| `\pxlst@lang@v` | `\__pxlst_set_style_vars:` | listings `language=` value |
| `\pxlst@numbers@v` | `\__pxlst_set_style_vars:` | listings `numbers=` value |
| `\pxlst@tabsize@v` | `\__pxlst_set_style_vars:` | listings `tabsize=` value |
| `\pxlst@basicstyle@v` | `\__pxlst_set_style_vars:` | listings `basicstyle=` token list |
| `\pxlst@arc@v` | `\__pxlst_set_style_vars:` | tcolorbox `arc=` value |

**Initialisation:** All display macros are initialised to the `dark`+`pxJava` default values at package load time (before `\ProcessKeysOptions`), so environments work even without any `\pxLSTsetup` call.

---

## 2. Internal Function Mapping

### 2.1 Public Internal API (called from `.sty`)

| Function | Signature | Purpose |
|----------|-----------|---------|
| `\pxLST_set_options:n` | `{option-string}` | Apply keys; update display vars; emit probe if active |
| `\pxLST_save_preset:nn` | `{name}{option-string}` | Store preset in `\l_pxlst_presets_prop` |
| `\pxLST_use_preset:n` | `{name}` | Retrieve and apply a named preset |
| `\pxLST_input_file:n` | `{filename}` | Render a file listing with current settings |

### 2.2 Private Implementation Functions (`.code.tex` only)

| Function | Purpose |
|----------|---------|
| `\__pxlst_set_style_vars:` | Update `\pxlst@*@v` macros from current `\l_pxlst_*` variables |
| `\__pxlst_probe_emit:` | Emit `PXLST_ASSERT:*` lines to log if probe is active |
| `\__pxlst_configure_tcb:` | Call `\tcbset{pxlst@env/.style={...}}` from current display vars |
| `\__pxlst_build_lstopts_tl:` | Build `\l__pxlst_lstopts_tl` (listing options string) |
| `\__pxlst_float_begin:` | Open float wrapper (`\begin{figure}[\l_pxlst_float_tl]`) |
| `\__pxlst_float_end:` | Close float wrapper and insert `\caption`/`\label` |

### 2.3 Key → Variable → Display Var Chain

```
\pxLSTsetup{style=light}
  → \keys_set:nn{pxLST}{style=light}
  → \l_pxlst_style_tl = "light"
  → \pxLST_set_options:n calls \__pxlst_set_style_vars:
  → \def\pxlst@colback@v{white}
     \def\pxlst@colframe@v{gray!25!}
     \def\pxlst@coltext@v{black}
     \def\pxlst@lstyle@v{pxlst@light}
  → \__pxlst_configure_tcb: updates the tcolorbox named style
```

---

## 3. Public Commands — Exact `\NewDocumentCommand` Signatures

All public commands live in `tex/latex/pxLST.sty`. None go in `.code.tex`.

### 3.1 `\pxLSTsetup`

```latex
\NewDocumentCommand{\pxLSTsetup}{m}
  { \pxLST_set_options:n { #1 } }
```

- `m` = mandatory brace group of `key=value,...` options.
- Scope: the current TeX group. At document level, effectively global.

### 3.2 `\pxLSTsavepreset`

```latex
\NewDocumentCommand{\pxLSTsavepreset}{mm}
  { \pxLST_save_preset:nn { #1 } { #2 } }
```

- `#1` = preset name (string), `#2` = option string.

### 3.3 `\pxLSTusepreset`

```latex
\NewDocumentCommand{\pxLSTusepreset}{m}
  { \pxLST_use_preset:n { #1 } }
```

### 3.4 `pxCode` Environment

```latex
\NewDocumentEnvironment{pxCode}{ O{} m }
```

Argument spec:
- `O{}` — optional key-value options (local to this environment)
- `m` — mandatory label string (used as tcolorbox title text; also as `\label{lst:#2}` if non-empty)

Internal flow (begin):
1. `\group_begin:`
2. `\pxLST_set_options:n{#1}` (applies local key overrides)
3. `\__pxlst_set_style_vars:` (updates display macros within group)
4. `\__pxlst_probe_emit:` (if probe=true)
5. Open `\begin{tcolorbox}[pxlst@env, listing~only, ...]` with title=`\texttt{\bfseries #2}`, label placed if non-empty
6. `\begin{lstlisting}`

Internal flow (end):
1. `\end{lstlisting}`
2. `\end{tcolorbox}`
3. `\group_end:`

**Note on verbatim:** Since this environment contains verbatim content (`lstlisting`), it MUST be defined via `\newtcblisting` (not `\NewDocumentEnvironment`). The wrapper in `.sty` uses a `\newtcblisting{pxCode}` call, NOT `\NewDocumentEnvironment`. See §implementation note below.

### 3.5 `pxCodeBox` Environment

```latex
\newtcblisting{pxCodeBox}[5][]{...}
```

- `#1` — optional key-value options (local)
- `#2` — label string
- `#3` — title (displayed in title bar)
- `#4` — short note (displayed in comment panel)
- `#5` — caption text (inserted below or in float)

Renders: listing in main panel + right-column note panel, matching the legacy `pxCodeBox` layout.
Float wrapper: if `\l_pxlst_float_tl` is non-empty (set by `float=...` key), wraps in `\begin{figure}[\l_pxlst_float_tl]`.

### 3.6 `pxCodeBreak` Environment

Same signature as `pxCodeBox` but `breakable=true` is forced regardless of key settings.

```latex
\newtcblisting{pxCodeBreak}[5][]{...}
```

### 3.7 `\pxLSTinput`

```latex
\NewDocumentCommand{\pxLSTinput}{ O{} m }
  { \pxLST_input_file:n { #1 }{ #2 } }
```

Wait — since this calls `\tcbinputlisting` or `\lstinputlisting` (not verbatim), it CAN be defined as `\NewDocumentCommand`.

- `#1` = optional keys, `#2` = filename.
- Internally calls `\pxLST_set_options:n{#1}`, `\__pxlst_set_style_vars:`, then opens a tcolorbox with `lstinputlisting` inside.

### 3.8 Implementation Note — Verbatim Environments

The verbatim problem: `\newtcblisting` is required for environments containing verbatim code. The `.sty` file uses `\newtcblisting{pxCode}`, `\newtcblisting{pxCodeBox}`, `\newtcblisting{pxCodeBreak}`.

**Dynamic option mechanism:** A PGF `.code n args` key named `pxlst@configure` is defined in `.code.tex`:

```latex
\pgfkeys{/tcb/pxlst@configure/.code n args={1}{
  \pxLST_set_options:n { #1 }
  \__pxlst_set_style_vars:
  \tcbset{
    colback  = \pxlst@colback@v,
    colframe = \pxlst@colframe@v,
    coltext  = \pxlst@coltext@v,
    listing options = {
      style    = \pxlst@lstyle@v,
      language = \pxlst@lang@v,
      numbers  = \pxlst@numbers@v,
      tabsize  = \pxlst@tabsize@v,
      basicstyle = \pxlst@basicstyle@v
    }
  }
}}
```

Then `\newtcblisting{pxCode}[2][]{ pxlst@configure={#1}, listing only, arc=.25em, ... }`.

This works because `\tcbset` inside a `.code` key updates the current box options in-place, and the `\def`-set display macros are group-scoped (they revert after `\end{pxCode}`).

---

## 4. Style Renderers — Exact Specification

### 4.1 Four `\lstdefinestyle` Entries (defined in `.code.tex`)

**`pxlst@dark`** (full Darcula dark background):
```
basicstyle    = <fontsize>\linespread{<linespread>}\ttfamily\color{darcula-fg}
identifierstyle = \color{darcula-fg}
commentstyle  = \itshape\color{darcula-comment}
stringstyle   = \color{darcula-string}
keywordstyle  = \bfseries\color{darcula-keyword}
keywordstyle=[2] \color{darcula-function}\bfseries
keywordstyle=[3] \color{darcula-type}
keywordstyle=[4] \itshape\color{darcula-tag}
emphstyle     = \color{darcula-keyword!70!}\underbar
frame         = none
numbers       = left  (overridden by \pxlst@numbers@v at use time)
numberstyle   = \footnotesize\ttfamily\bfseries\color{darcula-bg!50!}
showstringspaces = false
breaklines    = true
breakatwhitespace = true
tabsize       = 4    (overridden by \pxlst@tabsize@v)
```
Note: `fontsize` and `linespread` in `pxlst@dark` are set to their default values. Dynamic values are passed via `listing options={basicstyle=\pxlst@basicstyle@v}` at use time, which OVERRIDES the style's basicstyle.

**`pxlst@framed`** (Darcula dark with left rule frame):
Same as `pxlst@dark` but adds:
```
frame         = leftline
framesep      = 2pt
framexleftmargin = 3pt
xleftmargin   = 5pt
rulecolor     = \color{darcula-comment}
```

**`pxlst@light`** (white background, coloured syntax):
```
basicstyle    = <fontsize>\linespread{<linespread>}\ttfamily\color{black}
identifierstyle = \color{black}
commentstyle  = \itshape\color{darcula-comment!80!black}
stringstyle   = \color{darcula-string!80!black}
keywordstyle  = \bfseries\color{darcula-keyword!80!black}
keywordstyle=[2] \color{darcula-function!80!black}\bfseries
keywordstyle=[3] \color{darcula-type!70!black}
keywordstyle=[4] \itshape\color{darcula-tag!70!black}
frame         = none
numbers       = left
numberstyle   = \footnotesize\ttfamily\color{gray!60!}
showstringspaces = false
breaklines    = true
```

**`pxlst@plain`** (white background, monochrome):
```
basicstyle    = <fontsize>\linespread{<linespread>}\ttfamily\color{black}
identifierstyle = \color{black}
commentstyle  = \itshape\color{gray!70!black}
stringstyle   = \color{black}
keywordstyle  = \bfseries\color{black}
frame         = none
numbers       = none
numberstyle   = \footnotesize\ttfamily\color{gray!60!}
showstringspaces = false
breaklines    = true
```

### 4.2 tcolorbox Parameters per Style

| Style | `colback` | `colframe` | `coltext` | `arc` |
|-------|-----------|-----------|-----------|-------|
| `dark` | `darcula-bg!90!` | `darcula-bg!60!` | `darcula-fg` | `.25em` |
| `framed` | `darcula-bg!90!` | `darcula-comment!60!` | `darcula-fg` | `.25em` |
| `light` | `white` | `gray!25!` | `black` | `.25em` |
| `plain` | `white` | `gray!15!` | `black` | `0pt` |

---

## 5. Language Definitions — All 7 px-prefixed Languages

All defined via `\lstdefinelanguage` in `pxLST.code.tex`. The UTF-8 literate map (§global lstset) applies to all.

### `pxJava`
- Base: `language=Java`
- `emph={this,super}`
- `morekeywords=[1]{String,Integer,int,char,Double,Boolean,ArrayList,return,void,new,null,true,false}`
- `morekeywords=[2]{main,println,System,out,in,err,format,add,get,size,remove}`
- `moredelim=[s][stringstyle]{<<}{>>}`
- `moredelim=[s][commentstyle]{/*}{*/}`
- `moredelim=[l][\itshape\color{darcula-tag}]{@}`
- No per-language literate (global literate handles accents)

### `pxProlog`
- Base: `language=Prolog`
- `morekeywords=[3]{<user-extensible — example predicates may go here>}`
- `keywordstyle=\color{darcula-keyword}\bfseries`
- `keywordstyle=[3]\color{darcula-function}\bfseries`
- Custom literate: `{(}`, `{)}`, `{.}`, `{,}`, `{:-}`, `{<}`, `{>}` with Darcula operator/function colors
- Full accent literate map (merged from global, for language-level override safety)

### `pxOWL`
- No base language
- `morekeywords={AnnotationProperty,Annotations,Asymmetric,...}` (full set from legacy lines 138–161)
- `morekeywords=[3]{rdf,owl}`
- `keywordstyle=\color{darcula-keyword}\bfseries`
- `keywordstyle=[3]\color{darcula-function}\bfseries`
- `morecomment=[l]{\#\ }`
- `morestring=[b]"`
- Custom literate: `{.}`, `{:}` with Darcula operator colors

### `pxTAD`
- No base language
- `morekeywords={create,return,if,else,true,false,null}`
- `morekeywords=[2]{TAD,@pre,@post,Invariant,Boolean,Integer,String,Date,List}`
- `morekeywords=[3]{BaseballCards,Entity,Worker,Card,Loan}`  ← example-specific; clean version has empty [3]
- `keywordstyle=\color{darcula-keyword}\bfseries`
- `keywordstyle=[2]\color{darcula-function}\bfseries`
- `keywordstyle=[3]\color{darcula-type}\bfseries`
- Custom literate: `{.}`, `{,}`, `{:}`, `{<}`, `{>}` with Darcula operator colors
- `morecomment=[l]{//}`, `morecomment=[s]{/*}{*/}`, `morestring=[b]"`

### `pxYAML`
- No base language
- `morekeywords={true,false,null,yes,no}`
- `morestring=[b]'`, `morestring=[b]"`
- `sensitive=false`
- `comment=[l]{\#}`
- Custom literate: `{:}`, `{,}`, `{[}`, `{]}`, `{>}`, `{|}` with Darcula operator/type/function colors
- `upquote=true`

### `algoritme`
- No base language
- `morekeywords={Funcio,Fi,Funció,Si,Llavors,Sinó,Mentre,Fer,Per,Cada,A,Retornar,Sortir,Nova,Nou,Afegir,Extreure}`
- `keywordstyle=\color{darcula-keyword}\bfseries`
- `sensitive=true`
- `morecomment=[l]{//}`, `morecomment=[s]{/*}{*/}`, `morestring=[b]"`
- Custom literate: `{<--}→$\leftarrow$`, `{<=}→$\leq$`, `{>=}→$\geq$`, `{!=}→$\neq$`, `{*}→$\times$`, `{_}→\textunderscore` with Darcula colors
- Full accent map

### `pxBash`
- Base: `language=bash`
- `keywordstyle=\color{darcula-keyword}\bfseries`
- `stringstyle=\color{darcula-string}`
- `commentstyle=\color{darcula-comment}\itshape`
- `numberstyle=\tiny\color{darcula-number}`
- `showstringspaces=false`
- `columns=flexible`
- `upquote=true`
- Full accent map

---

## 6. Preset Mechanism

### 6.1 Storage

`\l_pxlst_presets_prop` is a `\prop` variable that maps preset name → option string.

### 6.2 `\pxLST_save_preset:nn`

```latex
\cs_new_protected:Npn \pxLST_save_preset:nn #1 #2 {
  \prop_put:Nnn \l_pxlst_presets_prop { #1 } { #2 }
}
```

### 6.3 `\pxLST_use_preset:n`

```latex
\cs_new_protected:Npn \pxLST_use_preset:n #1 {
  \prop_get:NnNTF \l_pxlst_presets_prop { #1 } \l__pxlst_retrieved_tl
    { \pxLST_set_options:n { \l__pxlst_retrieved_tl } }
    { \msg_warning:nnn { pxLST } { unknown-preset } { #1 } }
}
```

Note: `\pxLST_set_options:n { \l__pxlst_retrieved_tl }` must expand the tl: use `\exp_args:NV \pxLST_set_options:n \l__pxlst_retrieved_tl`.

### 6.4 Built-in Presets (registered in `.code.tex` after key definitions)

```
darcula:  style=dark, language=pxJava, numbers=left, breakable=true
minimal:  style=plain, language=pxJava, numbers=none
academic: style=light, language=pxJava, numbers=left, fontsize=\small
```

### 6.5 P3CTeX Branded Presets (registered in `.sty` under `\@ifclassloaded{P3CTeX}`)

```
p3c-code:  style=dark, language=pxJava, numbers=left, breakable=true
p3c-alg:   style=framed, language=algoritme, numbers=left, breakable=false
p3c-plain: style=plain, language=pxJava, numbers=none, breakable=false
```

---

## 7. pxCORE Integration

### 7.1 Changes to `tex/code/pxCORE.code.tex`

Add after the TAB key block (after line `TAB .default:n = true,`):

```latex
LST         .bool_set:N  = \l_pxcore_lst_use_bool,
    LST     .initial:n   = false,
    LST     .default:n   = true,
```

Extend the `default` meta key to include `LST=true`:

```latex
default     .meta:n = {
    PRP = true,
    UML = true,
    SRC = true,
    TAB = true,
    LST = true
},
```

Add after `\bool_if:NT \l_pxcore_tab_use_bool { \RequirePackage{pxTAB} }`:

```latex
\bool_if:NT \l_pxcore_lst_use_bool { \RequirePackage{pxLST} }
```

### 7.2 Changes to `tex/latex/pxCORE.sty`

No structural changes required. The 87-line file does not enumerate packages in its header comments (it only lists dependency packages, not modules it activates). No edit needed.

### 7.3 Opt-In Verification

- Default: `\usepackage{pxCORE}` → `\l_pxcore_lst_use_bool = false` → pxLST NOT loaded.
- Explicit: `\usepackage[LST]{pxCORE}` → `\l_pxcore_lst_use_bool = true` → pxLST loaded.
- Bundle: `\usepackage[default]{pxCORE}` → all modules including LST loaded.

---

## 8. Dependency Stack

Exact `\RequirePackage` calls in `tex/latex/pxLST.sty` (in order):

```latex
\RequirePackage{expl3}
\RequirePackage{xparse,l3keys2e}
\RequirePackage{listings}
\RequirePackage{listingsutf8}
\RequirePackage[table]{xcolor}
\RequirePackage{tcolorbox}
\tcbuselibrary{listings,listingsutf8,breakable,xparse,skins}
```

Notes:
- `xcolor` with `[table]` option provides `\rowcolor` if used alongside tcolorbox tables; it also ensures the `darcula-*` colors are available for tcolorbox `colback`.
- `listingsutf8` enables `inputencoding=utf8` in listings; required for accent support.
- `skins` tcolorbox library provides `drop lifted shadow` and advanced frame styles used in `pxCodeBox`.
- `float` package is NOT required (pxLST uses `figure` environment, not the `float` package).
- `amssymb` is NOT required (math symbols in `algoritme` are defined inline as `$\leftarrow$` etc., which standard LaTeX math provides).

---

## 9. Non-Goals for v0.1

The following are explicitly OUT OF SCOPE for this sprint:

1. **`minted` backend**: pxLST v0.1 uses `listings` only. `minted` (Pygments-based) backend is a v0.2 candidate.
2. **Float counter separate from `figure`**: pxLST floats use `figure` environment. A dedicated `listing` float counter is deferred.
3. **Automatic language detection** from file extension in `\pxLSTinput`.
4. **Side-by-side listings** (two-column code comparisons).
5. **Interactive line highlighting** or line range selection (`firstline`, `lastline`) — these are available via `\pxLSTinput[language=pxJava]{file}` passing lstset options, but not as dedicated pxLST keys.
6. **Integration with `pxANX`** (glossary/listing list) — future sprint.
7. **`pxGDX`/`pxSRC` coloring themes** — pxLST uses its own Darcula palette only.
8. **Changing `morekeywords` at use time** (per-environment custom keywords beyond the language definition).

---

## 10. Rollout Order — T2/T3 Parallelism Strategy

T2 (`pxLST.sty`) and T3 (`pxLST.code.tex`) are dispatched in parallel. They are independent at the file level: `.sty` calls functions defined in `.code.tex`, but since both are written from this frozen spec, there is no implementation dependency at write time.

**T2 (`pxLST.sty`) implementation order:**
1. File header + `\RequirePackage` block
2. `\ProvidesExplPackage`
3. `\file_input:n{pxLST.code.tex}`
4. P3CTeX branded presets under `\@ifclassloaded{P3CTeX}`
5. `\ProcessKeysOptions{pxLST}`
6. `\__pxlst_apply_local_options:n` helper
7. `\pxLSTsetup`, `\pxLSTsavepreset`, `\pxLSTusepreset` commands
8. `\newtcblisting{pxCode}` (2 args: `O{}` + `m`)
9. `\newtcblisting{pxCodeBox}` (5 args: `O{}` + 4 `m`)
10. `\newtcblisting{pxCodeBreak}` (5 args: same, breakable forced)
11. `\NewDocumentCommand{\pxLSTinput}` (2 args: `O{}` + `m`)

**T3 (`pxLST.code.tex`) implementation order:**
1. File header + `\ProvidesExplFile`
2. Module variable declarations
3. `\keys_define:nn{pxLST}{...}`
4. `\msg_new:nnn` warnings
5. Darcula `\definecolor` palette (10 colors)
6. Display macro initialisations (`\def\pxlst@*@v{...}`)
7. Global `\lstset` baseline (UTF-8 + literate map)
8. Four `\lstdefinestyle{pxlst@*}` blocks
9. Seven `\lstdefinelanguage{px*}` blocks
10. `\__pxlst_set_style_vars:` function
11. `\pxlst@configure` PGF key definition (`\pgfkeys{/tcb/pxlst@configure/.code n args={1}{...}}`)
12. `\__pxlst_probe_emit:` function
13. `\pxLST_save_preset:nn`, `\pxLST_use_preset:n`
14. Built-in preset registrations (`darcula`, `minimal`, `academic`)
15. `\pxLST_set_options:n` (calls `\keys_set:nn` then `\__pxlst_set_style_vars:` then `\__pxlst_probe_emit:`)
16. `\pxLST_input_file:n` (tcolorbox + `\lstinputlisting` wrapper)
17. `\endinput`

**Smoke test between T2+T3 and T4:**
After T2 and T3 are written, the orchestrator runs a minimal smoke test:
```
pdflatex -halt-on-error -interaction=nonstopmode "stub-pxlst-smoke.tex"
```
where `stub-pxlst-smoke.tex` contains:
```latex
\documentclass{article}
\usepackage{pxLST}
\begin{document}
\begin{pxCode}{hello}
public class Hello { }
\end{pxCode}
\end{document}
```
Exit code 0 = green light for T4 and T5 dispatch.
