# TFG: PR reuse and final-memory presentation

The `TFG` class option provides shared metadata with `\pxTFGsetup`.
`MEM` is a separate, opt-in final-memory presentation. It adds chapters
numbered with sections beneath them without modifying PAC/PR documents.

See `examples/UOCTemplates/TFGTemplate/` for a standalone PR and MEM
that reuse the same preamble. The MEM imports native LaTeX directly:

```latex
\documentclass[TFG,MEM,CAT]{P3CTeX}
% Set shared class data and \pxTFGsetup in the preamble.
\begin{document}
\chapter{Introducció}
\pxInput[section={Objectius}]{../PR1/PR1.tex}
\pxInput[section={Metodologia}]{../PR1/PR1.tex}
\end{document}
```

The PR need not be modified or registered. Heading selectors require
literal one-line section/subsection titles. Existing LaTeX labels are kept;
importing the same labelled material twice can therefore duplicate labels.
See `source-inclusion.md` for region, range and path limitations.

MEM uses the existing contents machinery. With the class TOC enabled,
`\pxMEMsetup{figures=true,tables=true}` (both default) places chapter-level
figure/table lists after the TOC; disable either list or use `\pxMEMpreliminaries`
for manual preliminary placement. `chapter-style` configures MEM chapter headings.
The independent pxANX module owns annexes, and MEM activates it. Annexes are queued by `\pxAddAnnex[label={ann:source}]{Title}{Content}`
and printed at document end, preserving the main counters. Annex references
use their own Hyperref destinations and are named for Cleveref when loaded.

The class's `data={subj-fullname=...}` is the **cover subject**, not the
research title. Keep it as the short label such as *Treball Fi de Grau*.
The actual project titles belong only to `\pxTFGsetup{title=...,title-en=...}`;
English keywords can be set with `keywords-en=...`. The shared preamble
must not reuse the long research title as the cover subject.

TFG also owns tutor, PRA, area, credits, keywords and licence fields.
Declare summaries separately with `\pxTFGabstract{CAT|ES|EN}{...}`.
The first information sheet contains the project title, metadata, selected-
language summary, and licence pushed towards the bottom by `\vspace{\fill}`.
The second sheet contains the English title, metadata and English abstract.
Both sheets precede the TOC. Additional non-selected summaries, if supplied,
follow the TOC.

Automatic printing is the default. `print=manual` and the existing
`\pxTFGfrontmatter`, `\pxTFGworkcard`, `\pxTFGabstracts` and
`\pxTFGcoverdetails` commands allow explicit placement. The separate
licence-only page remains available through the explicit
`\pxTFGlicencepage` command. Bundled CC artwork is used for recognised codes only.

The existing `glossary` option continues to use standard `glossaries`
entries and prints used entries; MEM adjusts only its heading hierarchy
and CAT/ES/EN titles. Standard LaTeX/BibTeX/biblatex bibliography commands
are not wrapped or reconfigured.

This example is not an assertion of mandatory UOC memory sections or
front-matter placement. Those must be checked against the applicable TFG
requirements before prescribing a fixed institutional template.
