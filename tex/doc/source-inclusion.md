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

Native imports execute LaTeX. Extracted native content should have balanced
environments and any required document-level packages/macros. Child inputs
resolve relative to the original source directory.

## Literal and programming sources

Use the same source-selection interface with an explicit rendering mode:

```latex
\pxInput[as=text,first-line=2,last-line=12]{results.log}
\pxInput[as=code,language=Python,first-line=12,last-line=20,
  title={Input validation}]{src/parser.py}
\pxInput[as=code,region=implementation,region-prefix=//]{src/main.js}
\pxInput[as=text,container=minipage,width=.8\linewidth]{results.csv}
```

`as=native` remains the default. `as=code` uses the existing pxLST renderer:
enable `LST` in P3CTeX or load `pxLST` alongside `pxSRC` in a standard
class. `as=text` uses literal verbatim output and does not need pxLST.
Neither literal mode executes TeX commands from the source. Line bounds are
inclusive and use original file positions.

The standard region delimiter is `%<*name>` / `%</name>`. Use
`region-prefix=//` or another source-language prefix for non-TeX files;
`region-suffix` customises text following the marker. Source registration
retains its existing `\pxSource[options]{id}{file}` and
`\pxUseSource[overrides]{id}` interfaces.

Use `\pxSRCsetup{input={as=text,...}}` to configure typed, locally scoped
input defaults without changing image settings. Per-source and per-call
settings override these defaults.

Native includes support `label-prefix=PR1:` and references inside the
source through `\pxSourceRef{sec:goals}`; ordinary external `\ref`
remains unchanged. Source metadata accepts `caption`, `label`,
`cite`, and `terms`. Citation and glossary terms are associated with
the inclusion explicitly; literal code is never executed. Terms require
glossary support. Source-reference labels are independent of native
`label-prefix` settings.

