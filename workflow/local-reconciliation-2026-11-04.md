# Local reconciliation verification — 2026-11-04

## Integration decision

Use the complete reconstructed tree from `0bed0011dba5dc8e3407ee6778cda411b1eb3e3b`, with the small corrections below, as a new commit whose parent is main `d031d94944ed0b7d2519255e848be3498314e2a5`. Do not merge the divergent pre-TFG history into main: doing so can retain superseded files such as pxCMP and pxGNT. The reconstructed tree uses pxDIA and pxPM and keeps the standard PRP/UML/SRC/TAB/LST bundle unchanged.

TFG and MEM are independent opt-in modules routed through pxCORE. Annexes belong to pxANX (also selected by MEM); glossaries belong to optional pxGLS. Native bibliography tools remain native. pxEND and source-preview machinery are absent.

## Corrections in this integration

- Move TFG metadata keys, licence helpers and licence rendering into pxTFG.code.tex. Keep public commands and presentation-hook registration in pxTFG.sty.
- Move the MEM chapter implementation helper into pxMEM.code.tex, retaining its existing public entry point and behavior.
- Correct the TFG guide to use the existing pxANX command `\pxAddAnnex`, rather than the removed `\pxMEMannex`.

No new package API, compatibility engine, or changes to TFG pagination and glossary defaults are introduced.

## Executed local verification

Windows MiKTeX/pdfLaTeX, with package auto-installation disabled. Every build used an `audit-` job name and a separate output directory. No existing PDF was overwritten. No CI workflow was dispatched.

- 68 repository regression fixtures: two pdfLaTeX passes, all passed. These include default/optional module isolation, TFG/MEM independence, source inclusion, diagrams and labels, calculations, listings, Gantt, annexes, glossaries, and unique PDF destinations. Relevant TFG/MEM fixtures executed after the internal-code moves.
- All 6 shipped example documents: three passes, passed, including input-based PAC templates and TFG PR/MEM reuse.
- pxDIA and architecture manuals: three passes, passed.
- 16 current private assessment variants: three passes plus BibTeX where applicable, all passed after the two document migrations below. Final logs contain no unresolved-reference/citation or duplicate-destination warnings.
- Four representative actual desktop sources (Compiladors, SSEE, TFG and the duplicate-class variant): normal installed MiKTeX lookup, without TEXINPUTS overrides; all passed. Recorder files identify the installed reconstructed sources.
- Older ISI/SXC material was used as behavioral evidence only. The same ISI assessment was built with pre-TFG `0657ad4` and the reconstructed tree: content and pagination agreed, with the intentional new glossary heading presentation. Older files were not modified.
- Representative TFG cover, Compiladors diagram and SSEE code pages were visually inspected. This is not a claim of exhaustive visual review of every page.

The existing development installation was preserved outside the TeX search tree before replacement. Original current-assessment PDF hashes were checked for preservation.

## Current-document migrations

1. Replace class selector `CMP` with `DIA`, and `\pxCMPsetup` with `\pxDiagramSetup` in the shared Compiladors preamble. Existing diagram commands remain usable.
2. A TFG compatibility variant declared a class before importing a preamble that already declares it. Remove the redundant declaration from that variant; leave the shared preamble responsible for class loading.

## Limits

Existing document overfull-box warnings and BibTeX style warnings remain; they are not equivalent to compile failures. Older relocated draft copies with broken relative paths, bundled third-party R examples, and historical documents that embed their own class copies are not compatibility acceptance targets. No content rewrite or historical document migration was performed. The retained TFG pagination and new glossary headings are deliberate presentation choices.
