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
%%  Version: v0.5 (03/2025)
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
\ProvidesExplClass{P3CTeX}{2025/03/07}{v0.5}{Ultimate LaTeX Package for UOC students by Scvria (LaTeX3 refactor)}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%    	--	OTHER PCKG IMPORT		--		%%%
%%BEGIN_FOLD%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\LoadClass{article}

% Fonts
\RequirePackage{arev}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%ENDFOLD%%%%%
%%%    	--	CLASS KEYS DEFINITION	--		%%%
%%BEGIN_FOLD%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\bool_new:N \l_pxdoc_language_bool
\bool_set_false:N \l_pxdoc_language_bool
\AtEndOfClass{
}
\keys_define:nn {P3CTeX}
{
	cover 			.bool_set:N 	=		\l_pxdoc_usecover_bool,
	cover 			.initial:n 		= 		false,
	cover 			.default:n 		= 		true,
	no-cover		.meta:n 		= 	{ 	cover ={ false }},
	toc 			.bool_set:N 	=		\l_pxdoc_usetoc_bool,
	toc 			.initial:n 		= 		false,
	toc 			.default:n 		= 		true,
	no-toc			.meta:n 		= 	{ 	toc ={ false }},
	CA				.meta:n			=	{	cover = {false}, toc ={ true }, en},
	PAC				.meta:n			=	{	cover = {false}, toc ={ true }, cat},
	PEC				.meta:n			=	{	cover = {false}, toc ={ true }, es},
	PR				.meta:n			=	{	cover = {true}, toc ={ true }	},
	help			.meta:n			=	{	cover = {true}, toc ={ true },en, data={help}},
	fake			.meta:n			=	{	cover = {true}, toc ={ true },en, data={example}},
	EN				.meta:n			=	{	en	},
	ES				.meta:n			=	{	es	},
	CAT				.meta:n			=	{	cat	},
	cat	.code		={
		\RequirePackage[catalan]{babel}
		\bool_set_true:N \l_pxdoc_language_bool
	},
	es	.code		={
		\RequirePackage[spanish]{babel}
		\bool_set_true:N \l_pxdoc_language_bool
		\_pxcore_set_language_spanish
	},
	en	.code		={
		\RequirePackage[english]{babel}
		\bool_set_true:N \l_pxdoc_language_bool
		\_pxcore_set_language_english
	},
	data 			.code:n	 			= 	{	\keys_set:nn { P3CTeX/data } {#1}	},
	debug 				.bool_set:N 		=		\l_pxcore_debug_bool,
		debug 				.initial:n 		= 		false,
		debug 				.default:n 		= 		true,
	print-doc 			.bool_set:N 		=		\l_pxcore_pxdoc_use_bool,
		print-doc			.initial:n 		= 		false,
		print-doc			.default:n 		= 		true,
	unknown 			.tl_set:N	 		= 	\l__pxdoc_unknown_tl
}
\keys_define:nn { P3CTeX / data}
{
	student				.tl_set:N 		=		\l__pxdata_student_tl,
		student			.initial:n		=	{Nom~Alumne},
	grade				.tl_set:N		=		\l__pxdata_course_tl,
		grade			.initial:n		=	{Nom~de~la~Titulació},
	subj-fullname		.tl_set:N		=		\l__pxdata_subj_name_tl,
		subj-fullname	.initial:n		=	{Nom de la Assignatura},
	subj-shortname		.tl_set:N		=		\l__pxdata_subj_short_tl,
		subj-shortname	.initial:n 		=	{NmAsg},
	subj-code			.tl_set:N		=		\l__pxdata_subj_code_tl,
		subj-code		.initial:n		=	{codiAsg},
	ca-fullname			.tl_set:N		=		\l__pxdata_activity_tl,
		ca-fullname		.initial:n		=	{Nom de l'activitat},
	ca-shortname		.tl_set:N 		=		\l__pxdata_act_short_tl,
		ca-shortname	.initial:n		=	{NmAct},
	date 				.tl_set:N		=		\l__px_date_tl,
	date 			.initial:n		=	{\today},
	example			.meta:n	={
		student = {Vladimir~Scoriae},
		grade = {Software~Engineering~Degree},
		subj-fullname	= {Pràctiques~de~Procrastinació-Avançada~en~\LaTeX},
		subj-shortname = {PPAL},
		subj-code = {01312},
		ca-fullname = {Repte~1:~Introducció~a~\texttt{xpl3} },
		ca-shortname = {PAC1},
		date = {1~de~Gener~de~1970}
	},
	help	.meta:n	={
		student = {student},
		grade = {grade},
		subj-fullname	= {subj-fullname},
		subj-shortname = {subj-shortname},
		subj-code = {subj-code},
		ca-fullname = {ca-fullname},
		ca-shortname = {ca-shortname},
		date = {date}
	},
	load-data		.code:n	={
	}

}
\file_input:n {pxTXT.code.tex}
\ProcessKeysOptions{P3CTeX}
\bool_if:NF  \l_pxdoc_language_bool {
	\RequirePackage[catalan]{babel}
}
\file_input:n {pxGDX.code.tex}
\RequirePackage[\l__pxdoc_unknown_tl]{pxCORE}
\pxGDX_config:n {
	cover-config={
		text-backtitle		=	{\l__pxdata_course_tl},
		text-uppertitle 	=	{\l__pxdata_activity_tl},
		text-title		 	=	{\l__pxdata_subj_name_tl},
		text-minititle	 	=	{\l__pxdata_act_short_tl},
		text-subtitle	 	=	{\l__pxdata_activity_tl},
		text-subsubtitle 	=	{\l__pxdata_subj_code_tl},
		text-author		 	=	{\l__pxdata_student_tl},
		text-date		 	=	{\today},
		text-auxtext	 	=	{ }
	},
	page-config={
		author-name			=	{\l__pxdata_student_tl},
		doc-name			=	{\l__pxdata_act_short_tl},
		subj-name			=	{\l__pxdata_subj_short_tl},
		refcode				=	{\l__pxdata_subj_code_tl},
		course-name			=	{\l__pxdata_course_tl}
	}
}
\RenewDocumentCommand{\contentsname}{}{\pxDEFtocname}
\cs_new:Nn \__ifcover:nn {
	\bool_if:NTF  \l_pxdoc_usecover_bool {#1}{#2}
}
%  	--	PCKG PUBLIC LaTeX2e API	-
\NewDocumentCommand{\PECTeXconfig}{+m}{
	\pxGDX_config:n {#1}
}
\NewDocumentCommand{\PECTeXprintCover}{s}{
	\setcounter{page}{-1}
	\IfBooleanT{#1}{\pxGDX_cover_config:n{noplagi}}
	\pxGDX_print_cover:
	\clearpage
}

\NewDocumentCommand{\PECTeXprintTOC}{s}{
	\IfBooleanT{#1}{
		\par\noindent
		\pxDEFnoplagi{\l__gdx_cover_author_tl}
		\par \__pxDEV_HRule:
	}{
	}
	\tableofcontents
	\clearpage
}
\AfterBeginDocument{
	\__ifcover:nn{
		\PECTeXprintCover*
		\tableofcontents %
		\clearpage
	}{	\PECTeXprintTOC*}
}
%%END_FOLD%%