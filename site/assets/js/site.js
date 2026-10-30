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
    'deck-macros': 'SECTION: [03 // PACKAGE DOCUMENTATION]',
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
    tipTitle: '💡 PAC vs PR Grading Compliance',
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
  header-left      = {\\raisebox{0.075cm}{\\includegraphics[height=0.9cm]{img/pxhlogo.png}}},
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
    tipTitle: '💡 Metadata vs Layout Literals',
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
  \\itembf Objectiu:: Desenvolupar l'analitzador lèxic.
  \\subitembf Restricció:: Temps d'execució inferior a 1 segon.
  \\itemT Metodologia: Implementació amb taules DFA mínimes.;
\\end{itemize}

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
      { k: '\\itembf Label: Text', v: 'Quick bold-item definition inside itemize environments.' },
      { k: '\\subitembf Label: Text', v: 'Indented secondary bold sub-item bullet.' },
      { k: '\\BOX{width}:{content};', v: 'Fixed-fraction width parbox container (\\BOX{0.5}:{...};).' },
      { k: '\\REF{label}', v: 'Renders a superscript gray page reference badge (e.g. Pàg[14]).' },
      { k: '\\EXPAND{content}', v: 'Scales wide formulas or tables to fit \\linewidth perfectly.' }
    ],
    tipTitle: '💡 Built-in Table Row Helpers',
    tipText: 'When using standard LaTeX tabulars, P3CTeX provides \\headRow and \\oddRow with \\adjH row height struts for rapid zebra striping.'
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
    tipTitle: '💡 Multilingual Previews',
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

% 2. pxLST: JetBrains Darcula dark code listing with line numbers:
\\begin{pxCode}[language=Java]{Parser.java}
public class Parser {
    private final Lexer lexer;
    public AST parse() throws SyntaxError {
        return parseExpression(0);
    }
}
\\end{pxCode}

% 3. pxSRC: Safe figure inclusion (draws vector placeholder if file missing):
\\pxIMG[0.75\\linewidth]{img/dfa_transitions}{Autòmat de transició d'estats}[fig:dfa]`,
    desc: 'pxTAB formats clean tables from comma-separated rows. pxLST highlights source code in a Darcula dark theme. pxSRC includes figures with vector placeholders if files are missing.',
    refLabel: '// CORE SUITE COMMANDS:',
    refTable: [
      { k: '\\pxTable[style=...]{head}{row1}{row2}', v: 'Comma-separated table. Styles: header, striped, boxed, grid.' },
      { k: '\\pxTBLlong*[opts]{head}{rows...}', v: 'Multi-page table repeating headers across page breaks.' },
      { k: '\\begin{pxCode}[language=...]{Title}', v: 'Code block with Darcula syntax highlighting and line numbers.' },
      { k: '\\pxIMG[width]{path}{caption}[label]', v: 'Resilient figure inclusion with automatic placeholder fallback.' }
    ],
    tipTitle: '💡 Zero Missing File Halts',
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
    tipTitle: '💡 Single Source of Truth',
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
  \\input{src/syntax_analyzer.tex}
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
    tipTitle: '💡 Code Snippet Reuse Across Deliverables',
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

  const channelData = {
    pxtab: {
      title: 'Tables (pxTAB)',
      badge: 'booktabs + longtable',
      desc: 'Creates LaTeX tables from comma-separated rows. Includes automatic alternating row shading (zebra striping) and multi-page page breaks using longtable and booktabs without manual column width calculations.',
      apiRows: [
        { cmd: '\\pxTable[style=...]{head}{row1}{row2}', desc: 'Creates a comma-separated table with automatic column sizing.' },
        { cmd: '\\pxTBLlong*[opts]{head}{rows...}', desc: 'Multi-page table that repeats headers across page breaks.' },
        { cmd: 'styles: header | striped | boxed | grid', desc: 'Visual presentation themes without manual TikZ coding.' }
      ],
      features: [
        '<strong>Syntax:</strong> Comma-separated row values',
        '<strong>Row striping:</strong> Alternating row background shading',
        '<strong>Multipage:</strong> Long table pagination with \\pxTBLlong*',
        '<strong>Backend:</strong> Built on longtable and booktabs'
      ],
      code: `% Create a complete table with comma-separated values:
\\pxTable[style=header]
  {Mètrica / Paràmetre, Valor Mesurat, Llindar, Estat}
  {Temps d'execució, 0.42 s, < 1.00 s, PASS}
  {Consum de Memòria, 18.5 MB, < 64.0 MB, PASS}
  {Complexitat Temporal, O(n log n), O(n^2), OPTIMAL}
  {Taxa d'encert (Cache), 96.8 %, > 90.0 %, PASS}
  {Cobertura de Tests, 94.2 %, > 80.0 %, PASS}`,
      notes: [
        '<code>[style=header]</code>: High-contrast header row with subtle separator borders.',
        '<code>{Mètrica, Valor, Estat}</code>: Header row with comma-separated column titles.',
        '<code>{row...}</code>: Subsequent argument braces form table rows automatically.',
        'Zero manual width arithmetic needed; columns fit content proportionally.'
      ],
      url: 'generator.html#tables'
    },
    pxsrc: {
      title: 'Figures & Graphics (pxSRC)',
      badge: 'resilient vector fallback',
      desc: 'Scales graphics proportionally to text width using \\pxIMG. If an image file path is missing from disk, it displays a calibrated placeholder box instead of halting pdflatex compilation.',
      apiRows: [
        { cmd: '\\pxIMG[width]{file}{caption}[label]', desc: 'Main figure command with missing-file fallback placeholder.' },
        { cmd: '\\pxIMGgrid[opts]{rows...}', desc: 'Balanced multi-image grid layout for side-by-side diagrams.' },
        { cmd: 'Formats: PDF, PNG, JPG', desc: 'Native vector and raster graphic support.' }
      ],
      features: [
        '<strong>Missing image fallback:</strong> Vector placeholder if file not found',
        '<strong>Proportional scaling:</strong> Default width set to text width fraction',
        '<strong>Unified binding:</strong> Binds caption, label, and file path in one macro',
        '<strong>File formats:</strong> PNG, JPG, and PDF vector graphics'
      ],
      code: `% Include an image with automatic missing-file fallback:
\\pxIMG[0.85\\linewidth]{img/arquitectura}
  {Diagrama de l'arquitectura proposada}[fig:arq]`,
      notes: [
        '<code>[0.85\\linewidth]</code>: Proportional width relative to page text width.',
        '<code>{img/arquitectura}</code>: Path to graphic file (omitting extension allows PDF/PNG auto-detection).',
        '<code>{caption}</code>: Sets the figure caption and adds it to List of Figures (LOF).',
        '<code>[fig:arq]</code>: Generates label for \\ref{fig:arq} cross-references.'
      ],
      url: 'generator.html#uml'
    },
    pxlst: {
      title: 'Code Listings (pxLST)',
      badge: 'Darcula + Pure LaTeX',
      desc: 'Formats source code listings with gutters, line numbers, and language syntax coloring. Pre-configured for Java, Python, C, SQL, Bash, R, and YAML using pure LaTeX (no external Python or pygments dependencies).',
      apiRows: [
        { cmd: '\\begin{pxCode}[language=...]{Title}', desc: 'Primary code listing box with Darcula theme and gutter.' },
        { cmd: '\\pxCodeFile[lang]{path}[title]', desc: 'External source file inclusion with line numbers.' },
        { cmd: '\\pxCodeIn[lang]{code}', desc: 'Inline styled code token or short statement.' }
      ],
      features: [
        '<strong>Dependencies:</strong> Pure LaTeX, zero external tools',
        '<strong>Languages:</strong> Java, Python, C, SQL, Bash, R, YAML',
        '<strong>Line numbers:</strong> Automatic gutter with line counts',
        '<strong>Typography:</strong> Monospace fonts with character spacing'
      ],
      code: `% Bloc de codi font amb tema fosc Darcula i números de línia:
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
\\end{pxCode}`,
      notes: [
        '<code>[language=Java]</code>: Syntax highlighting engine (supports Python, C, SQL, Bash, R, YAML).',
        '<code>{Lexer.java}</code>: Mandatory second argument displayed in the code box header bar.',
        'Built entirely with tcolorbox and listings; requires zero Python or external pygments.'
      ],
      url: 'generator.html#code'
    },
    pxcmp: {
      title: 'Compilers & Automata (pxCMP)',
      badge: 'Computer Science Diagrams',
      desc: 'Macros for Computer Science coursework (Compilers, Automata, and Theory of Computation). Generates Tombstone compiler diagrams (\\pxTombstoneCompile), DFA/NFA state transition tables (\\pxTransitionTable), and BNF grammar blocks (\\pxBNF).',
      apiRows: [
        { cmd: '\\pxTombstoneCompile[opts]{Prog}{Src}{Tgt}{Impl}', desc: '4-piece compiler execution T-diagram.' },
        { cmd: '\\pxTransitionTable{state,0,1; ...}', desc: 'State machine transition table for DFAs and NFAs.' },
        { cmd: '\\pxBNF{productions}', desc: 'Formatted context-free grammar production block.' }
      ],
      features: [
        '<strong>Tombstone diagrams:</strong> Compiler pipeline T-diagrams',
        '<strong>Transition tables:</strong> State machine tables for DFAs and NFAs',
        '<strong>Formal grammar:</strong> Context-free grammar BNF production blocks',
        '<strong>Course alignment:</strong> Compiladors, Teoria de la Computació'
      ],
      code: `% Diagrama d'execució Tombstone de 4 peces:
\\pxTombstoneCompile[title=Compilador Mini-C]{Mini-C}{C}{JVM}{Java}

% Taula de transicions d'estats per a autòmats finits:
\\pxTransitionTable{
  state, 0, 1;
  q0, q1, q0;
  q1, q0, q2;
  q2, q2, q1
}

% Produccions formals en notació BNF:
\\pxBNF{
  <expr>  ::= <term> ("+" | "-") <expr> | <term> \\\\
  <term>  ::= <factor> ("*" | "/") <term> | <factor> \\\\
  <factor>::= "(" <expr> ")" | <id> | <num>
}`,
      notes: [
        '<code>\\pxTombstoneCompile</code>: 4 mandatory arguments: {Program}{Source}{Target}{Implementation}.',
        '<code>\\pxTransitionTable</code>: Semicolon-delimited rows for finite automata state matrices.',
        '<code>\\pxBNF</code>: Renders aligned formal grammar productions for compiler design.'
      ],
      url: 'generator.html#compilers'
    },
    pxgnt: {
      title: 'Daily Gantt Schedules (pxGNT)',
      badge: 'Daily Calendar Resolution',
      desc: 'Generates daily-resolution Gantt project planning charts using \\pxGantt and \\pxGanttItem. Automatically renders consecutive calendar blocks with day-level milestone tracking for project planning and PAC submissions.',
      apiRows: [
        { cmd: '\\pxGantt{start=...,end=...,days-per-block=...}', desc: 'Initializes calendar timeline environment.' },
        { cmd: '\\pxGanttItem{Label}{start}{end}', desc: 'Task bar clipped to current date block.' },
        { cmd: '\\pxGanttEnd', desc: 'Finalizes and renders portrait blocks.' }
      ],
      features: [
        '<strong>Resolution:</strong> Daily calendar planning',
        '<strong>Syntax:</strong> \\pxGantt, \\pxGanttItem, \\pxGanttEnd',
        '<strong>Block division:</strong> Multi-week or multi-month blocks',
        '<strong>Backend:</strong> Pure TikZ timeline rendering'
      ],
      code: `% Project planning Gantt chart:
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
        'Tasks automatically clipped and connected across block boundaries.'
      ],
      url: 'generator.html#gantt'
    },
    pxuml: {
      title: 'UML Class & Object Diagrams (pxUML)',
      badge: 'pgf-umlcd + TikZ',
      desc: 'Creates clean object-oriented class and relationship diagrams with \\pxUMLClass and \\drawclass. Fully handles attributes, methods, inheritance, and instances with clean, legible typography.',
      apiRows: [
        { cmd: '\\pxUMLClass[type]{Name}{attrs}{ops}', desc: 'Defines UML class with typed members.' },
        { cmd: '\\drawclass{Name}[x,y]', desc: 'Places and renders class on a TikZ canvas.' },
        { cmd: '\\drawinstance{Name}[x,y]{Class}{attrs}', desc: 'Renders an instantiated object block.' }
      ],
      features: [
        '<strong>Class definitions:</strong> \\pxUMLClass[type]{Name}{attrs}{ops}',
        '<strong>Drawing placement:</strong> \\drawclass{Name}[x,y]',
        '<strong>Palette:</strong> UOC brand-matched contrast palette',
        '<strong>Backend:</strong> Built on pgf-umlcd and TikZ'
      ],
      code: `% Definició declarativa d'una classe UML:
\\pxUMLClass{GestorUsuari}{
  - id: Integer \\\\
  - email: String \\\\
  - actiu: Boolean
}{
  + autenticar(pass: String): Boolean \\\\
  + actualitzarPerfil(): Void \\\\
  + tancarSessio(): Void
}

% Dibuix de la classe sobre un llenç TikZ:
\\begin{tikzpicture}
  \\drawclass{GestorUsuari}[0,0]
\\end{tikzpicture}`,
      notes: [
        '<code>\\pxUMLClass</code> defines attributes (second arg) and methods (third arg).',
        '<code>\\drawclass{Name}[x,y]</code> places the defined classifier on the TikZ grid.',
        'Supports visibility prefixes (<code>+</code> public, <code>-</code> private, <code>#</code> protected).'
      ],
      url: 'generator.html#uml'
    }
  };

  keys.forEach(k => {
    k.addEventListener('click', () => {
      const ch = k.getAttribute('data-channel');
      if (!channelData[ch]) return;

      keys.forEach(key => key.classList.remove('active'));
      k.classList.add('active');

      const d = channelData[ch];
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
            <code class="api-col-cmd">${r.cmd}</code>
            <span class="api-col-desc">${r.desc}</span>
          </div>
        `).join('');
      }

      if (featuresTarget) {
        featuresTarget.innerHTML = d.features
          .map(f => `<div class="feat-pill">${f}</div>`)
          .join('');
      }

      if (notesListTarget && d.notes) {
        notesListTarget.innerHTML = d.notes
          .map(n => `<li>${n}</li>`)
          .join('');
      }
    });
  });
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
