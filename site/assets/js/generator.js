/* ==========================================================================
   P3CTeX LaTeX Generator Studio — Client Controller
   Multi-Asset Reactive LaTeX Generator (10 Specialized Tools)
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
    'tool-cover': 'TOOL: [02 // COVER & HEADERS]',
    'tool-tables': 'TOOL: [03 // DATA & MULTIPAGE TABLES]',
    'tool-figures': 'TOOL: [04 // RESILIENT FIGURES & LISTS]',
    'tool-grow': 'TOOL: [05 // DYNAMIC SIZING & LAYOUT]',
    'tool-code': 'TOOL: [06 // CODE LISTINGS]',
    'tool-uml': 'TOOL: [07 // UML ARCHITECTURE]',
    'tool-gantt': 'TOOL: [08 // GANTT TIMELINE]',
    'tool-compiler': 'TOOL: [09 // COMPILERS & AUTOMATA]',
    'tool-annexes': 'TOOL: [10 // ANNEXES & SLICING]'
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

  // 2. Document Profile Switcher (PAC / PR / MEM / TFG)
  const profilePills = document.querySelectorAll('#doc-profile-pills .pill-btn');
  profilePills.forEach(pill => {
    pill.addEventListener('click', () => {
      profilePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeProfile = pill.getAttribute('data-profile');

      const titleInput = document.getElementById('doc-title');
      if (titleInput) {
        if (activeProfile === 'PAC') {
          titleInput.value = 'PAC 1: Anàlisi Lèxica i Sintàctica';
        } else if (activeProfile === 'PR') {
          titleInput.value = 'Memòria de Projecte de Laboratori (PR1)';
        } else if (activeProfile === 'MEM') {
          titleInput.value = "Memòria Tècnica d'Enginyeria de Software";
        } else if (activeProfile === 'TFG') {
          titleInput.value = "Memòria de Treball Final de Grau: Disseny d'un Sistema Distribuït";
        }
      }
      renderActiveTool();
    });
  });

  // 3. Dynamic Sub-Form Toggles
  const figMode = document.getElementById('fig-mode');
  if (figMode) {
    figMode.addEventListener('change', () => {
      const singleFields = document.getElementById('fig-single-fields');
      const promptFields = document.getElementById('fig-prompt-fields');
      const listFields = document.getElementById('fig-list-fields');
      const mode = figMode.value;

      if (singleFields) singleFields.style.display = (mode === 'single' || mode === 'prompt') ? 'grid' : 'none';
      if (promptFields) promptFields.style.display = (mode === 'prompt') ? 'block' : 'none';
      if (listFields) listFields.style.display = (mode === 'list') ? 'block' : 'none';
    });
  }

  const annexKind = document.getElementById('annex-kind');
  if (annexKind) {
    annexKind.addEventListener('change', () => {
      const sliceFields = document.getElementById('annex-slice-fields');
      const tfgFields = document.getElementById('annex-tfg-fields');
      const kind = annexKind.value;

      if (sliceFields) sliceFields.style.display = (kind === 'slicing') ? 'grid' : 'none';
      if (tfgFields) tfgFields.style.display = (kind === 'tfg') ? 'grid' : 'none';
    });
  }

  // 4. Form Input Change Listeners
  const allInputs = document.querySelectorAll('.studio-form-pane input, .studio-form-pane select, .studio-form-pane textarea');
  allInputs.forEach(input => {
    input.addEventListener('input', renderActiveTool);
    input.addEventListener('change', renderActiveTool);
  });

  // 5. Render Active Tool Code Generator
  function renderActiveTool() {
    if (activeTool === 'tool-document') renderDocumentStarter();
    else if (activeTool === 'tool-cover') renderCoverSnippet();
    else if (activeTool === 'tool-tables') renderTableSnippet();
    else if (activeTool === 'tool-figures') renderFigureSnippet();
    else if (activeTool === 'tool-grow') renderDynamicGrowSnippet();
    else if (activeTool === 'tool-code') renderCodeSnippet();
    else if (activeTool === 'tool-uml') renderUmlSnippet();
    else if (activeTool === 'tool-gantt') renderGanttSnippet();
    else if (activeTool === 'tool-compiler') renderCompilerSnippet();
    else if (activeTool === 'tool-annexes') renderAnnexesSnippet();
  }

  // TOOL 01: DOCUMENT STARTER
  function renderDocumentStarter() {
    const student = (document.getElementById('doc-student') ? document.getElementById('doc-student').value.trim() : '') || 'Estudiant UOC';
    const degree = (document.getElementById('doc-degree') ? document.getElementById('doc-degree').value.trim() : '') || 'Grau en Enginyeria Informàtica';
    const subject = (document.getElementById('doc-subject') ? document.getElementById('doc-subject').value.trim() : '') || 'Compiladors i Llenguatges';
    const subjCodeRaw = (document.getElementById('doc-subjcode') ? document.getElementById('doc-subjcode').value.trim() : '') || '75.580 (COMP)';
    const title = (document.getElementById('doc-title') ? document.getElementById('doc-title').value.trim() : '') || 'PAC 1: Treball Pràctic';

    const incTable = document.getElementById('doc-inc-table') ? document.getElementById('doc-inc-table').checked : true;
    const incFigure = document.getElementById('doc-inc-figure') ? document.getElementById('doc-inc-figure').checked : true;
    const incCode = document.getElementById('doc-inc-code') ? document.getElementById('doc-inc-code').checked : true;
    const incGrow = document.getElementById('doc-inc-grow') ? document.getElementById('doc-inc-grow').checked : false;
    const incGantt = document.getElementById('doc-inc-gantt') ? document.getElementById('doc-inc-gantt').checked : false;
    const incTombstone = document.getElementById('doc-inc-tombstone') ? document.getElementById('doc-inc-tombstone').checked : false;

    let classOpt = '';
    if (activeProfile === 'PAC') classOpt = 'PAC,default';
    else if (activeProfile === 'PR') classOpt = 'PR,default';
    else if (activeProfile === 'MEM') classOpt = 'PR,MEM,default';
    else if (activeProfile === 'TFG') classOpt = 'TFG,MEM,default';

    if (incGantt) classOpt = 'GNT,' + classOpt;
    if (incTombstone) classOpt = 'CMP,' + classOpt;

    let filename = 'minimal-' + activeProfile.toLowerCase() + '.tex';
    outputFilename.textContent = 'OUTPUT: ' + filename;
    outputModeBadge.textContent = 'FULL DOCUMENT';

    let code = '% ==============================================================================\n';
    code += '% P3CTeX Document Starter (' + activeProfile + ' Profile)\n';
    code += '% Universitat Oberta de Catalunya — Academic Coursework\n';
    code += '% Compilation command: pdflatex ' + filename + '\n';
    code += '% ==============================================================================\n';
    code += '\\documentclass[' + classOpt + ']{P3CTeX}\n\n';
    code += '\\PECTeXconfig{\n';
    code += '  data = {\n';
    code += '    student        = {' + student + '},\n';
    code += '    grade          = {' + degree + '},\n';
    code += '    subj-fullname  = {' + subject + '},\n';
    code += '    subj-shortname = {' + (subjCodeRaw.includes('(') ? subjCodeRaw.split('(')[1].replace(')', '').trim() : 'SUBJ') + '},\n';
    code += '    subj-code      = {' + (subjCodeRaw.includes('(') ? subjCodeRaw.split('(')[0].trim() : subjCodeRaw) + '},\n';
    code += '    ca-fullname    = {' + title + '},\n';
    code += '    ca-shortname   = {' + activeProfile + '1},\n';
    code += '    date           = {\\today}\n';
    code += '  }\n';
    code += '}\n\n';
    code += '\\begin{document}\n\n';

    if (activeProfile === 'PAC') {
      code += '% --- PAC Profile: Starts on page 1 with student data card and anti-plagiarism pledge.\n';
      code += '\\section{1. Resolució del Treball Pràctic}\n';
      code += 'Aquest document incorpora la declaració automàtica de no plagi a la capçalera.\n\n';
    } else if (activeProfile === 'PR') {
      code += '% --- PR Profile: Official UOC graphical cover page and Table of Contents.\n';
      code += '\\section{1. Introducció i Abast del Projecte}\n';
      code += 'Aquest document recull la memòria tècnica del lliurament pràctic.\n\n';
    } else if (activeProfile === 'MEM') {
      code += '% --- MEM Profile: Multi-chapter report with true \\chapter and annex hierarchy.\n';
      code += '\\chapter{Introducció al Projecte}\n';
      code += 'Descripció del context general i requeriments del sistema.\n\n';
    } else {
      code += '% --- TFG Profile: Bachelor\'s thesis with official UOC workcard and bilingual abstracts.\n';
      code += '\\chapter{Introducció}\n';
      code += 'Objectius generals i planificació del Treball Final de Grau.\n\n';
    }

    if (incTable) {
      code += '% Taula declarativa per comes (sense càlcul manual d\'amplada de columnes):\n';
      code += '\\pxTable[style=header]\n  {Mètrica, Valor Mesurat, Estat}\n  {Temps d\'execució, 0.42 s, PASS}\n  {Memòria consumida, 18.5 MB, PASS}\n\n';
    }

    if (incFigure) {
      code += '% Figura resilient (mai no interromp la compilació si el fitxer no existeix):\n';
      code += '\\pxImage[0.85\\linewidth]{img/arquitectura}{Esquema de l\'arquitectura proposada}[fig:arq]\n\n';
    }

    if (incCode) {
      code += '% Bloc de codi font amb marc estètic Darcula i ressaltat de sintaxi:\n';
      code += '\\begin{pxCode}[language=Java]{LexerAnalyzer.java}\npublic class LexerAnalyzer {\n    public static void main(String[] args) {\n        System.out.println("P3CTeX: 100% Offline pdflatex");\n    }\n}\n\\end{pxCode}\n\n';
    }

    if (incGrow) {
      code += '% Dynamic Sizing: escalat delimitat amb límit d\'alçada màxima (evita desbordaments):\n';
      code += '\\pxGrow*[1.2]{\\fbox{Bloc de contingut escalable amb límit}}[0.3\\textheight]\n\n';
    }

    if (incGantt) {
      code += '% Cronograma Gantt diari amb resolució per data de calendari:\n';
      code += '\\pxGantt{start=01/03/2026,end=30/06/2026,days-per-block=28}\n';
      code += '\\pxGanttItem{Anàlisi de Requeriments}{01/03/2026}{25/03/2026}\n';
      code += '\\pxGanttItem{Implementació}{26/03/2026}{31/05/2026}\n';
      code += '\\pxGanttEnd\n\n';
    }

    if (incTombstone) {
      code += '% Diagrama de compilació Tombstone (T-diagram):\n';
      code += '\\pxTombstoneCompile[title={Compilació Java}]{Programa}{Java}{JVM}{x86}\n\n';
    }

    code += '\\end{document}\n';
    outputTarget.textContent = code;
  }

  // TOOL 02: COVER & HEADERS CUSTOMIZER
  function renderCoverSnippet() {
    const title = (document.getElementById('cov-title') ? document.getElementById('cov-title').value.trim() : '') || 'Títol del Document';
    const subtitle = (document.getElementById('cov-subtitle') ? document.getElementById('cov-subtitle').value.trim() : '') || 'Subtítol de la Memòria';
    const backtitle = (document.getElementById('cov-backtitle') ? document.getElementById('cov-backtitle').value.trim() : '') || 'UNIVERSITAT OBERTA DE CATALUNYA';
    const picture = (document.getElementById('cov-picture') ? document.getElementById('cov-picture').value.trim() : '') || 'img/portada.png';

    const hLeft = (document.getElementById('page-head-left') ? document.getElementById('page-head-left').value.trim() : '') || '\\caShortname';
    const hRight = (document.getElementById('page-head-right') ? document.getElementById('page-head-right').value.trim() : '') || '\\subjFullname';
    const fLeft = (document.getElementById('page-foot-left') ? document.getElementById('page-foot-left').value.trim() : '') || '\\student';
    const fCenter = (document.getElementById('page-foot-center') ? document.getElementById('page-foot-center').value.trim() : '') || '\\thepage\\ / \\pageref{LastPage}';

    const strToc = (document.getElementById('str-toc') ? document.getElementById('str-toc').value.trim() : '') || 'Taula de Continguts';
    const strFig = (document.getElementById('str-fig') ? document.getElementById('str-fig').value.trim() : '') || 'Figura';

    outputFilename.textContent = 'OUTPUT: cover-and-headers.tex';
    outputModeBadge.textContent = 'COVER & HEADERS';

    let code = '% ==============================================================================\n';
    code += '% P3CTeX Cover & Running Headers Configuration\n';
    code += '% Distinció clau:\n';
    code += '% - \\PECTeXconfig{data={...}} emmagatzema les dades de l\'estudiant/assignatura.\n';
    code += '% - \\PECTeXcover{...} i \\PECTeXpage{...} controlen el disseny visual i geometria.\n';
    code += '% ==============================================================================\n\n';

    code += '% 1. Personalització visual de la portada institucional:\n';
    code += '\\PECTeXcover{\n';
    code += '  text-title     = {' + title + '},\n';
    code += '  text-subtitle  = {' + subtitle + '},\n';
    code += '  text-backtitle = {' + backtitle + '},\n';
    code += '  add-picture    = {' + picture + '}\n';
    code += '}\n\n';

    code += '% 2. Personalització de capçaleres i peus de pàgina:\n';
    code += '\\PECTeXpage{\n';
    code += '  header-left   = {' + hLeft + '},\n';
    code += '  header-right  = {' + hRight + '},\n';
    code += '  header-rule   = true,\n';
    code += '  footer-left   = {' + fLeft + '},\n';
    code += '  footer-center = {' + fCenter + '},\n';
    code += '  footer-rule   = false\n';
    code += '}\n\n';

    code += '% 3. Reassignació de cadenes de text i etiquetes:\n';
    code += '\\pxDEFtocname{' + strToc + '}\n';
    code += '\\pxDEFpximgname{' + strFig + '}\n';

    outputTarget.textContent = code;
  }

  // TOOL 03: DATA & MULTIPAGE TABLES
  function renderTableSnippet() {
    const type = document.getElementById('tbl-type') ? document.getElementById('tbl-type').value : 'standard';
    const style = document.getElementById('tbl-style') ? document.getElementById('tbl-style').value : 'header';
    const caption = (document.getElementById('tbl-caption') ? document.getElementById('tbl-caption').value.trim() : '') || 'Taula de Dades';
    const label = (document.getElementById('tbl-label') ? document.getElementById('tbl-label').value.trim() : '') || 'tab:dades';
    const headers = (document.getElementById('tbl-headers') ? document.getElementById('tbl-headers').value.trim() : '') || 'Columna 1, Columna 2, Columna 3';
    const rows = (document.getElementById('tbl-rows') ? document.getElementById('tbl-rows').value.trim().split('\n').filter(r => r.trim()) : ['Dada 1, Dada 2, Dada 3']);

    outputFilename.textContent = 'OUTPUT: ' + (type === 'multipage' ? 'multipage-table.tex' : 'data-table.tex');
    outputModeBadge.textContent = type.toUpperCase() + ' TABLE';

    let code = '% ==============================================================================\n';
    code += '% P3CTeX Taula Declarativa (Estil: ' + style + ', Tipus: ' + type + ')\n';
    code += '% No cal calcular amplades de columna ni posar ampersands (&) manuals.\n';
    code += '% ==============================================================================\n';

    if (type === 'standard') {
      code += '\\begin{table}[htbp]\n\\centering\n';
      code += '\\caption{' + caption + '}\n\\label{' + label + '}\n';
      code += '\\pxTable[style=' + style + ']\n';
      code += '  {' + headers + '}';
      rows.forEach(r => { code += '\n  {' + r.trim() + '}'; });
      code += '\n\\end{table}\n';
    } else if (type === 'multipage') {
      code += '% Taula multipàgina: repeteix les capçaleres automàticament en cada salt de pàgina:\n';
      code += '\\pxTBLlong*[caption={' + caption + '},label={' + label + '},style=' + style + ']\n';
      code += '  {' + headers + '}';
      rows.forEach(r => { code += '\n  {' + r.trim() + '}'; });
      code += '\n\\pxTBLlongEnd\n';
    } else {
      code += '% Taula generada recursivament a partir d\'una llista expl3:\n';
      code += '\\pxTableFromList[style=' + style + ']{' + headers + '}{\n';
      code += rows.map(r => '  {' + r.trim() + '}').join(',\n');
      code += '\n}\n';
    }

    outputTarget.textContent = code;
  }

  // TOOL 04: RESILIENT FIGURES & IMAGE LISTS
  function renderFigureSnippet() {
    const mode = document.getElementById('fig-mode') ? document.getElementById('fig-mode').value : 'single';
    const scale = (document.getElementById('fig-scale') ? document.getElementById('fig-scale').value.trim() : '') || '0.85\\linewidth';
    const path = (document.getElementById('fig-path') ? document.getElementById('fig-path').value.trim() : '') || 'img/arquitectura';
    const label = (document.getElementById('fig-label') ? document.getElementById('fig-label').value.trim() : '') || 'fig:arq';
    const caption = (document.getElementById('fig-caption') ? document.getElementById('fig-caption').value.trim() : '') || 'Diagrama del sistema';
    const promptText = (document.getElementById('fig-prompt-text') ? document.getElementById('fig-prompt-text').value.trim() : '') || 'System architecture diagram';
    const prefix = (document.getElementById('fig-prefix') ? document.getElementById('fig-prefix').value.trim() : '') || 'img/captura-';
    const captures = (document.getElementById('fig-list-captures') ? document.getElementById('fig-list-captures').value.trim().split('\n').filter(c => c.trim()) : ['Pas 1', 'Pas 2']);

    outputFilename.textContent = 'OUTPUT: resilient-figures.tex';
    outputModeBadge.textContent = 'FIGURE SNIPPET';

    let code = '% ==============================================================================\n';
    code += '% P3CTeX Figures Resilients & Llistes d\'Imatges\n';
    code += '% Garantia: mai no interromp pdflatex amb error fatal si el fitxer no existeix.\n';
    code += '% Si el fitxer no es troba, genera un requadre visual de reserva (fallback box).\n';
    code += '% ==============================================================================\n\n';

    if (mode === 'single') {
      code += '\\begin{figure}[htbp]\n\\centering\n';
      code += '\\pxImage[' + scale + ']{' + path + '}{' + caption + '}\n';
      code += '\\label{' + label + '}\n';
      code += '\\end{figure}\n';
    } else if (mode === 'prompt') {
      code += '% [IMAGE PROMPT INSTRUCTION FOR GENERATIVE ART OR DESIGNERS]\n';
      code += '% PROMPT: ' + promptText.replace(/\n/g, '\n% ') + '\n\n';
      code += '\\begin{figure}[htbp]\n\\centering\n';
      code += '\\pxImage[' + scale + ']{' + path + '}{' + caption + '}\n';
      code += '\\label{' + label + '}\n';
      code += '\\end{figure}\n';
    } else {
      code += '% Bucle automàtic de figures consecutives (\\pxIMGList):\n';
      code += '% Insereix les imatges prefixades amb numeració automàtica i peus de figura sense codi redundant:\n';
      code += '\\pxIMGList[' + scale + ']{' + prefix + '}\n';
      code += '  [Captura de la seqüència]\n';
      captures.forEach(c => {
        code += '  {' + c.trim() + '}\n';
      });
    }

    outputTarget.textContent = code;
  }

  // TOOL 05: DYNAMIC SIZING & LAYOUT
  function renderDynamicGrowSnippet() {
    const feature = document.getElementById('grow-feature') ? document.getElementById('grow-feature').value : 'grow';
    const factor = (document.getElementById('grow-factor') ? document.getElementById('grow-factor').value.trim() : '') || '1.25';
    const maxh = (document.getElementById('grow-maxh') ? document.getElementById('grow-maxh').value.trim() : '') || '0.45\\textheight';
    const content = (document.getElementById('grow-content') ? document.getElementById('grow-content').value.trim() : '') || '\\includegraphics[width=\\linewidth]{img/esquema.png}';
    const bibfile = (document.getElementById('grow-bibfile') ? document.getElementById('grow-bibfile').value.trim() : '') || 'referencies.bib';

    outputFilename.textContent = 'OUTPUT: dynamic-layout.tex';
    outputModeBadge.textContent = 'DYNAMIC LAYOUT';

    let code = '% ==============================================================================\n';
    code += '% P3CTeX Dynamic Sizing & Bounded Layout Controls\n';
    code += '% ==============================================================================\n\n';

    if (feature === 'grow') {
      code += '% \\pxGrow*[factor]{contingut}[alçada-màxima]\n';
      code += '% Escala el contingut segons el factor, però GARANTEIX que mai no superarà\n';
      code += '% l\'alçada màxima indicada, prevenint desbordaments de pàgina i orfes:\n';
      code += '\\pxGrow*[' + factor + ']{\n';
      code += '  ' + content.replace(/\n/g, '\n  ') + '\n';
      code += '}[' + maxh + ']\n';
    } else if (feature === 'box') {
      code += '% \\EXPAND i \\BOX per a disseny de caixes auto-dimensionables:\n';
      code += '\\EXPAND\n';
      code += '\\BOX{0.9\\linewidth}:{\n';
      code += '  ' + content.replace(/\n/g, '\n  ') + '\n';
      code += '};\n';
    } else if (feature === 'glossary') {
      code += '% Glossaris i acrònims sense configuracions complexes:\n';
      code += '\\makenoidxglossaries\n\n';
      code += '% Definició de termes (\\GL crea l\'entrada i la cita):\n';
      code += '\\GL{api}{Application Programming Interface}\n';
      code += '\\GL*{uoc}{Universitat Oberta de Catalunya}\n\n';
      code += '% Imprimir el glossari al final del document:\n';
      code += '\\printnoidxglossaries\n';
    } else {
      code += '% Bibliografia unificada amb auto-detecció de motor:\n';
      code += '\\pxBib[numeric]{' + bibfile + '}\n';
    }

    outputTarget.textContent = code;
  }

  // TOOL 06: CODE LISTINGS
  function renderCodeSnippet() {
    const mode = document.getElementById('code-mode') ? document.getElementById('code-mode').value : 'inline';
    const lang = document.getElementById('code-lang') ? document.getElementById('code-lang').value : 'Java';
    const caption = (document.getElementById('code-caption') ? document.getElementById('code-caption').value.trim() : '') || 'Lexer.java';
    const range = (document.getElementById('code-range') ? document.getElementById('code-range').value.trim() : '') || '15-45';
    const body = (document.getElementById('code-body') ? document.getElementById('code-body').value : '');

    outputFilename.textContent = 'OUTPUT: code-listing.tex';
    outputModeBadge.textContent = 'CODE LISTING';

    let code = '% ==============================================================================\n';
    code += '% Bloc de codi font P3CTeX (Estil Darcula, Ressaltat de Sintaxi)\n';
    code += '% Inclòs a la suite principal de P3CTeX\n';
    code += '% ==============================================================================\n';

    if (mode === 'inline') {
      code += '\\begin{pxCode}[language=' + lang + ']{' + caption + '}\n';
      code += body;
      code += '\n\\end{pxCode}\n';
    } else if (mode === 'file') {
      code += '% Inclusió d\'un fitxer de codi font extern amb numeració de línies:\n';
      code += '\\pxCodeFile[language=' + lang + ']{' + caption + '}\n';
    } else {
      code += '% Inclusió d\'un rang de línies específic d\'un fitxer extern:\n';
      code += '\\pxCodeFileInput[language=' + lang + '][' + range + ']{' + caption + '}\n';
    }

    outputTarget.textContent = code;
  }

  // TOOL 07: UML ARCHITECTURE
  function renderUmlSnippet() {
    const classname = (document.getElementById('uml-classname') ? document.getElementById('uml-classname').value.trim() : '') || 'Usuari';
    const type = document.getElementById('uml-type') ? document.getElementById('uml-type').value : 'class';
    const outputKind = document.getElementById('uml-output-kind') ? document.getElementById('uml-output-kind').value : 'both';
    const attrsRaw = document.getElementById('uml-attrs') ? document.getElementById('uml-attrs').value.trim().split('\n').filter(a => a.trim()) : ['- id : String', '- email : String'];
    const opsRaw = document.getElementById('uml-ops') ? document.getElementById('uml-ops').value.trim().split('\n').filter(o => o.trim()) : ['+ autenticar() : boolean'];

    outputFilename.textContent = 'OUTPUT: uml-architecture.tex';
    outputModeBadge.textContent = 'UML ARCHITECTURE';

    let code = '% ==============================================================================\n';
    code += '% Especificació UML P3CTeX (Single Source of Truth)\n';
    code += '% Es defineix la classe una única vegada: es pot dibuixar el diagrama i generar\n';
    code += '% automàticament les taules descriptives d\'atributs i operacions per a la memòria.\n';
    code += '% ==============================================================================\n\n';

    code += '% 1. Definició de la classe (font única de dades):\n';
    code += '\\pxUMLClass[' + type + ']{' + classname + '}{\n';
    code += attrsRaw.map(a => '  ' + a).join(' \\\\\n');
    code += '\n}{\n';
    code += opsRaw.map(o => '  ' + o).join(' \\\\\n');
    code += '\n}\n\n';

    if (outputKind === 'both' || outputKind === 'diagram') {
      code += '% 2. Dibuix del diagrama visual TikZ:\n';
      code += '\\begin{tikzpicture}\n';
      code += '\\drawclass{' + classname + '}[0,0]\n';
      code += '\\end{tikzpicture}\n\n';
    }

    if (outputKind === 'both' || outputKind === 'spec') {
      code += '% 3. Taules documentals per a la memòria tècnica (sense duplicar text):\n';
      code += '\\subsubsection{Atributs de la classe ' + classname + '}\n';
      code += '\\printAttributes{' + classname + '}\n\n';
      code += '\\subsubsection{Operacions de la classe ' + classname + '}\n';
      code += '\\printOperations{' + classname + '}\n';
    }

    outputTarget.textContent = code;
  }

  // TOOL 08: GANTT TIMELINE
  function renderGanttSnippet() {
    const start = (document.getElementById('gnt-start') ? document.getElementById('gnt-start').value.trim() : '') || '01/03/2026';
    const end = (document.getElementById('gnt-end') ? document.getElementById('gnt-end').value.trim() : '') || '30/06/2026';
    const block = (document.getElementById('gnt-block') ? document.getElementById('gnt-block').value.trim() : '') || '28';
    const tasks = document.getElementById('gnt-tasks') ? document.getElementById('gnt-tasks').value.trim().split('\n').filter(t => t.trim()) : [];

    outputFilename.textContent = 'OUTPUT: gantt-timeline.tex';
    outputModeBadge.textContent = 'TIMELINE SNIPPET';

    let code = '% ==============================================================================\n';
    code += '% Cronograma Gantt diari amb resolució per calendari (P3CTeX)\n';
    code += '% Requereix \\documentclass[GNT,...]{P3CTeX} o \\usepackage{pxGNT}\n';
    code += '% ==============================================================================\n';
    code += '\\pxGantt{start=' + start + ',end=' + end + ',days-per-block=' + block + '}\n';

    tasks.forEach(task => {
      const parts = task.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        code += '\\pxGanttItem{' + parts[0] + '}{' + parts[1] + '}{' + parts[2] + '}\n';
      } else if (parts.length === 2) {
        code += '\\pxGanttItem{' + parts[0] + '}{' + parts[1] + '}{' + parts[1] + '}\n';
      } else {
        code += '\\pxGanttItem{' + task + '}{' + start + '}{' + end + '}\n';
      }
    });

    code += '\\pxGanttEnd\n';
    outputTarget.textContent = code;
  }

  // TOOL 09: COMPILERS & AUTOMATA
  function renderCompilerSnippet() {
    const type = document.getElementById('cmp-type') ? document.getElementById('cmp-type').value : 'tombstone';
    const prog = (document.getElementById('cmp-prog') ? document.getElementById('cmp-prog').value.trim() : '') || 'Programa';
    const src = (document.getElementById('cmp-source') ? document.getElementById('cmp-source').value.trim() : '') || 'Java';
    const tgt = (document.getElementById('cmp-target') ? document.getElementById('cmp-target').value.trim() : '') || 'Bytecode';
    const impl = (document.getElementById('cmp-impl') ? document.getElementById('cmp-impl').value.trim() : '') || 'JVM';

    const cmpInputs = document.getElementById('cmp-tombstone-inputs');
    const progField = document.getElementById('cmp-prog') ? document.getElementById('cmp-prog').closest('.input-field') : null;
    if (cmpInputs) cmpInputs.style.display = (type === 'tombstone' || type === 'tcompiler' || type === 'chain') ? 'block' : 'none';
    if (progField) progField.style.display = (type === 'tombstone' || type === 'tcompiler') ? 'block' : 'none';

    outputFilename.textContent = 'OUTPUT: compiler-diagram.tex';
    outputModeBadge.textContent = 'COMPILER SNIPPET';

    let code = '% ==============================================================================\n';
    code += '% Diagrames per a Compiladors i Teoria de la Computació (P3CTeX)\n';
    code += '% Requereix \\documentclass[CMP,...]{P3CTeX} o \\usepackage{pxCMP}\n';
    code += '% ==============================================================================\n';

    if (type === 'tombstone') {
      code += '% Compilació completa d\'un programa amb peça Tombstone en T:\n';
      code += '\\pxTombstoneCompile[title={Compilació de ' + prog + '}]{' + prog + '}{' + src + '}{' + tgt + '}{' + impl + '}\n';
    } else if (type === 'tcompiler') {
      code += '% Peces Tombstone individuals (Compilador, Programa, Màquina):\n';
      code += '\\pxTCompiler{' + src + '}{' + tgt + '}{' + impl + '}\n';
      code += '\\pxTProgram{' + prog + '}{' + src + '}\n';
      code += '\\pxTMachine{' + impl + '}\n';
    } else if (type === 'chain') {
      code += '% Canonada de compilació multi-etapa:\n';
      code += '\\pxTombstoneChain{\n  {Frontend, ' + src + ', IR, ' + impl + '},\n  {Backend, IR, ' + tgt + ', ' + impl + '}\n}\n';
    } else if (type === 'dfa') {
      code += '% Taula de transicions per a autòmats finits (DFA/NFA):\n';
      code += '\\pxTransitionTable{\n  state, 0, 1;\n  q0, q1, q0;\n  q1, q0, q1\n}\n';
    } else if (type === 'bnf') {
      code += '% Produccions gramaticals formals en BNF:\n';
      code += '\\pxBNF{\n  <expressio> ::= <terme> ("+" <terme> | "-" <terme>)* ;\n  <terme>     ::= <factor> ("*" <factor> | "/" <factor>)* ;\n  <factor>    ::= <ident> | <num> | "(" <expressio> ")\n}\n';
    }

    outputTarget.textContent = code;
  }

  // TOOL 10: ANNEXES & MODULAR SLICING
  function renderAnnexesSnippet() {
    const kind = document.getElementById('annex-kind') ? document.getElementById('annex-kind').value : 'slicing';
    const docid = (document.getElementById('annex-docid') ? document.getElementById('annex-docid').value.trim() : '') || 'pr1';
    const sourcefile = (document.getElementById('annex-sourcefile') ? document.getElementById('annex-sourcefile').value.trim() : '') || 'entregues/PR1-memoria.tex';
    const tagname = (document.getElementById('annex-tagname') ? document.getElementById('annex-tagname').value.trim() : '') || 'analisi-requeriments';
    const advisor = (document.getElementById('annex-advisor') ? document.getElementById('annex-advisor').value.trim() : '') || 'Dra. Maria Farré';
    const year = (document.getElementById('annex-academic-year') ? document.getElementById('annex-academic-year').value.trim() : '') || '2025/2026';

    outputFilename.textContent = 'OUTPUT: ' + (kind === 'slicing' ? 'modular-slicing.tex' : 'annexes-tfg.tex');
    outputModeBadge.textContent = 'MODULAR SLICING';

    let code = '% ==============================================================================\n';
    code += '% P3CTeX Modular Slicing, Annexes & TFG Frontmatter\n';
    code += '% ==============================================================================\n\n';

    if (kind === 'slicing') {
      code += '% Slicing modular entre documents (%<*tag>):\n';
      code += '% Permet reutilitzar seccions de PACs o PRs anteriors sense duplicar codi:\n\n';
      code += '% 1. Registrar el fitxer font extern:\n';
      code += '\\pxMEMsource{' + docid + '}{' + sourcefile + '}\n\n';
      code += '% 2. Incloure exclusivament el fragment delimitat per %<*' + tagname + '>:\n';
      code += '\\pxMEMinclude{' + docid + '}{' + tagname + '}\n';
    } else if (kind === 'annex') {
      code += '% Annexos formals amb lletres (Annex A, Annex B...):\n';
      code += '\\appendix\n\n';
      code += '\\pxMEMannex{Resultats de les Proves de Càrrega}\n';
      code += 'Contingut detallat de les proves de rendiment...\n\n';
      code += '\\pxMEMannex{Llistat Complet de la Configuració}\n';
      code += 'Especificacions addicionals del desplegament...\n';
    } else {
      code += '% Fitxa oficial de Treball Final de Grau (TFG) i resums bilingües:\n';
      code += '\\pxTFGworkcard{\n';
      code += '  title    = {\\caFullname},\n';
      code += '  student  = {\\student},\n';
      code += '  advisor  = {' + advisor + '},\n';
      code += '  degree   = {\\grade},\n';
      code += '  year     = {' + year + '}\n';
      code += '}\n\n';
      code += '\\pxTFGabstract{cat}{\n';
      code += '  Aquest Treball Final de Grau presenta el disseny i implementació...\n';
      code += '}\n\n';
      code += '\\pxTFGabstract{en}{\n';
      code += '  This Bachelor\'s Thesis presents the design and implementation...\n';
      code += '}\n';
    }

    outputTarget.textContent = code;
  }

  // 6. Copy Actions
  function copyOutput(btn) {
    const text = outputTarget.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<span>COPIED!</span>';
      setTimeout(() => { btn.innerHTML = original; }, 1800);
    }).catch(err => console.error('Copy failed:', err));
  }

  if (btnCopyMain) btnCopyMain.addEventListener('click', () => copyOutput(btnCopyMain));
  if (btnCopyPane) btnCopyPane.addEventListener('click', () => copyOutput(btnCopyPane));

  // 7. Download Actions
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

  if (btnDownloadMain) btnDownloadMain.addEventListener('click', downloadOutput);
  if (btnDownloadPane) btnDownloadPane.addEventListener('click', downloadOutput);

  // Initial render & URL hash support
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const target = 'tool-' + hash;
    if (document.getElementById(target)) activateTool(target);
    else renderActiveTool();
  } else {
    renderActiveTool();
  }
});
