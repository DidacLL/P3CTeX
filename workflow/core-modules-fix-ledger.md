# P3CTeX regression-fix ledger

Comparison baseline: `0657ad485f6dc133122a7b48032612159a59698c` (before pxTFG). Fix branch: `feature/core-modules-audit-and-fix`.

Review policy: preserve intended P3CTeX functionality, deliberate TFG formatting overrides, class-bound document components, and the established pxSRC (resource management) / pxLST (code presentation) boundary. Do not equate a large file, class dependency or an intentional override with a defect. Make small verified corrections, and preserve the public API unless a change is explicitly justified.

## Implementation checkpoints

- **F01 — fixed in checkpoint 1**: `pxDIAG.code.tex`, figure/float option passed through malformed `\exp_args:NnV \begin{figure}`; expand the actual placement token list instead. Extend diagram test with a floating caption and reference.
- **F02 — fixed in checkpoint 2**: `pxSRC.code.tex`, temporary `\label` override parses only a mandatory argument; preserve standard/cleveref optional label type and isolate nested native inputs.
- **F03 — fixed in checkpoint 3**: `pxANN`, register annex reference type for cleveref; preserve standard `\ref` and language selection.
- **F04 — explicit opt-in support added in checkpoint 8; automatic namespace policy not imposed**: `pxMEM` source inclusion and imported-reference scope (potential label collisions across PR documents); check intended label-prefix contract and native `\ref` semantics, not an automatic rewrite.
- **F05 — fixed in checkpoints 4 and 6**: translate user-visible literal strings in newly introduced TFG/diagram features via existing `pxTXT`; legitimate TFG presentation overrides are not a bug.
- **F06 — typed defaults implemented in checkpoint 18; full branch verification pending. Native unfiltered scan removed in checkpoint 9; fancyvrb extraction retained for source fidelity.**: `pxSRC/input` configuration string accumulation/replay, scanner on simple native inputs, and dependency on private fancyvrb internals. Simplify only where semantics and existing tests can be preserved.
- **F07 — review**: annex/glossary/bibliography document-end interaction from a single user-facing workflow; do not rename/delete packages without tracing all callers.
- **F08 — fixed in checkpoint 5**: pxCORE previously accepted nonfunctional config keys. `TABconfig` and `ORLconfig` now reach their package processors; `TFGconfig` uses the existing `\pxTFGsetup` API; unsupported `PRPconfig`, `LSTconfig` and `MEMconfig` were removed.

- **F09 — fixed in checkpoint 7**: reject post-load use of the legacy glossary class switch rather than silently changing a boolean that cannot load/unload the package.
- **F10 — fixed in checkpoint 11**: MEM lists of figures and tables now use chapter-level headings and enter the chapter-level TOC.

## Newly catalogued smells / deferred questions

- **S06 (pxSRC defaults)**: resolved in checkpoint 18: direct `l3keys` assignments to typed persistent defaults, copied into per-input working variables. No option-history strings, property replay or key-value reconstruction remain. Full suite pending.

- **S01 (DIAG)**: fixed in checkpoint 19 — nonfloating diagrams with `label=` receive a figure counter, a visible numbered caption (if supplied), and a list-of-figures entry. Unlabelled diagrams retain their previous unnumbered appearance.
- **S02 (DIAG)**: fixed in checkpoint 17 — uncaptained floats with `label=` advance the normal figure counter before registering their reference; `caption=` still uses standard `\caption`.
- **S05 (load-time)**: resolved in checkpoint 16 — all forwarded UML/SRC/DIAG/TAB/ORL config keys retain token arguments until package loading, as `TFGconfig` already does.
- **S04 (ANN)**: resolved in checkpoint 15 — `cleveref` plural annex names use localized `pxTXT` strings; standalone uses Babel's existing appendix heading as fallback.
- **S03 (API)**: resolved in checkpoint 14 — restored old `miniCode`, `CodeBox`, `CodeBox*`, and `\pxCodeIn` contracts without duplicating the three verbatim listing environments.

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

Checkpoint 13 (provisional, needs redesign): the stored-key property avoids accumulating historical option text, but it still reparses configuration and reconstructs keys during each inclusion. The regression file was added; **passing it in the full repository suite has not been established**. Do not treat this checkpoint as verified or architecture-clean.

Checkpoint 14: restored pre-TFG listing entry points that had been renamed during migration. Environment names alias the existing verbatim-aware tcolorbox implementations (both begin/end CS pairs); `\pxCodeIn` keeps its original mandatory-argument parsing instead of aliasing the incompatible verbatim-argument `\pxCodeInline`. Added legacy-API test. An isolated TeX Live tcolorbox probe compiled both plain and starred aliases; full module test remains outstanding.

Checkpoint 15: restored distinct singular/plural annex reference names for `cleveref` without changing the annex engine. P3CTeX uses CAT/ES/EN strings through pxTXT; standalone pxANN retains a Babel fallback. Expanded the existing annex test to reference a pair.

Checkpoint 16: changed five pxCORE config-key setters from eager `.tl_set_x:N` to token-preserving `.tl_set:N`, without changing their names or forwarding branches. TeX Live confirmed that `\\RequirePackage[\\l_config_tl]` expands the stored option list when loading the target package; a late-defined macro receives its current value at that point. Added config-token regression. Also corrected stale pxLST and pxCORE manual comments that advertised nonexistent aliases or repeated their own key names. Repository compilation remains pending.

Checkpoint 17: corrected `pxDIAG` references when `float=` and `label=` are present without a caption; the figure counter now advances normally, so labels cannot inherit a previous section. Existing captioned floats are unchanged. Focused test added and isolated article-class figure-counter probe verified the behavior; complete module compile remains pending.

Checkpoint 18: replaced checkpoint 13's key-value property roundtrip with direct `l3keys` assignments to typed default variables and simple grouped copies into working input variables. Preserves the existing `\pxSRCsetup{input={...}}` and `\pxInput` API, default mode precedence, nested input isolation and grouping. Updated `pxSRC.defaults.test.tex` for typed int/clist defaults and repeated overrides. Whole-branch TeX compilation not yet run.

Checkpoint 19: nonfloating `pxDIAG` labels now generate proper figure references instead of silently doing nothing; labelled captions show the number and enter the figure list. Unlabelled nonfloat presentation is unchanged; float behavior remains on the normal LaTeX caption path. Added focused counter/reference test. Full module compilation not claimed.

Checkpoint 20: read-back revealed a typo in checkpoint 18 (`\\choices_set_eq:NN` in the copied container option); corrected to the valid `\\tl_set_eq:NN`. This regression was introduced by the refactor itself, not by the original source. Focused and full test execution remain required.

Checkpoint 21: localized 16 more built-in compiler-model and IR-hub labels in pxDIAG through pxTXT (analysis/synthesis, compiler stages, source/target languages, symbols and errors). Standalone pxDIAG retains English fallback labels; diagram geometry and public commands unchanged. Earlier translation covered only seven labels. Full branch compile pending.

Checkpoint 22: removed the never-read global `\g__pxmem_annex_bool` from pxMEM; its adapter still delegates directly to pxANN, with no behavioral change. Corrected api-corrections.md to reflect the previously restored legacy listing names instead of falsely documenting their removal. Extended the existing diagram-language test to cover the newly localized compiler diagram and IR hub. No complete repository compilation claimed.
