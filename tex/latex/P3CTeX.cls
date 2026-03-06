% !TeX encoding = UTF-8
% !TeX spellcheck = en_EN-EnglishUnitedKingdom
%% =======================================================
%%  	P3C.TeX  			v0.3
%%		SCVRIA SOFWARE		Ultimate UOC PEC Repository
%% =======================================================
%%  This file is part of the P3CTeX project.
%%
%%  Author: Scvria
%%  File: P3CTeX.cls
%%  Version: v0.5 (02/2026)
%%  Description:
%%    Main document class for UOC assignments and projects.
%%    - Owns page layout, typography and global document behaviour.
%%    - Owns student / subject / activity metadata and language selection.
%%    - Delegates feature libraries (UML, property maps, etc.) to pxCORE.
%%
%%  Architectural role:
%%    - P3CTeX.cls never loads standalone libraries (pxUML, pxPRP, ...) directly.
%%      It only talks to the aggregation package `pxCORE` via package options.
%%    - All user-level interfaces that are document-wide (covers, TOC, metadata)
%%      are defined here as LaTeX2e commands.
%%    - expl3 implementation details live in dedicated *.code.tex files or
%%      in library packages; this class only orchestrates them.
%%
%%  This file may be distributed and/or modified:
%%
%%   1. under the LaTeX Project Public License and/or
%%   2. under the GNU Public License.
%%
%%   See the file doc/LICENSE for more details.
%% =======================================================
\RequirePackage[utf8]{inputenc}
\RequirePackage{expl3}
\RequirePackage{color,l3keys2e,xparse}
\NeedsTeXFormat{LaTeX2e}
\ProvidesExplClass{P3CTeX}{2026/02/25}{v0.5}
{
	Ultimate Open Source LaTeX repository based on official LaTeX styles defined by UOC
	Provides a professional and convenient environment for UOC students. By Scvria Sofware
}

\LoadClass{article} % Base class
\RequirePackage{arev} % Fonts
\file_input:n {P3CTeX.code.tex} % Input expl3 code
%% =================================
%% ===== PCKG PUBLIC LaTeX2e API ===
%% =================================
\NewDocumentCommand{\PECTeXconfig}{+m}{\keys_set:nn {P3CTeX}{#1}}
\NewDocumentCommand{\PECTeXprintCover}{s}{
	\setcounter{page}{0}
	\IfBooleanT{#1}{\pxGDX_cover_config:n{noplagi}}
	\pxGDX_print_cover:\clearpage
}
\NewDocumentCommand{\PECTeXprintTOC}{s}{
	\IfBooleanT{#1}{\par\noindent\pxDEFnoplagi{\l__gdx_cover_author_tl}\par\__pxDEV_HRule:}
	\tableofcontents\clearpage
}
\DeclareDocumentCommand\pxGDXconfig{ +m } {\pxGDX_config:n{ #1 }}
\DeclareDocumentCommand\PECTeXcover{ +m } {\pxGDX_config:n{ cover-config={ #1 }}}
\DeclareDocumentCommand\PECTeXpage{ +m } {\pxGDX_config:n{ page-config={ #1 }}}
\DeclareDocumentCommand\PECTeXpdf{ +m } {\pxGDX_config:n{ pdf-config={ #1 }}}
% pxGrow: Resizes content to fit especified width
% #1[*] align left
% #2[]box width
% #3 text content
% #4 max text width
\NewDocumentCommand{\pxGrow}{ s O{1} m O{42pt} }{\__pxgdx_grow:nnnn {#1}{#2}{#3}{#4}}
% pxFill: Fills Horizontal space
\NewDocumentCommand{\pxFill}{}{	\__pxgdx_hfill:	}
% legacy uoc sections comands
\NewDocumentCommand{\sectionuoc}{ m }{\__px_sectionuoc:n {#1}}
\NewDocumentCommand{\subsectionuoc}{ m }{\__px_subsectionuoc:n {#1}}
\NewDocumentCommand{\subsubsectionuoc}{ m }{\__px_subsubsectionuoc:n {#1}}
% Horizontal rules
\NewDocumentCommand{\pxHRule}{s o}{
	\IfNoValueTF{#2}{\IfBooleanTF{#1}{\__pxDEV_HRule:}{\__pxDEV_Hrule:}}
		{\IfBooleanTF{#1}{\__pxDEV_HRule:n{#2}}{\__pxDEV_Hrule:n{#2}}}
}
\NewDocumentCommand{\pxPageRule}{s}{
	\IfBooleanTF{#1}{\hspace*{.1\textwidth} \pxHRule[.8\textwidth]\\}
		{\hspace*{.1\textwidth} \pxHrule[.8\textwidth]\\}
}
%% AUTO LOAD COVER AND TOC
\AfterBeginDocument{
	\__ifcover:nn{
		\__ifplagi:nn{\PECTeXprintCover*}{\PECTeXprintCover}
		\__iftoc:nn{\PECTeXprintTOC}{}
	}{
		\__ifplagi:nn{
			\__iftoc:nn{\PECTeXprintTOC*}{\par\noindent\pxDEFnoplagi{\l__gdx_cover_author_tl}\par \__pxDEV_HRule:}{}
		}{\__iftoc:nn{\PECTeXprintTOC}{}}
	}
}

\def\PECTeX{P\kern-.1ex\raise0.6ex\hbox{\resizebox{1ex}{1ex}{3}}\kern-.3ex\raise-0.5ex\hbox{C}\kern-.4ex\TeX\kern1ex }
