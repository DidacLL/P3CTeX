/* ==========================================================================
   P3CTeX LaTeX Generator Studio — Client Controller
   Multi-Asset Reactive LaTeX Generator (Document, Tables, Gantt, UML, Code, Compilers)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let activeTool = 'tool-document';
  let activeProfile = 'PAC';

  // UI Elements
  const toolKeys = document.querySelectorAll('.selector-key[data-tool]');
  const panels = document.querySelectorAll('.generator-panel');
  const activeToolReadout = document.getElementById('active-tool-readout');
  const outputTarget = document.getElementById('studio-output-target');
  const outputFilename = document.getElementById('output-filename');
  const outputModeBadge = document.getElementById('output-mode-badge');
  const btnCopyMain = document.getElementById('btn-copy-main');
  const btnCopyPane = document.getElementById('btn-copy-pane');
  const btnDownloadMain = document.getElementById('btn-download-main');
  const btnDownloadPane = document.getElementById('btn-download-pane');

  const toolLabels = {
    'tool-document': 'TOOL: [01 // DOCUMENT STARTER]',
    'tool-tables': 'TOOL: [02 // DATA TABLES]',
    'tool-gantt': 'TOOL: [03 // GANTT TIMELINE]',
    'tool-uml': 'TOOL: [04 // UML & ARCHITECTURE]',
    'tool-code': 'TOOL: [05 // CODE LISTINGS]',
    'tool-compiler': 'TOOL: [06 // COMPILERS & AUTOMATA]'
  };

  // 1. Tool Tab Switching
  toolKeys.forEach(k => {
    k.addEventListener('click', () => {
      const targetTool = k.getAttribute('data-tool');
      activateTool(targetTool);
    });
  });

  function activateTool(toolId) {
    activeTool = toolId;
    panels.forEach(p => {
      if (p.id === toolId) p.classList.add('active');
      else p.classList.remove('active');
    });

    toolKeys.forEach(k => {
      if (k.getAttribute('data-tool') === toolId) k.classList.add('active');
      else k.classList.remove('active');
    });

    if (activeToolReadout && toolLabels[toolId]) {
      activeToolReadout.textContent = toolLabels[toolId];
    }
    renderActiveTool();
  }

  // 2. Document Profile Switcher (PAC / PR / TFG)
  const profilePills = document.querySelectorAll('#doc-deliverable-pills .pill-btn');
  profilePills.forEach(pill => {
    pill.addEventListener('click', () => {
      profilePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeProfile = pill.getAttribute('data-profile');

      // Auto-adjust metadata fields based on profile
      const titleInput = document.getElementById('doc-title');
      if (activeProfile === 'PAC') {
        titleInput.value = 'PAC 1: Anàlisi Lèxica i Sintàctica';
      } else if (activeProfile === 'PR') {
        titleInput.value = 'Memòria de Projecte de Laboratori (PR1)';
      } else if (activeProfile === 'TFG') {
        titleInput.value = "Memòria de Treball Final de Grau: Disseny d'un Sistema Distribuït";
      }
      renderActiveTool();
    });
  });

  // 3. Form Input Change Listeners
  const allInputs = document.querySelectorAll('.studio-form-pane input, .studio-form-pane select, .studio-form-pane textarea');
  allInputs.forEach(input => {
    input.addEventListener('input', renderActiveTool);
    input.addEventListener('change', renderActiveTool);
  });

  // 4. Render Active Tool Code Generator
  function renderActiveTool() {
    if (activeTool === 'tool-document') {
      renderDocumentStarter();
    } else if (activeTool === 'tool-tables') {
      renderTableSnippet();
    } else if (activeTool === 'tool-gantt') {
      renderGanttSnippet();
    } else if (activeTool === 'tool-uml') {
      renderUmlSnippet();
    } else if (activeTool === 'tool-code') {
      renderCodeSnippet();
    } else if (activeTool === 'tool-compiler') {
      renderCompilerSnippet();
    }
  }

  // Generator 1: Document Starter
  function renderDocumentStarter() {
    const student = document.getElementById('doc-student').value.trim() || 'Estudiant UOC';
    const degree = document.getElementById('doc-degree').value.trim() || 'Grau en Enginyeria Informàtica';
    const subject = document.getElementById('doc-subject').value.trim() || 'Compiladors i Llenguatges';
    const subjCodeRaw = document.getElementById('doc-subjcode').value.trim() || '75.580 (COMP)';
    const title = document.getElementById('doc-title').value.trim() || 'PAC 1: Treball Pràctic';
    const lang = document.getElementById('doc-lang').value;

    const incTable = document.getElementById('doc-inc-table').checked;
    const incFigure = document.getElementById('doc-inc-figure').checked;
    const incCode = document.getElementById('doc-inc-code').checked;
    const incTombstone = document.getElementById('doc-inc-tombstone').checked;

    let classOpt = activeProfile === 'TFG' ? 'TFG,MEM,default' : `${activeProfile},default`;
    let filename = `minimal-${activeProfile.toLowerCase()}.tex`;

    outputFilename.textContent = `OUTPUT: ${filename}`;
    outputModeBadge.textContent = 'FULL DOCUMENT';

    let code = `% ==============================================================================
% P3CTeX Document Starter (${activeProfile})
% Configured for UOC Academic Coursework & Reports
% Compile with: pdflatex ${filename}
% ==============================================================================
\\documentclass[${classOpt}]{P3CTeX}

\\PECTeXconfig{
  data = {
    student        = {${student}},
    grade          = {${degree}},
    subj-fullname  = {${subject}},
    subj-shortname = {${subjCodeRaw.includes('(') ? subjCodeRaw.split('(')[1].replace(')', '').trim() : 'SUBJ'}},
    subj-code      = {${subjCodeRaw.includes('(') ? subjCodeRaw.split('(')[0].trim() : subjCodeRaw}},
    ca-fullname    = {${title}},
    ca-shortname   = {${activeProfile}1},
    date           = {\\today}
  }
}

\\begin{document}
`;

    if (activeProfile === 'PAC') {
      code += `% PAC Profile: Portada desactivada; sumari i declaració de no plagi automàtics.\n\n`;
      code += `\\section{1. Resolució d'Exercicis}\n`;
      code += `Descripció dels procediments i anàlisi de requeriments...\n\n`;
    } else if (activeProfile === 'PR') {
      code += `% PR Profile: Portada formal i sumari generats automàticament.\n\n`;
      code += `\\section{1. Introducció i Abast del Projecte}\n`;
      code += `Aquest document recull la memòria tècnica del projecte desenvolupat...\n\n`;
    } else {
      code += `% TFG Profile: Fitxa d'avaluació de tribunal i estructura per capítols.\n\n`;
      code += `\\chapter{Introducció}\n`;
      code += `Descripció del context i objectius del Treball Final de Grau...\n\n`;
    }

    if (incTable) {
      code += `% Taula declarativa per comes (paquet pxTAB):\n`;
      code += `\\pxTable[style=header]\n  {Mètrica, Valor Mesurat, Estat}\n  {Temps d'execució, 0.42 s, PASS}\n  {Memòria consumida, 18.5 MB, PASS}\n\n`;
    }

    if (incFigure) {
      code += `% Figura amb placeholder resilient (paquet pxSRC):\n`;
      code += `\\pxIMG[0.85\\linewidth]{img/arquitectura}{Esquema de l'arquitectura proposada}[fig:arq]\n\n`;
    }

    if (incCode) {
      code += `% Bloc de codi amb ressaltat de sintaxi i números de línia (paquet pxLST):\n`;
      code += `\\begin{pxCode}[language=Java,caption=LexerAnalyzer.java]\npublic class LexerAnalyzer {\n    public static void main(String[] args) {\n        System.out.println("Lexer ready.");\n    }\n}\n\\end{pxCode}\n\n`;
    }

    if (incTombstone) {
      code += `% Diagrama Tombstone de compilació (paquet pxCMP):\n`;
      code += `\\pxTombstoneCompile{CUP}{Parser}{Java}\n\n`;
    }

    code += `\\end{document}\n`;
    outputTarget.textContent = code;
  }

  // Generator 2: Data Tables
  function renderTableSnippet() {
    const caption = document.getElementById('tbl-caption').value.trim() || 'Taula de Dades';
    const label = document.getElementById('tbl-label').value.trim() || 'tab:dades';
    const style = document.getElementById('tbl-style').value;
    const isMulti = document.getElementById('tbl-multipage').value === 'multi';
    const headers = document.getElementById('tbl-headers').value.trim();
    const rows = document.getElementById('tbl-rows').value.trim().split('\n').filter(r => r.trim());

    outputFilename.textContent = `OUTPUT: table-snippet.tex`;
    outputModeBadge.textContent = 'TABLE SNIPPET';

    let macroName = isMulti ? '\\pxTBLlong*' : '\\pxTable';
    let code = `% ==============================================================================\n`;
    code += `% Taula LaTeX generada amb P3CTeX (pxTAB)\n`;
    code += `% Inseriu aquest bloc al vostre document .tex\n`;
    code += `% ==============================================================================\n`;
    code += `${macroName}[style=${style}]\n`;
    code += `  {${headers}}`;

    rows.forEach(row => {
      code += `\n  {${row.trim()}}`;
    });

    outputTarget.textContent = code;
  }

  // Generator 3: Gantt Timelines
  function renderGanttSnippet() {
    const title = document.getElementById('gnt-title').value.trim() || 'Cronograma de Treball';
    const duration = document.getElementById('gnt-duration').value.trim();
    const tasks = document.getElementById('gnt-tasks').value.trim().split('\n').filter(t => t.trim());

    outputFilename.textContent = `OUTPUT: gantt-timeline.tex`;
    outputModeBadge.textContent = 'TIMELINE SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Cronograma de Treball / Diagrama Gantt per a PR i TFG\n`;
    code += `% Requereix el paquet GNT o pgfgantt\n`;
    code += `% ==============================================================================\n`;
    code += `\\begin{table}[htbp]\n\\centering\n`;
    code += `\\caption{${title} (${duration})}\n\\label{tab:gantt}\n`;
    code += `\\pxTable[style=header]\n`;
    code += `  {Tasca / Fase del Projecte, Interval Temporal, Estat Actual}`;

    tasks.forEach(task => {
      code += `\n  {${task.trim()}}`;
    });

    code += `\n\\end{table}\n`;
    outputTarget.textContent = code;
  }

  // Generator 4: Architecture & UML
  function renderUmlSnippet() {
    const type = document.getElementById('uml-type').value;
    const caption = document.getElementById('uml-caption').value.trim() || 'Diagrama';
    const elements = document.getElementById('uml-elements').value.trim().split('\n').filter(e => e.trim());

    outputFilename.textContent = `OUTPUT: architecture-diagram.tex`;
    outputModeBadge.textContent = 'DIAGRAM SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Diagrama d'Arquitectura / UML per a memòries d'enginyeria\n`;
    code += `% ==============================================================================\n`;
    code += `\\begin{figure}[htbp]\n\\centering\n`;
    code += `\\pxTable[style=compact]\n  {Capa del Sistema, Descripció dels Components}`;

    elements.forEach(el => {
      const parts = el.split(':');
      if (parts.length === 2) {
        code += `\n  {${parts[0].trim()}, ${parts[1].trim()}}`;
      } else {
        code += `\n  {Component, ${el.trim()}}`;
      }
    });

    code += `\n\\caption{${caption}}\n\\label{fig:arquitectura}\n\\end{figure}\n`;
    outputTarget.textContent = code;
  }

  // Generator 5: Code Listings
  function renderCodeSnippet() {
    const lang = document.getElementById('code-lang').value;
    const caption = document.getElementById('code-caption').value.trim() || 'CodiFont';
    const body = document.getElementById('code-body').value;

    outputFilename.textContent = `OUTPUT: code-listing.tex`;
    outputModeBadge.textContent = 'CODE SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Bloc de Codi Formatat amb P3CTeX (pxLST)\n`;
    code += `% ==============================================================================\n`;
    code += `\\begin{pxCode}[language=${lang},caption={${caption}}]\n`;
    code += body;
    code += `\n\\end{pxCode}\n`;

    outputTarget.textContent = code;
  }

  // Generator 6: Compilers & Automata
  function renderCompilerSnippet() {
    const type = document.getElementById('cmp-type').value;
    const caption = document.getElementById('cmp-caption').value.trim() || 'Esquema de Compilació';

    outputFilename.textContent = `OUTPUT: compiler-diagram.tex`;
    outputModeBadge.textContent = 'COMPILER SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Eines per a Compiladors i Teoria de la Computació (P3CTeX pxCMP)\n`;
    code += `% ==============================================================================\n`;

    if (type === 'tombstone') {
      const src = document.getElementById('cmp-source').value.trim() || 'CUP';
      const tgt = document.getElementById('cmp-target').value.trim() || 'Java';
      const impl = document.getElementById('cmp-impl').value.trim() || 'JVM';
      code += `% Diagrama Tombstone en T per a pipelines de compilació:\n`;
      code += `\\pxTombstoneCompile{${src}}{${tgt}}{${impl}}\n`;
    } else if (type === 'dfa') {
      code += `% Taula de transicions per a autòmats finits deterministes (DFA):\n`;
      code += `\\pxTransitionTable{\n  state, 0, 1;\n  q0, q1, q0;\n  q1, q0, q1\n}\n`;
    } else {
      code += `% Arbre de derivació sintàctica:\n`;
      code += `\\pxParseTree{E -> E + T | T}\n`;
    }

    outputTarget.textContent = code;
  }

  // 5. Copy Actions
  function copyOutput(btn) {
    const text = outputTarget.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<span>COPIED!</span>';
      setTimeout(() => {
        btn.innerHTML = original;
      }, 1800);
    }).catch(err => console.error('Copy failed:', err));
  }

  btnCopyMain.addEventListener('click', () => copyOutput(btnCopyMain));
  btnCopyPane.addEventListener('click', () => copyOutput(btnCopyPane));

  // 6. Download Actions
  function downloadOutput() {
    const text = outputTarget.textContent;
    let filename = outputFilename.textContent.replace('OUTPUT: ', '').trim() || 'p3ctex-export.tex';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  btnDownloadMain.addEventListener('click', downloadOutput);
  btnDownloadPane.addEventListener('click', downloadOutput);

  // Initial render & URL hash support
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const target = 'tool-' + hash;
    if (document.getElementById(target)) {
      activateTool(target);
    } else {
      renderActiveTool();
    }
  } else {
    renderActiveTool();
  }
});
