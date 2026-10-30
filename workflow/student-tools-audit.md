# Student tools: current implementation and selected changes

Baseline: `60df2f1`, `feature/core-modules-audit-and-fix`, plus the owner's existing uncommitted edits copied from the original checkout. Changes are applied directly to the existing `feature/core-modules-audit-and-fix` checkout; pre-existing edits are preserved.

The supplied research is a source of use cases, not a replacement specification. In particular, its standalone `test_all_tracks.tex` defines its own macros and does not test P3CTeX integration.

| Research use case | Existing support | Decision |
| --- | --- | --- |
| Safe screenshots and missing assets | `pxSRC`: `pxIMG`, `pxIMGpair`, `pxIMGList`, extension lookup, layered placeholders, labels and configuration | Reuse. Fix setters ignoring arguments and incorrect image-list documentation. No second safe-image API. |
| Automata, partitions and traces | `pxCMP`: transition tables with partition column, declarative traces, graphs and automata | Reuse. Do not add a second partition table or simulator. |
| Tables and matrices | `pxTAB`: row/list/matrix APIs, paragraph cells, scoped options and presets | Reuse for structured content; avoid hard-coded table geometry. |
| Annexes and report assembly | `pxMEM`: chapters, annexes, source-region reuse | Reuse. No competing annex numbering system. |
| Authorship and integrity | Class data, cover metadata, `no-plagi`, translated `pxDEFnoplagi` | Reuse declarations; do not invent official university wording. |
| Code and terminal output | `pxLST`: palettes, many languages, inline/file/block rendering, breakable annotated boxes, raw listings options | Fix quote/string handling; add a verbatim terminal preset and a line-range file convenience command using the same renderer. |
| Numerical worked solutions | No current calculation module | Add `pxCALC`: scoped variables, single-source formula templates, substitution, numeric results and local overrides. Diagnose missing names/cycles rather than silently using zero. Units label numbers; they do not convert them. |
| Requirements and SWOT | No dedicated API found | Add optional content helpers with editable labels/styles and reuse `pxTAB`. |
| Faster drafting | Existing section shortcuts and row-oriented table API | Prefer those documented APIs to a new globally active colon grammar. |

`pxCMP` already covers compilers, formal languages, logic, memory and machine-learning diagrams, not numerical calculation. A descriptive `diagrams` loading keyword and `pxDIAG` entry point make that distinction visible without replacing the existing engine or breaking its commands. `calculations` loads `pxCALC`; keywords need not mirror filenames.

Validation must exercise public APIs in standalone and class documents, check string state after delimiters (not just compilation), verify numerical values and scope, and compile existing regression documents. PDF inspection is required for the listing reproduction and worked examples.
