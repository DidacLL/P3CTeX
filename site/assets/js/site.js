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
    'deck-templates': 'SECTION: [01 // STARTER TEMPLATES]',
    'deck-macros': 'SECTION: [02 // PACKAGES & MACROS]',
    'deck-runbook': 'SECTION: [03 // INSTALLATION & SETUP]',
    'deck-specs': 'SECTION: [04 // DELIVERABLE GUIDE]',
    'deck-workshop': 'SECTION: [05 // ABOUT P3CTeX]'
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
   2. Deliverable Profile Switcher (PAC / PR / TFG)
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
      desc: 'Designed for standard semester deliverables (PAC / PEC / CA). As required by UOC grading criteria, it eliminates the blank cover page and starts directly on page 1 with subject metadata, table of contents, and the mandatory anti-plagiarism pledge.',
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

\\sectionuoc{Exercici 1}
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
      title: 'PR (Practicum & Lab Report)',
      desc: 'Comprehensive report profile for lab projects and practicums (PR). Generates an institutional cover page with the UOC logo, table of contents, list of figures, and formal academic integrity declaration for 20–50 page projects.',
      cover: 'Institutional Cover with UOC Logo',
      toc: 'Full TOC, List of Figures & Tables',
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

\\sectionuoc{1. Introducció i Abast}
Descripció dels requeriments i l'arquitectura desenvolupada...

\\sectionuoc{2. Arquitectura de l'Aplicació}
\\pxIMG[0.85\\linewidth]{img/diagrama_classes}{Diagrama de classes del domini}[fig:class]

\\sectionuoc{3. Resultats i Mètriques}
\\pxTable[style=header]{Mòdul, Cobertura, Estat}{Autenticació, 94%, PASS}{Processament, 88%, PASS}
\\end{document}`
    },
    tfg: {
      filename: 'minimal-tfg.tex',
      title: 'TFG (Bachelor Thesis Memory)',
      desc: 'Academic monograph profile for Bachelor’s Thesis (TFG). Generates official evaluation tribunal sheets, bilingual Catalan/English abstracts, Creative Commons copyright block, chapter formatting, and appendices.',
      cover: 'Tribunal Evaluation Sheet + CC License',
      toc: 'Academic Memory Chapter TOC',
      font: 'Arev Sans 11pt (Academic Memory)',
      code: `% Minimal P3CTeX TFG Bachelor Thesis Memory Skeleton
\\documentclass[TFG,MEM,default]{P3CTeX}

% Declarative UOC Student & Thesis Metadata
\\PECTeXconfig{
  data = {
    student        = {Estudiant UOC},
    grade          = {Grau en Enginyeria Informàtica},
    subj-fullname  = {Treball de Final de Grau},
    subj-shortname = {TFG},
    subj-code      = {75.999},
    ca-fullname    = {Memòria de TFG: Disseny d'un Sistema Distribuït},
    ca-shortname   = {MEM},
    date           = {\\today}
  }
}

\\begin{document}
% Profile TFG: Fitxa d'avaluació, llicència CC i resums multilingües.

\\chapter{Introducció}
Context del projecte de final de grau...

\\chapter{Disseny del Sistema}
Detalls d'implementació i esquemes d'enginyeria...
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
      title: 'pxTAB • Data Tables Without the LaTeX Pain',
      desc: 'Standard LaTeX tables are painful: counting column widths, escaping ampersands, and calculating hlines at 2:00 AM. pxTAB replaces all that with simple comma-separated rows. It handles alternating row shading (zebra striping) and multipage tables automatically.',
      features: [
        '<strong>Simple syntax:</strong> Comma-separated values, zero ampersand wrestling',
        '<strong>Auto zebra shading:</strong> Alternating row colors for easy reading',
        '<strong>Multipage support:</strong> Automatically splits long tables across pages',
        '<strong>Zero compilation crashes:</strong> Built on robust longtable and booktabs'
      ],
      code: `% Create a clean table with comma-separated values:
\\pxTable[style=header]
  {Mètrica, Valor Mesurat, Estat}
  {Temps d'execució, 0.42 s, PASS}
  {Memòria consumida, 18.5 MB, PASS}
  {Eficiència Algorísmica, O(n log n), PASS}`,
      url: 'showcases.html#pxtab'
    },
    pxsrc: {
      title: 'pxSRC • Resilient Figures & Image Fallbacks',
      desc: 'Including images in LaTeX often breaks builds when a collaborator deletes a file or a path is slightly off. \\pxIMG automatically fits images to text width and includes a failsafe: if an image is missing from disk, it displays a clear placeholder diagram instead of halting compilation right before your deadline.',
      features: [
        '<strong>Failsafe placeholder:</strong> Never crashes pdflatex if an image file is missing',
        '<strong>Auto proportioning:</strong> Automatically scales figures to text width',
        '<strong>Unified labels:</strong> Binds caption, label, and file path in one command',
        '<strong>Format support:</strong> Works with PNG, JPG, and vector PDF diagrams'
      ],
      code: `% Include an image that will never break the compilation:
\\pxIMG[0.85\\linewidth]{img/arquitectura}
  {Diagrama de l'arquitectura proposada}[fig:arq]`,
      url: 'showcases.html#pxsrc'
    },
    pxlst: {
      title: 'pxLST • Formatted Code Listings',
      desc: 'Include syntax-highlighted code with line numbers, clear borders, and dedicated captioning. Pre-configured for Java, Python, C, SQL, Bash, R, and YAML without requiring external Python pygments or shell escape privileges.',
      features: [
        '<strong>Zero external tools:</strong> 100% pure LaTeX, no Python or pygments needed',
        '<strong>7 languages pre-configured:</strong> Java, Python, C, SQL, Bash, R, YAML',
        '<strong>Line numbers & gutter:</strong> Clear, professional code presentation',
        '<strong>Easy copy-paste:</strong> Optimized typography with JetBrains and Consolas'
      ],
      code: `% Syntax-highlighted code block with line numbering:
\\begin{pxCode}[language=Java,caption=Lexer.java]
public class Lexer {
  public static void main(String[] args) {
    System.out.println("Lexer ready for compilation");
  }
}
\\end{pxCode}`,
      url: 'showcases.html#pxlst'
    },
    pxcmp: {
      title: 'pxCMP • Compilers & Automata Tools',
      desc: 'Dedicated macros specifically designed for Computer Engineering courses like Compilers, Automata, and Theory of Computation. Easily draw multi-stage Tombstone compiler diagrams, state machine transition tables, and syntactic parse trees without manual TikZ coding.',
      features: [
        '<strong>Tombstone T-diagrams:</strong> \\pxTombstoneCompile for compiler pipelines',
        '<strong>Transition tables:</strong> \\pxTransitionTable for DFA and NFA state machines',
        '<strong>Parse trees:</strong> Syntactic derivation trees for grammars',
        '<strong>Target courses:</strong> Compiladors, Teoria de la Computació'
      ],
      code: `% Draw a compiler Tombstone diagram:
\\pxTombstoneCompile{CUP}{Parser}{Java}

% Draw a state machine transition table:
\\pxTransitionTable{
  state, 0, 1;
  q0, q1, q0;
  q1, q0, q1
}`,
      url: 'showcases.html#pxcmp'
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
