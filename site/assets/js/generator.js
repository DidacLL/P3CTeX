/**
 * P3CTeX Reactive LaTeX Generator Engine
 * Client-side AST assembly, live preview, clipboard & file export
 */

(function () {
  'use strict';

  // --- Initial State adhering to P3CTeXState Schema ---
  const state = {
    preset: 'PAC',
    language: 'cat',
    cover: false,
    toc: true,
    noPlagi: true,
    debug: false,
    printDoc: false,
    packages: {
      pxCALC: true,
      pxCMP: true,
      pxMEM: false,
      pxSRC: true,
      pxLST: true,
      pxTAB: true,
      pxUML: false,
      pxREQ: false,
      pxANN: false,
      pxGNT: false,
      pxGLS: false
    },
    packageConfigs: {
      lstPalette: 'dark',
      lstDefaultLang: 'pxPython',
      cmpPreset: 'p3c-uoc',
      tabPreset: 'p3c-header',
      srcPlaceholderColor: 'primaryColor'
    },
    metadata: {
      student: 'Nom Alumne',
      grade: "Grau d'Enginyeria Informàtica",
      subjFullName: 'Disseny de Compiladors',
      subjShortName: 'DC',
      subjCode: '05.597',
      caFullName: 'PAC 1: Anàlisi Lèxica',
      caShortName: 'PAC1',
      date: '\\today'
    },
    snippets: {
      introSection: true,
      calcExample: true,
      cmpAutomaton: true,
      cmpTombstone: false,
      codeListing: true,
      tableExample: true,
      umlClass: false,
      bibliography: false
    }
  };

  // --- LaTeX Document Generator Function ---
  function generateLatexCode(st) {
    const lines = [];

    // 1. File header & TeX encoding markers
    lines.push('% !TeX encoding = UTF-8');
    lines.push(`% !TeX spellcheck = ${st.language === 'cat' ? 'ca_ES' : st.language === 'es' ? 'es_ES' : 'en_US'}`);
    lines.push('%% =======================================================');
    lines.push('%%  P3CTeX Document — Generated with P3CTeX Interactive Generator');
    lines.push(`%%  Target: ${st.metadata.caShortName || 'Activity'} — ${st.metadata.subjFullName || 'Subject'}`);
    lines.push('%% =======================================================\n');

    // 2. Class Declaration & Options
    const classOpts = [];

    if (st.preset !== 'Custom') {
      classOpts.push(st.preset);
      if (st.preset === 'PR') {
        classOpts.push(st.language);
      }
    } else {
      if (st.cover) classOpts.push('cover'); else classOpts.push('no-cover');
      if (st.toc) classOpts.push('toc'); else classOpts.push('no-toc');
      if (st.noPlagi) classOpts.push('no-plagi');
      classOpts.push(st.language);
    }

    // Class-load submodules (validated by P3CTeX.code.tex)
    if (st.packages.pxCMP) classOpts.push('CMP');
    if (st.packages.pxMEM) classOpts.push('MEM');
    if (st.packages.pxGNT) classOpts.push('GNT');
    if (st.debug) classOpts.push('debug');
    if (st.printDoc) classOpts.push('print-doc');

    const classOptStr = classOpts.length > 0 ? `[${classOpts.join(',')}]` : '';
    lines.push(`\\documentclass${classOptStr}{P3CTeX}\n`);

    // 3. Document Metadata Configuration (\PECTeXconfig)
    lines.push('%% Document Metadata Configuration');
    lines.push('\\PECTeXconfig{');
    lines.push('  data = {');
    lines.push(`    student        = {${st.metadata.student || 'Nom Alumne'}},`);
    lines.push(`    grade          = {${st.metadata.grade || "Grau d'Enginyeria Informàtica"}},`);
    lines.push(`    subj-fullname  = {${st.metadata.subjFullName || 'Assignatura'}},`);
    lines.push(`    subj-shortname = {${st.metadata.subjShortName || 'ASG'}},`);
    lines.push(`    subj-code      = {${st.metadata.subjCode || '00.000'}},`);
    lines.push(`    ca-fullname    = {${st.metadata.caFullName || 'Activitat'}},`);
    lines.push(`    ca-shortname   = {${st.metadata.caShortName || 'PAC1'}},`);
    lines.push(`    date           = {${st.metadata.date || '\\today'}}`);
    lines.push('  }');
    lines.push('}\n');

    // 4. Standalone Packages & Configuration
    lines.push('%% Package Initializations & Presets');
    if (st.packages.pxCALC) {
      lines.push('\\usepackage{pxCALC}');
      lines.push('\\pxCalcSetup{prec=2, steps=3}');
    }

    if (st.packages.pxSRC) {
      lines.push('\\usepackage{pxSRC}');
      lines.push(`\\pxSRCsetup{placeholder-color=${st.packageConfigs.srcPlaceholderColor}}`);
    }

    if (st.packages.pxLST) {
      lines.push('\\usepackage{pxLST}');
      lines.push(`\\pxLSTsetup[${st.packageConfigs.lstPalette}]{${st.packageConfigs.lstDefaultLang}}`);
    }

    if (st.packages.pxTAB) {
      lines.push('\\usepackage{pxTAB}');
      lines.push(`\\pxTABsetup{preset=${st.packageConfigs.tabPreset}}`);
    }

    if (st.packages.pxUML) {
      lines.push('\\usepackage{pxUML}');
    }

    if (st.packages.pxREQ) {
      lines.push('\\usepackage{pxREQ}');
    }

    if (st.packages.pxANN) {
      lines.push('\\usepackage{pxANN}');
    }

    if (st.packages.pxGLS) {
      lines.push('\\usepackage{pxGLS}');
    }
    lines.push('');

    // 5. Document Body
    lines.push('%% =======================================================');
    lines.push('%%  DOCUMENT CONTENT');
    lines.push('%% =======================================================');
    lines.push('\\begin{document}\n');

    // Starter Snippets
    if (st.snippets.introSection) {
      lines.push('\\section{Introducció}');
      lines.push("En aquest document es presenten les solucions desenvolupades per a l'activitat.");
      lines.push('\\bigskip\n');
    }

    if (st.packages.pxCALC && st.snippets.calcExample) {
      lines.push('%% Worked Calculation with pxCALC');
      lines.push("\\section{Càlculs d'Enginyeria (pxCALC)}");
      lines.push('\\pxDefVar{Vcc}{5}[V]');
      lines.push('\\pxDefVar{R1}{1000}[R_1]');
      lines.push('\\pxDefVar{R2}{2000}[R_2]');
      lines.push('\\pxDefFormula{Vout}{[Vcc] * [R2] / ([R1] + [R2])}[symbol=V_{out}, unit=\\volt]');
      lines.push('\\noindent Resultat del divisor de tensió:');
      lines.push('\\[');
      lines.push('  \\pxSolve[prec=3]{Vout}');
      lines.push('\\]\n');
    }

    if (st.packages.pxCMP && st.snippets.cmpAutomaton) {
      lines.push('%% Finite Automaton with pxCMP');
      lines.push('\\section{Autòmat Finit Determinista (pxCMP)}');
      lines.push('\\begin{center}');
      lines.push('\\pxAutomaton[');
      lines.push(`  preset=${st.packageConfigs.cmpPreset},`);
      lines.push('  states={q0/initial/at={(0,0)}, q1/accepting/at={(3,0)}},');
      lines.push('  transitions={q0/q1/a, q1/q0/b, q1/q1/a}');
      lines.push(']{}');
      lines.push('\\end{center}\n');
    }

    if (st.packages.pxCMP && st.snippets.cmpTombstone) {
      lines.push('%% Tombstone Compiler Diagram with pxCMP');
      lines.push('\\section{Esquema de Compilació Tombstone (pxCMP)}');
      lines.push('\\begin{center}');
      lines.push('  \\pxTombstoneCompile{App}{C}{x86}{C}');
      lines.push('\\end{center}\n');
    }

    if (st.packages.pxLST && st.snippets.codeListing) {
      lines.push('%% Code Listing with pxLST');
      lines.push('\\section{Implementació de Codi (pxLST)}');
      lines.push(`\\begin{pxCode}[language=${st.packageConfigs.lstDefaultLang}]{AlgorismePrincipal}`);
      lines.push('def process_data(records):');
      lines.push('    """Process validation batch in pure Python."""');
      lines.push('    return [item.strip() for item in records if item]');
      lines.push('\\end{pxCode}\n');
    }

    if (st.packages.pxTAB && st.snippets.tableExample) {
      lines.push('%% Formatted Table with pxTAB');
      lines.push('\\section{Resultats Experimentals (pxTAB)}');
      lines.push(`\\pxTable[preset=${st.packageConfigs.tabPreset}]`);
      lines.push('  {Mètrica, Mètode Clàssic, Mètode P3CTeX}');
      lines.push("  {Temps d'execució, 14.8 ms, 2.1 ms}");
      lines.push('  {Consum de memòria, 12.4 MB, 3.2 MB}');
      lines.push('  {Taxa d\'èxit, 94.2\\%, 99.8\\%}\n');
    }

    if (st.packages.pxUML && st.snippets.umlClass) {
      lines.push('%% UML Class Diagram with pxUML');
      lines.push('\\section{Model de Classes (pxUML)}');
      lines.push('\\pxUMLClass{Student}{- id: String}[+ submitWork(): void]');
      lines.push('\\pxUMLDiagram*{');
      lines.push('  \\drawclass[text width=12em]{Student}[0,0]');
      lines.push('}\n');
    }

    if (st.snippets.bibliography) {
      lines.push('%% Referències Bibliogràfiques');
      lines.push('\\newpage');
      lines.push('\\nocite{*}');
      lines.push('\\bibliographystyle{abbrvnat}');
      lines.push('\\bibliography{referencies}\n');
    }

    lines.push('\\end{document}');
    return lines.join('\n');
  }

  // --- Filename Sanitizer ---
  function getComputedFilename(st) {
    const act = (st.metadata.caShortName || 'DOC').replace(/[^a-zA-Z0-9_-]/g, '');
    const subj = (st.metadata.subjShortName || 'P3C').replace(/[^a-zA-Z0-9_-]/g, '');
    return `${subj}_${act}.tex`;
  }

  // --- Update UI from State ---
  function renderPreview() {
    const codeEl = document.getElementById('preview-code');
    const filenameEl = document.getElementById('filename-badge');
    const lineCountEl = document.getElementById('preview-line-count');
    const charCountEl = document.getElementById('preview-char-count');

    if (!codeEl) return;

    const code = generateLatexCode(state);
    codeEl.textContent = code;

    const filename = getComputedFilename(state);
    if (filenameEl) filenameEl.textContent = filename;

    const lines = code.split('\n');
    if (lineCountEl) lineCountEl.textContent = `${lines.length} lines`;
    if (charCountEl) charCountEl.textContent = `${code.length} chars`;
  }

  // --- Bind Form Inputs to State ---
  function bindForm() {
    // Presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const p = btn.getAttribute('data-preset');
        state.preset = p;

        if (p === 'PAC') {
          state.language = 'cat';
          state.cover = false;
          state.toc = true;
          state.noPlagi = true;
        } else if (p === 'PEC') {
          state.language = 'es';
          state.cover = false;
          state.toc = true;
          state.noPlagi = true;
        } else if (p === 'CA') {
          state.language = 'en';
          state.cover = false;
          state.toc = true;
          state.noPlagi = true;
        } else if (p === 'PR') {
          state.cover = true;
          state.toc = true;
          state.noPlagi = true;
        }

        // Sync inputs
        const langSel = document.getElementById('input-language');
        if (langSel) langSel.value = state.language;
        const coverChk = document.getElementById('chk-cover');
        if (coverChk) coverChk.checked = state.cover;
        const tocChk = document.getElementById('chk-toc');
        if (tocChk) tocChk.checked = state.toc;
        const plagiChk = document.getElementById('chk-no-plagi');
        if (plagiChk) plagiChk.checked = state.noPlagi;

        renderPreview();
      });
    });

    // Language
    const langSelect = document.getElementById('input-language');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        state.language = e.target.value;
        renderPreview();
      });
    }

    // Metadata inputs
    const metadataFields = [
      ['meta-student', 'student'],
      ['meta-grade', 'grade'],
      ['meta-subj-fullname', 'subjFullName'],
      ['meta-subj-shortname', 'subjShortName'],
      ['meta-subj-code', 'subjCode'],
      ['meta-ca-fullname', 'caFullName'],
      ['meta-ca-shortname', 'caShortName'],
      ['meta-date', 'date']
    ];

    metadataFields.forEach(([elemId, key]) => {
      const el = document.getElementById(elemId);
      if (el) {
        el.addEventListener('input', (e) => {
          state.metadata[key] = e.target.value;
          renderPreview();
        });
      }
    });

    // Class option checkboxes (cover, toc, noPlagi, debug, printDoc)
    const optionToggles = [
      ['chk-cover', 'cover'],
      ['chk-toc', 'toc'],
      ['chk-no-plagi', 'noPlagi'],
      ['chk-debug', 'debug'],
      ['chk-print-doc', 'printDoc']
    ];

    optionToggles.forEach(([elemId, key]) => {
      const el = document.getElementById(elemId);
      if (el) {
        el.addEventListener('change', (e) => {
          state[key] = e.target.checked;
          // Switching a granular toggle sets preset to Custom
          state.preset = 'Custom';
          document.querySelectorAll('[data-preset]').forEach(b => {
            if (b.getAttribute('data-preset') === 'Custom') b.classList.add('active');
            else b.classList.remove('active');
          });
          renderPreview();
        });
      }
    });

    // Package toggles
    const pkgKeys = ['pxCALC', 'pxCMP', 'pxMEM', 'pxSRC', 'pxTAB', 'pxLST', 'pxUML', 'pxREQ', 'pxANN', 'pxGNT', 'pxGLS'];
    pkgKeys.forEach(pkg => {
      const el = document.getElementById(`pkg-${pkg}`);
      if (el) {
        el.addEventListener('change', (e) => {
          state.packages[pkg] = e.target.checked;
          renderPreview();
        });
      }
    });

    // Package Config options
    const cfgLstPalette = document.getElementById('cfg-lst-palette');
    if (cfgLstPalette) {
      cfgLstPalette.addEventListener('change', (e) => {
        state.packageConfigs.lstPalette = e.target.value;
        renderPreview();
      });
    }

    const cfgLstLang = document.getElementById('cfg-lst-lang');
    if (cfgLstLang) {
      cfgLstLang.addEventListener('change', (e) => {
        state.packageConfigs.lstDefaultLang = e.target.value;
        renderPreview();
      });
    }

    const cfgCmpPreset = document.getElementById('cfg-cmp-preset');
    if (cfgCmpPreset) {
      cfgCmpPreset.addEventListener('change', (e) => {
        state.packageConfigs.cmpPreset = e.target.value;
        renderPreview();
      });
    }

    const cfgTabPreset = document.getElementById('cfg-tab-preset');
    if (cfgTabPreset) {
      cfgTabPreset.addEventListener('change', (e) => {
        state.packageConfigs.tabPreset = e.target.value;
        renderPreview();
      });
    }

    // Snippet toggles
    const snippetKeys = [
      ['snip-intro', 'introSection'],
      ['snip-calc', 'calcExample'],
      ['snip-automaton', 'cmpAutomaton'],
      ['snip-tombstone', 'cmpTombstone'],
      ['snip-code', 'codeListing'],
      ['snip-table', 'tableExample'],
      ['snip-uml', 'umlClass'],
      ['snip-bib', 'bibliography']
    ];

    snippetKeys.forEach(([elemId, key]) => {
      const el = document.getElementById(elemId);
      if (el) {
        el.addEventListener('change', (e) => {
          state.snippets[key] = e.target.checked;
          renderPreview();
        });
      }
    });

    // Copy to Clipboard Button
    const copyBtn = document.getElementById('btn-copy-tex');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const code = generateLatexCode(state);
        if (window.copyTextToClipboard) {
          window.copyTextToClipboard(code, () => {
            const orig = copyBtn.innerHTML;
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Copied!`;
            if (window.showToast) window.showToast('Document .tex code copied to clipboard');
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.innerHTML = orig;
            }, 2500);
          }, () => {
            if (window.showToast) window.showToast('Failed to copy. Please select manually.');
          });
        }
      });
    }

    // Download .tex Button
    const downloadBtn = document.getElementById('btn-download-tex');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const code = generateLatexCode(state);
        const filename = getComputedFilename(state);
        const blob = new Blob([code], { type: 'text/x-tex;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 300);
        if (window.showToast) window.showToast(`Downloaded ${filename}`);
      });
    }
  }

  // Expose to window for testing / standalone
  window.P3CTeXGenerator = {
    state,
    generateLatexCode,
    getComputedFilename,
    renderPreview
  };

  document.addEventListener('DOMContentLoaded', () => {
    bindForm();
    renderPreview();
  });
})();
