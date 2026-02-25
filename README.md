## P3CTeX

Ultimate LaTeX repository for PEC solving at UOC.

### Arquitectura bàsica

- **Classe de document `P3CTeX.cls`**: defineix el comportament global del
  document (format, metadades de l'estudiant/assignatura, idiomes) i
  proporciona la interfície d'usuari principal per als estudiants de la UOC.

- **Paquet nucli `pxCORE.sty`**: centralitza el càrrega de paquets externs
  i l'activació de biblioteques independents mitjançant la família de claus
  `pxCORE` (per exemple, `UML`, `PRP`, ...). Les classes de document només
  parlen amb les biblioteques a través de `pxCORE`.

- **Biblioteques independents `px*.sty`** (com `pxPRP`, `pxUML`, `pxALG`):
  ofereixen funcionalitats específiques (mapes de propietats, UML, algorismes,
  etc.) amb una API pública \LaTeX2e i, quan cal, una implementació interna
  basada en `expl3` als fitxers `*.code.tex`.
