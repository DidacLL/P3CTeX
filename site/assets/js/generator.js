/* ==========================================================================
   P3CTeX Generator Engine
   Reactive LaTeX Preamble & Assessment Boilerplate Synthesis
   Factually compliant with P3CTeX.cls and official UOC styles
   "Procrastinar és l'única esperança" · By ScVr!a
   ========================================================================== */

(function () {
  'use strict';

  // Deliverable Coursework Presets matching official P3CTeX conventions
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
      blobs: { table: true, codebox: true, figure: true, cmp: false, graph: false, ml: false, longtable: false, foreach: false }
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
      blobs: { table: true, codebox: true, figure: true, cmp: false, graph: false, ml: false, longtable: false, foreach: false }
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
      blobs: { table: true, codebox: true, figure: true, cmp: false, graph: false, ml: false, longtable: true, foreach: true }
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
      blobs: { table: true, codebox: true, figure: true, cmp: false, graph: false, ml: false, longtable: true, foreach: false }
    },
    ca: {
      profile: 'CA',
      lang: 'en',
      modules: { default: true, CMP: false, GNT: false, TFG: false },
      toggles: { cover: false, toc: true, plagi: false },
      meta: {
        student: 'Estudiant UOC',
        grade: 'Bachelor in Computer Science',
        subjFull: 'Distributed Systems Architecture',
        subjShort: 'DSA',
        subjCode: '75.590',
        caShort: 'CA1',
        caFull: 'Continuous Assessment 1: Consensus Protocols'
      },
      blobs: { table: true, codebox: true, figure: true, cmp: false, graph: false, ml: false, longtable: false, foreach: false }
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

    // Profile select
    const profileEl = document.getElementById('select-profile');
    if (profileEl) {
      profileEl.addEventListener('change', () => {
        state.profile = profileEl.value;
        if (state.profile === 'PR' || state.profile === 'TFG') {
          state.toggles.cover = true;
        } else {
          state.toggles.cover = false;
        }
        renderForm();
        generateLatexCode();
      });
    }

    // Language select
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
    ['table', 'codebox', 'figure', 'cmp', 'graph', 'ml', 'longtable', 'foreach'].forEach(blob => {
      const el = document.getElementById('blob-' + blob);
      if (el) {
        el.addEventListener('change', () => {
          state.blobs[blob] = el.checked;
          // Auto-enable CMP module if a CMP-dependent blob is selected
          if ((blob === 'cmp' || blob === 'graph' || blob === 'ml') && el.checked) {
            state.modules.CMP = true;
            const cmpCheck = document.getElementById('mod-CMP');
            if (cmpCheck) cmpCheck.checked = true;
          }
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
    out += '    student        = {' + (state.meta.student || 'Estudiant UOC') + '},\n';
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
    out += '\\sectionuoc{Exercici 1}\n';
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

    if (state.blobs.longtable) {
      out += '%% BLOB: Taula multipàgina pxTBLlong* per a llistats extensos de dades\n';
      out += '\\begin{pxTBLlong*}[header-repeat=true]{cols={0.25\\linewidth, 0.45\\linewidth, 0.3\\linewidth}}\n';
      out += '  Codi / ID, Descripció del Mòdul, Estat de Verificació;\n';
      out += '  MOD-01, Gestió de Memòria i Paginació Virtual, COMPLETAT;\n';
      out += '  MOD-02, Planificador de Processos Round-Robin, COMPLETAT;\n';
      out += '  MOD-03, Sistema de Fitxers Basat en Inodes, EN REVISIÓ;\n';
      out += '  MOD-04, Controlador de Dispositius I/O en Bloc, PENDENT\n';
      out += '\\end{pxTBLlong*}\n\n';
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
      out += '%% BLOB: Diagrames de Compiladors i Autòmats (pxCMP)\n';
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

    if (state.blobs.graph) {
      out += '%% BLOB: Graf de Cerca Heurística A* (pxCMP)\n';
      out += '\\pxGraph[title={Graf de cerca heurística $A^*$} travessant estats]{\n';
      out += '  A / A / 0,0 / start / $h=20$;\n';
      out += '  B / B / 2.2,1.1 / path / {$g=4, f=16$};\n';
      out += '  C / C / 2.2,-1.1 / visited / $h=15$;\n';
      out += '  D / D / 4.4,1.1 / open / $h=10$;\n';
      out += '  G / G / 4.4,-1.1 / goal / $h=0$\n';
      out += '}{\n';
      out += '  A => B / 4; A -> C / 5; B -> D / 6; B => G / 8; C -> G / 12\n';
      out += '}\n\n';
    }

    if (state.blobs.ml) {
      out += '%% BLOB: Intel·ligència Artificial: Matriu de Confusió i Xarxa Neuronal (pxCMP)\n';
      out += '\\pxConfusionMatrix[title={Avaluació del Classificador}]\n';
      out += '  {Positiu, Negatiu}\n';
      out += '  {45 (TP), 5 (FP); 3 (FN), 47 (TN)}\n';
      out += '  [Precisió = 0.90 \\quad|\\quad Sensibilitat = 0.9375 \\quad|\\quad $F_1 = 0.9184$]\n\n';
      out += '\\pxNeuralNet[title={Perceptró Multicapa (MLP)}]{\n';
      out += '  Entrada / x_0, x_1, x_2 / input;\n';
      out += '  Capa Oculta / h_0, h_1, h_2 / ReLU;\n';
      out += '  Sortida / Y / Softmax\n';
      out += '}[x_0 -> h_0 / 1; x_1 -> h_1 / 1; h_0 -> Y / 0.5]\n\n';
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

  // Expose generateLatexCode globally for testing / offline usage
  window.generateLatexCode = generateLatexCode;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
