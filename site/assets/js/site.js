/* ==========================================================================
   P3CTeX Product Workstation — Client Controller
   Fixed-Viewport Console & Navigation Management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setupDeckSwitcher();
  setupTutorialStepper();
  setupChannelRocker();
  setupCopyButtons();
});

/* --------------------------------------------------------------------------
   1. Section Deck Switcher (01 .. 05)
   -------------------------------------------------------------------------- */
function setupDeckSwitcher() {
  const keys = document.querySelectorAll('.selector-key[data-deck]');
  const decks = document.querySelectorAll('.console-deck');
  const readout = document.getElementById('active-mode-readout');

  const modeLabels = {
    'deck-overview': 'SECTION: [01 // OVERVIEW]',
    'deck-templates': 'SECTION: [02 // STEP-BY-STEP TUTORIAL]',
    'deck-macros': 'SECTION: [03 // MACRO & FEATURE REFERENCE]',
    'deck-runbook': 'SECTION: [04 // INSTALLATION & SETUP]'
  };

  function activateDeck(targetDeckId) {
    decks.forEach(deck => {
      if (deck.id === targetDeckId) {
        deck.classList.add('active');
      } else {
        deck.classList.remove('active');
      }
    });

    keys.forEach(k => {
      if (k.getAttribute('data-deck') === targetDeckId) {
        k.classList.add('active');
      } else {
        k.classList.remove('active');
      }
    });

    if (readout && modeLabels[targetDeckId]) {
      readout.textContent = modeLabels[targetDeckId];
    }
  }

  keys.forEach(key => {
    key.addEventListener('click', () => {
      const targetDeckId = key.getAttribute('data-deck');
      activateDeck(targetDeckId);
      window.location.hash = targetDeckId.replace('deck-', '');
    });
  });

  document.querySelectorAll('[data-jump-deck]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDeckId = btn.getAttribute('data-jump-deck');
      activateDeck(targetDeckId);
      window.location.hash = targetDeckId.replace('deck-', '');
    });
  });

  // Activate by URL hash if present
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const target = 'deck-' + hash;
    if (document.getElementById(target)) {
      activateDeck(target);
    }
  }
}

/* --------------------------------------------------------------------------
   2. Step-by-Step Interactive Tutorial (Lessons 01 .. 07)
   -------------------------------------------------------------------------- */
const tutorialSteps = {
  1: {
    num: '01',
    title: 'Profiles (PAC / PR / MEM / TFG)',
    tag: 'DOCUMENT LIFECYCLE',
    filename: '01-profiles.tex',
    code: `\\documentclass[PAC,default]{P3CTeX} % Profile: PAC (default) | PR | MEM | TFG

% PAC vs PR: Both share identical macros, geometry, and Arev typography.
% - PAC: Starts on page 1 with metadata & anti-plagiarism pledge (Continuous Assessment).
% - PR:  Adds the official UOC graphical cover page and table of contents (Reports).
% - MEM: Multi-chapter report. Enables \\chapter, \\pxMEMannex, and figure/table indexes.
% - TFG: Final Degree Project. Injects official UOC work card and bilingual abstract.`,
    desc: 'P3CTeX defines document lifecycle profiles via class options. PAC and PR share identical macros, booktabs tables, listings, and geometry, differing solely by whether an institutional graphic cover is generated.',
    refLabel: '// PROFILE OPTIONS REFERENCE:',
    refTable: [
      { k: 'PAC / PEC / CA', v: 'Continuous assessment (starts directly on page 1, auto anti-plagiarism pledge, no blank cover). Catalan (PAC), Spanish (PEC), English (CA).' },
      { k: 'PR', v: 'Practicum and lab reports. Automatically prints the official UOC graphical cover page and table of contents.' },
      { k: 'MEM', v: 'Multi-chapter technical memory. Enables \\chapter, appendices (\\pxMEMannex), and figure/table indexes.' },
      { k: 'TFG', v: 'Final Degree Project. Adds official UOC work card (\\pxTFGworkcard), praise/dedication, and bilingual abstracts.' }
    ],
    tipTitle: '[NOTE] PAC vs PR Grading Compliance',
    tipText: 'UOC continuous assessment rubrics penalize blank cover pages because teachers grade hundreds of digital submissions. PAC puts your identity directly on page 1. For formal practicum deliverables, switch to [PR].'
  },
  2: {
    num: '02',
    title: 'Cover Overrides & Header Layout',
    tag: 'GDXCOVER & GDXSTYLE',
    filename: '02-cover-and-headers.tex',
    code: `% 1. Academic metadata dictionary:
\\PECTeXconfig{
  data = {
    student        = {Estudiant UOC},
    grade          = {Grau en Enginyeria Informàtica},
    subj-fullname  = {Compiladors i Llenguatges},
    subj-shortname = {COMP},
    subj-code      = {75.580},
    ca-fullname    = {PAC 1: Anàlisi Lèxica i Sintàctica},
    ca-shortname   = {PAC1},
    date           = {\\today}
  }
}

% 2. Cover visual & text overrides (gdxCOVER):
\\PECTeXcover{
  text-title       = {Anàlisi de Gramàtiques LR(1)},
  text-subtitle    = {Implementació d'un Analitzador Sintàctic},
  text-backtitle   = {UNIVERSITAT OBERTA DE CATALUNYA},
  add-picture      = true,
  image-square     = {pxsqrcover.png},
  uppertitle       = true,
  text-uppertitle  = {Grau en Enginyeria Informàtica}
}

% 3. Running headers and footers (gdxSTYLE):
\\PECTeXpage{
  header-left      = {\\raisebox{0.075cm}{ìncludegraphics[height=0.9cm]{img/pxhlogo.png}}},
  header-center    = {\\mdseries COMP \\par\\noindent \\bfseries PAC 1},
  header-right     = {\\raggedleft\\mdseries Estudiant UOC \\par\\noindent\\bfseries 75.580},
  footer-left      = {\\textcolor{gray}{\\small PAC1-COMP}},
  footer-center    = {\\thepage\\ / \\pageref{LastPage}}
}`,
    desc: 'Metadata (\\PECTeXconfig) populates university registers. Direct visual overrides for the cover (\\PECTeXcover) and running headers/footers (\\PECTeXpage) allow custom branding, logos, and footer notices.',
    refLabel: '// COVER & PAGE REGISTERS:',
    refTable: [
      { k: '\\PECTeXconfig{data={...}}', v: 'High-level student and course metadata dictionary (student, grade, subj-code...).' },
      { k: '\\PECTeXcover{...}', v: 'Cover keys: text-title, text-subtitle, text-backtitle, add-picture, image-square, image-long.' },
      { k: '\\PECTeXpage{...}', v: 'Header/footer layout: header-left, header-center, header-right, footer-left, footer-center, footer-right.' },
      { k: 'footer-center / footer-left', v: 'Available footer space for page counters (\\thepage / \\pageref{LastPage}) or notices.' }
    ],
    tipTitle: '[NOTE] Metadata vs Layout Literals',
    tipText: 'Metadata keys represent who you are; cover and page literals represent how the document looks. You can override cover text without altering your student record.'
  },
  3: {
    num: '03',
    title: 'Built-in Tools & Typographic Shorthands',
    tag: 'DEFAULT PRESET',
    filename: '03-default-tools.tex',
    code: `\\section{Demostració d'eines i abreviatures per defecte}

% Institutional primary colored bold text:
\\textbc{Text destacat en el color primari institucional.}

% Fast structured lists:
\\begin{itemize}
  ìtembf Objectiu:: Desenvolupar l'analitzador lèxic.
  \\subitembf Restricció:: Temps d'execució inferior a 1 segon.
  ìtemT Metodologia: Implementació amb taules DFA mínimes.;
ènd{itemize}

% Fixed width parbox and horizontal filling:
\\BOX{0.48}:{Columna Esquerra}\\FL\\BOX{0.48}:{Columna Dreta}

% Inline page reference badge:
Segons s'indica a la secció anterior\\REF{sec:intro}, la gramàtica és lliure de context.

% Auto-scale wide equations or tables to exact linewidth:
\\EXPAND{$\\displaystyle \\sum_{i=1}^{n} \\frac{i^2 + \\sqrt{i}}{\\log(i + 1)} = \\Omega(n^2)$}`,
    desc: 'P3CTeX bundles convenient typographical shorthands loaded automatically by the default option. They accelerate writing, format list keys in bold, and provide inline page badges.',
    refLabel: '// BUILT-IN SHORTHANDS:',
    refTable: [
      { k: '\\textbc{text}', v: 'Typesets bold text in the official primary institutional theme color.' },
      { k: 'ìtembf Label: Text', v: 'Quick bold-item definition inside itemize environments.' },
      { k: '\\subitembf Label: Text', v: 'Indented secondary bold sub-item bullet.' },
      { k: '\\BOX{width}:{content};', v: 'Fixed-fraction width parbox container (\\BOX{0.5}:{...};).' },
      { k: '\\REF{label}', v: 'Renders a superscript gray page reference badge (e.g. Pàg[14]).' },
      { k: '\\EXPAND{content}', v: 'Scales wide formulas or tables to fit \\linewidth perfectly.' }
    ],
    tipTitle: '[NOTE] Built-in Table Row Helpers',
    tipText: 'When using standard LaTeX tabulars, P3CTeX provides \\headRow and òddRow with \\adjH row height struts for rapid zebra striping.'
  },
  4: {
    num: '04',
    title: 'Overwriting Default Strings & Language Literals',
    tag: 'PXTXT ENGINE',
    filename: '04-language-overrides.tex',
    code: `% Override standard P3CTeX literal text strings:
\\renewcommand{\\pxDEFtocname}{Taula de Continguts}
\\renewcommand{\\pxDEFpximgname}{Gràfic}
\\renewcommand{\\pxDEFpxcodename}{Llistat de Codi}
\\renewcommand{\\pxDEFpxcmdname}{Instrucció de Terminal}

% Custom authorship declaration text for UOC submission:
\\renewcommand{\\pxDEFnoplagi}[1]{%
  Jo, \\textbf{#1}, confirmo que aquest lliurament és de la meva exclusiva autoria, %
  sense cap intervenció externa no permesa ni plagi.%
}

\\begin{document}
% \\begin{document} outputs the customized authorship pledge and TOC automatically!`,
    desc: 'All standard labels in P3CTeX are defined in pxTXT via macros prefixed with \\pxDEF. You can overwrite any default string globally in your preamble with standard \\renewcommand.',
    refLabel: '// PXTXT STRING REGISTERS:',
    refTable: [
      { k: '\\pxDEFtocname', v: 'Title printed above the Table of Contents (default: Índex / Índice / Table of Contents).' },
      { k: '\\pxDEFnoplagi{author}', v: 'Statutory UOC anti-plagiarism and authorship pledge paragraph.' },
      { k: '\\pxDEFpximgname', v: 'Prefix label for pxSRC images and vector figure boxes (default: Imatge / Imagen / Picture).' },
      { k: '\\pxDEFpxcodename', v: 'Prefix label for pxLST source code listing frames.' },
      { k: '\\pxDEFpxcmdname', v: 'Prefix label for terminal command boxes.' }
    ],
    tipTitle: '[NOTE] Multilingual Previews',
    tipText: 'Passing CAT, ES, or EN in \\documentclass sets all pxTXT strings automatically. Use \\renewcommand{\\pxDEF...} when a faculty professor requires specific terminology.'
  },
  5: {
    num: '05',
    title: 'Data Tables, Code Listings & Safe Figures',
    tag: 'PXTAB, PXLST & PXSRC',
    filename: '05-tab-lst-src.tex',
    code: `% 1. pxTAB: Comma-separated tables without manual column arithmetic:
\\pxTable[style=header]
  {Fase, Estat, Temps, Proves}
  {Lexer, PASS, 0.12 s, 48/48}
  {Parser LR(1), PASS, 0.45 s, 112/112}
  {Generació Codi, PASS, 0.88 s, 32/32}

% 2. Syntax-highlighted dark code listing with line numbers:
\\begin{pxCode}[language=Java]{Parser.java}
public class Parser {
    private final Lexer lexer;
    public AST parse() throws SyntaxError {
        return parseExpression(0);
    }
}
ènd{pxCode}

% 3. pxSRC: Safe figure inclusion (draws vector placeholder if file missing):
\\pxIMG[0.75\\linewidth]{img/dfa_transitions}{Autòmat de transició d'estats}[fig:dfa]`,
    desc: 'pxTAB formats clean tables from comma-separated rows. pxLST highlights source code in a high-contrast dark theme. pxSRC includes figures with vector placeholders if files are missing.',
    refLabel: '// CORE SUITE COMMANDS:',
    refTable: [
      { k: '\\pxTable[style=...]{head}{row1}{row2}', v: 'Comma-separated table. Styles: header, striped, boxed, grid.' },
      { k: '\\pxTBLlong*[opts]{head}{rows...}', v: 'Multi-page table repeating headers across page breaks.' },
      { k: '\\begin{pxCode}[language=...]{Title}', v: 'Code block with high-contrast syntax highlighting and line numbers.' },
      { k: '\\pxIMG[width]{path}{caption}[label]', v: 'Resilient figure inclusion with automatic placeholder fallback.' }
    ],
    tipTitle: '[NOTE] Zero Missing File Halts',
    tipText: 'pxSRC guarantees pdflatex never halts with a missing file error before deadlines. A clean placeholder marks missing figures until they are exported.'
  },
  6: {
    num: '06',
    title: 'Object-Oriented UML Class Diagrams',
    tag: 'PXUML ENGINE',
    filename: '06-uml-class-diagram.tex',
    code: `% 1. Register class structure into the pxPRP class registry:
\\pxUMLClass[class]{Token}[Object]{
  - type : TokenType,
  - lexeme : String,
  - line : int
}[
  + getLexeme() : String,
  + getType() : TokenType,
  + toString() : String
]

\\pxUMLClass[class]{Lexer}{
  - input : String,
  - cursor : int
}[
  + nextToken() : Token,
  + hasMoreTokens() : boolean
]

% 2. Draw UML diagram with TikZ layout:
\\pxUMLDiagram{
  \\drawclass{Token}[0,0]
  \\drawclass{Lexer}[6,0]
}

% 3. Print member specifications directly as itemized list:
\\printAttributes{Token}
\\printOperations{Token}`,
    desc: 'pxUML decouples UML class definitions from drawing. Classes are registered once with attributes and operations, then drawn with \\drawclass inside \\pxUMLDiagram or printed as textual lists.',
    refLabel: '// PXUML INTERFACE COMMANDS:',
    refTable: [
      { k: '\\pxUMLClass[type]{Name}[parent]{attrs}[ops]<impl>', v: 'Registers a classifier into the pxPRP property registry without drawing.' },
      { k: '\\drawclass{Name}[x,y]', v: 'Renders a registered class with full attributes, operations, and inheritance lines.' },
      { k: '\\drawsimpleclass{Name}[x,y]', v: 'Renders a compact class showing only attributes and inheritance.' },
      { k: '\\printAttributes{Name} / \\printOperations{Name}', v: 'Typesets class members as a formatted itemized specification list.' }
    ],
    tipTitle: '[NOTE] Single Source of Truth',
    tipText: "Registering classes in pxUML means your UML diagram and your written report's method specification share identical signatures with zero copy-paste divergence."
  },
  7: {
    num: '07',
    title: 'Multi-Chapter Reports, Annexes & Bibliography',
    tag: 'PXMEM & PXBIB',
    filename: '07-mem-annexes-bib.tex',
    code: `% Requires MEM profile: \\documentclass[MEM,PR,default]{P3CTeX}

\\chapter{Desenvolupament del Projecte}
\\section{Arquitectura del Compilador}
Descripció detallada del mòdul semàntic...

% Annexes switch numbering to letter format (Annex A, Annex B...) automatically:
\\pxMEMannex{Codi Font Complet del Mòdul Sintàctic}{
  ìnput{src/syntax_analyzer.tex}
}

% Reusing sections from previous PR submissions without file duplication:
\\pxMEMsource{pr1}{../PR1/lliurament_pr1.tex}
\\pxMEMinclude{pr1}{benchmark_results} % extracts %<*benchmark_results> block

% Bibliography: automatically adds 'Bibliografia' to TOC on a fresh page:
\\pxBib[apalike]{references}`,
    desc: 'pxMEM turns P3CTeX into a multi-chapter report without changing base article geometry. It handles numbered chapters, lettered annexes, cross-PR section extraction, and bibliography.',
    refLabel: '// ADVANCED REPORT MACROS:',
    refTable: [
      { k: '\\chapter{Title}', v: 'Numbered chapter page break; numbers sections within current chapter.' },
      { k: '\\pxMEMannex{Title}{content}', v: 'Letter-numbered appendix chapter (Annex A, Annex B) with auto TOC registration.' },
      { k: '\\pxMEMsource{id}{path.tex}', v: 'Registers a previous assessment .tex file for code/text snippet reuse.' },
      { k: '\\pxMEMinclude{id}{region}', v: 'Inputs lines tagged with %<*region> ... %</region> from registered source.' },
      { k: '\\pxBib[style]{bibfile}', v: 'Outputs bibliography on a new page and creates a TOC entry automatically.' }
    ],
    tipTitle: '[NOTE] Code Snippet Reuse Across Deliverables',
    tipText: 'When preparing your final memory, tag benchmark or test sections in PR1 with %<*tag> and pull them directly into MEM with \\pxMEMinclude without maintaining two copies.'
  }
};


function setupTutorialStepper() {
  const stepBtns = document.querySelectorAll('.tut-step-btn[data-step]');
  const btnPrev = document.getElementById('tut-btn-prev');
  const btnNext = document.getElementById('tut-btn-next');
  const indicator = document.getElementById('tut-step-indicator');
  const filenameTarget = document.getElementById('tut-code-filename');
  const codeTarget = document.getElementById('tut-code-target');
  const statusTarget = document.getElementById('tut-progress-status');
  const guideTitle = document.getElementById('tut-guide-title');
  const guideTag = document.getElementById('tut-guide-tag');
  const guideDesc = document.getElementById('tut-guide-desc');
  const refLabel = document.getElementById('tut-ref-label');
  const refTable = document.getElementById('tut-ref-table');
  const tipTitle = document.getElementById('tut-tip-title');
  const tipText = document.getElementById('tut-tip-text');

  let currentStep = 1;
  const totalSteps = Object.keys(tutorialSteps).length;

  function renderStep(step) {
    const data = tutorialSteps[step];
    if (!data) return;
    currentStep = step;

    stepBtns.forEach(btn => {
      const s = parseInt(btn.getAttribute('data-step'), 10);
      if (s === step) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (indicator) indicator.textContent = `STEP ${data.num} OF 0${totalSteps}`;
    if (filenameTarget) filenameTarget.textContent = data.filename;
    if (codeTarget) codeTarget.textContent = data.code;
    if (statusTarget) statusTarget.textContent = `Lesson ${step} of ${totalSteps}`;
    if (guideTitle) guideTitle.textContent = `Step ${step}: ${data.title}`;
    if (guideTag) guideTag.textContent = data.tag;
    if (guideDesc) guideDesc.textContent = data.desc;
    if (refLabel) refLabel.textContent = data.refLabel;

    if (refTable) {
      refTable.innerHTML = '';
      data.refTable.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'ref-row';
        rowEl.innerHTML = `<code class="ref-k">${escapeHTML(row.k)}</code><span class="ref-v">${escapeHTML(row.v)}</span>`;
        refTable.appendChild(rowEl);
      });
    }

    if (tipTitle) tipTitle.textContent = data.tipTitle;
    if (tipText) tipText.textContent = data.tipText;

    if (btnPrev) btnPrev.disabled = (step <= 1);
    if (btnNext) {
      if (step >= totalSteps) {
        btnNext.innerHTML = '<span>FINAL STEP (SETUP &rarr;)</span>';
        btnNext.onclick = () => {
          const runbookKey = document.querySelector('.selector-key[data-deck="deck-runbook"]');
          if (runbookKey) runbookKey.click();
        };
      } else {
        btnNext.innerHTML = '<span>NEXT STEP &rarr;</span>';
        btnNext.onclick = () => renderStep(currentStep + 1);
      }
    }
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      renderStep(step);
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) renderStep(currentStep - 1);
    });
  }

  // Initialize step 1
  renderStep(1);
}

/* --------------------------------------------------------------------------
   3. Packages & Macros Switcher (6 Core Packages)
   -------------------------------------------------------------------------- */
function setupChannelRocker() {
  const keys = document.querySelectorAll('.channel-key[data-channel]');
  const titleTarget = document.getElementById('macro-hero-title');
  const backendBadgeTarget = document.getElementById('macro-backend-badge');
  const descTarget = document.getElementById('macro-hero-desc');
  const apiTableTarget = document.getElementById('macro-api-table');
  const featuresTarget = document.getElementById('macro-features-strip');
  const codeTarget = document.getElementById('macro-code-target');
  const notesListTarget = document.getElementById('macro-notes-list');
  const urlTarget = document.getElementById('macro-showcase-url');

  // Search & Viewport mode elements
  const searchInput = document.getElementById('macro-search-input');
  const searchClear = document.getElementById('macro-search-clear');
  const searchResults = document.getElementById('macro-search-results');
  const searchCount = document.getElementById('macro-search-count');
  const searchTable = document.getElementById('macro-search-table');
  const showcaseSplit = document.getElementById('macro-showcase-split');
  const viewModeBtns = document.querySelectorAll('.view-mode-rocker .mode-btn');

    const channelData = {
    pxtab: {
      id: 'pxTAB',
      title: 'Tables & Multipage Data',
      badge: 'booktabs + longtable',
      desc: 'Creates clean LaTeX tables from comma-separated rows without column math. Features automatic alternating row shading (zebra striping), multi-page longtable pagination, custom cell alignments, and variable-driven matrix rendering.',
      apiRows: [
        { cmd: '\\pxTable[style=...]{head}{row1}{row2}...', desc: 'Standard table from comma-separated rows. Styles: striped, header, boxed, grid.' },
        { cmd: 'style=striped | header | boxed | grid', desc: 'Presentation theme: striped (zebra rows), header (bold bar), boxed (border), grid (mesh).' },
        { cmd: '\\pxTableHeadBodyRows[opts]{head}{body}', desc: 'Explicit separation of column headers and multiline row block without column counting.' },
        { cmd: '\\pxTBLlong*[opts]{head}{rows...}', desc: 'Multipage table that repeats headers and rules across page-breaks without manual TikZ.' },
        { cmd: '\\pxTableFromList[opts]{list-data}', desc: 'Populates a structured table dynamically from an expl3 comma-separated list variable.' },
        { cmd: '\\pxTableRow{c1, c2, ...}', desc: 'Defines an explicit single row with custom cell styling or manual horizontal separators.' },
        { cmd: '\\pxTableMatrix{rows}', desc: 'Renders matrix format data directly without requiring math mode brackets or environments.' },
        { cmd: '\\pxTABsetup{key=val,...}', desc: 'Configures default style, zebra background color, and cell padding globally.' }
      ],
      features: [
        '<strong>Zero column math:</strong> Proportional column widths calculated dynamically from content',
        '<strong>Zebra striping:</strong> Low-strain alternating row shading out of the box',
        '<strong>Multipage tables:</strong> Long table pagination with automated header repeat via \\pxTBLlong*',
        '<strong>Expl3 backend:</strong> Built on longtable, booktabs, and colortbl without external dependencies'
      ],
      code: `% 1. Standard table with comma-separated values and zebra striping:
\\pxTable[style=striped]
  {Mètrica / Paràmetre, Valor Mesurat, Llindar, Estat}
  {Temps d'execució, 0.42 s, < 1.00 s, PASS}
  {Consum de Memòria, 18.5 MB, < 64.0 MB, PASS}
  {Complexitat Temporal, O(n log n), O(n^2), OPTIMAL}
  {Taxa d'encert (Cache), 96.8 %, > 90.0 %, PASS}
  {Cobertura de Tests, 94.2 %, > 80.0 %, PASS}

% 2. Multipage long table repeating headers on every page break:
\\pxTBLlong*[style=grid]
  {Codi Test, Mòdul Semàntic, Entorn, Resultat}
  {TC-01, Lexer Tokenizer, OpenJDK 21, VALID}
  {TC-02, Parser LR(1), OpenJDK 21, VALID}
  {TC-03, Taula de Símbols, OpenJDK 21, VALID}
  {TC-04, Generador Codi, OpenJDK 21, VALID}`,
      notes: [
        '<code>[style=striped]</code>: Alternates row backgrounds with low-strain shaded fills.',
        '<code>{head}</code>: Comma-separated column headers; sets the number of columns automatically.',
        '<code>{row...}</code>: Subsequent arguments form table rows automatically without & or \\\\ separators.',
        '<code>\\pxTBLlong*</code>: Handles multi-page tables spanning page boundaries cleanly.',
        'Zero manual width arithmetic needed; columns balance text proportionally.'
      ],
      url: 'generator.html#tables'
    },
    pxsrc: {
      id: 'pxSRC',
      title: 'Figures, Graphics & Automated Lists',
      badge: 'resilient vector fallback',
      desc: 'Safely scales graphics to text width fractions. If an image file path is missing from disk, it displays a calibrated vector placeholder box instead of halting pdflatex compilation before deadlines.',
      apiRows: [
        { cmd: '\\pxIMG[width]{file}{caption}[label]', desc: 'Primary safe figure command; auto-scales to linewidth; falls back to vector placeholder if missing.' },
        { cmd: '\\pxIMGpair[w]{left}{right}[col]{caption}[label]', desc: 'Side-by-side dual image comparison in a single float with balanced captions.' },
        { cmd: '\\pxIMGList[width]{prefix}[caption-prefix]{caps...}', desc: 'Generates consecutively numbered images (prefix1, prefix2...) automatically from comma list.' },
        { cmd: '\\listoffigures', desc: 'Typesets the standard List of Figures (LOF), populated automatically by \\pxIMG.' },
        { cmd: '\\pxSRCsetup{key=val,...}', desc: 'Configures default-width, pair-width, placeholder-color, and float-spec globally.' },
        { cmd: '\\pxDEFimagewidth{dim}', desc: 'Sets default width fallback for standalone images (default: 0.8\\linewidth).' },
        { cmd: '\\pxDEFimageplaceholdercolor{col}', desc: 'Sets fill color for missing image placeholders (default: light gray with border).' }
      ],
      features: [
        '<strong>Zero-halt fallback:</strong> Draws calibrated placeholder box if graphic file is missing',
        '<strong>Automated lists:</strong> \\pxIMGList expands numbered sequence figures automatically',
        '<strong>Dual comparison:</strong> \\pxIMGpair places two figures side by side with shared label',
        '<strong>Format support:</strong> Native PDF vector, PNG, and JPG raster graphics'
      ],
      code: `% 1. Standard safe figure with vector fallback if file is missing:
\\pxIMG[0.85\\linewidth]{img/arquitectura}
  {Diagrama de l'arquitectura proposada}[fig:arq]

% 2. Dual comparative figure side-by-side:
\\pxIMGpair{img/bench_v1}{img/bench_v2}
  {Comparativa de rendiment abans i després de l'optimització}[fig:bench]

% 3. Automated consecutively numbered figures (expands to img/step1.png ... img/step3.png):
\\pxIMGList[0.7\\linewidth]{img/step}[Fase ]{
  Anàlisi de requeriments i especificació,
  Disseny conceptual de la base de dades,
  Implementació dels serveis RESTful
}`,
      notes: [
        '<code>[0.85\\linewidth]</code>: Proportional width relative to page text width.',
        '<code>{img/arquitectura}</code>: Path to graphic file (omitting extension resolves .pdf/.png automatically).',
        '<code>{caption}</code>: Formats caption and registers entry in \\listoffigures automatically.',
        '<code>[fig:arq]</code>: Generates label for \\ref{fig:arq} cross-references.',
        'Missing image files render a crisp labeled box instead of halting compilation.'
      ],
      url: 'generator.html#uml'
    },
    pxlst: {
      id: 'pxLST',
      title: 'Syntax-Highlighted Code Blocks',
      badge: 'listings + tcolorbox',
      desc: 'High-contrast dark code blocks with line numbers, gutter styling, and syntax highlighting for 17+ languages using pure LaTeX (zero Python, pygments, or shell-escape dependencies).',
      apiRows: [
        { cmd: '\\begin{pxCode}[language=...]{Header Title}', desc: 'Primary code listing container with dark theme, gutter, and line numbers.' },
        { cmd: '\\pxCodeFile[lang]{path}[title]', desc: 'Directly includes external source file with syntax coloring and line gutter.' },
        { cmd: '\\pxCodeFileInput[lang]{path}{start}{end}', desc: 'Inlines specific line range from external source file without duplicating code.' },
        { cmd: '\\pxCodeIn[lang]{code}', desc: 'Typesets an inline monospace code token with language syntax color.' },
        { cmd: 'Languages: 17+ built-in', desc: 'Java, Python, C, C++, SQL, Bash, R, Rust, JS, TS, Go, PHP, HTML, CSS, JSON, YAML, LaTeX.' },
        { cmd: '\\pxCodeSet{key=val,...}', desc: 'Configures tab size, font family, line numbering step, and background tones.' }
      ],
      features: [
        '<strong>Pure LaTeX:</strong> Zero Python, pygments, or shell-escape dependencies',
        '<strong>17+ Languages:</strong> Java, Python, C, C++, SQL, Bash, R, Rust, JS, TS, Go, YAML...',
        '<strong>Line numbers:</strong> Low-strain muted gutter with automatic line numbers',
        '<strong>Line range slicing:</strong> Pull exact lines from project repositories'
      ],
      code: `% 1. High-contrast dark code listing with syntax highlighting and line numbers:
\\begin{pxCode}[language=Java]{Lexer.java}
package edu.uoc.compiler;

public class Lexer {
    private final String source;
    private int cursor = 0;

    public Lexer(String source) {
        this.source = source;
    }

    public Token nextToken() {
        if (cursor >= source.length()) return Token.EOF;
        char c = source.charAt(cursor++);
        return Character.isDigit(c) ? Token.NUMBER : Token.ID;
    }
}
\\end{pxCode}

% 2. Inline specific line range directly from repository file:
\\pxCodeFileInput[Java]{src/Parser.java}{45}{68}`,
      notes: [
        '<code>[language=Java]</code>: Syntax highlighting engine (supports 17+ languages).',
        '<code>{Lexer.java}</code>: Displayed in the code box header bar alongside language badge.',
        '<code>\\pxCodeFileInput</code>: Slices lines 45 to 68 directly from source file on disk.',
        'Built with listings and tcolorbox; fully offline compilable with standard pdflatex.'
      ],
      url: 'generator.html#code'
    },
    pxcmp: {
      id: 'pxCMP',
      title: 'Compilers, Automata & Visualizers',
      badge: 'Computer Science Diagrams',
      desc: 'Complete diagramming suite for Computer Science coursework: Compilers, Theory of Computation, and AI. Renders Tombstone compiler T-diagrams, DFA/NFA state transition tables, BNF production grammars, and neural/decision networks.',
      apiRows: [
        { cmd: '\\pxTombstoneCompile[opts]{Prog}{Src}{Tgt}{Impl}', desc: '4-piece compiler execution T-diagram (Program, Source, Target, Implementation).' },
        { cmd: '\\pxTombstoneChain{...}', desc: 'Multi-stage compilation pipeline chain (e.g. C -> Intermediate -> x86).' },
        { cmd: '\\pxTransitionTable{state,0,1; ...}', desc: 'Semicolon-delimited state transition matrix for DFAs and NFAs.' },
        { cmd: '\\pxBNF{productions}', desc: 'Formatted context-free grammar production block with alignment operators.' },
        { cmd: '\\pxAutomaton[opts]{states}{transitions}', desc: 'TikZ state machine diagram with initial and accepting states.' },
        { cmd: '\\pxDecisionTree / \\pxNeuralNet', desc: 'Visualizes decision trees, neural network topologies, and layer activation.' },
        { cmd: '\\pxConfusionMatrix{data}', desc: 'Confusion matrix visualizer for machine learning classifier validation.' },
        { cmd: '\\pxMemoryMap / \\pxRegisterMap', desc: 'Memory segment allocation and hardware CPU register map visualizers.' }
      ],
      features: [
        '<strong>Tombstone diagrams:</strong> Compiler pipeline T-diagrams with \\pxTombstoneCompile',
        '<strong>Transition matrices:</strong> Automata state transition tables for DFAs and NFAs',
        '<strong>Formal grammar:</strong> Context-free grammar BNF production blocks with alignment',
        '<strong>AI & Hardware:</strong> Decision trees, confusion matrices, and memory layout registers'
      ],
      code: `% 1. 4-piece compiler execution Tombstone T-diagram:
\\pxTombstoneCompile[title=Compilador Mini-C]{Mini-C}{C}{JVM}{Java}

% 2. State transition matrix for finite automata:
\\pxTransitionTable{
  state, 0, 1;
  q0, q1, q0;
  q1, q0, q2;
  q2, q2, q1
}

% 3. Context-free grammar production rules:
\\pxBNF{
  <expr>   ::= <term> ("+" | "-") <expr> | <term> \\\\
  <term>   ::= <factor> ("*" | "/") <term> | <factor> \\\\
  <factor> ::= "(" <expr> ")" | <id> | <num>
}`,
      notes: [
        '<code>\\pxTombstoneCompile</code>: 4 mandatory arguments: {Program}{Source}{Target}{Implementation}.',
        '<code>\\pxTransitionTable</code>: Semicolon-delimited rows for finite automata state matrices.',
        '<code>\\pxBNF</code>: Renders aligned formal grammar productions for compiler design.',
        'Supports multi-stage compilation pipelines with <code>\\pxTombstoneChain</code>.'
      ],
      url: 'generator.html#compilers'
    },
    pxgnt: {
      id: 'pxGNT',
      title: 'Daily-Resolution Gantt Timelines',
      badge: 'Daily Calendar Resolution',
      desc: 'Generates daily-resolution Gantt project planning charts using calendar dates (DD/MM/YYYY). Automatically partitions long multi-month timelines into consecutive page blocks for milestone tracking.',
      apiRows: [
        { cmd: '\\pxGantt{start=DD/MM/YYYY, end=DD/MM/YYYY, days-per-block=...}', desc: 'Initializes calendar timeline environment with date bounds.' },
        { cmd: '\\pxGanttItem{Task Label}{start-date}{end-date}', desc: 'Draws a task bar clipped to current date block.' },
        { cmd: '\\pxGanttEnd', desc: 'Finalizes and renders portrait blocks with day numbers and calendar grid.' },
        { cmd: 'days-per-block=30', desc: 'Partitions long timelines into clean 30-day blocks fitting on standard portrait pages.' }
      ],
      features: [
        '<strong>Resolution:</strong> Daily calendar planning using DD/MM/YYYY dates',
        '<strong>Block division:</strong> Splits long timelines into readable 30-day page blocks',
        '<strong>Automatic clipping:</strong> Multi-block tasks connect cleanly across boundaries',
        '<strong>Backend:</strong> Pure TikZ timeline rendering'
      ],
      code: `% Daily-resolution Gantt timeline split into 30-day blocks:
\\pxGantt{
  start=01/03/2026,
  end=30/04/2026,
  days-per-block=30
}
  \\pxGanttItem{Fase 1: Recerca i Requeriments}{01/03/2026}{15/03/2026}
  \\pxGanttItem{Fase 2: Disseny de l'Arquitectura}{12/03/2026}{28/03/2026}
  \\pxGanttItem{Fase 3: Implementació del Nucli}{25/03/2026}{20/04/2026}
  \\pxGanttItem{Fase 4: Validació i Proves}{15/04/2026}{30/04/2026}
\\pxGanttEnd`,
      notes: [
        'Dates formatted as <code>DD/MM/YYYY</code>.',
        '<code>days-per-block=30</code>: Splits long multi-month timelines into readable consecutive page blocks.',
        'Tasks automatically clipped and connected across block boundaries.',
        'Zero manual geometry calculations needed; bars align to exact day coordinates.'
      ],
      url: 'generator.html#gantt'
    },
    pxuml: {
      id: 'pxUML',
      title: 'UML Class & Architecture Modeling',
      badge: 'Single Source of Truth',
      desc: 'Decouples UML class models from TikZ diagram placement. Classes are registered once into the pxPRP property registry with attributes and methods, then rendered as diagrams or printed directly as textual specification lists.',
      apiRows: [
        { cmd: '\\pxUMLClass[type]{Name}[parent]{attrs}[ops]<impl>', desc: 'Registers a classifier into the property registry without drawing.' },
        { cmd: '\\drawclass{Name}[x,y]', desc: 'Renders the registered class with attributes, methods, and inheritance lines on TikZ canvas.' },
        { cmd: '\\drawsimpleclass{Name}[x,y]', desc: 'Renders compact class box showing only name and attributes.' },
        { cmd: '\\drawinstance{ObjName}[x,y]{ClassName}{attr-values}', desc: 'Renders an instantiated runtime object box.' },
        { cmd: '\\printAttributes{Name} / \\printOperations{Name}', desc: 'Outputs formatted itemized specification lists of class members in report body.' },
        { cmd: '\\pxUMLDiagram{...}', desc: 'Environment container for drawing classes and inheritance connectors.' }
      ],
      features: [
        '<strong>Single source of truth:</strong> Diagram and written specifications share one definition',
        '<strong>Visibility prefixes:</strong> + public, - private, # protected',
        '<strong>Connectors:</strong> Automatic inheritance and implementation connectors',
        '<strong>Backend:</strong> Built on pgf-umlcd and TikZ'
      ],
      code: `% 1. Register UML classes into the registry:
\\pxUMLClass[class]{Token}[Object]{
  - type : TokenType,
  - lexeme : String,
  - line : int
}[
  + getLexeme() : String,
  + getType() : TokenType,
  + toString() : String
]

\\pxUMLClass[class]{Lexer}{
  - input : String,
  - cursor : int
}[
  + nextToken() : Token,
  + hasMoreTokens() : boolean
]

% 2. Render UML Diagram on TikZ canvas:
\\pxUMLDiagram{
  \\drawclass{Token}[0,0]
  \\drawclass{Lexer}[6,0]
}

% 3. Print members as specification list in deliverable text:
\\printAttributes{Token}
\\printOperations{Token}`,
      notes: [
        '<code>\\pxUMLClass</code> registers members into the internal dictionary.',
        '<code>\\drawclass{Name}[x,y]</code> places the defined classifier on the TikZ grid.',
        '<code>\\printAttributes</code> typesets class attributes as a clean itemized specification list.',
        'Prevents divergence between graphical diagrams and textual report specifications.'
      ],
      url: 'generator.html#uml'
    },
    pxmem: {
      id: 'pxMEM',
      title: 'Multi-Chapter Reports, Annexes & Slicing',
      badge: 'TFG & Multi-PR Reports',
      desc: 'Transforms P3CTeX into a multi-chapter report without changing base article geometry. Handles numbered chapters, lettered annexes, cross-PR section extraction (%<*tag> blocks), and automatic bibliography TOC placement.',
      apiRows: [
        { cmd: '\\chapter{Title}', desc: 'Starts a new numbered chapter with automatic page break and section counter reset.' },
        { cmd: '\\appendix', desc: 'Switches section numbering to alphabetic (Annex A, Annex B...).' },
        { cmd: '\\pxMEMannex{Title}{content}', desc: 'Standalone letter-numbered annex with automated TOC registration.' },
        { cmd: '\\pxMEMsource{id}{file.tex}', desc: 'Registers an existing assessment .tex file for modular content reuse.' },
        { cmd: '\\pxMEMinclude{id}{region}', desc: 'Inlines lines bounded by %<*region> ... %</region> from registered source.' },
        { cmd: '\\pxBib[style]{bibfile}', desc: 'Typesets bibliography on a fresh page and injects "Bibliografia" into TOC.' },
        { cmd: '\\listoftables / \\listoffigures', desc: 'Automated table of contents, figures, and tables lists.' }
      ],
      features: [
        '<strong>Chapter hierarchy:</strong> Full chapter support on standard article geometry',
        '<strong>Lettered annexes:</strong> Annex A, Annex B with auto TOC integration',
        '<strong>Cross-PR slicing:</strong> Extract tagged blocks (%<*tag>) without file duplication',
        '<strong>Unified bibliography:</strong> Automatic page-break and TOC entry with \\pxBib'
      ],
      code: `% Requires MEM profile: \\documentclass[MEM,PR,default]{P3CTeX}

\\chapter{Desenvolupament del Projecte}
\\section{Arquitectura del Compilador}
Descripció detallada del mòdul semàntic...

% Annexes switch numbering to letter format (Annex A, Annex B...) automatically:
\\pxMEMannex{Codi Font Complet del Mòdul Sintàctic}{
  \\input{src/syntax_analyzer.tex}
}

% Reusing sections from previous PR submissions without duplicating files:
\\pxMEMsource{pr1}{../PR1/lliurament_pr1.tex}
\\pxMEMinclude{pr1}{benchmark_results} % extracts %<*benchmark_results> block

% Bibliography: automatically adds 'Bibliografia' to TOC on a fresh page:
\\pxBib[apalike]{references}`,
      notes: [
        '<code>\\chapter{Title}</code>: Resets section counters and outputs header banner.',
        '<code>\\pxMEMannex</code>: Lettered appendix with auto-generated TOC bookmark.',
        '<code>\\pxMEMinclude</code>: Pulls tagged regions (%<*tag>) from PR1/PR2 into final memory.',
        '<code>\\pxBib</code>: Handles page Roman numbering and TOC orchestration.'
      ],
      url: 'generator.html'
    },
    pxtfg: {
      id: 'pxTFG',
      title: 'TFG Official Thesis & Degree Workcards',
      badge: 'Official UOC TFG Frontmatter',
      desc: 'Formats official university bachelor thesis (TFG / Treball de Final de Grau) deliverables. Generates the mandatory academic workcard (fitxa del treball), bilingual Catalan/English abstracts, license declaration page, and official frontmatter.',
      apiRows: [
        { cmd: '\\pxTFGsetup{key=val,...}', desc: 'Configures thesis records: title, author, tutor, field, keywords, credits, date.' },
        { cmd: '\\pxTFGabstract{lang}{text}', desc: 'Registers localized abstract (ca Catalan, en English, es Spanish).' },
        { cmd: '\\pxTFGworkcard', desc: 'Typesets the official UOC academic workcard table (Fitxa del Treball).' },
        { cmd: '\\pxTFGabstracts', desc: 'Renders all registered multilingual abstracts with keywords.' },
        { cmd: '\\pxTFGlicencepage', desc: 'Typesets the Creative Commons / copyright distribution license page.' },
        { cmd: '\\pxTFGfrontmatter', desc: 'Orchestrates complete preambles: cover, license, workcard, abstracts, and TOC.' },
        { cmd: '\\pxTFGcoverdetails', desc: 'Generates formal evaluation tribunal signatures and defense dates.' }
      ],
      features: [
        '<strong>Official workcard:</strong> Generates UOC Fitxa del Treball table',
        '<strong>Multilingual abstracts:</strong> Catalan, English, and Spanish abstracts',
        '<strong>License declaration:</strong> Creative Commons and copyright distribution page',
        '<strong>Unified pipeline:</strong> Single command \\pxTFGfrontmatter generates full preamble'
      ],
      code: `% Configure TFG Thesis Metadata:
\\pxTFGsetup{
  title    = {Compilador i Entorn d'Execució per a Llenguatges Específics},
  author   = {Nom i Cognoms de l'Estudiant},
  tutor    = {Dra. Maria Garcia (Consultora)},
  field    = {Enginyeria Informàtica (Computació)},
  credits  = {12 ECTS},
  date     = {Juny 2026}
}

% Multilingual thesis abstracts:
\\pxTFGabstract{ca}{Aquest Treball de Final de Grau presenta el disseny...}
\\pxTFGabstract{en}{This Bachelor's Thesis presents the design and implementation...}

% Complete frontmatter generation:
\\pxTFGfrontmatter`,
      notes: [
        '<code>\\pxTFGsetup</code>: Central registry for degree, credits, tutor, and keywords.',
        '<code>\\pxTFGworkcard</code>: Exact formatted table required by degree evaluation boards.',
        '<code>\\pxTFGfrontmatter</code>: Handles page Roman numbering and TOC orchestration.',
        'Ensures 100% compliance with university academic committee regulations.'
      ],
      url: 'generator.html'
    },
    pxgdx: {
      id: 'pxGDX',
      title: 'Dynamic Sizing, Layout & Overrides',
      badge: 'Layout Engines & Overrides',
      desc: 'Controls page geometry, dynamic content fitting, custom cover configurations, running headers/footers, automated lists, and language literal overrides from a single unified API.',
      apiRows: [
        { cmd: '\\pxGrow*[factor]{content}[max-height]', desc: 'Scales any content box to fit a fraction of \\linewidth while capping max vertical height.' },
        { cmd: '\\EXPAND{content}', desc: 'Proportional visual expansion shorthand for tables and figures.' },
        { cmd: '\\pxFill / \\pxCenter{content}', desc: 'Elastic horizontal glue and centering macros.' },
        { cmd: '\\BOX{width}:{content};', desc: 'Sized horizontal container box (\\parbox[c]{width\\linewidth}{...}).' },
        { cmd: '\\pxPageRule*', desc: 'Machined horizontal rule across running pages.' },
        { cmd: '\\GL{acronym} / \\GL*{acronym}', desc: 'Glossary acronym expander (\\GL short, \\GL* full name).' },
        { cmd: '\\PECTeXcover{key=val,...}', desc: 'Custom cover page layout registers: text-title, text-subtitle, add-picture, image-square.' },
        { cmd: '\\PECTeXpage{key=val,...}', desc: 'Running headers and footers bays (header-left, header-right, footer-center).' },
        { cmd: '\\renewcommand{\\pxDEFtocname}{...}', desc: 'Language string overrides (\\pxDEFtocname, \\pxDEFpximgname, \\pxDEFpxcodename, \\pxDEFnoplagi).' }
      ],
      features: [
        '<strong>Capped dynamic scaling:</strong> \\pxGrow* scales width while enforcing maximum height',
        '<strong>Header/footer control:</strong> 3 header bays and 3 footer bays with \\PECTeXpage',
        '<strong>Direct cover overrides:</strong> Direct layout adjustments with \\PECTeXcover',
        '<strong>Language overrides:</strong> Full customization of Catalan/Spanish/English strings'
      ],
      code: `% 1. Scale large diagram or table to fit exactly 90% linewidth, max 140pt:
\\pxGrow*[0.90]{
  \\begin{tikzpicture}
    % Complex architecture diagram...
  \\end{tikzpicture}
}[140pt]

% 2. Custom Cover Page Text and Image Overrides:
\\PECTeXcover{
  text-title      = {PROPOSTA D'ENGINYERIA DE COMPILADORS},
  text-subtitle   = {PAC 1 // Anàlisi Sintàctica i Lexical},
  text-backtitle  = {UOC ESTUDIS D'INFORMATICA},
  image-square    = {img/uoc_seal.png}
}

% 3. Running Headers & Footers Configuration:
\\PECTeXpage{
  header-left     = {\\small\\textsf{PAC 1 // Compiladors}},
  header-right    = {\\small\\textsf{Curs 2025/2026}},
  footer-center   = {\\thepage\\ / \\pageref{LastPage}}
}

% 4. Language String Overrides:
\\renewcommand{\\pxDEFtocname}{Taula de Continguts Detallada}
\\renewcommand{\\pxDEFpximgname}{Figura}
\\renewcommand{\\pxDEFpxcodename}{Llistat de Codi Font}`,
      notes: [
        '<code>\\pxGrow*</code>: Prevents oversized TikZ or tables from pushing content to next page.',
        '<code>\\PECTeXpage</code>: footer-center is reserved for page numbering.',
        '<code>pxTXT</code> strings are safe to override in preamble with standard <code>\\renewcommand</code>.',
        'Allows complete document internationalization and brand customization.'
      ],
      url: 'generator.html'
    }
  };

  function renderChannel(ch) {
    const d = channelData[ch];
    if (!d) return;

    keys.forEach(k => {
      if (k.getAttribute('data-channel') === ch) {
        k.classList.add('active');
      } else {
        k.classList.remove('active');
      }
    });

    if (titleTarget) titleTarget.innerHTML = d.title;
    if (backendBadgeTarget) backendBadgeTarget.textContent = d.badge;
    if (descTarget) descTarget.textContent = d.desc;
    if (codeTarget) codeTarget.textContent = d.code;
    if (urlTarget) urlTarget.setAttribute('href', d.url);

    if (apiTableTarget && d.apiRows) {
      apiTableTarget.innerHTML = `
        <div class="api-row header">
          <span class="api-col-cmd">Command / Syntax</span>
          <span class="api-col-desc">Purpose &amp; Parameters</span>
        </div>
        ` + d.apiRows.map(r => `
        <div class="api-row">
          <code class="api-col-cmd">${escapeHTML(r.cmd)}</code>
          <span class="api-col-desc">${escapeHTML(r.desc)}</span>
        </div>
      `).join('');
    }

    if (featuresTarget && d.features) {
      featuresTarget.innerHTML = d.features
        .map(f => `<div class="feat-pill">${f}</div>`)
        .join('');
    }

    if (notesListTarget && d.notes) {
      notesListTarget.innerHTML = d.notes
        .map(n => `<li>${n}</li>`)
        .join('');
    }
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 1. Channel Button Clicks
  keys.forEach(k => {
    k.addEventListener('click', () => {
      const ch = k.getAttribute('data-channel');
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      if (searchResults) searchResults.style.display = 'none';
      if (showcaseSplit) showcaseSplit.style.display = 'grid';
      renderChannel(ch);
    });
  });

  // 2. Viewport Mode Rocker (Split View / Wide API Table / Full Code)
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-view');
      if (!showcaseSplit) return;
      showcaseSplit.classList.remove('view-wide-table', 'view-wide-code');
      if (mode === 'wide-table') {
        showcaseSplit.classList.add('view-wide-table');
      } else if (mode === 'wide-code') {
        showcaseSplit.classList.add('view-wide-code');
      }
    });
  });

  // 3. Live Macro Search / Filter Bus across all 9 suites
  if (searchInput && searchResults && searchTable) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchResults.style.display = 'none';
        if (showcaseSplit) showcaseSplit.style.display = 'grid';
        if (searchClear) searchClear.style.display = 'none';
        return;
      }

      if (searchClear) searchClear.style.display = 'block';
      if (showcaseSplit) showcaseSplit.style.display = 'none';
      searchResults.style.display = 'flex';

      const matches = [];
      Object.keys(channelData).forEach(chKey => {
        const suite = channelData[chKey];
        suite.apiRows.forEach(row => {
          if (row.cmd.toLowerCase().includes(q) || row.desc.toLowerCase().includes(q) || suite.title.toLowerCase().includes(q) || suite.id.toLowerCase().includes(q)) {
            matches.push({ chKey, suiteId: suite.id, suiteTitle: suite.title, cmd: row.cmd, desc: row.desc });
          }
        });
      });

      if (searchCount) {
        searchCount.textContent = `${matches.length} MATCH${matches.length === 1 ? '' : 'ES'} FOUND FOR "${q.toUpperCase()}"`;
      }

      if (matches.length === 0) {
        searchTable.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-family: var(--font-mono); font-size: 11px;">NO MACROS OR FEATURES FOUND MATCHING "${escapeHTML(q)}". TRY "TABLE", "GROW", "UML", "ANNEX", "GANTT", "CODE", OR "COVER".</div>`;
      } else {
        searchTable.innerHTML = `
          <div class="search-match-row" style="background:#0d121a; font-family:var(--font-mono); font-size:8.5px; color:var(--text-muted); font-weight:700;">
            <span>SUITE</span>
            <span>COMMAND / SIGNATURE</span>
            <span>CAPABILITY &amp; PARAMETERS</span>
            <span style="text-align:right;">ACTION</span>
          </div>
        ` + matches.map(m => `
          <div class="search-match-row" data-goto-channel="${m.chKey}">
            <span class="search-match-suite">${m.suiteId}</span>
            <code class="search-match-cmd">${escapeHTML(m.cmd)}</code>
            <span class="search-match-desc">${escapeHTML(m.desc)}</span>
            <span class="search-match-action">INSPECT &rarr;</span>
          </div>
        `).join('');

        searchTable.querySelectorAll('.search-match-row[data-goto-channel]').forEach(rowEl => {
          rowEl.addEventListener('click', () => {
            const ch = rowEl.getAttribute('data-goto-channel');
            searchInput.value = '';
            searchClear.style.display = 'none';
            searchResults.style.display = 'none';
            if (showcaseSplit) showcaseSplit.style.display = 'grid';
            renderChannel(ch);
          });
        });
      }
    });

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchResults.style.display = 'none';
        if (showcaseSplit) showcaseSplit.style.display = 'grid';
      });
    }
  }

  // Initialize with pxTAB
  renderChannel('pxtab');
}
/* --------------------------------------------------------------------------
   4. One-Click Clipboard Actions
   -------------------------------------------------------------------------- */
function setupCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-copy-target');
      const targetEl = document.querySelector(targetSelector);
      if (!targetEl) return;

      const text = targetEl.innerText || targetEl.textContent;
      try {
        await navigator.clipboard.writeText(text);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span>COPIED!</span>';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('copied');
        }, 1800);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}
