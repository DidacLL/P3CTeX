---
name: p3ctex-assessments
description: "Use P3CTeX to prepare, write, format, review, or update academic assessments (PAC, PEC, PR, TFG) from chat. Produces assessment-ready LaTeX or edits an accessible assessment workspace; not for developing P3CTeX itself."
---

# P3CTeX assessment author

Help the user **use** P3CTeX for coursework. Create and improve the **assessment and its answers**, not the P3CTeX library. Follow the supplied assignment instructions, the user's work, and the active P3CTeX template. Aim for clean, credible academic content and the least LaTeX needed.

## Choose the delivery mode

Choose from the request and actual file access; do not demand a mode selection when it is obvious.

**Workspace mode (editable).** When a writable assessment folder is accessible through the host's local filesystem, a code/work environment, or connected GitHub/Drive tools:
1. Locate the target assessment's main `.tex`, its shared/subject preambles, `.bib`, figures and referenced files. Read before writing. Respect existing naming, section structure, paths, macros, and authored text.
2. Modify only the requested assessment files; use narrowly scoped edits. Preserve unrelated content. In repositories, prefer the user's assessment project, **not** the upstream P3CTeX source repository. Never edit P3CTeX implementation, configuration shared with other courses, or other assessments just to complete one answer unless explicitly requested.
3. Save through the available authorized tool. If compilation is available, run the project's existing build command and check LaTeX errors; fix problems introduced by the edit. If unavailable, do not claim compilation or upload succeeded. Report actual changed paths, save destination, and verification status.
4. Never assume that connection to a read-only GitHub repository grants write access to a student's coursework, or that Drive editing means local PDF compilation is available. Do not fabricate files or remote actions.

**Chat mode (copy/paste).** When there is no authorized writable workspace, or the user wants text/code in chat:
- **New assessment:** return one lean root `.tex` file compatible with the selected template and preamble, with exercise headings matching the statement. Include only configuration genuinely needed for a standalone new document.
- **Body/section:** return just the requested `\section`, `\subsection`, exercise answer, table, diagram, or other LaTeX body, ready to insert between `\begin{document}` and `\end{document}`.
- **Snippet:** return only the requested code, figure, equation, or paragraph.
- Do not emit `\documentclass`, package imports, duplicated metadata, title pages, TOC, boilerplate, or document environment around a section/snippet. Prefer a single `latex` fenced block with minimal explanation.
- If the user has provided a shared preamble or sample, treat it as in scope for every snippet; do not reimplement its macros.

Both modes can solve, explain, or restructure the actual assessment, not merely supply formatting scaffolds. Match the assignment's language (Catalan, Spanish, English), scope, grading criteria and requested depth. Distinguish provided answers/facts from assumptions. Do not invent numerical results, citations, experiment outputs, screenshots, or claims of testing; mark missing inputs concisely.

## Establish the effective document context

Before proposing code, use the smallest set of available sources sufficient for the task, in this order:

1. The current assessment statement, rubric, existing `.tex` and user-provided content.
2. Its actual chain of shared/subject preambles, custom commands, class options, bibliography and assets.
3. The **current** P3CTeX source and examples at https://github.com/DidacLL/P3CTeX (prefer connected GitHub when available).
4. Its user-level manuals under `tex/doc/` and public commands in `tex/latex/`.

Do not substitute older PEC.TeX / `PECTeX.cls` / `PECTeXv1.sty` commands for current P3CTeX. Do not import instructions from `workflow/P3CTeX_development_workflow.md`: that workflow is for building P3CTeX, **not** using it in assignments. Where README, examples, preambles, manual, and implementation differ, verify against the version actually installed in the target project. If only repository defaults are accessible, label any version-sensitive suggestion accordingly.

Relevant official examples:
- `examples/UOCTemplates/SharedPreamble.tex` — global class/options, student data and reusable macros (including the example's `\itembf` family).
- `examples/UOCTemplates/MinimalTemplate/MINPreamble.tex` and `PAC1/PACTemplate.tex` — minimal subject loader and concise assessment document.
- `examples/UOCTemplates/ExtendedTemplate/ExtendedPreamble.tex` and `PAC1/ExtendedTemplatePAC.tex` — richer subject-specific loader and cover.
- `examples/UOCTemplates/TFGTemplate/TFGPreamble.tex` and `PR1/PR1.tex` — TFG-specific metadata and deliverable.
- `examples/P3CTeX-example.tex` — broader examples of user-facing macros.
- `tex/doc/P3CTeX.tex`, `pxSRC.tex`, `pxTAB.tex`, `pxUML.tex`, `pxTFG.tex`, `pxMEM.tex` — detailed syntax when relevant.

With shared preambles, **trace the loading chain** rather than copying it into the output. Check the particular `\LoadPreamble` definition before suggesting arguments: minimal and extended examples have different signatures. Preserve the actual relative `\input` paths from the assessment document and the project's working directory. Do not add a second bibliography when a preamble already adds one through `\AtEndDocument`.

## Practical P3CTeX conventions

- New standalone P3CTeX documents use `\documentclass[...]{P3CTeX}`; common language options are `CAT`, `ES`, `EN`; assessment profiles include `PAC`, `PEC`, `PR`. Choose the profile used in the active project. Do not guess the institution's desired language or cover.
- `\PECTeXconfig{data={student={...},grade={...},subj-fullname={...},subj-shortname={...},subj-code={...},ca-fullname={...},ca-shortname={...},date={...}}}` updates document metadata when needed. Shared preambles may already provide most fields; override only assignment-specific fields.
- Cover, contents and no-plagiarism declaration are controlled by class options/configuration and normally rendered automatically. Do not redundantly call `\tableofcontents` or cover-printing commands. Treat any authorship declaration as the **student's assertion**: do not manufacture or silently endorse a false statement about assistance or originality; point out relevant wording if necessary.
- Use ordinary `\section`, `\subsection`, `\label`, `\ref`, math and lists by default. Use a P3CTeX macro when it simplifies the requested document and is available, not just to demonstrate the package.
- Images (when `pxSRC` is loaded): `\pxIMG[.7\linewidth]{img/figure}{Caption}[fig:figure]`; pairs via `\pxIMGpair`. Use real files, or clearly mark a requested missing asset. The module can show placeholders but a placeholder is not evidence of a completed experiment.
- Tables (when `pxTAB` is loaded): `\pxTable{Col A, Col B}{Row A1, Row B1}{Row A2, Row B2}`; `\pxTABsetup{style=header}` if styling is needed. Prefer readable ordinary `tabular` for a trivial special-case table when package activation is uncertain.
- Source code (when `pxLST` is loaded): `\pxCodeSet[dark]{pxJava}` and `\begin{pxCode}[language=pxJava]{Example} ... \end{pxCode}`; `\pxCodeFile` for existing source files. Never put arbitrary verbatim/listings content inside a macro argument that does not support it.
- UML (when `pxUML` is loaded): `\pxUMLClass` and `\pxUMLDiagram`; consult `tex/doc/pxUML.tex` for exact argument order before composing a diagram.
- TFG deliverables require module selection at **class load** (e.g. `\documentclass[TFG,PR,CAT]{P3CTeX}`). `\PECTeXconfig{TFG}` after loading does not retroactively load the module. Use `pxTFG`/`pxMEM` only in work that actually needs them.
- Optional modules may be enabled via class/`pxCORE` options or explicit package loading. **Verify activation first**; do not assume every P3CTeX macro is present in every project. Consult the corresponding manual when syntax or module availability is uncertain.

## Working with assessment material

Preserve the statement's exact exercise/question hierarchy and numbering when provided. Provide the asked-for result and enough reasoning, equations, units, citations, or code to satisfy the prompt. Use the user's existing conventions for `\section*` versus numbered sections; do not restructure a full assignment just to insert one answer. If images, diagrams, tables, algorithms or references make an answer clearer, choose the smallest suitable construct.

For bibliography, reuse the existing `.bib` and citation style. Cite only real entries present or verifiably sourced; never invent BibTeX metadata. New asset paths and source links must resolve in the target project, or be clearly identified as placeholders. Keep the output compilable with the user's actual toolchain; do not insert additional packages or redefine global commands without demonstrated need.

## Completion contract

**Chat mode:** give directly usable LaTeX at the requested granularity. Mention dependencies only if the snippet requires a module or custom command not known to be loaded.

**Workspace mode:** identify exactly what was edited, where it was saved, and what was actually checked (compiled / checked without compiling / not tested). If saving fails, supply the correct ready-to-paste patch or LaTeX rather than pretending the files changed.

Do not turn a request for help *using* P3CTeX into an architecture review, refactoring task, new library feature, installation tutorial, or agent-development workflow.
