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
%% \PECTeXconfig{<key=value,...>}
%% Apply P3CTeX class keys after loading; accepts the same keys as the P3CTeX key family.
%% #1 - comma-separated class configuration.
\NewDocumentCommand{\PECTeXconfig}{+m}{\keys_set:nn {P3CTeX}{#1}}
%% \PECTeXprintCover*
%% Print the configured pxGDX cover and start the following content on a new page.
%% * - enable the no-plagiarism text in the cover before rendering.
\NewDocumentCommand{\PECTeXprintCover}{s}{
	\setcounter{page}{0}
	\IfBooleanT{#1}{\pxGDX_cover_config:n{noplagi}}
	\pxGDX_print_cover:\clearpage
}
%% \PECTeXprintTOC*
%% Print the table of contents and clear the page afterwards.
%% * - print the no-plagiarism declaration immediately before the TOC.
\NewDocumentCommand{\PECTeXprintTOC}{s}{
	\IfBooleanT{#1}{\par\noindent\pxDEFnoplagi{\l__gdx_cover_author_tl}\par\__pxDEV_HRule:}
	\tableofcontents\clearpage
}
%% \pxGDXconfig{<pxGDX keys>}
%% Direct access to the pxGDX dispatcher; use nested cover-config/page-config/pdf-config keys as needed.
%% #1 - pxGDX key list.
\DeclareDocumentCommand\pxGDXconfig{ +m } {\pxGDX_config:n{ #1 }}
%% \PECTeXcover{<gdxCOVER keys>}
%% Configure cover-only pxGDX keys.
%% #1 - gdxCOVER key list.
\DeclareDocumentCommand\PECTeXcover{ +m } {\pxGDX_config:n{ cover-config={ #1 }}}
%% \PECTeXpage{<gdxSTYLE keys>}
%% Configure running-page header/footer metadata and layout.
%% #1 - gdxSTYLE key list.
\DeclareDocumentCommand\PECTeXpage{ +m } {\pxGDX_config:n{ page-config={ #1 }}}
%% \PECTeXpdf{<gdxPDF keys>}
%% Configure PDF metadata and hyperlink colours.
%% #1 - gdxPDF key list.
\DeclareDocumentCommand\PECTeXpdf{ +m } {\pxGDX_config:n{ pdf-config={ #1 }}}
% pxGrow: Resizes content to fit especified width
% #1[*] align left
% #2[]box width
% #3 text content
% #4 max text width
%% \pxGrow*[<width factor>]{<content>}[<max height>]
%% Scale content to the requested fraction of \linewidth, limiting height when necessary.
%% * - left-align the result; unstarred form inserts flexible space before it.
%% #1 - width factor relative to \linewidth (default 1).
%% #2 - content to scale.
%% #3 - maximum permitted height (default 42pt).
\NewDocumentCommand{\pxGrow}{ s O{1} m O{42pt} }{\__pxgdx_grow:nnnn {#1}{#2}{#3}{#4}}
% pxFill: Fills Horizontal space
%% \pxFill
%% Insert stretchable horizontal space.
\NewDocumentCommand{\pxFill}{}{	\__pxgdx_hfill:	}
%% \pxCenter{<content>}
%% Center arbitrary inline content using flexible space on both sides.
%% #1 - content to center.
\NewDocumentCommand{\pxCenter}{m}{\pxFill#1\pxFill}
% legacy uoc sections comands
%% \sectionuoc{<title>} / \subsectionuoc{<title>} / \subsubsectionuoc{<title>}
%% Legacy UOC-coloured section wrappers; \sectionuoc also starts a new page.
%% #1 - section title.
\NewDocumentCommand{\sectionuoc}{ m }{\__px_sectionuoc:n {#1}}
\NewDocumentCommand{\subsectionuoc}{ m }{\__px_subsectionuoc:n {#1}}
\NewDocumentCommand{\subsubsectionuoc}{ m }{\__px_subsubsectionuoc:n {#1}}
% Horizontal rules
%% \pxHRule*[<width>]
%% Draw a horizontal rule using the thick (*) or thin (unstarred) pxGDX rule helper.
%% * - select 1.5pt thickness instead of 0.75pt.
%% #1 - optional rule width; defaults to \linewidth.
\NewDocumentCommand{\pxHRule}{s o}{
	\IfNoValueTF{#2}{\IfBooleanTF{#1}{\__pxDEV_HRule:}{\__pxDEV_Hrule:}}
		{\IfBooleanTF{#1}{\__pxDEV_HRule:n{#2}}{\__pxDEV_Hrule:n{#2}}}
}
%% \pxPageRule*
%% Draw an 80%-text-width rule centered on the page and terminate the line.
%% * - select the thick rule variant.
\NewDocumentCommand{\pxPageRule}{s}{
	\IfBooleanTF{#1}{\hspace*{.1\textwidth} \pxHRule[.8\textwidth]\\}
		{\hspace*{.1\textwidth} \pxHrule[.8\textwidth]\\}
}
%% AUTO LOAD COVER AND TOC
\AtEndOfClass{
	\__ifglossary:nn{
		\makenoidxglossaries
%% \GL*{<glossary label>}
%% Glossary shorthand created only when glossary support is enabled.
%% * - print the long acronym form; unstarred prints the short form.
%% #1 - glossary/acronym label.
		\NewDocumentCommand{\GL}{s m}{\IfBooleanTF{#1}{\acrlong{#2} }{\acrshort{#2} } }
	}{}
	\__ifpreamble:nn{\input{\tl_use:N \l__pxdoc_preamblepath_tl}}{}
}
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
\AtEndDocument{
%	\glsaddall

	\__ifglossary:nn{
		\clearpage
		\addcontentsline{toc}{section}{Glossari}
		\printnoidxglossary[type=\acronymtype,title=\hspace*{\fill}Acrònims\hspace*{\fill}]
		\printnoidxglossary[title=\hspace*{\fill}Definicions\hspace*{\fill}]
	}{}
%	\__ifbibliography:nn{
%		\pxBib{ \l__pxdoc_bibpath_tl }
%	}{}
}
%% \PECTeX
%% Typeset the stylised P3CTeX project logo/name.
\def\PECTeX{P\kern-.1ex\raise0.6ex\hbox{\resizebox{1ex}{1ex}{3}}\kern-.3ex\raise-0.5ex\hbox{C}\kern-.4ex\TeX\kern1ex }
%\makeatletter
%\def\pxBib#1{
%	\newpage
%	\nocite{*}
%	\addcontentsline{toc}{section}{Referències}
%	\bibliographystyle{abbrvnat}
%	\bibliography{ #1 }
%}
%\makeatother