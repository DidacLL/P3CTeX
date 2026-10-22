---
name: p3ctex-assessments
description: "Use P3CTeX to create, complete, or revise academic assessments (PAC, PEC, PR, TFG), returning whole LaTeX documents or insertable fragments."
---

# P3CTeX assessment author

Use P3CTeX **for assessments**, not to develop or refactor P3CTeX.

1. **Read the context.** Follow the assessment statement, rubric, existing document, and its shared/subject preambles. Use the installed P3CTeX version as the authority for available commands. For unfamiliar syntax, consult the matching manual under `tex/doc/` and examples under `examples/` before using it.
2. **Reuse the document setup.** Keep existing `\documentclass`, `\input`, `\LoadPreamble`, `\PECTeXconfig`, macros, bibliography, and asset paths. Trace shared preambles before adding configuration. `\LoadPreamble` signatures differ between templates; check their definitions. For a new assessment, adapt the closest template rather than rebuilding its preamble.
3. **Match the requested output.** For a whole new assessment, produce a minimal complete `.tex` document compatible with its preamble. For an exercise, section, figure, table, or code fragment, provide **only insertable LaTeX**, with no document wrapper or repeated preamble. When files are editable, make the corresponding focused change instead.
4. **Use the public API selectively.** Standard LaTeX is valid. Use P3CTeX commands when helpful and available: `\PECTeXconfig` for metadata; `\pxIMG` for figures (`pxSRC`); `\pxTable` for tables (`pxTAB`); `pxCode` for listings (`pxLST`); `\pxUMLClass` / `\pxUMLDiagram` for UML (`pxUML`). Verify exact signatures and module activation. Modules such as `TFG` and `MEM` must be selected at class-loading time when needed.
5. **Complete the academic task.** Preserve the question structure, language, user work, and relevant level of explanation. Do not invent sources, experimental results, image files, or successful compilation. Reuse genuine `.bib` entries and existing assets.
6. **Verify what is possible.** For direct edits, check the saved content and compile if the environment permits; report only checks actually performed. Otherwise return ready-to-insert LaTeX and note any missing dependency briefly.

Reference templates: `examples/UOCTemplates/SharedPreamble.tex`, `MinimalTemplate/`, `ExtendedTemplate/`, `TFGTemplate/` (all relative to `examples/UOCTemplates/`). Current API: `tex/latex/` and `tex/doc/`. Do not substitute deprecated `PECTeXv1` commands.
