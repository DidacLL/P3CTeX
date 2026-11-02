# P3CTeX feature recovery inventory

Authoritative tree: \`restart/pre-tfg-clean-2026-11-01\`, initial HEAD \`026f26e380cf4171f041a4683a4d581feb261c27\`.

Comparison sources: \`feature/core-modules-audit-and-fix\` (including \`workflow/core-modules-fix-ledger.md\`, \`workflow/source-inclusion-design.md\`, \`workflow/student-tools-audit.md\`, \`tex/doc/api-corrections.md\`), \`main\`, and the named development branches \`feature/pxcmp-computation-diagrams\`, \`feature/pxgnt-optional-gantt\`, \`feature/tfg-mem-uoc-template\`. Feature branch inventories and module tests are evidence of intent, **not** proof of present behavior or compilation.

Status vocabulary: **Already correctly recovered** = present in the authoritative tree with a matching established interface (still subject to integration regression); **Recovered but needing correction** = partly implemented or known follow-up; **Awaiting implementation** = missing from authoritative tree; **Implemented and verified** = tested after reconstruction. No feature is excluded because an old API or implementation was defective.

Legend: B = authoritative branch, D = discarded \`feature/core-modules-audit-and-fix\`, M = discarded \`main\`. Source paths below are relative to \`tex/\`; **P** in correction column means preserve current API/behavior. All status labels reflect repository inspection at inventory creation, before reconstruction changes.

## Source management — owner pxSRC (rendering delegated to pxLST)

| Capability / previous user-visible behavior | Previous implementation | B status | Correction / accepted equivalent | Recovery status |
| --- | --- | --- | --- | --- |
| Native full-file \`\\pxInput{file}\` | D \`latex/pxSRC.sty\`, \`code/pxSRC.code.tex\` | Present | P; use source-relative child inputs | Already correctly recovered |
| Heading-based \`section={...}\` and \`subsection={...}\` direct extraction, without registration/markers | B \`code/pxSRC.code.tex\` | Present | P; mandatory accepted interface, no PR modifications | Already correctly recovered |
| Tagged region extraction \`region=...\` | D/B pxSRC code | Present | P; duplicate/unclosed validation | Already correctly recovered |
| Inclusive \`first-line\` / \`last-line\` selection | D/B pxSRC code | Present for native | Extend to literal and code selection; preserve validation | Recovered but needing correction |
| Registered source + registered defaults + per-use overrides | D pxSRC \`\\pxSource\`, \`\\pxUseSource\` | Minimal B registry | Restore renderer and default precedence, keep heading selector | Recovered but needing correction |
| External programming source as syntax-highlighted code \`as=code\` | D pxSRC + pxLST | Missing | Reuse pxLST file renderer; no new listings engine | Awaiting implementation |
| Literal text/CSV/log content \`as=text\` | D pxSRC | Missing | Literal, never execute TeX | Awaiting implementation |
| Container \`minipage\`, configurable width | D pxSRC | Missing | Local optional container, no float assumptions | Awaiting implementation |
| Source-relative native input/graphics paths | D/B pxSRC | Present | Preserve on filtered and nested imports | Already correctly recovered |
| Region prefix/suffix for non-TeX comment styles | D pxSRC | Missing | One selector engine for TeX, Python, shell etc. | Awaiting implementation |
| Label prefix + \`\\pxSourceRef\`, optional label type and nested scope | D pxSRC and ledger F02/F04 | Missing/partial | Preserve \`\\label[type]{...}\`, \`\\ref\`, and child scoping | Awaiting implementation |
| Captions, source labels and source metadata \`cite\`/\`terms\` | D pxSRC | Missing | Explicit metadata; no execution from verbatim | Awaiting implementation |
| Height-bounded source preview and linked full-source annex | D \`\\pxSourcePreview\`, \`\\pxUseSourcePreview\` | Missing | Reuse pxLST and annex owner; full source queued once | Awaiting implementation |
| Typed input defaults, nested override isolation, no option-history replay | D ledger F06/S06 | Missing | One l3keys state, no duplicate parser | Awaiting implementation |
| Image insertion \`\\pxIMG\`, pairs, list, safe placeholders and extension lookup | B/D pxSRC | Present | P | Already correctly recovered |
| Image setters, list behavior, source reference correctness | D student-tools audit | Partial | Port argument passing/list defects only; no new API | Recovered but needing correction |

## Code and terminal — owner pxLST

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Existing block, inline, external-file listings, language styles | B/D \`latex/pxLST.sty\` | Present | P, preserve existing public contracts | Already correctly recovered |
| Quotes, literal dollars, JLex/CUP backslash escapes | D pxLST + \`pxLST.quotes.test.tex\` | Missing fixes | Retain literal-by-default, explicit mathescape | Awaiting implementation |
| Plain terminal \`pxTerminal\` with existing listing palette | D pxLST | Missing | Use existing tcolorbox/listings renderer | Awaiting implementation |
| Line-range \`\\pxCodeChunk\` and original source line numbers | D pxLST | Missing | Reuse existing file renderer | Awaiting implementation |
| New display variants \`pxCodeMini\`, \`pxCodeBox\`, \`pxCodeBreak\`, \`pxCode*\` | D pxLST | Partial | No separate engine; preserve starred vs plain behavior | Recovered but needing correction |
| Original \`miniCode\`, \`CodeBox\`, \`CodeBox*\` and \`\\pxCodeIn\` interfaces | D ledger S03 | Partial | Restore argument conventions as proper aliases, not incompatible forwarding | Recovered but needing correction |
| Language, IO and syntax preset fixes | D pxLST tests | Partial | Port only justified renderer/fidelity corrections | Recovered but needing correction |

## Calculations — owner pxCALC (optional)

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Named evaluated variables, scoped update \`\\pxDefVar\`, \`\\pxSetVar\` | D \`latex/pxCALC.sty\`, \`code/pxCALC.code.tex\` | Missing | Scoped definitions, no extra global framework | Implemented and verified |
| Reusable live formulas and named symbol/unit \`\\pxDefFormula\` | D pxCALC | Missing | One-source formula, current input values | Implemented and verified |
| Nested \`\\frac\`, \`\\sqrt\`, slots, formula chains | D pxCALC | Missing | Diagnose cycles/missing names, preserve math display | Implemented and verified |
| \`\\pxSolve\` 1/2/3 steps, precision, units, per-call overrides | D pxCALC | Missing | Local options, no global presentation state | Implemented and verified |
| Numerical expressions \`\\pxCalc\`, unrounded store \`\\pxCalcStore\` | D pxCALC | Missing | Defined numeric results, no unintended rounding | Implemented and verified |
| Class/Core optional \`calculations\` / \`CALC\` selection | D pxCORE | Missing | Add opt-in keys only, preserve load-time class behavior | Recovered but needing correction |

## Diagrams — owner one coherent diagram package (not forwarding pxCMP wrappers)

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Unified presets, styles, \`\\pxDiagramSetup\`, save/use preset, generic diagram and note | D \`latex/pxDIA.sty\`, \`code/pxDIA.code.tex\`; M pxCMP | Missing | Direct owner, no wrapper or duplicate diagram engine | Awaiting implementation |
| Compiler T-diagrams, tombstone, compile/run, compiler pipeline, bootstrap, IR hub | D pxDIA; M pxCMP | Missing | Retain meaningful specialized interfaces | Awaiting implementation |
| Syntax trees, automata, state transitions, traces, transition tables, graphs | D pxDIA; M pxCMP | Missing | Preserve diagram-specific types and configurable styles | Awaiting implementation |
| BNF, derivations, regex/list, lexeme table, IR comparisons, inference rules | D pxDIA; M pxCMP | Missing | One diagram implementation | Awaiting implementation |
| Venn, logical groups, flowchart, memory/register/endian maps | D pxDIA; M pxCMP | Missing | Local styles and presets | Awaiting implementation |
| Decision trees, neural networks, confusion matrices, fuzzy plots | D pxDIA; M pxCMP | Missing | Preserve all specialized types | Awaiting implementation |
| Floating, uncaptioned and nonfloating label/counter/list correctness | D ledger F01/S01/S02 | Missing | Apply corrected standard figure semantics | Awaiting implementation |
| Multi-language preset headings, compiler/IR labels, valid identifier regex | D ledger F05, checkpoints 21/28 | Missing | Reuse pxTXT translations; fix invalid regex range | Awaiting implementation |

## Project management — owner pxPM (Gantt lives here)

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| SWOT/DAFO \`\\pxSWOT\` | D \`latex/pxPM.sty\`, \`code/pxPM.code.tex\` | Missing | Optional, local config, use table system where appropriate | Awaiting implementation |
| \`pxUserStory\`, as-a/want/so-that/acceptance criteria | D pxPM | Missing | Localized labels, user-editable content | Awaiting implementation |
| Given/When/Then \`pxScenario\` | D pxPM | Missing | Reuse document/container styling | Awaiting implementation |
| Actors/preconditions/main/alternative/postconditions \`pxUseCase\` | D pxPM | Missing | Distinct from stories and scenarios | Awaiting implementation |
| \`pxGantt\`, \`\\pxGanttItem\`, \`\\pxGanttEnd\` | M \`pxGNT\`; D pxPM | Missing | Gantt under pxPM, preserve command semantics | Awaiting implementation |
| Gantt environment, date scaling, label widths, split blocks, rotate | D pxPM | Missing | Chart-only rotation; no global landscape state | Awaiting implementation |
| PM language labels + \`\\pxPMsetup\` | D pxPM + pxTXT | Missing | Existing localization; local settings | Awaiting implementation |

## TFG, MEM, class, cover, page and PDF — natural owners pxTFG/pxMEM/P3CTeX/pxGDX

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| TFG/PR/MEM profile, metadata, final memory formatting | B \`latex/pxTFG.sty\`, \`latex/pxMEM.sty\` | Present | Preserve reconstructed behavior; do not replace class | Already correctly recovered |
| TFG tutor/PRA/area/credits/keywords and memory summary/abstract | D pxTFG / pxTXT and B pxTFG | Present partly | Check language-sensitive headings, metadata/page override | Recovered but needing correction |
| MEM chapter-level lists of figures/tables and TOC entries | D ledger F10; B pxMEM | Present partly | Verify heading level/anchors in integrated output | Recovered but needing correction |
| MEM source reuse and PR annex compatibility | D pxMEM; B heading \`\\pxInput\` | Present partially | Preserve direct heading extraction, ensure legacy adapters | Recovered but needing correction |
| License selection/page and CC assets | D/B pxTFG + class | Present | Check types, paths, localized text | Recovered but needing correction |
| Dynamic cover/title geometry and toggles | B pxGDX + P3CTeX; D improvements | Present | Preserve old cover profiles; port only fixes | Recovered but needing correction |
| Page rules, metadata and PDF link/color behavior | B pxGDX/P3CTeX | Present | Audit D differences without altering language timing | Recovered but needing correction |
| PAC/PR cover/TOC/no-plagi semantics and class option processing | B P3CTeX | Present | Keep eager Babel loading; reject D deferred-language architecture | Already correctly recovered |

## Endmatter, glossaries, bibliography and annexes — class + existing MEM/TXT, optional endmatter capability

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Explicit + queued annexes, numbering restore, one-time printing | D \`pxEND.sty/.code.tex\`; B pxMEM annex | Partial | One annex engine; class/MEM adapters; no permanent \`\\appendix\` in PAC | Recovered but needing correction |
| Auto annex queue order before glossary, chapter/section selection, cleveref names | D pxEND, ledger F03/F07/S04 | Missing | Own hooks once, localized reference names | Awaiting implementation |
| Optional glossary modes: used/all, auto/manual, toc, per-type output | D pxEND; B class \`glossary\` | Partial | Preserve existing class activation; no competing backend | Recovered but needing correction |
| Glossary declarations, acronyms/terms, group maps/files | D \`\\pxTerm\`, \`\\pxAcronym\`, etc. | Missing | Reuse glossaries and existing localization | Awaiting implementation |
| External indexed glossary backend tests | D pxEND + tests | Missing | Only opt-in backend, retain default no-index | Awaiting implementation |
| Native BibTeX/biblatex-compatible \`\\pxBibliography\` convenience | D pxEND | Missing | Do not force backend or modify normal \`\\cite\` | Awaiting implementation |
| Citation/glossary propagation through native versus code sources | D pxSRC + pxEND | Partial | Execution only for native; metadata explicit for code | Recovered but needing correction |

## Existing-module corrections, configuration, tests

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| pxTAB alignment, widths, presets, pxtbl, raw tables | B/D pxTAB + tests | Present | Compare defect fixes; do not rewrite working layout | Recovered but needing correction |
| pxUML model diagrams, \`pxpgf-umlcd\` compatibility | B/D pxUML | Present | Preserve class and standalone paths | Already correctly recovered |
| pxORL object/style configuration | B/D pxORL | Present | Only restore verified option issues | Recovered but needing correction |
| pxPRP property-list structures | B/D pxPRP | Present | Preserve established entry points | Already correctly recovered |
| pxCORE opt-in keys, package config tokens, load-time flags | B core, D core | Present partly | Preserve baseline eager option expansion + unknown behavior unless justified; add missing modules only | Recovered but needing correction |
| pxTXT CAT/ES/EN additions for source, diagrams, PM, TFG, annexes | D pxTXT, B pxTXT | Partial | Extend existing catalog; no duplicates | Recovered but needing correction |
| Regression fixtures for each feature, relevant multi-pass integration | D \`tests\`, B \`tests\` | Partial | Adapt targeted tests; do not import huge CI framework | Recovered but needing correction |

## Reconstruction order and evidence

1. **First bounded module: calculations** (pxCALC public package, associated code, optional pxCORE key and targeted regression). Keep the existing P3CTeX class and Babel loading untouched.
2. Source handling and listings, preserving the already accepted heading extraction.
3. Diagrams, then project-management including Gantt.
4. Endmatter / TFG/MEM finishing, existing-module fixes and integrated regression.

Verification ledger must record individual test commands, outputs, branch/commit and PDF inspection. The discarded ledger reports a passing CI run for commit \`dd8f6fd\` but expressly states that most subsequent checkpoints were not fully revalidated; that result is **not evidence** for this reconstruction.

No file from a discarded branch may be merged wholesale, and an unrecovered capability must not be declared unnecessary merely because its previous package or API design was rejected.

## Checkpoint: calculations recovered (2026-11-02)

Authoritative commits, in order:
- \`40c74eb\`: \`tex/code/pxCALC.code.tex\`, numerical evaluation and formula storage.
- \`4693971\`: \`tex/latex/pxCALC.sty\`, public commands.
- \`c5113ee\`: restored original targeted \`tex/tests/pxCALC.test.tex\`.
- \`0c70199\`: \`tex/code/pxCORE.code.tex\`, opt-in \`CALC\` / \`calculations\` only.
- Additional scope and class integration test commits recorded in Git history.

Functional equivalence: named/scoped values; live formulas, nested math, substitution; three steps; unit/precision; per-use values; unrounded store; missing/cyclic names. Public APIs remain \`\\pxDefVar\`, \`\\pxSetVar\`, \`\\pxDefFormula\`, \`\\pxSolve\`, \`\\pxCalc\`, \`\\pxCalcStore\`. No new global display settings, duplicate calculations engine, class parsing changes, or forced dependency on pxLST/pxSRC. Removed an unused \`\\prop_get:NnNTF\` variant from the discarded implementation.

**Actual local test evidence** (TeX Live pdfLaTeX, standalone module with the reconstructed implementation): \`test.tex\` compiled with \`-halt-on-error -interaction=nonstopmode\`, emitted \`PXCALC-PASS\` and created a one-page PDF; also diagnosed missing name and circular dependency as expected. \`scope.tex\` emitted \`PXCALC-SCOPE-PASS\`, including local group and values override tests. Rendered PDF inspected for equation, substitution, unit, and result stages. The matching repository fixtures are \`pxCALC.test.tex\` and \`pxCALC.scope.test.tex\`.

**Still pending**: class-level \`pxCALC.class-integration.test.tex\` compilation against the complete authoritative tree, optional/default module loading regression, and cross-module regression. Therefore the \`pxCORE\` selector is *not* classified as fully integrated/verified. Do not mark the overall calculations module complete until those checks pass. All other inventory rows remain open.
