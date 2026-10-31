# Student tools

P3CTeX's existing tools remain the foundation. Choose features by what you need:

```latex
\documentclass[EN,code,images,tables,diagrams,calculations,project-management]{P3CTeX}
```

The readable keywords are aliases for module selection at class/package load time. Existing `LST`, `SRC`, `TAB`, `DIAG` and `default` options remain available. `CALC` and `PM` are also accepted. For a standard `article`, load individual packages or `\usepackage[code,calculations]{pxCORE}`. Runtime setup rejects module-loading options; use the selected tool\'s setup command for customisation.

| Tool | Package | Existing entry points |
| --- | --- | --- |
| Code | `pxLST` | `pxCode`, `pxCodeInline`, `pxCodeFile`, `pxCodeBox` |
| Images | `pxSRC` | `pxIMG`, `pxIMGpair`, `pxIMGList` |
| Tables | `pxTAB` | `pxTable`, `pxTableFromList`, `pxTableMatrix` |
| Diagrams | `pxDIAG` | `pxAutomaton`, `pxTransitionTable`, `pxGraph`, compiler/logic/memory/ML tools |
| Calculations | `pxCALC` | `pxDefVar`, `pxDefFormula`, `pxSolve`, `pxCalcStore` |
| Project management | `pxPM` | `pxUserStory`, `pxScenario`, `pxSWOT` |

## Code without TeX escaping

Quotes are upright. JLex/CUP double-quoted strings recognise backslash escapes. Dollar signs remain literal by default; `mathescape=true` is still an explicit per-listing option.

```latex
\begin{pxCode}[language=pxJLex]{Parameters}
<LONG_STRING>"$"[a-zA-Z_][a-zA-Z0-9_]* { emitParameter(); }
<LONG_STRING>[^'$]+ { /* ordinary text */ }
\end{pxCode}

\begin{pxTerminal}{Shell session}
$ printf '%s\n' "$HOME"
/home/student
\end{pxTerminal}

\pxCodeInline[pxBash]|printf '%s' "$HOME"|
\pxCodeChunk[pxJava]{src/Main.java}{12}{20}{Input validation}
```

`pxTerminal` accepts listings options in its optional argument, just like `pxCode`. It defaults to plain verbatim so command output is not misclassified as shell source. Use `[language=pxBash]` for a shell script. Set palettes with the existing `\pxLSTsetup[light]{pxBash}`. Customise the terminal container with `\tcbset{pxlst-terminal/.append style={...}}`.

`pxCodeChunk` uses an inclusive, 1-based source range and preserves source line numbers. Inline code accepts braces or a delimiter that does not occur in the code. Like `\verb`, verbatim commands cannot be placed inside another command's argument (including captions and section titles). The existing optional trailing inline style remains available.

## Define once, substitute, solve

```latex
\pxDefVar{m}{1200}[m]
\pxDefVar{v}{25}[v]
\pxDefFormula{Ek}{\frac{1}{2}[m][v]^2}
  [symbol=E_k,unit=J]

\pxSolve{Ek}                           % 375 000 J
\pxSolve[values={m=800,v=40}]{Ek}       % 640 000 J
\pxSolve{Ek}                           % still 375 000 J
\pxSetVar{v}{30}
\pxSolve[steps=1]{Ek}                  % 540 000 J
\pxCalcStore{Ek}{\energy}              % unrounded reusable number
```

Names start with a letter and may contain letters, digits, `_` and `-`. A slot `[name]` refers to a defined variable or formula. Formulas are evaluated from current inputs, including chained formulas. Missing names and dependency cycles are errors, not zero-valued inputs.

The supported single-source notation is arithmetic (`+`, `-`, `*`, `/`, parentheses and `^` with an unbraced exponent), `[name]` slots, `\frac{...}{...}`, `\sqrt{...}`, `\cdot`, `\times`, and `\pi`. Fractions and square roots can nest. This is numerical evaluation, not symbolic algebra or a general TeX mathematics parser. For function-rich numerical expressions use `\pxCalc{sin(pi/2)}` with expl3 floating-point syntax; it prints only the result. Use `\cdot` instead of `*` when the formula will be displayed.

`steps=3` prints symbol, formula, substituted formula and result; `steps=2` omits substitution; `steps=1` prints symbol and result. `prec` rounds the displayed result to that number of decimal places, without forcing trailing zeros. `\pxCalcStore[values={...}]{id}{\command}` stores the unrounded number; it respects the enclosing TeX group.

Presentation options belong to each call. Formula definitions store symbol and unit; each solve starts with steps=3 and prec=2, then applies its own overrides. Variables and formulas also respect TeX groups. `values={...}` only overrides existing variables and only for that call. Use `\pxSetVar` for a persistent change in the current group.

Units are formatted with `siunitx`, whose `\sisetup` remains available. **Units do not convert numerical values.** To display joules as kilojoules, define a formula that divides by 1000 and give that formula `unit=\kilo\joule`.

## Requirements using existing layout tools

```latex
\begin{pxUserStory}{US-102: Reuse a formula}
  \pxAsA{student}
  \pxIWant{to change inputs without copying formulas}
  \pxSoThat{my working stays consistent}
  \pxAcceptanceCriteria{\begin{itemize}
    \item Show substituted values.
    \item Preserve the defaults after a local override.
  \end{itemize}}
\end{pxUserStory}

\begin{pxScenario}[colback=green!4]{Changing the speed}
  \pxGiven{a stored formula}
  \pxWhen{I override the speed}
  \pxThen{the result uses the new value}
\end{pxScenario}

\pxSWOT{Strengths}{Weaknesses}{Opportunities}{Threats}
```

Cards are breakable and accept ordinary `tcolorbox` options. Set shared card options with `\pxPMsetup{box-options={colframe=teal}}`, or extend the `pxpm` style. Labels are editable, for example `\pxPMsetup{labels={as-a=Com a,i-want=Vull,so-that=Per tal de}}`. All label keys are `story`, `scenario`, `as-a`, `i-want`, `so-that`, `acceptance`, `given`, `when`, `then`, `strengths`, `weaknesses`, `opportunities`, `threats`.

`pxSWOT`/`pxDAFO` reuse `pxTable` with paragraph columns. Their optional argument takes existing `pxTAB` options; lists and paragraphs can be used in the four cells. Override `colspec` for custom column widths.

## Existing capabilities to reuse

- Missing screenshots: use `\pxIMG`, not a second safe-image API. `\pxIMGList[.8\linewidth]{img/run}[Iteration: ]{First,Second}` loads `img/run1`, `img/run2`.
- Partitions: `\pxTransitionTable` already has a partition field. `\pxAutomatonTrace` displays a supplied trace without running an automaton.
- Annexes and source reuse share pxANN and pxSRC across PAC, PR and MEM; see [the source guide](source-inclusion.md). Legacy pxMEM entry points delegate to them.
- Authorship: use the class's metadata, cover and translated declaration support. New tools do not generate institutional pledges.
- Diagram customisation: `\pxDiagramSetup`, `\pxDiagramSavePreset`, `\pxDiagramUsePreset` and `pxDiagram` are descriptive aliases; all existing `pxDIAG` commands and presets remain supported.
