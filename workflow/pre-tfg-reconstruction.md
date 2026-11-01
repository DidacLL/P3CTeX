# Pre-TFG reconstruction

Branch: `restart/pre-tfg-clean-2026-11-01`
Original authored revision: `0657ad485f6dc133122a7b48032612159a59698c` (5 October 2026).

This is a repair-first reconstruction, not a rewrite. Abandoned branches are read-only references. No merging their implementation. Keep corrections separate from added functionality.

## 1. Characterize the original baseline

Use original PAC/PR documents, their shared preambles, and the existing `tex/tests` cases. Characterize CAT/ES/EN, cover/no-cover, TOC, module opt-ins and the original `default` bundle (including `pxUML`). Verify source loading and installed MiKTeX root. Do not redesign the class, Babel, global layout or default package choices.

**Evidence:** Original branch commit and library file hashes checked. Source-level reproducers for six image setters, `pxSRCsetup`, and both `\\pxPageRule` variants reproduced locally under TeX Live. Representative PAC/PR and actual MiKTeX installation checks remain **pending**; do not mark baseline fully verified until those complete.

## 2. Correct reproduced baseline defects only

- `pxSRC.sty`: six image setters must apply the caller's argument.
- `pxSRC.sty`: `\\pxSRCsetup` must not reprocess package options in the document body.
- `P3CTeX.cls`: starred `\\pxPageRule*` must select the thick rule; unstarred `\\pxPageRule` must call the existing thin rule.
- Other alleged defects: inspect and reproduce individually. No speculative changes.

Each correction needs its failing original case, minimal code edit and a passing targeted regression. Keep fixes in independent commits. Then run the original PAC/PR documents and check visible PDF output before accepting the **corrected baseline** milestone.

## 3. TFG essentials — only after baseline acceptance

Add shared metadata while preserving PAC/PR semantics; restore source-region inclusion in `pxSRC`; introduce license resources and MEM-only front matter using actual UOC requirements; use native bibliography/glossary/annex tools with only necessary conveniences. Validate PR and MEM independently and source reuse.

## 4. Optional tools

Consider `pxCALC`, `pxPM`/Gantt, `pxDIA`, and listing enhancements one at a time, starting from a concrete student use case. Do not make these TFG prerequisites.

## 5. Integration

Only when approved, create an integration commit atop `main` whose complete file tree equals the clean branch. Review by PR; no merge of abandoned work and no force-push.

## Validation policy

- During a fix: compile only its small reproducer; inspect the output where relevant.
- At a milestone: manually compile representative original documents and verify installation when relevant.
- Before integration: run the complete regression manually.
- No automatic expensive CI on every push. The existing baseline workflow is `workflow_dispatch` only.

No duplicate frameworks, compatibility shims for discarded APIs, or unsolicited Babel/class/default/layout/text changes.
