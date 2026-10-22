# P3CTeX usage reference (offline)

P3CTeX is a LaTeX document class for academic assessments at the UOC. This file ships with the skill so an assistant can write P3CTeX without knowing the project or accessing its repository. Compiling still requires the P3CTeX class and selected packages to be installed in the user's TeX environment. The user's installed version and supplied preambles take precedence over this reference.

## Document class and metadata

Use `\documentclass[options]{P3CTeX}`. Frequently used options:

- `PAC`: Catalan assessment, no cover, with TOC and authorship declaration.
- `PEC`: Spanish assessment, no cover, with TOC and declaration.
- `PR`: project/report profile, cover and TOC.
- `CAT`, `ES`, `EN`: language options.
- `default`: loads common modules `pxPRP`, `pxUML`, `pxSRC`, `pxTAB`, `pxLST`.
- `cover`, `no-cover`, `toc`, `no-toc`, `no-plagi`: output controls.
- `TFG`, `MEM`: special modules; select at class-load time when needed.

Set academic details using `\PECTeXconfig{data={...}}` in the preamble. Data keys: `student`, `grade`, `subj-fullname`, `subj-shortname`, `subj-code`, `ca-fullname`, `ca-shortname`, `date`. Existing preambles may already supply some or all keys. Cover and TOC are automatically generated according to class options; do not insert them again by default.

## New assessment without a shared preamble

A self-contained minimal root document (replace sample metadata and assessment content):

```latex
\documentclass[PAC,default]{P3CTeX}
\PECTeXconfig{
  data={
    student={Nom Cognoms},
    grade={Enginyeria Informàtica},
    subj-fullname={Nom de l'assignatura},
    subj-shortname={SIGLES},
    subj-code={00.000},
    ca-fullname={Primera activitat},
    ca-shortname={PAC1},
    date={\today}
  }
}
\begin{document}
\section{Exercici 1}
\subsection{Pregunta 1}
% Resposta.
\end{document}
```

This document needs the installed `P3CTeX.cls` and its packages. It does **not** need extra `\usepackage` declarations for modules already selected by `default`.

## Reusing a shared preamble

A shared preamble commonly holds the class, student metadata, macros, and possibly subject settings and bibliography. The root assessment should import it instead of repeating it:

```latex
\input{../SubjectPreamble.tex}
\PECTeXconfig{data={
  ca-fullname={Segona activitat},
  ca-shortname={PAC2}
}}
\begin{document}
\section{Exercici 1}
% Resposta.
\end{document}
```

`\LoadPreamble` is **not** a built-in P3CTeX command: it is defined by some example/user preambles. Use it only when its definition is present, and follow that definition's exact arguments. For example, the repository's *extended* template uses:

```latex
\input{../ExtendedPreamble.tex}
\LoadPreamble{PAC1}[Nom complet de l'activitat]
\begin{document}
\section{Exercici 1}
% Resposta.
\end{document}
```

The repository's *minimal* template defines a different `\LoadPreamble` signature. Never generalize either signature to another project. Paths in `\input`, `\bibliography`, and image commands must match the assessment's directory layout. A shared preamble might append the bibliography with `\AtEndDocument`; do not add it again.

## Insertable assessment elements

The following fragments belong **inside** an existing `document` environment. Match the document's headings and language.

**Exercise/question**

```latex
\section{Exercici 2}
\subsection{Pregunta A}
La resposta és ...
```

**Figure** (requires `pxSRC`; image path is relative to the document's working directory):

```latex
\pxIMG[.7\linewidth]{img/diagrama}{Arquitectura proposada}[fig:arquitectura]
```

A nonexistent figure file may yield a P3CTeX placeholder. A placeholder is not an actual screenshot or experimental result.

**Table** (requires `pxTAB`; each braced group is one row):

```latex
\pxTable[style=header]{Component, Estat}{API, Complet}{Client, Pendent}
```

**Code listing** (requires `pxLST`; verbatim-like environments must not be nested in arbitrary macro arguments):

```latex
\pxCodeSet[dark]{pxJava}
\begin{pxCode}[language=pxJava]{Exemple}
public class Main {
    public static void main(String[] args) {
        System.out.println("Hola");
    }
}
\end{pxCode}
```

**UML** (requires `pxUML`; define classes before drawing):

```latex
\pxUMLClass{Person}{- name : String}[+ getName() : String]
\pxUMLDiagram{
  \drawclass{Person}[0,0]
}
```

Use ordinary LaTeX for math, paragraphs, lists, references, and simple tables when it is clearer. Custom `\itembf` and similar commands exist only when defined by the user's preamble.

## Checks when authoring

- Confirm package/module activation before using `pxIMG`, `pxTable`, `pxCode`, or `pxUMLDiagram`.
- Keep a section response free of `\documentclass`, `\begin{document}`, and repeated setup.
- Reuse existing bibliography entries and image paths; do not fabricate citations, measurements, or build results.
- Existing user documents and definitions override sample conventions in this reference.
