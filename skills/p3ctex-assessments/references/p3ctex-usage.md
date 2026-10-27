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
- `CMP`, `GNT`, `TFG`, `MEM`: special modules; select at class-load time when needed (e.g., `\documentclass[CMP,PAC,default]{P3CTeX}`).

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

Predefined languages include `pxJava`, `pxPython`, `pxR` (Data Mining/Statistics), `pxC`, `pxSTM32C`, `pxASM`, `pxSQL`, `pxJavaScript` (`pxJS`), `pxJLex`, `pxCUP` (`pxYacc`/`pxBison`), `pxWorkflow` (`pxDSL`), `pxTAD`, `pxProlog`, `pxOWL`, `pxYAML`, and `algoritme`.

**UML** (requires `pxUML`; define classes before drawing):

```latex
\pxUMLClass{Person}{- name : String}[+ getName() : String]
\pxUMLDiagram{
  \drawclass{Person}[0,0]
}
```

**Compilers, Automata & Logic Diagrams** (requires `CMP` class option or `\usepackage{pxCMP}`):

```latex
% Auto-docked Tombstone compilation & 2-stage bootstrapping:
\pxTombstoneCompile[title={Compilació en Java}]{Programa}{Java}{JVM}{M}
\pxTombstoneBootstrap[title={Bootstrapping d'Oberon}]{Oberon}{486}{P-III}

% Front-End / Back-End compiler architecture & Parse Tree with token/lexeme leaves:
\pxCompilerModel[title={Estructura interna d'un compilador}]
\pxSyntaxTree[title={Arbre sintàctic}]{
  exp / exp / 0,0;
  id1 / IDENTIFICADOR / -2.0,-1.4 / ValorX;
  semi / PUNT\_I\_COMA / 2.0,-1.4 / {;}
}{exp->id1, exp->semi}

% Finite Automaton & Transition Table with Minimization:
\pxAutomaton[title={AFD}]{q0 / $q_0$ / 0,0 / initial; q1 / $q_1$ / 2.8,0 / accepting}{q0 -> q1 / a}
\pxTransitionTable[title={Taula $\delta$ i partició $\Pi_0$}]{a, b}{
  q_0 / initial   / q_1, q_2 / I;
  q_1 / accepting / q_1, q_0 / II
}
\pxAutomatonTrace{q_0 / a / q_1; q_1 / b / q_0}[Rebutjat]

% Heuristic Search Graph (A* / Dijkstra with badges and optimal path):
\pxGraph[title={Cerca A*}]{A / A / 0,0 / start / $h=20$; B / B / 2,1 / path / {$g=4, f=16$}; G / G / 4,0 / goal / $h=0$}{A => B / 4; B => G / 8}

% Machine Learning: Decision Tree, Multi-Layer Perceptron & Confusion Matrix:
\pxDecisionTree[title={Arbre de decisió}]{root / Neu / 0,0 / root / $IG=0.875$; leaf / Y / 2,0 / leaf}{root -> leaf / L}
\pxNeuralNet[title={Perceptró Multicapa}]{Entrada / x_0, x_1 / input; Capa oculta / h_0, h_1 / ReLU; Sortida / Y / Heaviside}[x_0 -> h_0 / 1; h_0 -> Y / -1]
\pxConfusionMatrix[title={Matriu de confusió}]{Positiu, Negatiu}{3 (TP), 2 (FP); 5 (FN), 5 (TN)}[F1 = 0.4615]
\pxFuzzyPlot[title={Lògica borrosa}, xlabel={Temperatura}]{0, 50}{Baixa / primaryColor / 0,1 / 15,1 / 25,0; Alta / darkColor / 20,0 / 35,1 / 50,1}

% BNF Grammar:
\pxBNF{exp -> assigna PUNT\_I\_COMA; assigna -> IDENTIFICADOR ASSIGNACIÓ operació}
```

Use ordinary LaTeX for math, paragraphs, lists, references, and simple tables when it is clearer. Custom `\itembf` and similar commands exist only when defined by the user's preamble.

## Checks when authoring

- Confirm package/module activation before using `pxIMG`, `pxTable`, `pxCode`, `pxUMLDiagram`, or `pxCMP` commands.
- Keep a section response free of `\documentclass`, `\begin{document}`, and repeated setup.
- Reuse existing bibliography entries and image paths; do not fabricate citations, measurements, or build results.
- Existing user documents and definitions override sample conventions in this reference.
