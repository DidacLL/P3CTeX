# P3CTeX regression-fix ledger

Comparison baseline: `0657ad485f6dc133122a7b48032612159a59698c` (before pxTFG). Fix branch: `feature/core-modules-audit-and-fix`.

Review policy: preserve intended P3CTeX functionality, deliberate TFG formatting overrides, class-bound document components, and the established pxSRC (resource management) / pxLST (code presentation) boundary. Do not equate a large file, class dependency or an intentional override with a defect. Make small verified corrections, and preserve the public API unless a change is explicitly justified.

## Implementation checkpoints

- **F01 — fixed in checkpoint 1**: `pxDIAG.code.tex`, figure/float option passed through malformed `\exp_args:NnV \begin{figure}`; expand the actual placement token list instead. Extend diagram test with a floating caption and reference.
- **F02 — fixed in checkpoint 2**: `pxSRC.code.tex`, temporary `\label` override parses only a mandatory argument; preserve standard/cleveref optional label type and isolate nested native inputs.
- **F03 — fixed in checkpoint 3**: `pxANN`, register annex reference type for cleveref; preserve standard `\ref` and language selection.
- **F04 — explicit opt-in support added in checkpoint 8; automatic namespace policy not imposed**: `pxMEM` source inclusion and imported-reference scope (potential label collisions across PR documents); check intended label-prefix contract and native `\ref` semantics, not an automatic rewrite.
- **F05 — fixed in checkpoints 4 and 6**: translate user-visible literal strings in newly introduced TFG/diagram features via existing `pxTXT`; legitimate TFG presentation overrides are not a bug.
- **F06 — native unfiltered scan removed in checkpoint 9; default replay replaced in checkpoint 13; fancyvrb internals retained pending fidelity proof**: `pxSRC/input` configuration string accumulation/replay, scanner on simple native inputs, and dependency on private fancyvrb internals. Simplify only where semantics and existing tests can be preserved.
- **F07 — review**: annex/glossary/bibliography document-end interaction from a single user-facing workflow; do not rename/delete packages without tracing all callers.
- **F08 — fixed in checkpoint 5**: pxCORE previously accepted nonfunctional config keys. `TABconfig` and `ORLconfig` now reach their package processors; `TFGconfig` uses the existing `\pxTFGsetup` API; unsupported `PRPconfig`, `LSTconfig` and `MEMconfig` were removed.

- **F09 — fixed in checkpoint 7**: reject post-load use of the legacy glossary class switch rather than silently changing a boolean that cannot load/unload the package.
- **F10 — fixed in checkpoint 11**: MEM lists of figures and tables now use chapter-level headings and enter the chapter-level TOC.

## Newly catalogued smells / deferred questions

- **S01 (DIAG)**: `label=` is silently ignored when `float=` is omitted. Determine whether a nonfloating diagram should have a reference counter or should reject `label`; avoid inventing numbering in this checkpoint.
- **S02 (DIAG)**: floating diagram labels are currently emitted even without a caption, so they may inherit an unrelated `\@currentlabel`; review the contract.
- **S05 (load-time)**: existing module config keys use `.tl_set_x:N` and can prematurely expand arbitrary user macros; TFGconfig now stores tokens unexpanded. Audit UML/SRC/DIAG/TAB/ORL key expansion separately before changing long-standing behavior.
- **S04 (ANN)**: cleveref plural for the custom `pxannex` type currently reuses Babel's `\appendixname` in both forms; defer a fully localized plural string to the pxTXT integration review rather than hardcoding incorrect suffixes.
- **S03 (API)**: previous changes renamed legacy `miniCode`, `CodeBox`, `CodeBox*`, and `\pxCodeIn` entry points in pxLST. Check actual compatibility requirements before reintroducing aliases.

## Validation

Checkpoint 1: code replacement and test registration inspected statically; multi-pass compilation is **not** claimed by this ledger. The existing reported test pass does not cover this new float test until rerun.

Checkpoint 2: native source label override now understands `\label[type]{key}`, resets the label dispatcher for nested no-prefix inputs, and retains the caller's prefix when the child returns. Added fixture and focused regression document. Compilation has not been run for this checkpoint.

Checkpoint 3: register `pxannex` with cleveref only if loaded, using current `\appendixname`; extend automatic-annex document with `\cref`. No compilation claimed.

Checkpoint 4: TFG public labels, cover data, licence, summary and abstract headings now resolve through pxTXT; TFG's exceptional cover geometry, page rules, front-matter sequence and metadata are untouched. Static substitution checked; compilation not claimed.

Checkpoint 5: pxCORE now forwards TAB/ORL package options to their package key processors, and applies TFG metadata through the existing public pxTFGsetup after loading pxTFG. Removed nonfunctional PRPconfig, LSTconfig and MEMconfig keys (none has a package configuration entry point). Added source-label and TFG-language tests to the standard runner. No compile claimed.

Checkpoint 6: added pxTXT translations for DIAG terminology and timing labels, with standalone English defaults in pxDIAG.sty; replaced seven hardcoded user-visible strings in pxDIAG. Other diagram semantics and formatting unchanged. Not yet compiled.

Checkpoint 7: the legacy `glossary` class key is now explicitly load-time only (like tool selection); runtime attempts report an error without mutating the loaded state. User-level glossary output remains controlled by `\pxGlossarySetup`. Added a public-API negative regression with redirected warning. Not yet compiled.

Checkpoint 8: MEM inclusion accepts an optional pxSRC input-key list, allowing `label-prefix=PR1:` for reused source documents. Legacy two-argument calls and unmodified `\ref` semantics are preserved. Updated manual, two-source collision fixture and test registration. No compilation claimed.

Checkpoint 9: unfiltered `as=native` includes no longer read/scan the whole source file before ordinary native inclusion. Region/range native requests and all literal/code requests retain existing validation and line-bound handling. Existing native/nested/fragment tests exercise both branches; not compiled in this session.

Checkpoint 10: corrected the float regression test fixture created in checkpoint 1: literal `\n` escape sequences had produced a malformed test, with the new case inside a comment. This checkpoint replaces those escapes with actual lines. The float implementation itself was unchanged. Regression compile still required.

Checkpoint 11: MEM's figures/tables lists use its own chapter-level headings, are registered in the chapter-level TOC, and still use standard `.lof`/`.lot` sources and Babel titles. This only affects MEM's preliminary list rendering and leaves TFG's exceptional formatting untouched. Multi-pass TOC verification remains pending.

## Independent TeX probes (2026-10-31)

- TeX Live pdfLaTeX: targeted float expansion probe compiled and produced a numbered floating figure.
- TeX Live pdfLaTeX, hyperref and cleveref: prefixed optional labels and nested unprefixed labels produced the intended three AUX entries after two passes.
- TeX Live pdfLaTeX: article-based MEM chapter/list construction compiled in two passes; `.toc` contained chapter-level figures/tables entries.
- These were **isolated reproductions**, not the complete P3CTeX repository builds. GitHub branch read-back verified commit paths and content; no GitHub Actions workflow runs were available for the branch. Full module test and multi-pass template compilation remain required before declaring the branch release-ready.

Checkpoint 13: `pxSRC/input` no longer appends every historical input setting into a growing token list. Validated keys are stored once per key in a scoped property, retaining last-value precedence and earlier unrelated keys. Per-input defaults are still reset and restored independently for nested sources. Added `pxSRC.defaults.test.tex` to the runner. An isolated TeX Live expl3 probe verified comma-bearing values, replacements, key retention and grouping; no full P3CTeX compile is claimed.
