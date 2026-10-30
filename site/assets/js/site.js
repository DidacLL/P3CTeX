/* ==========================================================================
   P3CTeX Public Documentation & Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. One-Click Copy Buttons for Code Boxes & Image Prompts
  setupCopyButtons();

  // 2. Interactive Showcase Tabs
  setupShowcaseTabs();

  // 3. Highlight Current Navigation Item
  setupNavHighlight();

  // 4. Interactive Console Profile Switcher
  setupProfileRocker();
});

function setupCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetSelector = button.getAttribute('data-copy-target');
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;

      const textToCopy = targetElement.innerText || targetElement.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = button.innerText;
        button.innerText = 'COPIED!';
        button.classList.add('copied');
        setTimeout(() => {
          button.innerText = originalText;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });
}

function setupShowcaseTabs() {
  document.querySelectorAll('.showcase-tab-bar').forEach(tabBar => {
    const tabs = tabBar.querySelectorAll('.showcase-tab');
    const container = tabBar.closest('.showcase-container');
    if (!container) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab-target');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        container.querySelectorAll('.showcase-panel').forEach(panel => {
          if (panel.id === targetId) {
            panel.classList.add('active');
            panel.hidden = false;
          } else {
            panel.classList.remove('active');
            panel.hidden = true;
          }
        });
      });
    });
  });
}

function setupNavHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function setupProfileRocker() {
  const rockerButtons = document.querySelectorAll('.rocker-btn[data-profile]');
  const codeTarget = document.querySelector('#code-minimal-pac');
  const readoutProfile = document.querySelector('#readout-profile-label');
  const readoutCover = document.querySelector('#readout-cover');
  const readoutToc = document.querySelector('#readout-toc');
  const readoutLang = document.querySelector('#readout-lang');
  if (!rockerButtons.length || !codeTarget) return;

  const profileData = {
    pac: {
      label: 'PAC (Continuous Assessment)',
      cover: 'Disabled (No cover)',
      toc: 'Enabled (Automatic)',
      lang: 'Catalan (cat)',
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

% Taula declarativa per comes amb pxTAB (inclosa al paquet default)
\\pxTable[style=header]{Mètrica, Valor Mesurat, Estat}{Temps d'execució, 0.42 s, PASS}{Memòria consumida, 18.5 MB, PASS}

% Inclusió resilient de figura amb pxSRC (crea placeholder si la imatge no existeix)
\\pxIMG[0.8\\linewidth]{img/arquitectura}{Diagrama de l'arquitectura proposada}[fig:arq]
\\end{document}`
    },
    pr: {
      label: 'PR (Practicum & Lab Report)',
      cover: 'Enabled (Formal Cover)',
      toc: 'Enabled (Full TOC & LOF)',
      lang: 'Catalan / Spanish',
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
      label: 'TFG (Bachelor Thesis Memory)',
      cover: 'Enabled (Tribunal Sheet)',
      toc: 'Enabled (Memory Chapters)',
      lang: 'Bilingual (cat/en)',
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

  rockerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const profile = btn.getAttribute('data-profile');
      if (!profileData[profile]) return;

      rockerButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = profileData[profile];
      if (readoutProfile) readoutProfile.textContent = data.label;
      if (readoutCover) readoutCover.textContent = data.cover;
      if (readoutToc) readoutToc.textContent = data.toc;
      if (readoutLang) readoutLang.textContent = data.lang;
      codeTarget.textContent = data.code;
    });
  });
}
