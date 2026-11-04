# P3CTeX feature recovery inventory


## Consolidated recovery worktree — 2026-11-02

Branch: `rebuild/full-feature-recovery-2026-11-02`. Foundation PAC/PR/TFG/MEM fixes and recovered diagrams remain intact. Restored optional project-management/Gantt, specialized code-listing languages and legacy interfaces, original CAT/ES/EN labels, and independent opt-in `pxGLS` and `pxANX` modules. MEM activates `pxANX`, independently of TFG; annexes remain owned by `pxANX`. Normal BibTeX/biblatex are not replaced; `\pxBibliography` is a small optional convenience.

The owner explicitly discarded source previews (`\pxSourcePreview` / `\pxUseSourcePreview`), including automatic preview-to-annex forwarding. `pxSRC` has no MEM dependency. `pxGLS` is inactive unless selected (`glossary` or `GLS`/`glossaries`), and `pxANX` can be selected independently; selecting MEM additionally activates it. The monolithic `pxEND` remains rejected.

The integrated full-feature fixtures and old regression suites are committed, but **the combined feature recovery has not yet received an actual full-class TeX build**. No new GitHub Actions runs have been initiated. This is an implementation worktree, not a released or verified replacement.


Authoritative tree: `restart/pre-tfg-clean-2026-11-01`, initial HEAD `026f26e380cf4171f041a4683a4d581feb261c27`.

Comparison sources: `feature/core-modules-audit-and-fix` (including `workflow/core-modules-fix-ledger.md`, `workflow/source-inclusion-design.md`, `workflow/student-tools-audit.md`, `tex/doc/api-corrections.md`), `main`, and the named development branches `feature/pxcmp-computation-diagrams`, `feature/pxgnt-optional-gantt`, `feature/tfg-mem-uoc-template`. Feature branch inventories and module tests are evidence of intent, **not** proof of present behavior or compilation.

Status vocabulary: **Already correctly recovered** = present in the authoritative tree with a matching established interface (still subject to integration regression); **Recovered but needing correction** = partly implemented or known follow-up; **Awaiting implementation** = missing from authoritative tree; **Implemented and verified** = tested after reconstruction. No feature is excluded because an old API or implementation was defective.

Legend: B = authoritative branch, D = discarded `feature/core-modules-audit-and-fix`, M = discarded `main`. Source paths below are relative to `tex/`; **P** in correction column means preserve current API/behavior. All status labels reflect repository inspection at inventory creation, before reconstruction changes.

## Module ownership correction — 2026-11-02

`pxANX.sty` + `pxANX.code.tex` now own annex rendering, numbering, queuing, manual/automatic output and Cleveref names, in both ordinary article/PAC/PR and MEM. MEM loads `pxANX` because a memory-style document includes annex support, but MEM introduces no alias or annex implementation. TFG alone does not select MEM or annexes. `pxGLS.sty` + `pxGLS.code.tex` own optional glossary/acronym commands and print lifecycle, with no default loading. P3CTeX's `glossary`/`glossary-backend` and `annexes` keys forward initial activation to `pxCORE`; direct standalone `\usepackage{pxGLS}` and `\usepackage{pxANX}` are supported. `pxEND` remains rejected. The distinct-module and combined-mode fixtures are committed; they are not yet compiled.

## Integration verification checkpoint — 2026-11-02

**Scope and evidence:** Task branch `fix/foundation-integration-2026-11-02`, starting at `987e2d7181174f1d59ba45424058822fd05d9772`. This is a **partial verification checkpoint, not acceptance of the full foundation**. The complete GitHub tree was inspected through the repository connection, but the isolated TeX runtime could not clone/download the repository (`git ls-remote`: `Could not resolve host: github.com`). Its local staging area contains the exact committed `pxMEM.sty` and `pxMEM.code.tex` blobs, and three committed standalone MEM fixtures. Therefore a complete `P3CTeX.cls` build is **not yet verified**.

| Existing behavior | Source state at the starting commit | Verified by a complete P3CTeX class build? | Executed verification / remaining gate |
| --- | --- | --- | --- |
| PAC/PR defaults, covers, contents, running pages and PDF settings | Reconstructed class / pxGDX files present | **No** | Class regression, cover/no-cover matrix, PDF visual output still required |
| TFG/PR/MEM metadata, language-dependent workcard, abstracts and licence page | pxTFG, pxTXT and pxMEM files and targeted fixtures present | **No** | `pxTFG.presentation-recovery.test.tex`, three-language pages and template examples still required |
| MEM chapter/annex numbering, Hyperref/Cleveref targets | Existing pxMEM implementation, unchanged | **No** | **Standalone verified**: `pxMEM.standalone.test.tex` and `pxMEM.annex-references.test.tex`, three pdfLaTeX passes each; 6-page and 5-page PDFs inspected; annex A/B and nested section/figure/table/equation labels have distinct, correct `.aux` destinations |
| MEM annex-to-glossary ordering | Existing pxMEM deferred annex and optional native glossaries | **No** | **Standalone verified**: `pxMEM.annex-glossary-interaction.test.tex`, three passes; 3-page PDF shows annex term on page 2 and glossary entry on page 3. One nonfatal `glossaries` notice remains |
| Native PR heading/subsection extraction and nested relative paths; source labels and code/text modes | pxSRC / pxLST implementation and fixtures present | **No** | Earlier isolated source probes recorded below; committed integration fixtures and actual PR/MEM examples still need full build |
| Code listings, terminal, inline and custom global listing styles | Existing pxLST implementation and fixture present | **No** | Earlier isolated listing probes only; `pxLST.recovery.test.tex` must run against full tree |
| Optional calculations through `pxCORE` and actual class | Existing pxCALC implementation, opt-in CORE selector and fixtures present | **No** | Earlier isolated pxCALC and CORE probes only; `pxCALC.class-integration.test.tex` must run against actual class |
| Other source domains, table/diagram modules and optional bibliography behavior | Existing sources unchanged | **No** | Not tested in this checkpoint; no completion claim |

Executed from the staged `tex/tests` directory with `TEXINPUTS=".:../latex//:../code//:"`: each of `pxMEM.standalone.test.tex`, `pxMEM.annex-references.test.tex`, and `pxMEM.annex-glossary-interaction.test.tex` passed three `pdflatex -halt-on-error -interaction=nonstopmode` passes. The relevant PDFs were text-inspected; the annex-reference `.aux` contains `pxmemannex.1` and `pxmemannex.2` and distinct nested targets without duplicate-destination warnings. The two committed pxMEM implementation files in the staging area were checked with `git hash-object` against the starting-commit Git blob SHAs (`ba106aa8...` and `68800c72...`).

**Defects corrected in this checkpoint:** none; the executed standalone paths did not reproduce a functional source defect, so working modules were not altered. **Unresolved verification:** complete repository retrieval, committed class-level fixture execution, multi-pass PAC/PR/TFG/MEM builds and visual cover/listing review. The preceding feature-recovery rows are historical inventory, not proof of class-level verification. Do not promote any foundation feature to class-verified from this checkpoint.

## Source management — owner pxSRC (rendering delegated to pxLST)

| Capability / previous user-visible behavior | Previous implementation | B status | Correction / accepted equivalent | Recovery status |
| --- | --- | --- | --- | --- |
| Native full-file `\pxInput{file}` | D `latex/pxSRC.sty`, `code/pxSRC.code.tex` | Present | P; use source-relative child inputs | Already correctly recovered |
| Heading-based `section={...}` and `subsection={...}` direct extraction, without registration/markers | B `code/pxSRC.code.tex` | Present | P; mandatory accepted interface, no PR modifications | Already correctly recovered |
| Tagged region extraction `region=...` | D/B pxSRC code | Present | P; duplicate/unclosed validation | Already correctly recovered |
| Inclusive `first-line` / `last-line` selection | D/B pxSRC code | Present for native | Extend to literal and code selection; preserve validation | Recovered but needing correction |
| Registered source + registered defaults + per-use overrides | D pxSRC `\pxSource`, `\pxUseSource` | Minimal B registry | Restore renderer and default precedence, keep heading selector | Recovered but needing correction |
| External programming source as syntax-highlighted code `as=code` | D pxSRC + pxLST | Missing | Reuse pxLST file renderer; no new listings engine | Recovered but needing correction |
| Literal text/CSV/log content `as=text` | D pxSRC | Missing | Literal, never execute TeX | Recovered but needing correction |
| Container `minipage`, configurable width | D pxSRC | Missing | Local optional container, no float assumptions | Recovered but needing correction |
| Source-relative native input/graphics paths | D/B pxSRC | Present | Preserve on filtered and nested imports | Already correctly recovered |
| Region prefix/suffix for non-TeX comment styles | D pxSRC | Missing | One selector engine for TeX, Python, shell etc. | Recovered but needing correction |
| Label prefix + `\pxSourceRef`, optional label type and nested scope | D pxSRC and ledger F02/F04 | Missing/partial | Preserve `\label[type]{...}`, `\ref`, and child scoping | Recovered but needing correction |
| Captions, source labels and source metadata `cite`/`terms` | D pxSRC | Missing | Explicit metadata; no execution from verbatim | Recovered but needing correction |
| Height-bounded source preview and linked full-source annex | D `\pxSourcePreview`, `\pxUseSourcePreview` | Missing | Reuse pxLST and annex owner; full source queued once | Discarded by explicit owner decision; use ordinary source inclusion inside MEM annexes |
| Typed input defaults, nested override isolation, no option-history replay | D ledger F06/S06 | Missing | One l3keys state, no duplicate parser | Recovered but needing correction |
| Image insertion `\pxIMG`, pairs, list, safe placeholders and extension lookup | B/D pxSRC | Present | P | Already correctly recovered |
| Image setters, list behavior, source reference correctness | D student-tools audit | Partial | Port argument passing/list defects only; no new API | Recovered but needing correction |

## Code and terminal — owner pxLST

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Existing block, inline, external-file listings, language styles | B/D `latex/pxLST.sty` | Present | P, preserve existing public contracts | Already correctly recovered |
| Quotes, literal dollars, JLex/CUP backslash escapes | D pxLST + `pxLST.quotes.test.tex` | Missing fixes | Retain literal-by-default, explicit mathescape | Recovered but needing correction | (global OT1/T1 and code source quote path restored; JLex/CUP coverage still pending)
| Plain terminal `pxTerminal` with existing listing palette | D pxLST | Missing | Use existing tcolorbox/listings renderer | Recovered but needing correction |
| Line-range `\pxCodeChunk` and original source line numbers | D pxLST | Missing | Reuse existing file renderer | Recovered but needing correction |
| New display variants `pxCodeMini`, `pxCodeBox`, `pxCodeBreak`, `pxCode*` | D pxLST | Partial | No separate engine; preserve starred vs plain behavior | Recovered but needing correction |
| Original `miniCode`, `CodeBox`, `CodeBox*` and `\pxCodeIn` interfaces | D ledger S03 | Partial | Restore argument conventions as proper aliases, not incompatible forwarding | Recovered but needing correction |
| Language, IO and syntax preset fixes | D pxLST tests | Partial | Port only justified renderer/fidelity corrections | Recovered but needing correction |

## Calculations — owner pxCALC (optional)

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Named evaluated variables, scoped update `\pxDefVar`, `\pxSetVar` | D `latex/pxCALC.sty`, `code/pxCALC.code.tex` | Missing | Scoped definitions, no extra global framework | Implemented and verified |
| Reusable live formulas and named symbol/unit `\pxDefFormula` | D pxCALC | Missing | One-source formula, current input values | Implemented and verified |
| Nested `\frac`, `\sqrt`, slots, formula chains | D pxCALC | Missing | Diagnose cycles/missing names, preserve math display | Implemented and verified |
| `\pxSolve` 1/2/3 steps, precision, units, per-call overrides | D pxCALC | Missing | Local options, no global presentation state | Implemented and verified |
| Numerical expressions `\pxCalc`, unrounded store `\pxCalcStore` | D pxCALC | Missing | Defined numeric results, no unintended rounding | Implemented and verified |
| Class/Core optional `calculations` / `CALC` selection | D pxCORE | Missing | Add opt-in keys only, preserve load-time class behavior | Recovered but needing correction |

## Diagrams — owner one coherent diagram package (not forwarding pxCMP wrappers)

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Unified presets, styles, `\pxDiagramSetup`, save/use preset, generic diagram and note | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; M pxCMP | Missing | Direct owner, no wrapper or duplicate diagram engine | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| Compiler T-diagrams, tombstone, compile/run, compiler pipeline, bootstrap, IR hub | D pxDIA; M pxCMP | Missing | Retain meaningful specialized interfaces | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| Syntax trees, automata, state transitions, traces, transition tables, graphs | D pxDIA; M pxCMP | Missing | Preserve diagram-specific types and configurable styles | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| BNF, derivations, regex/list, lexeme table, IR comparisons, inference rules | D pxDIA; M pxCMP | Missing | One diagram implementation | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| Venn, logical groups, flowchart, memory/register/endian maps | D pxDIA; M pxCMP | Missing | Local styles and presets | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| Decision trees, neural networks, confusion matrices, fuzzy plots | D pxDIA; M pxCMP | Missing | Preserve all specialized types | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| Floating, uncaptioned and nonfloating label/counter/list correctness | D ledger F01/S01/S02 | Missing | Apply corrected standard figure semantics | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| Multi-language preset headings, compiler/IR labels, valid identifier regex | D ledger F05, checkpoints 21/28 | Missing | Reuse pxTXT translations; fix invalid regex range | Recovered in pxDIA; isolated compilation evidence, combined integration pending |

## Project management — owner pxPM (Gantt lives here)

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| SWOT/DAFO `\pxSWOT` | D `latex/pxPM.sty`, `code/pxPM.code.tex` | Missing | Optional, local config, use table system where appropriate | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| `pxUserStory`, as-a/want/so-that/acceptance criteria | D pxPM | Missing | Localized labels, user-editable content | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| Given/When/Then `pxScenario` | D pxPM | Missing | Reuse document/container styling | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| Actors/preconditions/main/alternative/postconditions `pxUseCase` | D pxPM | Missing | Distinct from stories and scenarios | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| `pxGantt`, `\pxGanttItem`, `\pxGanttEnd` | M `pxGNT`; D pxPM | Missing | Gantt under pxPM, preserve command semantics | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| Gantt environment, date scaling, label widths, split blocks, rotate | D pxPM | Missing | Chart-only rotation; no global landscape state | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| PM language labels + `\pxPMsetup` | D pxPM + pxTXT | Missing | Existing localization; local settings | Recovered in optional pxPM, includes Gantt; actual module compilation pending |

## TFG, MEM, class, cover, page and PDF — natural owners pxTFG/pxMEM/P3CTeX/pxGDX

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| TFG/PR/MEM profile, metadata, final memory formatting | B `latex/pxTFG.sty`, `latex/pxMEM.sty` | Present | Preserve reconstructed behavior; do not replace class | Already correctly recovered |
| TFG tutor/PRA/area/credits/keywords and memory summary/abstract | D pxTFG / pxTXT and B pxTFG | Present partly | Check language-sensitive headings, metadata/page override | Recovered but needing correction |
| MEM chapter-level lists of figures/tables and TOC entries | D ledger F10; B pxMEM | Present partly | Verify heading level/anchors in integrated output | Recovered but needing correction |
| MEM source reuse and PR annex compatibility | D pxMEM; B heading `\pxInput` | Present partially | Preserve direct heading extraction, ensure legacy adapters | Recovered but needing correction |
| License selection/page and CC assets | D/B pxTFG + class | Present | Check types, paths, localized text | Recovered but needing correction |
| Dynamic cover/title geometry and toggles | B pxGDX + P3CTeX; D improvements | Present | Preserve old cover profiles; port only fixes | Recovered but needing correction |
| Page rules, metadata and PDF link/color behavior | B pxGDX/P3CTeX | Present | Audit D differences without altering language timing | Recovered but needing correction |
| PAC/PR cover/TOC/no-plagi semantics and class option processing | B P3CTeX | Present | Keep eager Babel loading; reject D deferred-language architecture | Already correctly recovered |

## Endmatter, glossaries, bibliography and annexes — optional `pxANX` + `pxGLS` modules; class selects, MEM consumes

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| Explicit + queued annexes, numbering restore, one-time printing | D `pxEND.sty/.code.tex`; current `pxANX` | Partial | One annex engine; class/MEM adapters; no permanent `\appendix` in PAC | Recovered but needing correction |
| Auto annex queue order before glossary, chapter/section selection, cleveref names | D pxEND, ledger F03/F07/S04; current pxANX | Missing | Own hooks once, localized reference names | Independent `pxANX` queue and references restored; MEM uses the public API; full integration pending |
| Optional glossary modes: used/all, auto/manual, toc, per-type output | D pxEND; B class `glossary` | Partial | Preserve existing class activation; no competing backend | Recovered but needing correction |
| Glossary declarations, acronyms/terms, group maps/files | D `\pxTerm`, `\pxAcronym`, etc. | Missing | Reuse native glossaries via optional `pxGLS` and existing localization | Restored as `pxGLS` APIs; package is not loaded by default |
| External indexed glossary backend tests | D pxEND + tests | Missing | Only opt-in backend, retain default no-index | Opt-in backend restored in `pxGLS`, with a class option forwarding adapter; integration tests pending |
| Native BibTeX/biblatex-compatible `\pxBibliography` convenience | D pxEND | Missing | Do not force backend or modify normal `\cite` | Native bibliography retained; lightweight class convenience restored |
| Citation/glossary propagation through native versus code sources | D pxSRC + pxEND | Partial | Execution only for native; metadata explicit for code | Recovered but needing correction |

## Existing-module corrections, configuration, tests

| Capability / behavior | Previous implementation | B status | Correction | Recovery status |
| --- | --- | --- | --- | --- |
| pxTAB alignment, widths, presets, pxtbl, raw tables | B/D pxTAB + tests | Present | Compare defect fixes; do not rewrite working layout | Recovered but needing correction |
| pxUML model diagrams, `pxpgf-umlcd` compatibility | B/D pxUML | Present | Preserve class and standalone paths | Already correctly recovered |
| pxORL object/style configuration | B/D pxORL | Present | Only restore verified option issues | Recovered but needing correction |
| pxPRP property-list structures | B/D pxPRP | Present | Preserve established entry points | Already correctly recovered |
| pxCORE opt-in keys, package config tokens, load-time flags | B core, D core | Present partly | Preserve baseline eager option expansion + unknown behavior unless justified; add missing modules only | Recovered but needing correction |
| pxTXT CAT/ES/EN additions for source, diagrams, PM, TFG, annexes | D pxTXT, B pxTXT | Partial | Extend existing catalog; no duplicates | Recovered but needing correction |
| Regression fixtures for each feature, relevant multi-pass integration | D `tests`, B `tests` | Partial | Adapt targeted tests; do not import huge CI framework | Recovered but needing correction |

## Reconstruction order and evidence

1. **First bounded module: calculations** (pxCALC public package, associated code, optional pxCORE key and targeted regression). Keep the existing P3CTeX class and Babel loading untouched.
2. Source handling and listings, preserving the already accepted heading extraction.
3. Diagrams, then project-management including Gantt.
4. Endmatter / TFG/MEM finishing, existing-module fixes and integrated regression.

Verification ledger must record individual test commands, outputs, branch/commit and PDF inspection. The discarded ledger reports a passing CI run for commit `dd8f6fd` but expressly states that most subsequent checkpoints were not fully revalidated; that result is **not evidence** for this reconstruction.

No file from a discarded branch may be merged wholesale, and an unrecovered capability must not be declared unnecessary merely because its previous package or API design was rejected.

## Checkpoint: calculations recovered (2026-11-02)

Authoritative commits, in order:
- `40c74eb`: `tex/code/pxCALC.code.tex`, numerical evaluation and formula storage.
- `4693971`: `tex/latex/pxCALC.sty`, public commands.
- `c5113ee`: restored original targeted `tex/tests/pxCALC.test.tex`.
- `0c70199`: `tex/code/pxCORE.code.tex`, opt-in `CALC` / `calculations` only.
- Additional scope and class integration test commits recorded in Git history.

Functional equivalence: named/scoped values; live formulas, nested math, substitution; three steps; unit/precision; per-use values; unrounded store; missing/cyclic names. Public APIs remain `\pxDefVar`, `\pxSetVar`, `\pxDefFormula`, `\pxSolve`, `\pxCalc`, `\pxCalcStore`. No new global display settings, duplicate calculations engine, class parsing changes, or forced dependency on pxLST/pxSRC. Removed an unused `\prop_get:NnNTF` variant from the discarded implementation.

**Actual local test evidence** (TeX Live pdfLaTeX, standalone module with the reconstructed implementation): `test.tex` compiled with `-halt-on-error -interaction=nonstopmode`, emitted `PXCALC-PASS` and created a one-page PDF; also diagnosed missing name and circular dependency as expected. `scope.tex` emitted `PXCALC-SCOPE-PASS`, including local group and values override tests. Rendered PDF inspected for equation, substitution, unit, and result stages. The matching repository fixtures are `pxCALC.test.tex` and `pxCALC.scope.test.tex`.

**Still pending**: class-level `pxCALC.class-integration.test.tex` compilation against the complete authoritative tree, optional/default module loading regression, and cross-module regression. Therefore the `pxCORE` selector is *not* classified as fully integrated/verified. Do not mark the overall calculations module complete until those checks pass. All other inventory rows remain open.

## API-level reconciliation checklist (discarded public entry points)

This expands the domain rows into individual public interfaces. Each entry was found in the discarded `.sty` file, not inferred from generic use cases. `D` source means the discarded implementation, `B` means the authoritative tree. Focused tests use the matching `tex/tests/pxDIA*.tex`, `pxLST*.tex`, `pxSRC*.tex`, `pxPM*.tex` and `pxANN*`/`pxGLS*` fixtures as relevant; every new implementation still requires a tested equivalent.

### Diagram entry points: individual coverage

| Previous entry point | User-visible behavior | Where implemented / B support | Proper owner / issue to correct | Recovery status |
| --- | --- | --- | --- | --- |
| \pxTCompiler | Compiler tombstone shapes and components (T-diagram compiler/program/machine/interpreter) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTProgram | Compiler tombstone shapes and components (T-diagram compiler/program/machine/interpreter) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTMachine | Compiler tombstone shapes and components (T-diagram compiler/program/machine/interpreter) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTInterpreter | Compiler tombstone shapes and components (T-diagram compiler/program/machine/interpreter) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneRun | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneInterpret | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneVM | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneCompile | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneChain | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneCompileCompiler | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTombstoneBootstrap | Execution, translation, chaining and bootstrapping (Tombstone compositions) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTranslatorBox | Compiler stages, flows and IR links (Compiler visualizations) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxCompileRunFlow | Compiler stages, flows and IR links (Compiler visualizations) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxCompilerModel | Compiler stages, flows and IR links (Compiler visualizations) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxCompilerPipeline | Compiler stages, flows and IR links (Compiler visualizations) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxIRHub | Compiler stages, flows and IR links (Compiler visualizations) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxSyntaxTree | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxAutomaton | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxTransitionTable | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxAutomatonTrace | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxGraph | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxBNF | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxDerivation | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxRegEx | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxRegExList | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxLexemeTable | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxIRCompare | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxInferenceRule | Automata, trees, rules and representations (Formal languages) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxVenn | Logic diagrams and hardware/memory layouts (Logic and organization) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxLogicGroup | Logic diagrams and hardware/memory layouts (Logic and organization) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxFlowchart | Logic diagrams and hardware/memory layouts (Logic and organization) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxMemoryMap | Logic diagrams and hardware/memory layouts (Logic and organization) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxEndianCompare | Logic diagrams and hardware/memory layouts (Logic and organization) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxRegisterMap | Logic diagrams and hardware/memory layouts (Logic and organization) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxDecisionTree | Decision and learning visualizations (ML and decision tools) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxNeuralNet | Decision and learning visualizations (ML and decision tools) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxConfusionMatrix | Decision and learning visualizations (ML and decision tools) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxFuzzyPlot | Decision and learning visualizations (ML and decision tools) | D `latex/pxDIA.sty`, `code/pxDIA.code.tex`; B absent | pxDIA; direct implementation, pxTXT labels where needed | Recovered in pxDIA; isolated compilation evidence, combined integration pending |
| \pxDiagramSetup | configuration | D pxDIA; B absent | pxDIA; no forwarding pxCMP layer | Awaiting implementation |
| \pxDiagramSavePreset | store diagram preset | D pxDIA; B absent | pxDIA; no forwarding pxCMP layer | Awaiting implementation |
| \pxDiagramUsePreset | retrieve diagram preset | D pxDIA; B absent | pxDIA; no forwarding pxCMP layer | Awaiting implementation |
| \pxDiagram | generic diagram | D pxDIA; B absent | pxDIA; no forwarding pxCMP layer | Awaiting implementation |
| \pxDiagramNote | diagram annotation | D pxDIA; B absent | pxDIA; no forwarding pxCMP layer | Awaiting implementation |

### Code / source / project-management / endmatter entry points

| API / defined behavior | Old implementation / B status | Owner and correction | Recovery status |
| --- | --- | --- | --- |
| `pxCode` / `pxCode*`: regular and visual listing environments | D/B `pxLST.sty`, existing partially | pxLST; preserve distinct verbatim-aware forms | Recovered but needing correction |
| `pxCodeMini`, `pxCodeBox`, `pxCodeBreak` | D `pxLST.sty`; B originals present | pxLST: feature equivalents are established `miniCode`, `CodeBox`, `CodeBox*`; do not add duplicate forwarding names | Recovered but needing correction |
| `pxTerminal`: plain terminal output | D `pxLST.sty`; B absent | pxLST; same listing renderer | Awaiting implementation |
| `\pxCodeFile`, `\pxCodeChunk`, `\pxCodeInline`, `\pxCodeIn` | D `pxLST.sty`; B file/inline support partially | pxLST; correct verbatim versus mandatory arguments and source line range | Recovered but needing correction |
| `\pxSource`, `\pxInput`, `\pxUseSource` | D `pxSRC.sty`; B provides accepted heading-based source extraction | pxSRC; preserve heading selectors and registration-free path | Recovered but needing correction |
| `\pxSourcePreview`, `\pxUseSourcePreview` | D `pxSRC.sty`; B absent | pxSRC delegates rendered code to pxLST and queued full source to annex owner | Discarded by explicit owner decision; use ordinary source inclusion inside MEM annexes |
| `\pxSourceRef` | D `pxSRC.sty`; B absent | pxSRC; scoped label-prefix, optional label support | Awaiting implementation |
| `\pxSRCsetup`, `\pxDEFimagewidth`, `\pxDEFimagepairwidth`, `\pxDEFimageplaceholdercolor`, `\pxDEFimageposition`, `\pxDEFimagepairgap`, `\pxDEFimagelabelprefix` | D pxSRC; B image config | pxSRC; preserve working setters, no new config engine | Recovered but needing correction |
| `\pxIMG`, `\pxIMGpair`, `\pxIMGList` | D/B pxSRC | pxSRC; existing image rendering and list | Already correctly recovered |
| `\pxUserStory`, `\pxScenario`, `\pxUseCase` | D `pxPM.sty` command signatures; B absent | pxPM; **correct inconsistency**: old documentation shows environment/field-style use despite command-style definitions | Awaiting implementation |
| `\pxSWOT`, `\pxPMsetup` | D pxPM; B absent | pxPM; reuse table/localization | Recovered in optional pxPM, includes Gantt; actual module compilation pending |
| `\pxGantt`, `\pxGanttItem`, `\pxGanttEnd`, `\endpxGantt` | D pxPM, M pxGNT; B absent | pxPM; single chart engine, coherent command/environment behavior | Awaiting implementation |
| `\pxGlossarySetup`, `\pxGlossaryFile`, `\pxPrintGlossary`, `\pxPrintGlossaries` | D pxEND; B class-only auto glossary | Endmatter/class existing glossary; preserve user control and backend | Recovered but needing correction |
| `\pxAcronym`, `\pxTerm`, `\pxTerms`, `\pxAcronyms` | D pxEND; B absent | Existing glossary facilities; no duplicate glossary backend | Awaiting implementation |
| `\GL`, `\GL*` | D pxEND and B P3CTeX class | Class/glossary owner; avoid duplicate definitions | Recovered but needing correction |
| `\pxAnnexSetup`, `\pxAnnex`, `\pxAddAnnex`, `\pxPrintAnnexes` | D pxEND; B pxMEM adapter only | Existing annex/MEM capabilities, optional PAC/PR support | Recovered but needing correction |
| `\pxEndMatterSetup`, `\pxPrintEndMatter`, `\pxBibliography` | D pxEND; B absent | Document-level endmatter; no bibliography backend replacement | Awaiting implementation |

The API reconciliation distinguishes a feature from its old spelling: duplicated forwarding names may change, but the capability remains mandatory. The earlier `pxCMP`/`pxGNT` modules are historical references only; their functionality must remain represented without recreating redundant owners.

### Core-selection regression checkpoint

- Local pdfLaTeX probes of the reconstructed `pxCORE` key/loading code emitted `PXCORE-OPTION-PASS` for `calculations` and `PXCORE-DEFAULT-PASS` without the option. Matching repository fixtures are `tex/tests/pxCALC.core-selection.test.tex` and `tex/tests/pxCALC.core-default.test.tex` (commits `da9c8d5` and `31034d7`). The full P3CTeX class integration is still unverified.
- Branch comparison cross-check: `feature/pxcmp-computation-diagrams` and `main` carry the older separate `pxCMP`/`pxGNT` design; `feature/pxgnt-optional-gantt` supplies preceding Gantt history; `feature/tfg-mem-uoc-template` supplies earlier TFG/MEM history. Existing historical `pxLST` and `pxTAB` branches add no files beyond the reconstruction baseline in the comparison. The later discarded `pxDIA`/`pxPM` domain grouping remains the recovery target, not a wholesale source replacement.

## Checkpoint: pxSRC source modes and reference recovery (2026-11-02)

Branch: `restart/pre-tfg-clean-2026-11-01`. Changes are bounded to the established `pxSRC` and `pxLST` owners, their fixtures and one existing source-inclusion manual. `P3CTeX.cls`, `P3CTeX.code.tex` and class language loading are unchanged.

- `b58c58b`: extend the existing `pxLST_input_file:nn` renderer with a compatible four-argument form (language/path/title/local options). Original two-argument use remains.
- `87ea00a`: add `as=native|code|text`, literal/line-range rendering, region-prefix/suffix and optional minipage under the existing `\pxInput` selector; accepted `section`/`subsection` extraction kept.
- `976be5f`: repair the OT1 double-quote failure in code listings using T1 for listing text only, `upquote` and safe defaults; no global document font encoding switch.
- `64ef6be` then `9dcfeb8`: add optional source label/caption/cite/terms metadata and native `label-prefix` with correct optional label syntax. The isolated cleveref probe exposed recursion caused by rebinding `\ltx@label` in the discarded branch; removed that rebinding and ensured metadata labels use the original handler.
- `2f2f7ac`: expose source-relative `\pxSourceRef`.
- `6db7d1d`: direct, typed, locally scoped defaults for all 18 source-input fields under `\pxSRCsetup{input={...}}`, without serializing or replaying key history.
- Fixtures: `pxSRC.modes-recovery.test.tex`, `pxSRC.text-standalone.test.tex`, `pxSRC.defaults-labels-recovery.test.tex`, source/text/JS/PR fixtures. Source-specific syntax remains in pxSRC; programming source presentation stays in pxLST.
- `e68d239`: update the existing source manual, preserving the heading-reuse instructions.

**Actual verification:** Local TeX Live pdfLaTeX focused source probe (representative extracted selector and new rendering paths, with the same TeX primitives) produced a PDF and emitted `PXSRC-PROBE-PASS` and `NESTED-YES`, checking literal text does not execute, code files and custom JS regions render, and the unmodified PR's subsection and relative child import. Its initial OT1 quotation error was reproduced and then resolved by the local T1 listing-style correction. Output text and rendered PDF were inspected. A separate hyperref+cleveref two-pass probe emitted `pr:typed`, `pr:normal`, and unprefixed `after` AUX entries. It also reproduced and eliminated the discarded `\ltx@label` recursion. An isolated expl3 typed-defaults probe emitted `PXSRC-TYPED-DEFAULTS-PASS` after checking that input-mode, container, integer, and list overrides did not mutate defaults.

**Verification limit:** these are isolated local TeX probes, not a compilation of the complete repository implementation. Repository fixtures have been created but not yet run against the integrated authoritative tree, and no class-level PDF integration or complete regression run is claimed. Consequently the rows above remain **Recovered but needing correction**, not **Implemented and verified**.

**Still outstanding in pxSRC:** source previews with full-source annex, annex hook integration, complete native label handling inside amsmath environments, full cross-module glossary/citation validation, class/MEM/PR integration compilations and any rendering corrections those reveal. Existing heading-based source selection is a nonnegotiable regression gate. No claim of source-module completion.

## Checkpoint: pxLST code/terminal recovery (2026-11-02)

Branch: `restart/pre-tfg-clean-2026-11-01`.

- `dafcdd1`: add terminal transcript environment `pxTerminal`, inclusive source-range `\pxCodeChunk[language]{file}{first}{last}{title}`, optional title to `\pxCodeFile[language]{file}[title]`, and verbatim-aware `\pxCodeInline`; all use the established listing and tcolorbox renderer. Original `\pxCodeIn` retains its mandatory code argument.
- `90f1f0e`: consolidate unnecessary forwarding aliases. The discarded `pxCodeMini`, `pxCodeBox`, `pxCodeBreak` correspond to the **unchanged established** `miniCode`, `CodeBox`, `CodeBox*` environments, with compact `miniCode` displaying no line numbers. No capability was deleted; those unreleased duplicate names are intentionally not retained as separate public APIs.
- `76234b9` and `e65f548`: activate the existing default `pxlst` styling once and preserve later user-selected global styles through `\pxCodeSet`. Listing-specific font encoding remains T1 without switching document encoding.
- `b07debd` / `3bfbab3`: targeted regression fixture `tex/tests/pxLST.recovery.test.tex` covers terminal, file/chunk, original annotated/compact environments, legacy inline and new verbatim inline.
- Local TeX Live pdfLaTeX test using representative renderer produced `PXLST-TERMINAL-CHUNK-PASS` and a one-page PDF; quoted shell prompts, a dollar-prefixed command, and a bounded Python slice appeared in the rendered output. Earlier shared pxSRC probe also rendered selected code/text and reproduced/fixed the old quote-encoding error.

Additional isolated pdfLaTeX inline probe emitted `PXLST-INLINE-PASS` for both delimiter-based and braced verbatim code, including quoted shell text. This is evidence for the underlying renderer/parser only, not a full-package regression. `e0689b7` also corrected old pxLST comments that advertised nonexistent setup/preset commands.

**Remaining:** compile the tracked `pxLST.recovery.test.tex` against the complete package; verify specialized JLex/CUP quote escapes and syntax styles, package-local style scoping, and source/terminal interaction in P3CTeX PAC/PR/MEM documents. No full integration result is claimed. Public API changes relative to discarded development: use `miniCode`, `CodeBox`, `CodeBox*` instead of `pxCodeMini`, `pxCodeBox`, `pxCodeBreak`; use `\pxCodeSet` instead of the redundant unreleased `\pxLSTsetup`.

## Explicit rejection: monolithic pxEND (2026-11-02)

**Owner decision:** The endmatter implementation in `recovery/endmatter-2026-11-02` (`02867e4`) was architecturally rejected. Its fast-forward was undone by commit `b8fbc6e`; the authoritative source tree matches the pre-endmatter checkpoint `8cfae208` (with the rejection recorded in history). **Do not reintroduce `pxEND`, do not fork its implementation into disguised forwarding modules, and do not use its internal architecture as the design.** Its tests/history may document expected user-facing behaviors, but cannot authorize copying its dependency or lifecycle model.

The error is coupling independent features: normal bibliography uses native LaTeX/BibTeX/biblatex without an endmatter manager; glossary support loads the substantial `glossaries` package *only when explicitly selected*; annex features work without glossaries and fit the existing document/class/MEM responsibilities. PAC/PR/MEM default loading must not acquire glossary, annex, or bibliography overhead solely to support one another. Keep class/Babel initial-load timing unchanged. Implement each missing behavior in its natural existing owner, with small documented opt-in code as necessary. **Functional goals remain; the discarded pxEND approach does not.** Review each old behavior against actual use rather than treating the discarded API or test suite as unquestionable requirements.

Old module-specific inventory rows concerning `pxEND` describe historical behaviors, *not* approved architecture. They remain unimplemented until independently reworked and validated.
