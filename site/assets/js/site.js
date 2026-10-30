/* ==========================================================================
   P3CTeX Product Workstation — Client Controller
   Fixed-Viewport Console & Navigation Management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setupDeckSwitcher();
  setupProfileRocker();
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
    'deck-templates': 'SECTION: [02 // STARTER TEMPLATES]',
    'deck-macros': 'SECTION: [03 // PACKAGES & MACROS]',
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
   2. Document Profile Switcher (PAC / PR / MEM / TFG)
   -------------------------------------------------------------------------- */
function setupProfileRocker() {
  const switches = document.querySelectorAll('.profile-switch[data-profile]');
  const codeTarget = document.getElementById('code-minimal-target');
  const bufferFilename = document.getElementById('buffer-filename');
  const titleTarget = document.getElementById('spec-profile-title');
  const descTarget = document.getElementById('spec-profile-desc');
  const coverTarget = document.getElementById('spec-cover-val');
  const tocTarget = document.getElementById('spec-toc-val');
  const fontTarget = document.getElementById('spec-font-val');

  const profileData = {
    pac: {
      filename: 'minimal-pac.tex',
      title: 'PAC (Continuous Assessment)',
      desc: 'Designed for semester continuous assessments (PAC / PEC / CA). As required by UOC grading criteria, it eliminates the blank cover page and starts directly on page 1 with subject metadata, table of contents, and the mandatory anti-plagiarism pledge.',
      cover: 'Bypassed (Starts on Page 1)',
      toc: 'Auto with anti-plagiarism pledge',
      font: 'Arev Sans 11pt (Clear and legible)',
      code: `% Minimal P3CTeX PAC Continuous Assessment Skeleton
\\documentclass[PAC,default]{P3CTeX}

% Declarative UOC Student & Subject Metadata
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

\\begin{document}
% Profile PAC: Portada desactivada; sumari i declaració de no plagi automàtics.

\\section{Exercici 1}
\\subsection{Apartat A}
Resolució del primer apartat del document...

% Taula declarativa per comes amb pxTAB (inclosa al paquet default):
\\pxTable[style=header]{Mètrica, Valor Mesurat, Estat}{Temps d'execució, 0.42 s, PASS}{Memòria consumida, 18.5 MB, PASS}

% Inclusió resilient de figura amb pxSRC (crea placeholder si el fitxer no existeix):
\\pxIMG[0.8\\linewidth]{img/arquitectura}{Diagrama de l'arquitectura proposada}[fig:arq]
\\end{document}`
    },
    pr: {
      filename: 'minimal-pr.tex',
      title: 'PR (Project & Practicum Report)',
      desc: 'Report profile for laboratory reports and practicums (PR). Generates an institutional cover page with the UOC logo, table of contents, and figure list for project reports.',
      cover: 'Institutional Cover with UOC Logo',
      toc: 'Full TOC and Figure Index',
      font: 'Arev Sans 11pt (Lab Report Standard)',
      code: `% Minimal P3CTeX PR Practicum Report Skeleton
\\documentclass[PR,default]{P3CTeX}

% Declarative UOC Student & Subject Metadata
\\PECTeXconfig{
  data = {
    student        = {Estudiant UOC},
    grade          = {Grau en Enginyeria Informàtica},
    subj-fullname  = {Pràcticum d'Enginyeria de Software},
    subj-shortname = {PRAC},
    subj-code      = {75.590},
    ca-fullname    = {Memòria de Projecte de Laboratori},
    ca-shortname   = {PR1},
    date           = {\\today}
  }
}

\\begin{document}
% Profile PR: Portada institucional i sumari generats automàticament.

\\section{1. Introducció i Abast}
Descripció dels requeriments i l'arquitectura desenvolupada...

\\section{2. Arquitectura de l'Aplicació}
\\pxIMG[0.85\\linewidth]{img/diagrama_classes}{Diagrama de classes del domini}[fig:class]

\\section{3. Resultats i Mètriques}
\\pxTable[style=header]{Mòdul, Cobertura, Estat}{Autenticació, 94%, PASS}{Processament, 88%, PASS}
\\end{document}`
    },
    mem: {
      filename: 'minimal-mem.tex',
      title: 'MEM (Multi-Chapter Memory / Report)',
      desc: 'Generic memory support module for reports, practicums, or theses requiring numbered chapters. Adds \\chapter, appendix management with \\pxMEMannex, List of Figures (LOF), List of Tables (LOT), and source snippet reuse without changing the base article layout.',
      cover: 'Institutional Cover & LOF/LOT Indexes',
      toc: 'Chapter & Section TOC',
      font: 'Arev Sans 11pt',
      code: `% Minimal P3CTeX Multi-Chapter Memory (MEM) Skeleton
\\documentclass[MEM,PR,default]{P3CTeX}

\\PECTeXconfig{
  data = {
    student        = {Nom i Cognoms},
    grade          = {El Teu Grau o Màster},
    subj-fullname  = {Nom de l'Assignatura o Projecte},
    subj-code      = {00.000},
    ca-fullname    = {Memòria Tècnica del Projecte},
    ca-shortname   = {MEM},
    date           = {\\today}
  }
}

\\begin{document}
\\chapter{Introducció i Context}
\\section{Objectius del Projecte}
Descripció dels requeriments tècnics...

\\chapter{Arquitectura del Sistema}
\\section{Mòduls Principals}
\\pxTable[style=header]{Mòdul, Descripció, Estat}{Nucli, Processament, PASS}

% Annex amb numeració A, B, C...
\\pxMEMannex{Manual d'Instal·lació}{
Instruccions per desplegar el sistema en entorns locals...
}
\\end{document}`
    },
    tfg: {
      filename: 'minimal-tfg.tex',
      title: 'TFG (Final Degree Project Front Matter)',
      desc: 'UOC TFG-specific front matter module. Adds the official project work card (\\pxTFGworkcard), multilingual abstracts (\\pxTFGabstract{CAT/ES/EN}{...}), tutor and PRA metadata, and Creative Commons license page (\\pxTFGlicencepage). Combine with MEM if chapters are needed.',
      cover: 'TFG Work Card & CC License Page',
      toc: 'Preliminary Content & TOC',
      font: 'Arev Sans 11pt',
      code: `% Minimal P3CTeX TFG Project Skeleton
\\documentclass[TFG,MEM,default]{P3CTeX}

\\PECTeXconfig{
  data = {
    student        = {Nom i Cognoms},
    grade          = {Grau en Enginyeria Informàtica},
    subj-fullname  = {Treball Final de Grau},
    subj-code      = {75.599},
    ca-fullname    = {Títol del Treball Final de Grau},
    ca-shortname   = {TFG},
    date           = {\\today}
  }
}

% Metadades específiques de TFG:
\\pxTFGsetup{
  tutor   = {Nom del Tutor/a},
  PRA     = {Nom del Professor/a Responsable},
  area    = {Àrea de Coneixement},
  credits = {12}
}

% Resum bilingüe:
\\pxTFGabstract{CAT}{Resum en català del projecte de final de grau...}
\\pxTFGabstract{EN}{Abstract in English describing the project scope...}

\\begin{document}
% La portada, fitxa del TFG, resums i índexs es generen automàticament.

\\chapter{Introducció}
\\section{Motivació}
Descripció de la motivació del projecte...
\\end{document}`
    }
  };

  switches.forEach(sw => {
    sw.addEventListener('click', () => {
      const p = sw.getAttribute('data-profile');
      if (!profileData[p]) return;

      switches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');

      const data = profileData[p];
      if (bufferFilename) bufferFilename.textContent = data.filename;
      if (titleTarget) titleTarget.textContent = data.title;
      if (descTarget) descTarget.textContent = data.desc;
      if (coverTarget) coverTarget.textContent = data.cover;
      if (tocTarget) tocTarget.textContent = data.toc;
      if (fontTarget) fontTarget.textContent = data.font;
      if (codeTarget) codeTarget.textContent = data.code;
    });
  });
}

/* --------------------------------------------------------------------------
   3. Packages & Macros Switcher (pxTAB, pxSRC, pxLST, pxCMP)
   -------------------------------------------------------------------------- */
function setupChannelRocker() {
  const keys = document.querySelectorAll('.channel-key[data-channel]');
  const titleTarget = document.getElementById('macro-hero-title');
  const descTarget = document.getElementById('macro-hero-desc');
  const featuresTarget = document.getElementById('macro-features-strip');
  const codeTarget = document.getElementById('macro-code-target');
  const urlTarget = document.getElementById('macro-showcase-url');

  const channelData = {
    pxtab: {
      title: 'Tables (pxTAB)',
      desc: 'Creates LaTeX tables from comma-separated rows. Includes automatic alternating row shading (zebra striping) and multi-page page breaks using longtable and booktabs without manual column width calculations.',
      features: [
        '<strong>Syntax:</strong> Comma-separated row values',
        '<strong>Row striping:</strong> Alternating row background shading',
        '<strong>Multipage:</strong> Long table pagination with \\pxTBLlong*',
        '<strong>Backend:</strong> Built on longtable and booktabs'
      ],
      code: `% Create a table from comma-separated values:
\\pxTable[style=header]
  {Mètrica, Valor Mesurat, Estat}
  {Temps d'execució, 0.42 s, PASS}
  {Memòria consumida, 18.5 MB, PASS}
  {Eficiència Algorísmica, O(n log n), PASS}`,
      url: 'generator.html#tables'
    },
    pxsrc: {
      title: 'Figures & Graphics (pxSRC)',
      desc: 'Scales graphics proportionally to text width using \\pxIMG. If an image file path is missing from disk, it displays a calibrated placeholder box instead of halting pdflatex compilation.',
      features: [
        '<strong>Missing image fallback:</strong> Vector placeholder if file not found',
        '<strong>Proportional scaling:</strong> Default width set to text width fraction',
        '<strong>Unified binding:</strong> Binds caption, label, and file path in one macro',
        '<strong>File formats:</strong> PNG, JPG, and PDF vector graphics'
      ],
      code: `% Include an image with automatic missing-file fallback:
\\pxIMG[0.85\\linewidth]{img/arquitectura}
  {Diagrama de l'arquitectura proposada}[fig:arq]`,
      url: 'generator.html#uml'
    },
    pxlst: {
      title: 'Code Listings (pxLST)',
      desc: 'Formats source code listings with gutters, line numbers, and language syntax coloring. Pre-configured for Java, Python, C, SQL, Bash, R, and YAML using pure LaTeX (no external Python or pygments dependencies).',
      features: [
        '<strong>Dependencies:</strong> Pure LaTeX, zero external tools',
        '<strong>Languages:</strong> Java, Python, C, SQL, Bash, R, YAML',
        '<strong>Line numbers:</strong> Automatic gutter with line counts',
        '<strong>Typography:</strong> Monospace fonts with character spacing'
      ],
      code: `% Formatted code listing with line numbers:
\\begin{pxCode}[language=Java,caption=Lexer.java]
public class Lexer {
  public static void main(String[] args) {
    System.out.println("Lexer ready for compilation");
  }
}
\\end{pxCode}`,
      url: 'generator.html#code'
    },
    pxcmp: {
      title: 'Compilers & Automata (pxCMP)',
      desc: 'Macros for Computer Science coursework (Compilers, Automata, and Theory of Computation). Generates Tombstone compiler diagrams (\\pxTombstoneCompile), DFA/NFA state transition tables (\\pxTransitionTable), and parse trees.',
      features: [
        '<strong>Tombstone diagrams:</strong> Compiler pipeline T-diagrams',
        '<strong>Transition tables:</strong> State machine tables for DFAs and NFAs',
        '<strong>Parse trees:</strong> Syntactic derivation tree representation',
        '<strong>Course alignment:</strong> Compiladors, Teoria de la Computació'
      ],
      code: `% Draw a compiler Tombstone diagram:
\\pxTombstoneCompile{CUP}{Parser}{Java}

% Draw a state machine transition table:
\\pxTransitionTable{
  state, 0, 1;
  q0, q1, q0;
  q1, q0, q1
}`,
      url: 'generator.html#compilers'
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
      if (descTarget) descTarget.textContent = d.desc;
      if (codeTarget) codeTarget.textContent = d.code;
      if (urlTarget) urlTarget.setAttribute('href', d.url);

      if (featuresTarget) {
        featuresTarget.innerHTML = d.features
          .map(f => `<div class="feat-pill">${f}</div>`)
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
