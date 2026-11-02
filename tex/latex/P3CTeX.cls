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
% TFG and MEM may register class-owned presentation hooks while class
% options are being processed; ordinary PAC/PR documents leave them empty.
\NewHook{P3CTeX/before-toc}
\NewHook{P3CTeX/after-toc}

% Glossaries are optional and owned by the class, not by a combined endmatter manager.
\bool_new:N \l__pxdoc_glossary_manual_bool
\bool_new:N \l__pxdoc_glossary_all_bool
\bool_new:N \l__pxdoc_glossary_toc_bool
\bool_new:N \l__pxdoc_glossary_terms_bool
\bool_new:N \l__pxdoc_glossary_acronyms_bool
\tl_new:N \l__pxdoc_glossary_type_tl
\tl_new:N \l__pxdoc_glossary_short_tl
\tl_new:N \l__pxdoc_glossary_long_tl
\tl_new:N \l__pxdoc_glossary_entry_options_tl
\prop_new:N \g__pxdoc_glossary_printed_prop
\keys_define:nn {P3CTeX/glossary}
  {
    print .choice:,
    print / manual .code:n = {\bool_set_true:N \l__pxdoc_glossary_manual_bool},
    print / auto .code:n = {\bool_set_false:N \l__pxdoc_glossary_manual_bool},
    print .initial:n = auto,
    include .choice:,
    include / used .code:n = {\bool_set_false:N \l__pxdoc_glossary_all_bool},
    include / all .code:n = {\bool_set_true:N \l__pxdoc_glossary_all_bool},
    include .initial:n = used,
    terms .bool_set:N = \l__pxdoc_glossary_terms_bool,
    terms .initial:n = true,
    acronyms .bool_set:N = \l__pxdoc_glossary_acronyms_bool,
    acronyms .initial:n = true,
    toc .bool_set:N = \l__pxdoc_glossary_toc_bool,
    toc .initial:n = true,
    type .tl_set:N = \l__pxdoc_glossary_type_tl
  }
\keys_define:nn {P3CTeX/glossary/acronym}
  {
    short .tl_set:N = \l__pxdoc_glossary_short_tl,
    long .tl_set:N = \l__pxdoc_glossary_long_tl,
    unknown .code:n = {\tl_put_right:Nx \l__pxdoc_glossary_entry_options_tl
      {\l_keys_key_str={\exp_not:n {#1}},}}
  }
\cs_new_protected:Npn \__pxdoc_glossary_missing_entry:n #1
  {\PackageError{P3CTeX}{Glossary entry '#1' needs fields}{}}
\cs_new_protected:Npn \__pxdoc_glossary_term:nn #1#2
  {\newglossaryentry{#1}{#2}}
\cs_new_protected:Npn \__pxdoc_acronym_entry:nn #1#2
  {
    \group_begin:
    \tl_clear:N \l__pxdoc_glossary_short_tl
    \tl_clear:N \l__pxdoc_glossary_long_tl
    \tl_clear:N \l__pxdoc_glossary_entry_options_tl
    \keys_set:nn {P3CTeX/glossary/acronym}{#2}
    \bool_lazy_or:nnTF
      {\tl_if_blank_p:V \l__pxdoc_glossary_short_tl}
      {\tl_if_blank_p:V \l__pxdoc_glossary_long_tl}
      {\PackageError{P3CTeX}{Acronym '#1' needs short and long fields}{}}
      {\use:x {\exp_not:N \newacronym[\exp_not:V \l__pxdoc_glossary_entry_options_tl]
        {\exp_not:n {#1}}{\exp_not:V \l__pxdoc_glossary_short_tl}
        {\exp_not:V \l__pxdoc_glossary_long_tl}}}
    \group_end:
  }
\cs_new_protected:Npn \__pxdoc_glossary_print_type:n #1
  {
    \prop_if_in:NnF \g__pxdoc_glossary_printed_prop {#1}
      {
        \group_begin:
        \bool_if:NT \l__pxdoc_glossary_all_bool {\glsaddall[types={#1}]}
        \bool_if:NTF \l__pxdoc_glossary_toc_bool {\glstoctrue}{\glstocfalse}
        \str_if_eq:nnTF {#1}{acronym}
          {\tl_set:Nn \l_tmpa_tl {\pxDEFacronymname}}
          {\tl_set:Nn \l_tmpa_tl {\pxDEFglossaryname}}
        \tl_if_eq:NnTF \l__pxdoc_glossary_backend_tl {external}
          {\printglossary[type={#1},title={\l_tmpa_tl}]}
          {\printnoidxglossary[type={#1},title={\l_tmpa_tl}]}
        \prop_gput:Nnn \g__pxdoc_glossary_printed_prop {#1}{true}
        \group_end:
      }
  }
\cs_new_protected:Npn \__pxdoc_glossary_print_all:
  {
    \bool_if:NT \l__pxdoc_glossary_acronyms_bool
      {\__pxdoc_glossary_print_type:n {acronym}}
    \bool_if:NT \l__pxdoc_glossary_terms_bool
      {\__pxdoc_glossary_print_type:n {main}}
  }

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
	\UseHook{P3CTeX/before-toc}
	\IfBooleanT{#1}{\par\noindent\pxDEFnoplagi{\l__gdx_cover_author_tl}\par\__pxDEV_HRule:}
	\tableofcontents\clearpage
	\UseHook{P3CTeX/after-toc}
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
	\IfBooleanTF{#1}{\hspace*{.1\textwidth} \pxHRule*[.8\textwidth]\\}
		{\hspace*{.1\textwidth} \pxHRule[.8\textwidth]\\}
}
%% AUTO LOAD COVER AND TOC
\AtEndOfClass{
	\__ifglossary:nn{
        \tl_if_eq:NnTF \l__pxdoc_glossary_backend_tl {external}
          {\makeglossaries}{\makenoidxglossaries}
%% \GL*{<glossary label>}
%% Glossary shorthand created only when glossary support is enabled.
%% * - print the long acronym form; unstarred prints the short form.
%% #1 - glossary/acronym label.
		\NewDocumentCommand{\GL}{s m}{\IfBooleanTF{#1}{\acrlong{#2} }{\acrshort{#2} } }

        % Native glossary entry model; these commands exist only with glossary enabled.
        \NewDocumentCommand\pxGlossarySetup{m}
          {\keys_set:nn {P3CTeX/glossary}{#1}}
        \NewDocumentCommand\pxGlossaryFile{m}{\file_input:n {#1}}
        \NewDocumentCommand\pxAcronym{O{} m m m}
          {\newacronym[#1]{#2}{#3}{#4}}
        \NewDocumentCommand\pxTerm{O{} m m +m}
          {\newglossaryentry{#2}{name={#3},description={#4},#1}}
        \NewDocumentCommand\pxTerms{+m}
          {\keyval_parse:NNn \__pxdoc_glossary_missing_entry:n
             \__pxdoc_glossary_term:nn {#1}}
        \NewDocumentCommand\pxAcronyms{+m}
          {\keyval_parse:NNn \__pxdoc_glossary_missing_entry:n
             \__pxdoc_acronym_entry:nn {#1}}
        \NewDocumentCommand\pxPrintGlossary{O{}}
          {\group_begin:
           \tl_set:Nn \l__pxdoc_glossary_type_tl {main}
           \keys_set:nn {P3CTeX/glossary}{#1}
           \exp_args:NV \__pxdoc_glossary_print_type:n \l__pxdoc_glossary_type_tl
           \group_end:}
        \NewDocumentCommand\pxPrintGlossaries{O{}}
          {\group_begin:\keys_set:nn {P3CTeX/glossary}{#1}
           \__pxdoc_glossary_print_all:\group_end:}

	}{}
	\__ifpreamble:nn{\input{\tl_use:N \l__pxdoc_preamblepath_tl}}{}
}
\AfterBeginDocument{
	\__ifcover:nn{
		\__ifplagi:nn{\PECTeXprintCover*}{\PECTeXprintCover}
		\__iftoc:nn{\PECTeXprintTOC}{\UseHook{P3CTeX/before-toc}}
	}{
		\__ifplagi:nn{
			\__iftoc:nn{\PECTeXprintTOC*}{\UseHook{P3CTeX/before-toc}\par\noindent\pxDEFnoplagi{\l__gdx_cover_author_tl}\par \__pxDEV_HRule:}{}
		}{\__iftoc:nn{\PECTeXprintTOC}{\UseHook{P3CTeX/before-toc}}}
	}
}
\AtEndDocument{
  \__ifglossary:nn
    {\bool_if:NF \l__pxdoc_glossary_manual_bool
      {\clearpage\__pxdoc_glossary_print_all:}}
    {}
}
% Simple BibTeX convenience; \cite and \bibliography remain native and optional.
\NewDocumentCommand\pxBibliography{O{plain} m}
  {\bibliographystyle{#1}\bibliography{#2}}

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