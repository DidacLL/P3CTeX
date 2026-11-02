# Annexes, glossaries and bibliography

Optional shared module: `pxEND` (with `pxEND.code.tex`). PAC and PR use
section-level annex headings; MEM uses chapter-level annex headings. The
class still accepts `glossary`; `glossaries`, `annexes`, and `endmatter`
also select the shared module. The existing standard core bundle is unchanged.

## Annexes

```latex
\documentclass[PAC,annexes]{P3CTeX}
\pxAnnexSetup{print=auto,level=auto,toc=true,pagebreak=true}
\begin{document}
See annex \ref{ann:source}.
\pxAddAnnex[label=ann:source]{Full source}{\pxInput[as=code]{program.py}}
% Optional exact placement: \pxPrintAnnexes
% Optional immediate placement: \pxAnnex[label=ann:now]{Title}{content}
\end{document}
```

`pxAddAnnex[<keys>]{<title>}{<body>}` is the minimal stable integration
point for later pxSRC previews. The body is stored as unexpanded native TeX
and rendered exactly once, in registration order, on explicit
`\pxPrintAnnexes` or at document end. A registration made while rendering an
annex is appended to the same queue. `label` supplies an ordinary LaTeX label,
which is suitable for `\ref`, `\cref` and `\hyperref`. The renderer owns
the annex heading, counter, reference destination, TOC entry and page break.
pxSRC/pxLST own preview measurement, source selection and code/text rendering;
no preview implementation is part of this module.

`pxAnnexSetup{print=manual}` disables automatic queue draining.
`level=auto|section|chapter`, `name`, `toc=true|false` and
`pagebreak=true|false` can be set as defaults or per-annex keys.
`pagebreak=false` affects the leading break; the final `\clearpage` is
retained to flush floats before restoring document counters. Immediate and
deferred annexes share a single alphabetic sequence, assigned at print time.
Document section/chapter, figure, table and equation counters are restored.
PAC/PR never call global `\appendix`.

`pxMEMannex[<keys>]{<title>}{<body>}` keeps its existing interface, chapter
layout and `pxmemannex` Hyperref destination prefixes. Its counter aliases
the shared annex counter; there is no separate queue or annex engine.

## Glossaries

```latex
\documentclass[CAT,glossary]{P3CTeX}
\pxGlossaryFile{shared-terms.tex}
\pxGlossarySetup{print=auto,include=used,terms=true,acronyms=true,toc=true}
\begin{document}
\gls{myterm}; \GL{myacronym}; \GL*{myacronym}.
% Optional manual placement: \pxPrintGlossaries
% Optional single-type selection: \pxPrintGlossary[type=acronym]
\end{document}
```

Declarations: `\pxTerm[<options>]{id}{name}{description}`,
`\pxAcronym[<options>]{id}{short}{long}`,
`\pxTerms{ id={name=...,description=...},... }`, and
`\pxAcronyms{ id={short=...,long=...},... }`.
Native `glossaries` entry definitions also work. `include=used` is
the default; `include=all` prints all selected definitions. Lists are
independent and manually printed lists are skipped by later automatic output.
`terms-title`, `acronyms-title`, `title`, `type`, `options` and
`toc` control individual printing. Titles use the CAT/ES/EN string table.
Default backend is no-index. For external indexing, before class loading use
`\PassOptionsToPackage{glossary={backend=external}}{pxEND}`, then run
pdflatex, makeglossaries and pdflatex. Do not initialize both glossary
backends or redefine `\GL` in the class.

## Bibliography and ordering

Normal BibTeX and biblatex commands remain untouched. `\pxBibliography[plain]{references}`
is optional convenience: it registers a BibTeX database/style and prints
once at endmatter; when biblatex is already loaded it registers the .bib
resource in the preamble and uses `\printbibliography` at output time.
Do not call this convenience from document content when biblatex is in use,
because `\addbibresource` belongs in the preamble.

`\pxEndMatterSetup{print=manual}` and `\pxPrintEndMatter` control combined
manual placement. Default automatic order is bibliography, annexes,
glossaries; annexes must precede glossaries, including for annex-only terms.
The historic `order` key remains but rejects reversed annex/glossary order.
Native source TeX executes its labels, citations and glossary references;
verbatim code/text requires explicit pxSRC metadata.
