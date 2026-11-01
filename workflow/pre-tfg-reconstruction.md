# P3CTeX reconstruction

Branch: `restart/pre-tfg-clean-2026-11-01`
Starting revision: `0657ad4` (last pre-TFG authored baseline).

Reconstruct from this revision, not from abandoned branches. Preserve existing PAC/PR behavior. Keep fixes and new features in separate commits.

## 1. Original baseline and repairs

The source tree and default bundle were inspected; `default` still contains PRP, UML, SRC, TAB and LST.

Corrections committed:
- Six `pxDEFimage...` setters now use their arguments.
- `pxSRCsetup` no longer reprocesses package options in the document body.
- Both `\\pxPageRule` variants call the correct existing rule.

Isolated original/fixed LaTeX reproducers were compiled: original failed, corrected definitions passed. This is sufficient to proceed; it is **not** a claim that every original PAC/PR or MiKTeX configuration was tested. Other defects must be reproduced individually before changing code.

## 2. TFG integration

- Shared TFG metadata is opt-in via `TFG` and `\\pxTFGsetup`, independent of regular PAC/PR metadata. A standalone metadata smoke document compiles.
- Named PR source regions can be reused from `pxSRC` using `\\pxSource[region=...]{name}{path}` and `\\pxUseSource{name}`. An isolated PR-to-MEM example compiles.
- Next: test these features in a real PR, then add license material and TFG-specific front matter. Keep final-memory presentation (`MEM`) separate from TFG semantics, and follow actual UOC requirements.
- Do not change Babel, existing defaults, cover, TOC, or ordinary PAC/PR behavior unnecessarily.

## 3. Optional tools

Evaluate `pxCALC`, `pxPM`/Gantt, `pxDIA`, and listing improvements individually, only for concrete student tasks.

## 4. Replace main, when ready

Review the clean reconstructed implementation. Create an integration commit on top of `main` with the same complete file tree; no merge of abandoned work and no force-push.

## Validation

Compile a small targeted example for each change. Inspect a PDF when formatting is affected. Run broader examples or installation checks when their code path changes or before a release. CI is manual-only, not a per-commit requirement.
