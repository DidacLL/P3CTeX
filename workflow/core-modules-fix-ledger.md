# P3CTeX regression-fix ledger

Comparison baseline: `0657ad485f6dc133122a7b48032612159a59698c` (before pxTFG). Fix branch: `feature/core-modules-audit-and-fix`.

Review policy: preserve intended P3CTeX functionality, deliberate TFG formatting overrides, class-bound document components, and the established pxSRC (resource management) / pxLST (code presentation) boundary. Do not equate a large file, class dependency or an intentional override with a defect. Make small verified corrections, and preserve the public API unless a change is explicitly justified.

## Implementation checkpoints

- **F01 — fixed in checkpoint 1**: `pxDIAG.code.tex`, figure/float option passed through malformed `\exp_args:NnV \begin{figure}`; expand the actual placement token list instead. Extend diagram test with a floating caption and reference.
- **F02 — pending**: `pxSRC.code.tex`, temporary `\label` override parses only a mandatory argument; preserve standard/cleveref optional label type and isolate nested native inputs.
- **F03 — pending**: `pxANN`, register annex reference type for cleveref; preserve standard `\ref` and language selection.
- **F04 — investigate before changing**: `pxMEM` source inclusion and imported-reference scope (potential label collisions across PR documents); check intended label-prefix contract and native `\ref` semantics, not an automatic rewrite.
- **F05 — pending**: translate user-visible literal strings in newly introduced TFG/diagram features via existing `pxTXT`; legitimate TFG presentation overrides are not a bug.
- **F06 — investigate**: `pxSRC/input` configuration string accumulation/replay, scanner on simple native inputs, and dependency on private fancyvrb internals. Simplify only where semantics and existing tests can be preserved.
- **F07 — review**: annex/glossary/bibliography document-end interaction from a single user-facing workflow; do not rename/delete packages without tracing all callers.
- **F08 — verify legacy behavior first**: pxCORE `PRPconfig/TABconfig/LSTconfig/ORLconfig/MEMconfig/TFGconfig` are accepted without forwarding. Determine which keys predate the baseline and which target packages accept package options before editing.

## Newly catalogued smells / deferred questions

- **S01 (DIAG)**: `label=` is silently ignored when `float=` is omitted. Determine whether a nonfloating diagram should have a reference counter or should reject `label`; avoid inventing numbering in this checkpoint.
- **S02 (DIAG)**: floating diagram labels are currently emitted even without a caption, so they may inherit an unrelated `\@currentlabel`; review the contract.
- **S03 (API)**: previous changes renamed legacy `miniCode`, `CodeBox`, `CodeBox*`, and `\pxCodeIn` entry points in pxLST. Check actual compatibility requirements before reintroducing aliases.

## Validation

Checkpoint 1: code replacement and test registration inspected statically; multi-pass compilation is **not** claimed by this ledger. The existing reported test pass does not cover this new float test until rerun.
