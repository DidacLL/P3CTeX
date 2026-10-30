/* ==========================================================================
   P3CTeX Generator Engine
   Reactive LaTeX Preamble & Complex Boilerplate Synthesis
   ========================================================================== */

(function () {
  'use strict';

  // Default State & Presets
  const PRESETS = {
    pac: {
      docClass: 'P3CTeX',
      classOpts: { cover: true, toc: false, CMP: false, draft: false, fontsize: '11pt', language: 'catalan' },
      meta: {
        student: 'Dídac Llorens',
        niu: '0131242',
        subject: 'Enginyeria del Software',
        subjCode: '75.564',
        caShort: 'PAC 1',
        caFull: 'Repte 1: Modelat i Especificació de Requeriments',
        title: 'PAC 1 — Solució Oficial'
      },
      packages: { pxCALC: true, pxCMP: false, pxMEM: false, pxSRC: true, pxLST: true, pxTAB: true, pxUML: true, pxREQ: true },
      blobs: { multipageTable: false, foreachLoop: false, cmpDiagrams: false, codebox: true, reqCard: true }
    },
    pr: {
      docClass: 'P3CTeX',
      classOpts: { cover: true, toc: true, CMP: true, draft: false, fontsize: '11pt', language: 'catalan' },
      meta: {
        student: 'Dídac Llorens',
        niu: '0131242',
        subject: 'Compiladors i Llenguatges',
        subjCode: '75.580',
        caShort: 'PR 1',
        caFull: 'Pràctica 1: Anàlisi Lèxica, Sintàctica i Bootstrapping',
        title: 'Pràctica 1 — Memòria Tècnica'
      },
      packages: { pxCALC: true, pxCMP: true, pxMEM: false, pxSRC: true, pxLST: true, pxTAB: true, pxUML: false, pxREQ: false },
      blobs: { multipageTable: true, foreachLoop: true, cmpDiagrams: true, codebox: true, reqCard: false }
    },
    tfg: {
      docClass: 'P3CTeX',
      classOpts: { cover: true, toc: true, CMP: true, draft: false, fontsize: '11pt', language: 'catalan' },
      meta: {
        student: 'Dídac Llorens',
        niu: '0131242',
        subject: 'Treball Final de Grau',
        subjCode: '75.599',
        caShort: 'TFG',
        caFull: 'Memòria del Treball Final de Grau en Enginyeria Informàtica',
        title: 'Disseny i Implementació d\'un Ecosistema de Tipografia Científica'
      },
      packages: { pxCALC: true, pxCMP: true, pxMEM: true, pxSRC: true, pxLST: true, pxTAB: true, pxUML: true, pxREQ: true },
      blobs: { multipageTable: true, foreachLoop: false, cmpDiagrams: true, codebox: true, reqCard: true }
    },
    cmp: {
      docClass: 'P3CTeX',
      classOpts: { cover: true, toc: false, CMP: true, draft: false, fontsize: '11pt', language: 'catalan' },
      meta: {
        student: 'Dídac Llorens',
        niu: '0131242',
        subject: 'Teoria de la Computació',
        subjCode: '75.520',
        caShort: 'PAC 2',
        caFull: 'Autòmats Finits, Gramàtiques i Models de Compilador',
        title: 'Exercicis de Computabilitat i Diagrames de Tombstone'
      },
      packages: { pxCALC: true, pxCMP: true, pxMEM: false, pxSRC: true, pxLST: true, pxTAB: true, pxUML: false, pxREQ: false },
      blobs: { multipageTable: false, foreachLoop: true, cmpDiagrams: true, codebox: false, reqCard: false }
    },
    req: {
      docClass: 'P3CTeX',
      classOpts: { cover: true, toc: false, CMP: false, draft: false, fontsize: '11pt', language: 'catalan' },
      meta: {
        student: 'Dídac Llorens',
        niu: '0131242',
        subject: 'Enginyeria de Requisits',
        subjCode: '75.550',
        caShort: 'PAC 3',
        caFull: 'Especificació d\'Històries d\'Usuari i Matriu DAFO',
        title: 'Document d\'Enginyeria de Requisits (IEEE 830)'
      },
      packages: { pxCALC: false, pxCMP: false, pxMEM: false, pxSRC: true, pxLST: false, pxTAB: true, pxUML: true, pxREQ: true },
      blobs: { multipageTable: true, foreachLoop: false, cmpDiagrams: false, codebox: false, reqCard: true }
    }
  };

  // State
  let state = JSON.parse(JSON.stringify(PRESETS.pac));

  // Initialize
  function init() {
    bindPresetButtons();
    bindFormInputs();
    bindActions();
    renderForm();
    generateLatex();
  }

  function bindPresetButtons() {
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        if (PRESETS[presetKey]) {
          state = JSON.parse(JSON.stringify(PRESETS[presetKey]));
          document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderForm();
          generateLatex();
        }
      });
    });
  }

  function bindFormInputs() {
    const container = document.getElementById('generator-form');
    if (!container) return;

    container.addEventListener('input', handleInputChange);
    container.addEventListener('change', handleInputChange);
  }

  function handleInputChange(e) {
    const target = e.target;
    const name = target.name;
    if (!name) return;

    if (name.startsWith('meta.')) {
      const key = name.replace('meta.', '');
      state.meta[key] = target.value;
    } else if (name.startsWith('opts.')) {
      const key = name.replace('opts.', '');
      state.classOpts[key] = target.type === 'checkbox' ? target.checked : target.value;
    } else if (name.startsWith('pkg.')) {
      const key = name.replace('pkg.', '');
      state.packages[key] = target.checked;
    } else if (name.startsWith('blob.')) {
      const key = name.replace('blob.', '');
      state.blobs[key] = target.checked;
    }

    generateLatex();
  }

  function renderForm() {
    for (const [k, v] of Object.entries(state.meta)) {
      const input = document.querySelector(`[name="meta.${k}"]`);
      if (input) input.value = v;
    }

    for (const [k, v] of Object.entries(state.classOpts)) {
      const input = document.querySelector(`[name="opts.${k}"]`);
      if (input) {
        if (input.type === 'checkbox') input.checked = !!v;
        else input.value = v;
      }
    }

    for (const [k, v] of Object.entries(state.packages)) {
      const input = document.querySelector(`[name="pkg.${k}"]`);
      if (input) input.checked = !!v;
    }

    for (const [k, v] of Object.entries(state.blobs)) {
      const input = document.querySelector(`[name="blob.${k}"]`);
      if (input) input.checked = !!v;
    }
  }

  function generateLatex() {
    const previewEl = document.getElementById('latex-preview');
    if (!previewEl) return;

    const opts = [];
    if (state.classOpts.cover) opts.push('cover');
    if (state.classOpts.toc) opts.push('toc');
    if (state.classOpts.CMP) opts.push('CMP');
    if (state.classOpts.draft) opts.push('draft');
    if (state.classOpts.fontsize) opts.push(state.classOpts.fontsize);
    if (state.classOpts.language && state.classOpts.language !== 'catalan') {
      opts.push(state.classOpts.language);
    }
    const optString = opts.length > 0 ? '[' + opts.join(',') + ']' : '';

    let out = '% !TeX encoding = UTF-8\n';
    out += '% !TeX program = pdflatex\n';
    out += '%% ==========================================================================\n';
    out += '%% P3CTeX Document Boilerplate\n';
    out += '%% Generated automatically via P3CTeX Indie Tooling Engine\n';
    out += '%% Motto: "PROCRASTINAR ES LA UNICA ESPERANZA" · By ScVr!a\n';
    out += '%% ==========================================================================\n\n';

    out += '\\documentclass' + optString + '{P3CTeX}\n\n';

    out += '%% --- Metadades del Document & Identificacio UOC ---\n';
    out += '\\PECTeXconfig{\n';
    out += '  data = {\n';
    out += '    student        = {' + (state.meta.student || 'Estudiant') + '},\n';
    out += '    niu            = {' + (state.meta.niu || '0000000') + '},\n';
    out += '    grade          = {Grau en Enginyeria Informatica},\n';
    out += '    subj-fullname  = {' + (state.meta.subject || 'Assignatura') + '},\n';
    out += '    subj-shortname = {' + (state.meta.subject ? state.meta.subject.substring(0, 4).toUpperCase() : 'UOC') + '},\n';
    out += '    subj-code      = {' + (state.meta.subjCode || '00.000') + '},\n';
    out += '    ca-fullname    = {' + (state.meta.caFull || 'PAC') + '},\n';
    out += '    ca-shortname   = {' + (state.meta.caShort || 'PAC1') + '},\n';
    out += '  }\n';
    out += '}\n\n';

    if (state.classOpts.cover) {
      out += '%% --- Configuracio de Portada P3CTeX ---\n';
      out += '\\PECTeXcover{fullcover, text-uppertitle=' + (state.meta.caShort || 'PAC1') + '}\n\n';
    }

    out += '%% --- Moduls d\'Arsenal P3CTeX ---\n';
    if (state.packages.pxCALC) out += '\\usepackage{pxCALC}  % Calculs automatics i resolucio pas a pas\n';
    if (state.packages.pxTAB)  out += '\\usepackage{pxTAB}   % Taules professionals i composicio de presets\n';
    if (state.packages.pxSRC)  out += '\\usepackage{pxSRC}   % Gestio resilient d\'imatges i fallbacks\n';
    if (state.packages.pxLST)  out += '\\usepackage{pxLST}   % Caixes de codi amb ressaltat de sintaxi\n';
    if (state.packages.pxREQ)  out += '\\usepackage{pxREQ}   % Histories d\'usuari i matrius DAFO/SWOT\n';
    if (state.packages.pxUML)  out += '\\usepackage{pxUML}   % Diagrames de classes i sequencia UML\n';
    if (state.packages.pxMEM)  out += '\\usepackage{pxMEM}   % Estructura modular per a memories i TFG\n';
    out += '\n';

    if (state.packages.pxSRC) {
      out += '%% Configuracio resilient de figures\n';
      out += '\\pxSRCsetup{placeholder-color=blue, fallback=true}\n\n';
    }
    if (state.packages.pxTAB) {
      out += '%% Estil base per a taules\n';
      out += '\\pxTABsetup{style=header, headerbgcolor=blue!15, headertextcolor=blue!70!black}\n\n';
    }

    out += '\\begin{document}\n\n';
    out += '\\section*{' + (state.meta.title || 'Resolucio de la Practica') + '}\n';
    out += 'Document generat per a la resolucio oficial de l\'activitat \\textbf{' + (state.meta.caFull || 'PAC') + '}.\n\n';

    if (state.blobs.multipageTable) {
      out += '%% BLOB: Taula Multipagina de Gran Volum (pxTBLlong / longtable)\n';
      out += '\\section{Registre Detallat d\'Execucio i Proves}\n';
      out += '\\pxTBLlong[.95\\linewidth]{5}{\n';
      out += '  \\textbf{ID} & \\textbf{Vector d\'Entrada} & \\textbf{Estat Esperat} & \\textbf{Temps (ms)} & \\textbf{Veredicte}\n';
      out += '}{\n';
      out += '  TC-01 & \\texttt{0x00FF (Init)}     & READY       & 1.24  & \\textbf{PASS} \\\\\n';
      out += '  TC-02 & \\texttt{0x01A0 (Payload)}  & PROCESSING  & 4.85  & \\textbf{PASS} \\\\\n';
      out += '  TC-03 & \\texttt{0x02B4 (Checksum)} & VERIFIED    & 2.10  & \\textbf{PASS} \\\\\n';
      out += '  TC-04 & \\texttt{0x03FF (Overflow)} & REJECTED    & 0.88  & \\textbf{PASS} \\\\\n';
      out += '  TC-05 & \\texttt{0x04C1 (Retry)}    & RECOVERED   & 12.40 & \\textbf{PASS} \\\\\n';
      out += '  TC-06 & \\texttt{0x05D8 (Drain)}    & IDLE        & 1.15  & \\textbf{PASS} \\\\\n';
      out += '  TC-07 & \\texttt{0x06E2 (Close)}    & TERMINATED  & 0.42  & \\textbf{PASS} \\\\\n';
      out += '}\n\n';
    }

    if (state.blobs.foreachLoop) {
      out += '%% BLOB: Execucio Recursiva i Iterativa Automatica (\\foreach)\n';
      out += '\\section{Galeria d\'Iteracions i Benchmarks Recursius}\n';
      out += '\\noindent\\foreach \\iter/\\labelName in {1/Baseline, 2/Optimized-O2, 3/Vectorized-AVX2, 4/Final-JIT} {%\n';
      out += '  \\begin{minipage}[t]{0.48\\linewidth}\n';
      out += '    \\centering\n';
      out += '    \\pxIMG[0.9\\linewidth]{benchmarks/step_\\iter}{\\labelName\\ (Iteracio \\iter)}[fig:bench_\\iter]\n';
      out += '    \\vspace{1em}\n';
      out += '  \\end{minipage}%\n';
      out += '  \\hfill\\ifnum\\iter=2 \\par\\vspace{1em}\\fi\n';
      out += '}\n\n';
    }

    if (state.blobs.cmpDiagrams && state.classOpts.CMP) {
      out += '%% BLOB: Diagrames de Compilacio i Automats (pxCMP)\n';
      out += '\\section{Arquitectura del Compilador i Taula de Transicio}\n';
      out += '\\subsection{Diagrama de Tombstone}\n';
      out += '\\pxTombstoneCompile[title={Compilacio de Java cap a Bytecode JVM}]{Programa}{Java}{JVM}{x86}\n\n';
      out += '\\subsection{Taula de Transicio d\'Estats (DFA)}\n';
      out += '\\pxTransitionTable[title={Taula de transicio d\'estats del lexer}]{a, b}{\n';
      out += '  q_0 / initial   / q_1, q_0 / I;\n';
      out += '  q_1 / normal    / q_1, q_2 / I;\n';
      out += '  q_2 / accepting / q_0, q_2 / II\n';
      out += '}\n\n';
      out += '\\pxAutomatonTrace[title={Traca de reconeixement de la paraula \\texttt{abb}}]{\n';
      out += '  q_0 / a / q_1; q_1 / b / q_2; q_2 / b / q_2\n';
      out += '}[Acceptat]\n\n';
    }

    if (state.blobs.codebox && state.packages.pxLST) {
      out += '%% BLOB: Llistat de Codi Font Professional (pxLST)\n';
      out += '\\section{Implementacio de l\'Algorisme Principal}\n';
      out += '\\pxCodeSet[dark]{pxJava}\n';
      out += '\\begin{pxCode}[language=pxJava]{PipelineEngine}\n';
      out += 'public class PipelineEngine {\n';
      out += '    private final int bufferCapacity;\n';
      out += '    public PipelineEngine(int capacity) {\n';
      out += '        this.bufferCapacity = capacity;\n';
      out += '    }\n';
      out += '    public synchronized boolean dispatch(byte[] data) {\n';
      out += '        if (data == null || data.length > bufferCapacity) {\n';
      out += '            return false;\n';
      out += '        }\n';
      out += '        return true;\n';
      out += '    }\n';
      out += '}\n';
      out += '\\end{pxCode}\n\n';
    }

    if (state.blobs.reqCard && state.packages.pxREQ) {
      out += '%% BLOB: Historia d\'Usuari i Matriu DAFO / SWOT (pxREQ)\n';
      out += '\\section{Especificacio d\'Enginyeria de Requisits}\n';
      out += '\\begin{pxUserStory}{US-01}\n';
      out += '  \\pxAsA{Estudiant d\'Enginyeria de la UOC}\n';
      out += '  \\pxIWant{Generar documents LaTeX amb plantilles oficials}\n';
      out += '  \\pxSoThat{Puc lliurar PACs impecables a l\'avaluacio continuada}\n';
      out += '  \\pxAcceptanceCriteria{Compilacio sense errors i tipografia estandarditzada}\n';
      out += '\\end{pxUserStory}\n\n';
      out += '\\pxSWOT[tabwidth=\\linewidth]{\n';
      out += '  Sintaxi expl3 moderna, suport resilient d\'imatges\n';
      out += '}{\n';
      out += '  Dependencia d\'un entorn TeX local\n';
      out += '}{\n';
      out += '  Adopcio massiva a assignatures de la UOC\n';
      out += '}{\n';
      out += '  Modificacions de formats oficials per part del professorat\n';
      out += '}\n\n';
    }

    out += '\\section{Conclusions}\n';
    out += 'El treball s\'ha desenvolupat complint amb la totalitat dels objectius proposats en el calendari.\n\n';
    out += '\\end{document}\n';

    previewEl.textContent = out;
  }

  function bindActions() {
    const copyBtn = document.getElementById('btn-copy-tex');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const previewEl = document.getElementById('latex-preview');
        if (!previewEl) return;
        try {
          await navigator.clipboard.writeText(previewEl.textContent);
          const origText = copyBtn.innerText;
          copyBtn.innerText = 'COPIED TO CLIPBOARD!';
          copyBtn.classList.add('green');
          setTimeout(() => {
            copyBtn.innerText = origText;
            copyBtn.classList.remove('green');
          }, 2000);
        } catch (err) {
          console.error(err);
        }
      });
    }

    const downloadBtn = document.getElementById('btn-download-tex');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const previewEl = document.getElementById('latex-preview');
        if (!previewEl) return;
        const blob = new Blob([previewEl.textContent], { type: 'text/x-tex;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = (state.meta.caShort || 'P3CTeX-document').replace(/[^a-zA-Z0-9_-]/g, '_') + '.tex';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  // Export
  window.P3CTeXGenerator = { init, generateLatex, generateLatexCode: generateLatex };
  window.generateLatexCode = generateLatex;
  document.addEventListener('DOMContentLoaded', init);
})();
