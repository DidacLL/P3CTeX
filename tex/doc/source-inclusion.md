# Reusing PR content with pxSRC

Use `\pxInput` to include a section or subsection from a previous PR directly
in another document. **No changes to the original PR are necessary.**

```latex
\pxInput[section={Objectius}]{../PR1/PR1.tex}
\pxInput[subsection={Metodologia}]{../PR1/PR1.tex}
```

A section includes nested subsections; a subsection includes nested subsubsections.
The inclusion ends at the next heading of the same or higher level.
Source headings are retained and numbered in the receiving document.

Automatic selection supports literal, single-line section/subsection titles,
including starred headings and an optional short title. Duplicate titles at
the requested level produce an error instead of an arbitrary selection.
Use a named region for complex or multiline heading declarations.

Other selectors:

```latex
% A named region requires source comments: %<*discussion> ... %</discussion>
\pxInput[region=discussion]{../PR1/PR1.tex}
\pxInput[first-line=12,last-line=30]{../PR1/PR1.tex}
% The complete content of an ordinary body-only fragment:
\pxInput{sections/body.tex}
```

Optional registration avoids repeating a path:

```latex
\pxSource[section=Objectius]{pr1-goals}{../PR1/PR1.tex}
\pxUseSource{pr1-goals}
```

Imports execute native LaTeX, not code listings. Extracted content should
have balanced environments and any required document-level packages/macros.
Child inputs resolve relative to the original source directory.
