% !TeX encoding = UTF-8
% !TeX spellcheck = en_EN-EnglishUnitedKingdom
%% =======================================================
%%  	P3C.TeX  			v0.3
%%		SCVRIA SOFWARE		Ultimate UOC PEC Repository
%% =======================================================
%%  This file is part of the package P3C.TeX
%%
%%  Author's name: Scvria
%%  File: pxUML.code.tex
%% 	Version: v0.1 (02/2026)
%%  Description: Provides a UML class diagram implementation based on top of pgf-umlcd and TikZ packages
%%
%%  This file may be distributed and/or modified:
%%
%%   1. under the LaTeX Project Public License and/or
%%   2. under the GNU Public License.
%%
%%   See the file doc/LICENSE for more details.
%%
%% =======================================================
%%	TODO:	- User level API
%%			- Add more features to the UML class diagram implementation
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
	\bool_if:NF  \l_pxdoc_language_bool {
		\RequirePackage[catalan]{babel}
	}
}
\keys_define:nn {P3CTeX}
{
	cover 			.bool_set:N 	=		\l_pxdoc_usecover_bool,
	cover 		.initial:n 		= 		false,
	cover 		.default:n 		= 		true,
	no-cover	.meta:n 		= 	{ 	cover ={ false }},
	CA				.meta:n			=	{	cover = {false}, en},
	PAC				.meta:n			=	{	cover = {false}, cat},
	PEC				.meta:n			=	{	cover = {false}, es},
	PR				.meta:n			=	{	cover = {true}	},
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
	},
	en	.code		={
		\RequirePackage[english]{babel}
		\bool_set_true:N \l_pxdoc_language_bool
	},
	user-data 			.code:n	 			= 	{	\keys_set:nn { P3CTeX/data } {#1}	},
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

\ProcessKeysOptions{P3CTeX}
\file_input:n {pxTXT.code.tex}
\file_input:n {pxGDX.code.tex}
\RequirePackage[\l__pxdoc_unknown_tl]{pxCORE}
%\RequirePackage{p3xGDX}
%\RequirePackage{p3xSRC}
%% GLOBAL VARIABLES DEFINITION
\prop_gclear_new:N \g_pxCORE_main_prop
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
	\IfBooleanT{#1}{\pxGDX_cover_config:n{noplagi}}
	\setcounter{page}{-1}
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