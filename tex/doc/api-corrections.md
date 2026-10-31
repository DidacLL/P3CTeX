# API correction and migration

The development API now has one spelling for each code operation:

- Inline: pxCodeInline (verbatim argument); the original pxCodeIn call remains available.
- Block: pxCode and its visual pxCode* variant.
- Compact block: pxCodeMini; the old miniCode environment remains available.
- Annotated blocks: pxCodeBox and pxCodeBreak; the original CodeBox and CodeBox* environments remain available.
- File: pxCodeFile.

The original listing environment names are aliases to the current verbatim-aware
engines; they do not duplicate implementations. pxCodeIn retains its original
mandatory-argument syntax, which is different from pxCodeInline's verbatim syntax.
pxCode* remains an explicit visual variant.

Calculation presentation is local to each call. Use pxSolve[steps=1|2|3,prec=...]
and pxCalc[prec=...,unit=...]. Formula definitions accept symbol and unit only.
pxCalcSetup and package-level calculation options were removed from this
unreleased development API.

Requirements labels follow pxTXT's Catalan, Spanish and English public strings;
pxPMsetup labels remain available for deliberate customisation. The class now
selects Babel language after processing options, so a profile and an explicit
language no longer load Babel repeatedly. The last language key wins.

Glossary entries can be registered individually with
pxAcronym[options]{id}{short}{long} and pxTerm[options]{id}{name}{definition},
or in shared maps with pxAcronyms{id={short=...,long=...},...} and
pxTerms{id={name=...,description=...},...}. Standard glossaries fields and
shared-preamble macros remain usable. Use entries with gls; printing is automatic.

## Project management

Use one tool: documentclass[PR,project-management]{P3CTeX}, or usepackage{pxPM}.
It provides SWOT/DAFO, user stories, scenarios, use-case descriptions and the
Gantt API (pxGantt, pxGanttItem, pxGanttEnd). Both the unreleased pxREQ and the separate pxGNT package are removed. All planning implementations live in pxPM.code.tex; public commands live in pxPM.sty. General UML remains a separate tool.

A use-case card is distinct from a user story or Given/When/Then scenario:

    \begin{pxUseCase}{Reserve equipment}
      \pxActors{\CustomerRole}
      \pxPreconditions{Equipment is available.}
      \pxMainFlow{Select equipment, then confirm the reservation.}
      \pxAlternatives{If unavailable, choose another date.}
      \pxPostconditions{The reservation exists.}
    \end{pxUseCase}

Shared macros such as CustomerRole can live in the project preamble. PM labels
follow the document language, and pxPMsetup can customise labels and box options.
The supplied PhotoFilm coursework archive informed this grouping through its
shared story/scenario cards and sprint/release planning; its personal/project
content was not copied into the package.

Diagram naming is also implemented directly: pxDIAG.sty and pxDIAG.code.tex own
the diagram tools. The earlier forwarding wrapper and pxCMP package are removed.
Use diagrams, pxDiagramSetup, pxDiagramSavePreset, pxDiagramUsePreset and pxDiagram.
Existing diagram-specific commands (automata, graphs, compiler diagrams, etc.) keep
their meaningful names.

The unused print-doc flag has been removed: it never rendered documentation. Unknown options now report errors instead of silently storing or ignoring them.
