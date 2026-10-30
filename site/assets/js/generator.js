/* ==========================================================================
   P3CTeX Generator Engine
   Reactive LaTeX Preamble & Assessment Boilerplate Synthesis
   Factually compliant with P3CTeX.cls and official UOC styles
   ========================================================================== */

(function () {
  'use strict';

  // Default Presets matching official P3CTeX conventions
  const PRESETS = {
    pac: {
      profile: 'PAC',
      lang: 'cat',
      modules: { default: true, CMP: false, GNT: false, TFG: false },
      toggles: { cover: false, toc: true, plagi: false },
      meta: {
        student: 'Estudiant UOC',
        grade: 'Grau en Enginyeria Informàtica',
        subjFull: 'Compiladors i Llenguatges',
        subjShort: 'COMP',
        subjCode: '75.580',
        caShort: 'PAC1',
        caFull: 'PAC 1: Anàlisi Lèxica i Sintàctica'
      },
      blobs: { table: true, codebox: true, figure: true, cmp: false, foreach: false }
    },
    pec: {
      profile: 'PEC',
      lang: 'es',
      modules: { default: true, CMP: false, GNT: false, TFG: false },
      toggles: { cover: false, toc: true, plagi: false },
      meta: {
        student: 'Estudiant UOC',
        grade: 'Grado en Ingeniería Informática',
        subjFull: 'Sistemas Operativos Avanzados',
        subjShort: 'SO',
        subjCode: '75.560',
        caShort: 'PEC1',
        caFull: 'PEC 1: Gestión de Procesos y Memoria Virtual'
      },
      blobs: { table: true, codebox: true, figure: true, cmp: false, foreach: false }
    },
    pr: {
      profile: 'PR',
      lang: 'cat',
      modules: { default: true, CMP: false, GNT: false, TFG: false },
      toggles: { cover: true, toc: true, plagi: false },
      meta: {
        student: 'Estudiant UOC',
        grade: 'Grau en Enginyeria Informàtica',
        subjFull: 'Enginyeria del Software',
        subjShort: 'ES',
        subjCode: '75.564',
        caShort: 'PR1',
        caFull: 'Pràctica 1: Disseny i Implementació del Sistema'
      },
      blobs: { table: true, codebox: true, figure: true, cmp: false, foreach: true }
    },
    cmp: {
      profile: 'PAC',
      lang: 'cat',
      modules: { default: true, CMP: true, GNT: false, TFG: false },
      toggles: { cover: false, toc: true, plagi: false },
      meta: {
        student: 'Estudiant UOC',
        grade: 'Grau en Enginyeria Informàtica',
        subjFull: 'Compiladors i Teoria de la Computació',
        subjShort: 'COMP',
        subjCode: '75.580',
        caShort: 'PAC2',
        caFull: 'PAC 2: Autòmats, Gramàtiques i Bootstrapping'
      },
      blobs: { table: false, codebox: false, figure: false, cmp: true, foreach: false }
    },
    tfg: {
      profile: 'TFG',
      lang: 'cat',
      modules: { default: true, CMP: false, GNT: true, TFG: true },
      toggles: { cover: true, toc: true, plagi: false },
      meta: {
        student: 'Estudiant UOC',
        grade: 'Grau en Enginyeria Informàtica',
        subjFull: 'Treball Final de Grau',
        subjShort: 'TFG',
        subjCode: '75.599',
        caShort: 'MEM',
        caFull: 'Memòria del Treball Final de Grau'
      },
      blobs: { table: true, codebox: true, figure: true, cmp: false, foreach: false }
    }
  };

  // State
  let state = JSON.parse(JSON.stringify(PRESETS.pac));

  function init() {
    bindPresetButtons();
    bindFormInputs();
    bindActions();
    renderForm();
    generateLatexCode();
  }

  function bindPresetButtons() {
    const buttons = document.querySelectorAll('[data-preset]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-preset');
        if (PRESETS[key]) {
          state = JSON.parse(JSON.stringify(PRESETS[key]));
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderForm();
          generateLatexCode();
        }
      });
    });
  }

  function bindFormInputs() {
    // Text inputs
    const textFields = ['student', 'grade', 'subjFull', 'subjShort', 'subjCode', 'caShort', 'caFull'];
    textFields.forEach(field => {
      const el = document.getElementById('input-' + field);
      if (el) {
        el.addEventListener('input', () => {
          state.meta[field] = el.value;
          generateLatexCode();
        });
      }
    });

    // Profile radio/select
    const profileEl = document.getElementById('select-profile');
    if (profileEl) {
      profileEl.addEventListener('change', () => {
        state.profile = profileEl.value;
        if (state.profile === 'PR' || state.profile === 'TFG') {
          state.toggles.cover = true;
        }
        renderForm();
        generateLatexCode();
      });
    }

    // Language radio/select
    const langEl = document.getElementById('select-lang');
    if (langEl) {
      langEl.addEventListener('change', () => {
        state.lang = langEl.value;
        generateLatexCode();
      });
    }

    // Module checkboxes
    ['default', 'CMP', 'GNT', 'TFG'].forEach(mod => {
      const el = document.getElementById('mod-' + mod);
      if (el) {
        el.addEventListener('change', () => {
          state.modules[mod] = el.checked;
          generateLatexCode();
        });
      }
    });

    // Toggle checkboxes
    ['cover', 'toc', 'plagi'].forEach(tog => {
      const el = document.getElementById('tog-' + tog);
      if (el) {
        el.addEventListener('change', () => {
          state.toggles[tog] = el.checked;
          generateLatexCode();
        });
      }
    });

    // Blobs checkboxes
    ['table', 'codebox', 'figure', 'cmp', 'foreach'].forEach(blob => {
      const el = document.getElementById('blob-' + blob);
      if (el) {
        el.addEventListener('change', () => {
          state.blobs[blob] = el.checked;
          generateLatexCode();
        });
      }
    });
  }

  function bindActions() {
    const copyBtn = document.getElementById('btn-copy-latex');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const code = document.getElementById('latex-preview-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = 'COPIAT!';
          setTimeout(() => { copyBtn.textContent = original; }, 2000);
        });
      });
    }

    const downloadBtn = document.getElementById('btn-download-tex');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const code = document.getElementById('latex-preview-code').textContent;
        const filename = (state.meta.caShort || 'assessment') + '.tex';
        const blob = new Blob([code], { type: 'text/x-tex;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  function renderForm() {
    // Populate text inputs
    for (const key in state.meta) {
      const el = document.getElementById('input-' + key);
      if (el) el.value = state.meta[key];
    }

    const profileEl = document.getElementById('select-profile');
    if (profileEl) profileEl.value = state.profile;

    const langEl = document.getElementById('select-lang');
    if (langEl) langEl.value = state.lang;

    for (const mod in state.modules) {
      const el = document.getElementById('mod-' + mod);
      if (el) el.checked = state.modules[mod];
    }

    for (const tog in state.toggles) {
      const el = document.getElementById('tog-' + tog);
      if (el) el.checked = state.toggles[tog];
    }

    for (const blob in state.blobs) {
      const el = document.getElementById('blob-' + blob);
      if (el) el.checked = state.blobs[blob];
    }
  }

  function generateLatexCode() {
    // Build options list for \documentclass[...]{P3CTeX}
    const opts = [];
    opts.push(state.profile);
    if (state.lang) opts.push(state.lang);
    if (state.modules.default) opts.push('default');
    if (state.modules.CMP) opts.push('CMP');
    if (state.modules.GNT) opts.push('GNT');
    if (state.modules.TFG && state.profile !== 'TFG') opts.push('TFG');

    if (state.toggles.cover) opts.push('cover');
    if (!state.toggles.toc) opts.push('no-toc');
    if (state.toggles.plagi) opts.push('no-plagi');

    const optString = opts.length > 0 ? '[' + opts.join(',') + ']' : '';

    let out = '% !TeX encoding = UTF-8\n';
    out += '%% ==========================================================================\n';
    out += '%% P3CTeX Assessment Document · Universitat Oberta de Catalunya (UOC)\n';
    out += '%% Generated with P3CTeX Web Generator Tool\n';
    out += '%% "Procrastinar és l\'única esperança" · By ScVr!a\n';
    out += '%% ==========================================================================\n\n';

    out += '\\documentclass' + optString + '{P3CTeX}\n\n';

    out += '%% Metadades acadèmiques oficials de la UOC\n';
    out += '\\PECTeXconfig{\n';
    out += '  data = {\n';
    out += '    student        = {' + (state.meta.student || 'Nom Cognoms') + '},\n';
    out += '    grade          = {' + (state.meta.grade || 'Enginyeria Informàtica') + '},\n';
    out += '    subj-fullname  = {' + (state.meta.subjFull || 'Nom Assignatura') + '},\n';
    out += '    subj-shortname = {' + (state.meta.subjShort || 'SIGLES') + '},\n';
    out += '    subj-code      = {' + (state.meta.subjCode || '00.000') + '},\n';
    out += '    ca-fullname    = {' + (state.meta.caFull || 'PAC1: Activitat') + '},\n';
    out += '    ca-shortname   = {' + (state.meta.caShort || 'PAC1') + '},\n';
    out += '    date           = {\\today}\n';
    out += '  }\n';
    out += '}\n\n';

    out += '\\begin{document}\n\n';
    out += '\\section{Exercici 1}\n';
    out += '\\subsection{Pregunta A}\n';
    out += 'La resposta al primer apartat de l\'activitat ' + (state.meta.caShort || 'PAC1') + ' es redacta aquí.\n\n';

    // Insertable Blobs
    if (state.blobs.table) {
      out += '%% BLOB: Taula de dades mitjançant pxTAB (sintaxi declarativa per comes)\n';
      out += '\\pxTable[style=header]{\n';
      out += '  Mètrica, Valor Mesurat, Llindar, Estat\n';
      out += '}{\n';
      out += '  Latència de xarxa, 14.2 ms, < 50 ms, PASS\n';
      out += '}{\n';
      out += '  Taxa de transferència, 850 Mbps, > 500 Mbps, PASS\n';
      out += '}{\n';
      out += '  Pèrdua de paquets, 0.01 %, < 0.1 %, PASS\n';
      out += '}\n\n';
    }

    if (state.blobs.codebox) {
      out += '%% BLOB: Llistat de codi amb entorn pxCode i ressaltat de sintaxi (pxLST)\n';
      out += '\\begin{pxCode}[language=pxJava]{Algorisme de Cerca}\n';
      out += 'public class Solution {\n';
      out += '    public static int binarySearch(int[] arr, int target) {\n';
      out += '        int left = 0, right = arr.length - 1;\n';
      out += '        while (left <= right) {\n';
      out += '            int mid = left + (right - left) / 2;\n';
      out += '            if (arr[mid] == target) return mid;\n';
      out += '            if (arr[mid] < target) left = mid + 1;\n';
      out += '            else right = mid - 1;\n';
      out += '        }\n';
      out += '        return -1;\n';
      out += '    }\n';
      out += '}\n';
      out += '\\end{pxCode}\n\n';
    }

    if (state.blobs.figure) {
      out += '%% BLOB: Inclusió segura de figura amb fallback automàtic (pxSRC)\n';
      out += '\\pxIMG[0.75\\linewidth]{img/arquitectura}{Diagrama d\'arquitectura del sistema}[fig:arquitectura]\n\n';
    }

    if (state.blobs.cmp) {
      out += '%% BLOB: Diagrames d\'Enginyeria de Compiladors i Autòmats (pxCMP)\n';
      out += '\\subsection{Diagrama de Tombstone i Autòmat Finit}\n';
      out += '\\pxTombstoneCompile[title={Compilador Java cap a Bytecode JVM}]{Programa}{Java}{JVM}{x86}\n\n';
      out += '\\pxTransitionTable[title={Taula de transició de l\'autòmat}]{a, b}{\n';
      out += '  q_0 / initial   / q_1, q_2 / I;\n';
      out += '  q_1 / normal    / q_3, q_2 / I;\n';
      out += '  q_2 / accepting / q_1, q_3 / II;\n';
      out += '  q_3 / accepting / q_3, q_3 / II\n';
      out += '}\n\n';
      out += '\\pxAutomatonTrace[title={Traça de reconeixement de la paraula \\texttt{aba}}]{\n';
      out += '  q_0 / a / q_1; q_1 / b / q_2; q_2 / a / q_1\n';
      out += '}[Reconegut]\n\n';
    }

    if (state.blobs.foreach) {
      out += '%% BLOB: Inclusió automàtica de llista d\'imatges (pxIMGList de pxSRC)\n';
      out += '\\pxIMGList[0.7\\linewidth]{img/benchmark_pas_}{\n';
      out += '  Pas 1: Captura de dades inicials,\n';
      out += '  Pas 2: Filtratge i processament,\n';
      out += '  Pas 3: Resultats de l\'avaluació\n';
      out += '}\n\n';
    }

    out += '\\end{document}\n';

    const codeEl = document.getElementById('latex-preview-code');
    if (codeEl) {
      codeEl.textContent = out;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
