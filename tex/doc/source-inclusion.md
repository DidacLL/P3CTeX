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

The source registry accepts external resources, not just TeX documents. Choose as=code for source code, as=text for literal text (logs, CSV, configuration), or as=native for TeX execution. Existing image APIs handle graphical resources. CSV text is displayed literally, not converted into a table.

    \pxInput[as=text,first-line=2,last-line=12]{results.csv}
    \pxInput[as=code,language=Python]{experiment.py}

Native input executes TeX in a local group with the receiving document's style.
Include body material, or select a region from a standalone document. Minipages
cannot contain ordinary floats or break across pages. Relative child inputs and
images are searched from the original source directory.

Region markers occupy separate lines and are excluded. Their default prefix is the TeX comment character. Set region-prefix=// for C-like sources, region-prefix=\string# for Python or shell sources, or customise region-suffix as needed. Line ranges require no source markers:

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
    % Optional: \pxPrintGlossaries places lists here instead of at the end.

Enabling glossaries automatically prints the lists at the end. The default noindex backend needs repeated LaTeX runs,
without an external index command. The legacy glossary class option also retains
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
    % Optional: \pxPrintAnnexes places pending annexes here.

Immediate and queued annexes share A, B, C numbering in printing order. Printing
drains the queue once. Pending annexes print automatically at the end, before automatic glossaries so terms used in annexes are included. Set \pxAnnexSetup{print=manual} only to opt out of automatic printing; unprinted queued annexes then generate a warning.
Main section, equation, figure and table counters resume after each annex.
level=auto uses chapters in MEM and sections in PAC/PR. Use sections inside chapter
annexes and subsections inside section annexes; source headings are not rewritten.

\pxAnnexSetup{toc=true,name=Annex} sets defaults. Per-annex options include label,
name, level=auto|section|chapter, toc and pagebreak. Default titles follow the
language. pagebreak=false suppresses the leading break; final page and floats
still flush before restoring counters.

Legacy \pxMEMsource, \pxMEMinclude and \pxMEMannex delegate to these shared tools.
Explicit \appendix retains its permanent numbering transition.

## Styled previews with automatic full-source annexes

    \pxSourcePreview[as=code,language=Python,height=.33\textheight,
      title={Experiment},annex-label=ann:experiment]{experiment.py}
    \pxSourcePreview[as=text,height=\textheight,title={Execution log}]{run.txt}

The preview uses the current P3CTeX listing palette, a translated preview heading,
and a clickable full-source annex footer. Its measured height includes the entire
frame and link. Complete source lines are selected, including their wrapped display
lines; text is not cut mid-line or shrunk. The complete original file is queued and
printed automatically. A region or range limits only the preview; the annex still
contains the whole file. Native TeX and image previews are outside this iteration.

height defaults to textheight. annex-title and annex-label are optional. title,
language and listing-options follow source input conventions. Customise the outer
container through tcbset{pxsrc-preview/.style={...}}. Custom styles must retain an
unbreakable container for measurement. If the frame/link cannot fit, an error asks
for more space; if no complete line fits, the preview contains an explanatory note.
The height is an explicit budget, not an estimate of the space left on the current
page. Run LaTeX again to resolve annex numbers and final link measurements.

Registered sources also support previews directly:

    \pxSource[as=code,language=Python]{experiment}{experiment.py}
    \pxUseSourcePreview[width=.8\linewidth,height=.33\textheight]{experiment}

Registration supplies defaults, and per-use options override them. Preview width
is measured at the requested size, including any extra wrapping. The deferred
full-source annex captures the resolved rendering and metadata settings at the
preview call, including scoped pxSRCsetup defaults. Referenced macros must still
exist when the annex prints, as with any deferred TeX content.

Missing optional tools are diagnosed before source execution or numbering.
Nested source captions retain their own numbers even when the inner input creates
another numbered source. GL and GL* acronym shorthand are available with both
glossary and glossaries; an explicitly requested unknown glossary type is an error.