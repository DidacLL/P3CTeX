# Source inclusion, glossaries and annexes

Status: implemented and documented. Final integrated gate passed 50/50. After the mechanical pxSRC file consolidation, image, native-source and preview regressions passed again. All remaining changes are ready for the final Git checkpoint.

Owner request (2026-10-30): pxSRC must load files and fragments as P3CTeX-styled code, native TeX, minipages and annex content. Glossaries, references and annexes must integrate consciously and be optional in PAC, PR and MEM documents. Work directly on the development branch and checkpoint in Git regularly.

## Existing foundation (audit baseline)

- pxSRC owns images, placeholders, image lists and source configuration.
- pxLST owns syntax-highlighted inline, block and external-file code, including line slices.
- pxMEM currently couples tagged TeX extraction to the memory module. It registers source files, extracts `%<*region>` / `%</region>` using fancyvrb, and prepends source-relative input and graphics search paths.
- pxMEM annexes switch chapter numbering globally through appendix; this must not be imposed on PAC documents.
- The class glossary key loads glossaries and uses the no-index backend. It currently prints both acronym and term lists automatically at document end with hard-coded Catalan titles. Explicit placement and independent enable/print controls are missing.
- Bibliography keys in P3CTeX.code.tex are commented out. Native LaTeX citation commands remain available; do not pretend an integrated bibliography API already exists.

## Design scope

1. Separate source selection (whole file, named region, line range) from rendering (native, code, minipage) and placement (here, queued annex). Keep file paths relative to the included source, and diagnose unknown IDs, absent files and absent/ambiguous regions.
2. Reuse pxLST rendering and migrate/generalise the existing tagged extraction rather than introducing a competing implementation. Keep pxMEMsource/include as compatibility entry points.
3. Define what propagates: native TeX executes labels, citations and glossary uses normally; verbatim code must never execute embedded commands. Source metadata can explicitly associate citations/glossary entries with a code excerpt.
4. Introduce optional annex registration and explicit printing, with deterministic order, titles, labels and stable hyperref anchors, without globally switching subsequent main-body numbering. Respect chapter versus section structure and allow use in PAC, PR and MEM.
5. Split glossary declaration/use from printing. Support explicit placement and optional automatic printing; use only entries actually referenced unless the author explicitly asks for all. Preserve the existing glossary class option as a compatibility profile.
6. Make bibliography backend ownership explicit, avoiding forced replacement of a document's existing biblatex/BibTeX setup. Define source citation metadata and document the bibliography commands it relies upon.
7. Test nested source-relative assets, fragment selection, missing/duplicate markers, literal special characters, code/non-execution, glossary first-use and list inclusion, citations, cross-references and annex numbering in PAC/PR/MEM. Compile multi-pass examples and inspect their output.

## Checkpoint discipline

Current student-tools work and pre-existing development edits must be committed before starting this extension. Keep this file current with completed steps, decisions, test outcomes and remaining work at each subsequent commit. Do not publish or bump VERSION as part of this work.

## Implemented decisions

- pxSRC exposes pxSource, pxInput and pxUseSource. Whole native files use native input; fragments reuse fancyvrb extraction with preflight marker/range validation. Source paths are prepended to native input/graphics lookup.
- as=native|code and container=none|minipage separate execution from layout. Code rendering reuses pxLST. cite and terms are explicit metadata; code itself never executes glossary or citation commands.
- label-prefix applies to native labels; pxSourceRef resolves an internal reference with that prefix, while ordinary ref continues to address external/document labels unchanged.
- pxANN provides immediate pxAnnex, queued pxAddAnnex and explicit pxPrintAnnexes. Main-body counters are restored; queues are consumed once. No global appendix transition is imposed.
- pxGLS automatically prints used glossary lists when enabled, including through the glossaries tool key. Explicit placement and print=manual are optional customisations. External indexed backends remain author-managed.
- Existing pxMEMsource/include/annex now delegate to these shared engines. Existing chapter mode remains pxMEM's responsibility.
- References use standard LaTeX labels/citations and the author's bibliography backend, rather than forcing a new bibliography engine.

## Validation and remaining work

- Checkpoint bb93310: initial student tools and pre-existing local development edits. All 38 tests/templates passed before direct transfer; the four initial direct-checkout lookup failures passed after refreshing MiKTeX's filename database.
- Current source integration passes PAC, PR, MEM, missing/duplicate-region diagnostics and the existing MEM regression. PAC's profile selects Catalan; combining PAC and EN currently triggers the pre-existing Babel option clash and needs a separate focused fix.
- Complete multi-pass cross-reference/glossary checks, external-backend and manual-placement assertions, user manuals and final repository-wide gate before final sign-off.
## Completed validation (2026-10-30)

- Common gate: 43/43 passed (36 regression documents with three LaTeX passes each, plus seven template/example builds).
- Source integration passed in PAC, PR and MEM. Final source logs contain no unresolved references, multiply defined labels or duplicate destination warnings.
- Rendered glossary text verified: default used-only excludes unused entries; manual plus automatic printing produces each list once. External include=all includes used and unused terms and the acronym list.
- External indexing passed through makeindex for both lists. The makeglossaries wrapper cannot run on this machine because Perl is absent; run-pxGLS-external-test.ps1 reproduces the direct indexing check.
- Updated pxMEM manual compiled successfully. Source/glossary/annex API and ownership rules are documented in tex/doc/source-inclusion.md.
- Existing pxSRC image facilities are reused. Legacy pxMEM APIs delegate to the shared source/annex implementations.
- Annex pagebreak=false intentionally suppresses only the leading page break; final float flushing is retained and documented.
- Generated source snippets are excluded from release selection. No release archive rebuilt; existing dist remains untouched.

The previously observed EN,PAC Babel option clash remains a separate known issue. This validation does not claim every possible language-option combination works.


## Owner corrections applied

- Enabling glossaries automatically prints lists. Students need no printing command. The class-level automatic regression and the manual-plus-automatic regression passed with three LaTeX runs; rendered output was checked.
- pxSRC manages external resources, not only TeX documents. Added literal as=text rendering, configurable region comment prefixes/suffixes, and Python/CSV coverage. Existing as=code handles external program files; graphical resources retain the existing image APIs. CSV is displayed literally, not parsed into a table.
- Seven focused regression documents passed with three runs each after these corrections, including PAC/PR/MEM source integration. Python markers select only the intended fragment; CSV TeX-like text does not execute. Updated user guide and common test registration.

## Automatic annex correction

Queued annexes now print automatically at document end, before automatic glossaries. Explicit printing drains the queue and prevents duplication; print=manual opts out. Definitions may occur in the preamble or body. Five regression documents passed three runs each, including PAC/PR/MEM integration. Rendered automatic test confirms main body, annex A, annex B, then glossary containing a term used only in annex A.

Next requested feature: space-limited source previews that queue the complete source automatically. Owner confirmed code and literal text first. Measure rendered complete-line prefixes, including wrapping and code-box decoration; preserve full source in the annex. Native TeX and images are outside this preview iteration.

## Quality correction checkpoint

Owner rejected duplicate class flags, package-wide calculation presentation,
English-only requirements defaults, duplicated code names, shallow glossary
registration and insufficient public API comments. Corrections now use one
class forwarding path plus meta keys, per-use calculation settings, pxTXT labels,
canonical code implementations and migrated callers, shared glossary registration
helpers, and documented public contracts. Also found actual dimension text leaking
from pxTAB column-spec classification: a token predicate was given a grouped item;
replaced it with a token-list predicate. Full gate and source preview work continue.

## PM ownership correction

The owner rejected retaining a separate Gantt package. pxPM now owns the Gantt
public commands and loads pxPM.gantt.code.tex internally. pxGNT and its redundant
loading keys are removed; tests and manuals use project-management/pxPM.
This supersedes the earlier standalone-engine compatibility note.

The final PM layout is the standard pair pxPM.sty / pxPM.code.tex. Gantt is a
section in that implementation, not another package or implementation file.
The source-preview implementation is now present and passing focused builds;
final height, link, literal-content and full-suite checks are underway.

## Final quality validation (2026-10-31)

- Integrated gate: 50/50 regression documents and templates passed after the
  diagram migration, runtime graphics-routing fix and Babel shorthand fix.
- pxSRC now uses one implementation file. The three focused image, source-input
  and measured-preview tests passed again after that mechanical consolidation.
- Per-use calculation steps and precision are asserted across consecutive calls.
- Rendered previews obey the complete .33-textheight budget, retain complete
  wrapped source lines, and link to the correct automatic annexes. Final source
  lines are present only in the full annex, and literal TeX escape content never
  executes. The styled page was inspected visually.
- Runtime cover/page settings and PDF title/author were verified in PDF output.
- PM labels were checked in Catalan, Spanish and English. The previously recorded
  EN/PAC clash is fixed; Spanish quote shorthand no longer breaks graph arrows.
- Shared glossary entry registration, automatic output, native source metadata,
  references and automatic annex-before-glossary ordering passed their tests.
- Manuals for PM, diagrams, core and code, plus the student guide, were rebuilt.
- Migration is documented in tex/doc/api-corrections.md. Removed packages and
  duplicate spellings are intentionally not retained as compatibility wrappers.
- Existing dist/ is untouched. No release archive was rebuilt or published.
## Public API audit (2026-10-31)

- Added pxUseSourcePreview for the existing source registry, with the same
  registration/default/override precedence as ordinary inclusion.
- Preview width now affects measurement; deferred source rendering captures
  resolved local settings instead of rereading changed defaults at document end.
- Native nesting starts each input with configured defaults, rather than the
  parent's resolved line limits, region or metadata. The regression proves that
  the final child line executes and that the outer/inner source numbers stay 1/2.
- Missing source dependencies fail before execution or source numbering.
- GL/GL* are owned by pxGLS, so both glossary-loading keys expose the same API.
  Explicit unknown glossary types and unknown core options are diagnosed.
- Runtime core setup cannot pretend to load/unload modules by only changing flags.
- Gantt now also works as a normal pxGantt environment, whose closing delimiter
  renders the chart. The command form remains useful for generated content.
- Public comments, guides and tests cover these contracts. Final full gate pending.

The audit additionally fixed relative nested pxInput paths: original-source
lookup now supplies an explicit child path, without relying on MiKTeX's filename
cache. Class-load cover/page/PDF keys are now consumed by the class and applied
after metadata defaults; runtime changes use the same entry point immediately.
The new public-api guide gives a single task-oriented starting point. The first
full audit run passed 52/53; its remaining class-load appearance issue was fixed
and passed targeted tests. A final integrated run follows.
