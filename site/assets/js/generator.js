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
  const profilePills = document.querySelectorAll('#doc-profile-pills .pill-btn');
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
    if (incTombstone) {
      classOpt = `CMP,${classOpt}`;
    }
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
      code += `% TFG Profile: Estructura de memòria amb capítols (pxMEM) i fitxa institucional (pxTFG).\n\n`;
      code += `\\chapter{Introducció}\n`;
      code += `Descripció del context i objectius del Treball Final de Grau...\n\n`;
    }

    if (incTable) {
      code += `% Taula declarativa per comes (paquet pxTAB inclòs a default):\n`;
      code += `\\pxTable[style=header]\n  {Mètrica, Valor Mesurat, Estat}\n  {Temps d'execució, 0.42 s, PASS}\n  {Memòria consumida, 18.5 MB, PASS}\n\n`;
    }

    if (incFigure) {
      code += `% Figura resilient amb fallback si el fitxer no existeix (paquet pxSRC):\n`;
      code += `\\pxIMG[0.85\\linewidth]{img/arquitectura}{Esquema de l'arquitectura proposada}[fig:arq]\n\n`;
    }

    if (incCode) {
      code += `% Bloc de codi amb ressaltat de sintaxi i marc Darcula (paquet pxLST):\n`;
      code += `\\begin{pxCode}[language=Java]{LexerAnalyzer.java}\npublic class LexerAnalyzer {\n    public static void main(String[] args) {\n        System.out.println("Compilable amb P3CTeX");\n    }\n}\n\\end{pxCode}\n\n`;
    }

    if (incTombstone) {
      code += `% Diagrama Tombstone de compilació (paquet pxCMP):\n`;
      code += `\\pxTombstoneCompile[title={Compilació en Java}]{Programa}{Java}{JVM}{x86}\n\n`;
    }

    code += `\\end{document}\n`;
    outputTarget.textContent = code;
  }

  // Generator 2: Data Tables
  function renderTableSnippet() {
    const caption = document.getElementById('tbl-caption').value.trim() || 'Taula de Dades';
    const label = document.getElementById('tbl-label').value.trim() || 'tab:dades';
    const style = document.getElementById('tbl-style').value;
    const headers = document.getElementById('tbl-headers').value.trim();
    const rows = document.getElementById('tbl-rows').value.trim().split('\n').filter(r => r.trim());

    outputFilename.textContent = `OUTPUT: table-snippet.tex`;
    outputModeBadge.textContent = 'TABLE SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Taula declarativa generada amb P3CTeX (pxTAB)\n`;
    code += `% Inclosa al paquet 'default' de P3CTeX (estils: plain, header, striped, boxed, grid)\n`;
    code += `% ==============================================================================\n`;
    code += `\\begin{table}[htbp]\n\\centering\n`;
    code += `\\caption{${caption}}\n\\label{${label}}\n`;
    code += `\\pxTable[style=${style}]\n`;
    code += `  {${headers}}`;

    rows.forEach(row => {
      code += `\n  {${row.trim()}}`;
    });

    code += `\n\\end{table}\n`;
    outputTarget.textContent = code;
  }

  // Generator 3: Gantt Timelines
  function renderGanttSnippet() {
    const start = document.getElementById('gnt-start') ? document.getElementById('gnt-start').value.trim() : '01/03/2026';
    const end = document.getElementById('gnt-end') ? document.getElementById('gnt-end').value.trim() : '30/06/2026';
    const block = document.getElementById('gnt-block') ? document.getElementById('gnt-block').value.trim() : '28';
    const tasks = document.getElementById('gnt-tasks').value.trim().split('\n').filter(t => t.trim());

    outputFilename.textContent = `OUTPUT: gantt-timeline.tex`;
    outputModeBadge.textContent = 'TIMELINE SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Diagrama Gantt diari generat amb P3CTeX (pxGNT)\n`;
    code += `% Requereix \\documentclass[GNT,...]{P3CTeX} o \\usepackage{pxGNT}\n`;
    code += `% ==============================================================================\n`;
    code += `\\pxGantt{start=${start},end=${end},days-per-block=${block}}\n`;

    tasks.forEach(task => {
      const parts = task.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        code += `\\pxGanttItem{${parts[0]}}{${parts[1]}}{${parts[2]}}\n`;
      } else if (parts.length === 2) {
        code += `\\pxGanttItem{${parts[0]}}{${parts[1]}}{${parts[1]}}\n`;
      } else {
        code += `\\pxGanttItem{${task}}{${start}}{${end}}\n`;
      }
    });

    code += `\\pxGanttEnd\n`;
    outputTarget.textContent = code;
  }

  // Generator 4: Architecture & UML
  function renderUmlSnippet() {
    const classname = document.getElementById('uml-classname') ? document.getElementById('uml-classname').value.trim() : 'Usuari';
    const type = document.getElementById('uml-type').value;
    const attrsRaw = document.getElementById('uml-attrs') ? document.getElementById('uml-attrs').value.trim().split('\n').filter(a => a.trim()) : ['- id : String', '- email : String'];
    const opsRaw = document.getElementById('uml-ops') ? document.getElementById('uml-ops').value.trim().split('\n').filter(o => o.trim()) : ['+ autenticar() : boolean'];

    outputFilename.textContent = `OUTPUT: uml-class-diagram.tex`;
    outputModeBadge.textContent = 'UML SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Diagrama de classes UML generat amb P3CTeX (pxUML)\n`;
    code += `% Basat en pgf-umlcd i TikZ. Inclòs al paquet 'default' de P3CTeX\n`;
    code += `% ==============================================================================\n`;
    code += `\\begin{tikzpicture}\n`;
    code += `\\pxUMLClass[${type}]{${classname}}{\n`;
    code += attrsRaw.map(a => `  ${a}`).join(' \\\\\n');
    code += `\n}{\n`;
    code += opsRaw.map(o => `  ${o}`).join(' \\\\\n');
    code += `\n}\n`;
    code += `\\drawclass{${classname}}[0,0]\n`;
    code += `\\end{tikzpicture}\n`;

    outputTarget.textContent = code;
  }

  // Generator 5: Code Listings
  function renderCodeSnippet() {
    const lang = document.getElementById('code-lang').value;
    const caption = document.getElementById('code-caption').value.trim() || 'Lexer.java';
    const body = document.getElementById('code-body').value;

    outputFilename.textContent = `OUTPUT: code-listing.tex`;
    outputModeBadge.textContent = 'CODE SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Bloc de codi font amb ressaltat de sintaxi i marc estil Darcula (pxLST)\n`;
    code += `% Inclòs al paquet 'default' de P3CTeX\n`;
    code += `% ==============================================================================\n`;
    code += `\\begin{pxCode}[language=${lang}]{${caption}}\n`;
    code += body;
    code += `\n\\end{pxCode}\n`;

    outputTarget.textContent = code;
  }

  // Generator 6: Compilers & Automata
  function renderCompilerSnippet() {
    const type = document.getElementById('cmp-type').value;
    const prog = document.getElementById('cmp-prog') ? document.getElementById('cmp-prog').value.trim() : 'Programa';
    const src = document.getElementById('cmp-source') ? document.getElementById('cmp-source').value.trim() : 'Java';
    const tgt = document.getElementById('cmp-target') ? document.getElementById('cmp-target').value.trim() : 'Bytecode';
    const impl = document.getElementById('cmp-impl') ? document.getElementById('cmp-impl').value.trim() : 'JVM';

    const cmpInputs = document.getElementById('cmp-tombstone-inputs');
    const progField = document.getElementById('cmp-prog') ? document.getElementById('cmp-prog').closest('.input-field') : null;
    if (cmpInputs) {
      cmpInputs.style.display = (type === 'tombstone' || type === 'tcompiler') ? 'block' : 'none';
    }
    if (progField) {
      progField.style.display = (type === 'tombstone' || type === 'tcompiler') ? 'block' : 'none';
    }

    outputFilename.textContent = `OUTPUT: compiler-diagram.tex`;
    outputModeBadge.textContent = 'COMPILER SNIPPET';

    let code = `% ==============================================================================\n`;
    code += `% Diagrama per a Compiladors i Teoria de la Computació (P3CTeX pxCMP)\n`;
    code += `% Requereix \\documentclass[CMP,...]{P3CTeX} o \\usepackage{pxCMP}\n`;
    code += `% ==============================================================================\n`;

    if (type === 'tombstone') {
      code += `% Compilació completa d'un programa amb peça Tombstone en T:\n`;
      code += `\\pxTombstoneCompile[title={Compilació de ${prog}}]{${prog}}{${src}}{${tgt}}{${impl}}\n`;
    } else if (type === 'tcompiler') {
      code += `% Peces Tombstone independents (Compilador, Programa, Màquina):\n`;
      code += `\\pxTCompiler{${src}}{${tgt}}{${impl}}\n`;
      code += `\\pxTProgram{${prog}}{${src}}\n`;
      code += `\\pxTMachine{${impl}}\n`;
    } else if (type === 'dfa') {
      code += `% Taula de transicions per a autòmats finits (DFA/NFA):\n`;
      code += `\\pxTransitionTable{\n  state, 0, 1;\n  q0, q1, q0;\n  q1, q0, q1\n}\n`;
    } else if (type === 'bnf') {
      code += `% Produccions gramaticals en format BNF formal:\n`;
      code += `\\pxBNF{\n  <expressio> ::= <terme> ("+" <terme> | "-" <terme>)* ;\n  <terme>     ::= <factor> ("*" <factor> | "/" <factor>)* ;\n  <factor>    ::= <ident> | <num> | "(" <expressio> ")\n}\n`;
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
