# P3CTeX foundation-integrity audit — 2026-11-02

**Disposition: architectural sign-off BLOCKED. Freeze further feature recovery until the accepted foundation is corrected and verified.**

Audited tree: `restart/pre-tfg-clean-2026-11-01` at `c80ce1cb6fa9d124da8a85f2e8395f985875d669`. Reference pre-TFG baseline: `42c11d1448e09210004b3ee1af62d2faa6ac5d2c`. Discarded implementation reference: `feature/core-modules-audit-and-fix` at `1eedb42366924f00daf338e1f1a7a8fb55013e62`.

This is a **source/dependency audit plus one faithfully reproduced standalone annex test**, not a full P3CTeX build. Do not infer that an uncompiled fixture passes.

## Findings, separated by proof level

| Owner | Finding | Disposition |
| --- | --- | --- |
| **pxEND** | The rejected module is absent from the active file tree. Its shared loading of glossaries for annex/bibliography use was explicitly rejected and reverted. | **Keep rejected.** Do not re-create it or distribute equivalent coupled machinery across wrappers. |
| **Class / pxCORE** | Comparing accepted files against the pre-TFG baseline: no class dependency change; the added MEM profile loads pxMEM; CORE adds only conditional pxCALC loading. Existing Babel loading is eager, and the class glossary option alone loads glossaries. | **Architectural boundary retained** in the examined source. Do not revise language timing or route bibliographies through new loaders. |
| **pxCALC** | Opt-in through `CALC` / `calculations`. Its own `amsmath` and `siunitx` imports only occur when selected. No dependency on source, glossary, annex or document-finalization modules. | **Dependency structure provisionally acceptable.** Prior isolated tests reported; integrated class test remains unexecuted. |
| **pxSRC** | Its package imports are unchanged from pre-TFG (float, graphicx, tcolorbox, hyperref, pgffor, fvextra). The new source modes/typed defaults and label wrappers live within the existing module, with code presentation delegated to pxLST. Does not require glossaries or an annex module. | **No new package-level coupling detected.** Native label scoping in amsmath, nested relative paths, and cross-module integration still need real builds; no full sign-off. |
| **pxLST** | No added package imports versus pre-TFG. New terminal, code-range and verbatim inline entry points reuse listings/tcolorbox. Added `\lstset{style=pxlst}` initializes global listing style at package load. | **No extra module coupling detected.** Verify ordering with user styles and specialized JLex/CUP escaping; integrated test not run. |
| **pxTFG** | Selected through the existing TFG class option; adds its own `graphicx` dependency for CC artwork. No automatic glossary or endmatter dependency. But accepted version provides metadata and manual licence page, not the formerly developed abstracts, workcard, cover details and frontmatter capabilities. | **Functional-parity failure / incomplete implementation.** Do not represent as completed or recover by copying old coupled lifecycle. |
| **pxMEM** | Selected only for MEM, depends on expl3/xparse and does not load glossaries. Provides article-based chapter structure, lists, and a deferred annex queue. Unlike prior developed MEM, configurable chapter style, preliminary-content interface, etc. are still absent. | **Functional-parity failure; concrete reference bug confirmed below.** |
| **pxTAB / pxUML / pxPRP / pxORL, baseline graphics** | No changes in the examined pre-TFG-to-current file comparison for these library implementations. | **Not implicated by reconstruction changes.** Original behavior still requires integrated regression; absence of change is not proof of correctness. |

## Confirmed defect: MEM annex links and Cleveref

A faithful local copy of `tex/latex/pxMEM.sty` from `c80ce1c` was compiled with `article`, `hyperref`, and `cleveref` twice using the installed TeX Live `pdflatex`. The document included a main chapter and two deferred annexes with labels.

Actual second-pass AUX results:

```
\newlabel{ann:a}{{A}{2}{...}{section*.2}{}}
\newlabel{ann:b}{{B}{3}{...}{section*.4}{}}
\newlabel{sec:first}{{A.1}{2}{...}{section.pxmemannex.1.1}{}}
\newlabel{sec:second}{{B.1}{3}{...}{section.pxmemannex.2.1}{}}
```

Cleveref emitted `cref reference format for label type 'pxmemannex' undefined`. The starred annex heading and following `\phantomsection` overwrite the anchor from the earlier `\refstepcounter{pxmemannex}`; the annex's own `\label` uses the starred-section destination. Visible annex numbering works, but typed reference destinations do not. **This is a reproduced code defect, not speculation or a merely missing test.**

The previously fixed `\theHfigure`, `\theHtable`, `\theHequation` uniqueness does not correct this separate failure. Correct it within the MEM owner, preserving those three fixes and original PAC/PR behavior; do not revive pxEND.

Test conditions: two successful local pdfLaTeX passes, a three-page PDF, AUX inspected, and no full-class compilation claimed.

## Functional parity and risk gate

The accepted reconstruction is **not feature-complete**, particularly TFG/MEM. The old API and architecture need not be preserved where defective, but every previously developed user-facing capability remains accounted for. No features are deleted simply to shrink implementation.

Pending correctness gates (not yet proven failures): full `pxCALC.class-integration.test.tex`; `pxSRC` nested input and `amsmath` label scope; `pxLST` specialized language/palette behavior; actual PR/MEM/TFG compilation and visual inspection; licence asset resolution in installed TeX roots. These are evidence gaps, not grounds for an architectural rewrite.

## Execution order from this audit

1. **Fix the reproduced MEM annex anchor + Cleveref defect in the existing MEM implementation**, test two annex labels and references, preserve original counter and figure/table/equation anchors.
2. **Complete foundation integration verification** on the actual P3CTeX class. Include existing PAC/PR regressions plus minimal `CALC`, `SRC`, `LST`, `TFG`, `MEM` use cases. Do not report isolated or static probes as integrated passes.
3. **Audit and implement accepted TFG/MEM capability parity** under original module owners, without another monolithic document-end facility. Resolve each missing previously-developed behavior explicitly and verify it.
4. Resume independent new-module recovery **only after** these corrections and integration gates, without importing rejected pxEND code or modifying initial Babel-loading semantics.

No changes to the authoritative branch, `main`, package implementations or CI were made for this audit record. The analysis and findings are preserved on the separate audit branch only.
