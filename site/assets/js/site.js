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
    title: 'Document Class & Profiles',
    tag: 'CORE SETUP',
    filename: '01-documentclass.tex',
    code: `% =======================================================
% Step 1: Declare Document Class & Select Profile
% =======================================================
% Supported Profiles:
%   PAC / PEC / CA : Continuous Assessment (Page 1 start, no blank cover)
%   PR             : Practicum Report (Institutional UOC cover page)
%   MEM            : Multi-Chapter Memory (\\chapter + appendices)
%   TFG            : Final Degree Project (Official UOC work card)

\\documentclass[PAC,default]{P3CTeX}

% Architectural note on PAC vs PR:
% PAC and PR share the exact same macros, fonts, and geometry.
% - PAC begins directly on page 1 with student metadata & pledge.
% - PR adds the graphic cover page before page 1.`,
    desc: 'Every P3CTeX document begins with \\documentclass[<profile>,default]{P3CTeX}. The profile configures page geometry, typography, and whether an institutional cover page is rendered or bypassed.',
    refLabel: '// PROFILE OPTIONS REFERENCE:',
    refTable: [
      { k: 'PAC / PEC / CA', v: 'Continuous assessment (starts directly on page 1, auto anti-plagiarism pledge, no blank cover). Catalan (PAC), Spanish (PEC), English (CA).' },
      { k: 'PR', v: 'Practicum and lab reports. Automatically prints the official UOC graphical cover page and table of contents.' },
      { k: 'MEM', v: 'Multi-chapter technical memory. Enables \\chapter, appendices (\\pxMEMannex), and figure/table indexes.' },
      { k: 'TFG', v: 'Final Degree Project. Adds official UOC work card (\\pxTFGworkcard), praise/dedication, and bilingual abstracts.' }
    ],
    tipTitle: '💡 Why PAC vs PR?',
    tipText: 'UOC grading rubrics for continuous assessment (PAC) explicitly discourage empty cover pages to streamline grading. PAC puts student identity and the required anti-plagiarism pledge immediately at the top of page 1. For lab reports (PR), switch to [PR] to print the graphic cover.'
  },
  2: {
    num: '02',
    title: 'Student & Coursework Metadata',
    tag: 'DECLARATIVE METADATA',
    filename: '02-metadata.tex',
    code: `% =======================================================
% Step 2: Configure Student & Coursework Metadata
% =======================================================
% P3CTeX uses this declarative dictionary to populate page headers,
% footers, anti-plagiarism authorship pledges, and document covers:

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

% Tip: Once defined, your name and subject never need to be repeated.`,
    desc: 'Metadata is defined cleanly before \\begin{document} inside \\PECTeXconfig{ data = { ... } }. P3CTeX injects these fields into running headers, footers, anti-plagiarism statements, and title covers without manual formatting.',
    refLabel: '// SUPPORTED METADATA KEYS:',
    refTable: [
      { k: 'student', v: 'Full name of the student or group members (separated by \\and).' },
      { k: 'grade', v: 'Official university degree title (e.g., Grau en Enginyeria Informàtica).' },
      { k: 'subj-fullname / -shortname', v: 'Full subject title and course acronym (e.g. Compiladors i Llenguatges / COMP).' },
      { k: 'subj-code', v: 'UOC subject catalog code (e.g., 75.580).' },
      { k: 'ca-fullname / -shortname', v: 'Continuous assessment or deliverable title and code (e.g., PAC 1 / PAC1).' },
      { k: 'date', v: 'Submission date (defaults to \\today).' }
    ],
    tipTitle: '💡 Zero Hardcoding in Document Body',
    tipText: 'Once registered in \\PECTeXconfig, you never need to repeat your name or course code in the body. If you reuse the template for PAC2 or PAC3, just update the single ca-fullname string.'
  },
  3: {
    num: '03',
    title: 'Document Body & Auto-Pledge',
    tag: 'CONTENT WORKFLOW',
    filename: '03-document-body.tex',
    code: `% =======================================================
% Step 3: Document Body & Automatic Academic Pledge
% =======================================================
\\begin{document}
% In [PAC] mode, \\begin{document} automatically renders:
% 1. Page 1 student & course banner
% 2. Mandatory UOC anti-plagiarism authorship declaration
% 3. Table of contents (if toc=true)
% In [PR] mode, it outputs the full institutional title page.

\\section{Exercici 1: Anàlisi Lèxica}
\\subsection{Apartat A: Expressions Regulars}
Resolució del primer apartat del document segons l'enunciat de l'activitat...

\\subsection{Apartat B: Diagrama de Transicions}
Descripció dels estats de l'autòmat i transicions amb símbols d'entrada...

\\section{Exercici 2: Implementació del Lexer}
Detall dels tokens i gestió d'errors sintàctics...

\\end{document}`,
    desc: 'Opening \\begin{document} invokes P3CTeX hooks. In PAC profile, it immediately prints the anti-plagiarism pledge and student identity plate, fulfilling UOC guidelines without an empty cover.',
    refLabel: '// SECTIONING COMMANDS:',
    refTable: [
      { k: '\\section{Title}', v: 'Primary numbered exercise or deliverable block.' },
      { k: '\\subsection{Title}', v: 'Sub-activity or question part (Apartat A, Apartat B...).' },
      { k: '\\subsubsection{Title}', v: 'Fine-grained technical subsection.' },
      { k: '\\chapter{Title}', v: 'Available in MEM / TFG profiles for full chapter breaks.' }
    ],
    tipTitle: '💡 Mandatory Authorship Compliance',
    tipText: 'UOC requires all continuous assessment submissions to include an explicit anti-plagiarism pledge stating that the work was prepared independently. P3CTeX injects this text automatically in Catalan, Spanish, or English.'
  },
  4: {
    num: '04',
    title: 'Comma-Separated Tables (pxTAB)',
    tag: 'DATA TABLES',
    filename: '04-tables-pxtab.tex',
    code: `% =======================================================
% Step 4: Tables with Comma-Separated Values (pxTAB)
% =======================================================
% No \\begin{tabular}{l|c|r} column counting or manual arithmetic!
% Rows are defined as comma-separated values in braced groups:

\\pxTable[style=header]
  {Mètrica / Token, Expressió Regular, Estat}
  {Identificador, [a-zA-Z][a-zA-Z0-9]*, PASS}
  {Literal Enter, [0-9]+, PASS}
  {Operador Suma, \\texttt{+}, PASS}
  {Delimitador, [;,{}], PASS}

% Available styles:
%   style=header  : Dark high-contrast header row with subtle separator borders
%   style=striped : Alternating zebra shading for multi-row data
%
% For multi-page tables that paginate across page breaks with repeated headers:
% \\pxTBLlong*[style=striped]{Capçalera 1, Capçalera 2}{Fila 1...}{Fila 2...}`,
    desc: 'pxTAB eliminates tedious column counting and width calculations in LaTeX. Write comma-separated values in braced groups {...}, and pxTAB formats professional booktabs tables with automatic zebra row striping.',
    refLabel: '// PXTAB COMMANDS & STYLES:',
    refTable: [
      { k: '\\pxTable[style=...]{head}{row1}{row2}', v: 'Standard compact table with automatic column sizing.' },
      { k: '\\pxTBLlong*[opts]{head}{rows...}', v: 'Multi-page table that repeats headers across page breaks.' },
      { k: 'style=header', v: 'High-contrast dark header row with subtle separator borders.' },
      { k: 'style=striped', v: 'Alternating row background shading (zebra striping) for readability.' }
    ],
    tipTitle: '💡 Special Characters in Tables',
    tipText: 'Because commas separate columns, if a cell value contains a literal comma or macro brackets, wrap it in braces: {[0-9]+, \\texttt{+}}.'
  },
  5: {
    num: '05',
    title: 'Code Listings with Syntax Highlighting (pxLST)',
    tag: 'SOURCE CODE',
    filename: '05-code-pxlst.tex',
    code: `% =======================================================
% Step 5: Code Listings with Darcula Dark Theme (pxLST)
% =======================================================
% Syntax highlighting, line numbers, and monospaced Inconsolata font:

\\begin{pxCode}[language=Java]{Lexer.java}
public class Lexer {
    private final String source;
    private int position = 0;

    public Lexer(String source) {
        this.source = source;
    }

    public Token nextToken() {
        // Retorna el següent token reconegut
        return new Token(TokenType.EOF, "");
    }
}
\\end{pxCode}

% Inline code formatting matching the listing palette:
% El mètode \\pxCodeInline{nextToken()} processa cada caràcter.`,
    desc: 'pxLST wraps LaTeX listings with a custom Darcula-inspired dark theme. It renders syntax highlighting, line numbers, and file titles cleanly without text overflowing the margins.',
    refLabel: '// PXLST OPTIONS & SHORTCUTS:',
    refTable: [
      { k: '\\begin{pxCode}[language=...]{Title}', v: 'Syntax-highlighted block. Takes programming language and filename title.' },
      { k: 'language=Java | Python | C | SQL', v: 'All standard listings languages supported.' },
      { k: '\\pxCodeInline{code}', v: 'Inline code snippet with matching dark pill background.' },
      { k: '\\pxInputCode[opts]{file.java}', v: 'Directly includes an external source code file without copy-pasting.' }
    ],
    tipTitle: '💡 Multi-Language Coursework',
    tipText: 'pxLST works out of the box for COMP (Java/C), Software Engineering (Python/JavaScript), Databases (SQL/PL-SQL), and Systems (Bash/C++).'
  },
  6: {
    num: '06',
    title: 'Resilient Safe Figures (pxSRC)',
    tag: 'GRAPHICS & FIGURES',
    filename: '06-figures-pxsrc.tex',
    code: `% =======================================================
% Step 6: Safe Figure Inclusion with Fallback (pxSRC)
% =======================================================
% Standard \\includegraphics crashes pdflatex if an image file is missing.
% pxSRC renders an elegant vector wireframe placeholder if the file is not found!

\\pxIMG[0.85\\linewidth]{img/automata}{Diagrama de transicions de l'autòmat}[fig:dfa]

% You can reference the figure anywhere in your text:
Segons es mostra a la Figura~\\ref{fig:dfa}, l'estat inicial és q0...

% Supported extensions: .png, .jpg, .pdf, .eps
% pxSRC discovers the correct graphic extension automatically.`,
    desc: 'Standard \\includegraphics halts compilation with a fatal error if an image file is missing. pxSRC detects missing files and draws an elegant vector wireframe placeholder box, keeping your PDF compilation flowing uninterrupted.',
    refLabel: '// PXSRC COMMAND ARGUMENTS:',
    refTable: [
      { k: '\\pxIMG[width]{path}{caption}[label]', v: 'Primary figure inclusion macro with automatic missing-file fallback.' },
      { k: '[width]', v: 'Optional width specification (defaults to 0.8\\linewidth).' },
      { k: '{path}', v: 'Relative path without extension (finds .png, .jpg, or .pdf automatically).' },
      { k: '{caption} / [label]', v: 'Figure caption and \\label for cross-referencing via \\ref{label}.' }
    ],
    tipTitle: '💡 Deadline Safe',
    tipText: 'When working late before a submission deadline, missing or renamed screenshot files won’t break your LaTeX compilation. The PDF still builds completely with placeholders indicating exactly what is missing.'
  },
  7: {
    num: '07',
    title: 'Compiling Locally with pdflatex',
    tag: 'OFFLINE COMPILATION',
    filename: '07-terminal-compile.sh',
    code: `# =======================================================
# Step 7: Local Offline Compilation with pdflatex
# =======================================================
# P3CTeX compiles 100% locally with zero cloud dependencies!

# 1. Open terminal in your coursework folder and run:
pdflatex my-assessment.tex

# 2. Run pdflatex a second time to resolve references and TOC:
pdflatex my-assessment.tex

# Output generated:
# -> my-assessment.pdf (ready for UOC campus submission!)

# If using BibTeX bibliography:
# pdflatex my-assessment.tex && bibtex my-assessment && pdflatex my-assessment.tex`,
    desc: 'P3CTeX compiles cleanly with the standard pdflatex engine included in both MiKTeX (Windows) and TeX Live (Linux/macOS). No special engines (XeLaTeX/LuaLaTeX) or cloud subscriptions required.',
    refLabel: '// COMPILATION COMMAND MATRIX:',
    refTable: [
      { k: 'pdflatex file.tex', v: 'Standard single-pass compilation.' },
      { k: 'pdflatex x2', v: 'Resolves page numbers, \\ref cross-references, and table of contents.' },
      { k: 'bibtex file && pdflatex x2', v: 'Compiles bibliography references when using \\pxBib.' },
      { k: 'del *.aux *.log / rm *.aux', v: 'Deletes temporary cache files if LaTeX throws an auxiliary cache mismatch.' }
    ],
    tipTitle: '💡 Zero Overleaf Restrictions',
    tipText: 'Compiling locally means no 20-second Overleaf timeout errors, no paid collaborator tiers, and complete offline privacy for your university assignments.'
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
