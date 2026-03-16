# pxLST Technical Memorandum (truthful)

> **Audience**: maintainers / AI agents resuming work on pxLST.
>
> **Purpose**: short retrospective focused on what actually exists in the repo.
>
> **Last updated**: 2026-03-16

## 1 Scope (current state)

- `pxLST` is implemented entirely in `tex/latex/pxLST.sty`.
- `tex/code/pxLST.code.tex` is a stub (reserved for a future split).
- Public API is **not key-value driven** at the top level; configuration is via:
  - `\pxLSTsetup[palette]{language}[lststyle]`

## 2 Incident: fragile palette expansion in `listings`

### Symptom

Earlier iterations tried to drive palette selection through expl3 token-list
variables and dynamic string expansion (e.g. constructing color names inside
`\color{...}`). When these macros were consumed by `listings` / `tcolorbox`,
the expansion model was too fragile and could break unexpectedly.

### Fix (implemented)

- Adopt a **three-macro palette model**:
  - each palette is a plain LaTeX2e macro:
    - `\pxLSTpaletteDark`, `\pxLSTpalettePastel`, `\pxLSTpaletteLight`
  - each palette macro just `\def`s the role commands and helper values to
    literal xcolor names, e.g.:
    - `\pxDEFlstfg` → `\color{dark-fg}`
    - `\pxDEFlstkeyword` → `\color{pastel-keyword}`
    - `\pxDEFlstbgv` → `light-bg`
    - `\pxDEFlstnumbervFifty` → `dark-number!50!`
  - `\pxLSTsetup[palette]{language}[style]` becomes the single entry point:
    it selects the palette by calling the appropriate `\pxLSTpalette...` macro
    and then forwards to `\lstset`.

This keeps the token lists that `listings` sees simple and predictable and
removes the dependency on expl3 tl state for colors.

## 3 Lessons learned / guardrails

- Avoid “smart dispatch layers” for `listings` option values; prefer literal tokens
  produced by simple `\def`-based macros.
- **Do not** add expl3 tl-based palette state or `.code.tex` indirection back into
  the color pipeline. Future palettes must follow the same three-macro pattern.
- Keep `\newtcblisting` usage (verbatim safety) and keep multi-word tcolorbox keys
  written with `~` inside expl3 `.sty` files.
- Keep line-break hook configuration conservative: malformed dimensions inside
  break hooks can fail hard at runtime.

