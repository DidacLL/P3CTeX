# Source files, glossaries and annexes

Load the optional tools with:

    \documentclass[PAC,sources,annexes,glossaries]{P3CTeX}

These tools also work in PR and MEM. Existing pxSRC image APIs remain available.

## Input

    \pxInput{sections/body.tex}
    \pxInput[region=results]{reports/pr1.tex}
    \pxInput[first-line=10,last-line=25]{sections/body.tex}
    \pxInput[container=minipage,width=.8\linewidth]{sections/summary.tex}
    \pxInput[as=code,language=Python,title={Experiment}]{experiment.py}

Native input executes TeX in a local group with the receiving document's style.
Include body material, or select a region from a standalone document. Minipages
cannot contain ordinary floats or break across pages. Relative child inputs and
images are searched from the original source directory.

Region markers occupy separate lines and are excluded:

    %<*results>
    \subsection{Results}\label{sec:results}
    The \gls{sample} results support \cite{study}.
    %</results>

Selections must contain balanced environments. Invalid, missing, duplicate,
unclosed or empty regions fail before execution. Line bounds are inclusive;
last-line=0 means EOF. Choose either a region or a range. Native fragments create
disposable JOB.pxsrc-N.tex files.

    \pxSource[region=results]{pr-one}{reports/pr1.tex}
    \pxUseSource[caption={Earlier results},label=src:results]{pr-one}
    \pxUseSource[as=code,title={Original TeX},language={[LaTeX]TeX}]{pr-one}

Options apply in this order: \pxSRCsetup{input={...}}, registered defaults,
per-use overrides. Clear region={} to replace a registered region with a range.
Per-use options are scoped. Caption and/or label create a numbered source reference.

Native citations, glossary use and labels propagate normally. The receiving
document owns bibliography entries and backend setup. Code stays literal; attach
metadata explicitly with cite={study},terms={sample}. Terms require glossary
support and defined entries. listing-options={...} customises pxLST rendering;
validated line bounds take precedence.

For repeated native inclusion, set label-prefix=pr-one: and use
\pxSourceRef{sec:results} inside reusable material. Outside use
\ref{pr-one:sec:results}. Ordinary reference macros are not rewritten.

## Glossaries

    \pxGlossaryFile{terms.tex} % standard glossary/acronym definitions
    \pxGlossarySetup{include=used,toc=true}
    % In the body:
    \gls{sample}
    \pxPrintGlossaries

The glossaries tool defaults to manual placement and noindex: run LaTeX repeatedly,
without an external index command. The legacy glossary class option retains
automatic end printing; override with \pxGlossarySetup{print=manual}.

include=used prints referenced entries; include=all includes all defined entries
of selected types. \pxPrintGlossaries[terms=false] prints acronyms only.
\pxPrintGlossary[type=main,title={Terminology}] selects one type. Customise
terms-title, acronyms-title, toc and options={style=...}. Each type prints once
through these wrappers; automatic printing skips types already printed manually.
Standard glossaries commands remain available for advanced customisation.

For indexed workflows, before loading the class:

    \PassOptionsToPackage{backend=external}{pxGLS}
    \documentclass[PR,glossaries]{P3CTeX}
    \makeglossaries

Run LaTeX, makeglossaries JOB, then LaTeX again. Backend choice is fixed at load.

## Annexes

    \pxAnnex[label=ann:data]{Data}{\pxInput{data.tex}}
    \pxAddAnnex[label=ann:source]{Original results}{
      \pxUseSource[label-prefix=ann:]{pr-one}
    }
    \pxPrintAnnexes

Immediate and queued annexes share A, B, C numbering in printing order. Printing
drains the queue once. Unprinted queued annexes generate an end warning.
Main section, equation, figure and table counters resume after each annex.
level=auto uses chapters in MEM and sections in PAC/PR. Use sections inside chapter
annexes and subsections inside section annexes; source headings are not rewritten.

\pxAnnexSetup{toc=true,name=Annex} sets defaults. Per-annex options include label,
name, level=auto|section|chapter, toc and pagebreak. Default titles follow the
language. pagebreak=false suppresses the leading break; final page and floats
still flush before restoring counters.

Legacy \pxMEMsource, \pxMEMinclude and \pxMEMannex delegate to these shared tools.
Explicit \appendix retains its permanent numbering transition.
