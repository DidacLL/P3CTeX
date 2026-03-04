@echo off
:: Script per eliminar fitxers auxiliars generats per LaTeX a tot el repositori
setlocal

:: Anar al directori arrel del repositori (un nivell per sobre de scripts)
cd /d "%~dp0.."

:: Llista d'extensions auxiliars a eliminar de manera recursiva
for %%x in (aux log toc out synctex.gz hd lof lot fls fdb_latexmk bbl blg nav snm test.pdf) do (
    del /S /Q "*.%%x" 2>nul
)

echo Fitxers auxiliars de LaTeX eliminats de tot el repositori.
pause
