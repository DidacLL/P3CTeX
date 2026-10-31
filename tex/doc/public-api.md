# Public API: common workflows

Select tools by task in the class options. Each tool supplies its defaults;
setup commands are optional customisation, not a mandatory configuration stage.

| Task | Load key | Start here |
| --- | --- | --- |
| Code | code | pxCode environment; pxCodeInline; pxCodeFile |
| Files and images | sources | pxInput, pxSource/pxUseSource; existing pxIMG family |
| Source preview | sources,annexes | pxSourcePreview or pxUseSourcePreview |
| Tables | tables | pxTable, pxTableFromList, pxTableMatrix |
| Diagrams | diagrams | pxDiagram and the diagram-specific commands |
| Calculations | calculations | pxDefVar, pxDefFormula, pxSolve, pxCalc |
| Project management | project-management | pxUserStory, pxScenario, pxUseCase, pxSWOT, pxGantt |
| Terminology | glossaries | pxTerm, pxAcronym, pxTerms, pxAcronyms; use entries with gls |
| Annexes | annexes | pxAddAnnex; output is automatic |

## Reuse a source without repeating its path

    % Preamble
    \pxSource[as=code,language=Python]{experiment}{experiment.py}
    % Body: the preview links to the automatically printed full-source annex.
    \pxUseSourcePreview[height=.33\textheight,width=.8\linewidth]{experiment}

Use pxUseSource for an ordinary inclusion. Per-use options override registration;
registration overrides scoped pxSRCsetup defaults. Child files resolve relative
to the containing source. Selection and metadata do not leak into nested inputs.

## Write a schedule as a normal environment

    \begin{pxGantt}{start=01/11/2026,end=07/11/2026}
      \pxGanttItem{Planning}{01/11/2026}{03/11/2026}
      \pxGanttItem{Implementation}{04/11/2026}{07/11/2026}
    \end{pxGantt}

The closing delimiter renders the schedule. The command form with pxGanttEnd
remains available when generating chart content programmatically.

## Define terminology once in a shared preamble

    \pxAcronym{api}{API}{application programming interface}
    \pxTerm{iteration}{iteration}{A bounded cycle of development.}
    % In any receiving document:
    \gls{api}; \gls{iteration}.

Lists print automatically. GL/GL* also provide the existing short/long acronym
shorthand with either glossary-loading key. Use pxGlossaryFile for shared entry
files and pxTerms/pxAcronyms for entry maps. Manual placement is optional.

## Customisation without hidden state

- Calculation display options belong to each call: pxSolve[steps=2,prec=3]{id}.
- Class cover-config, page-config and pdf-config work both at class load and
  through PECTeXconfig. Class-load overrides apply after metadata defaults.
- Module selection belongs in class/package options. pxCOREsetup changes runtime
  debug settings; individual tools own their styling setup commands.
- Unknown tool options and explicitly requested unknown glossary types report
  errors. A source whose required tool is missing does not execute or allocate a
  source number.
- Source-preview metadata is captured for its deferred annex. As with ordinary
  deferred TeX content, macros referenced by that metadata must remain defined.

See [source inclusion](source-inclusion.md), [student tools](student-tools.md),
and [API migration](api-corrections.md) for detailed syntax and renamed APIs.
