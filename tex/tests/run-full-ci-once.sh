#!/usr/bin/env bash
# Single-revision P3CTeX regression: all root test documents, examples, and manuals.
set -uo pipefail
suite="$1"
count=0
failed=0
warned=0
pdf_less=0
skipped=0
export TEXINPUTS=".:/work/tex/latex//:/work/tex/code//:"
case "$suite" in
  core) patterns="P3CTeX*.tex pxCORE*.tex pxGDX*.tex pxPRP*.tex pxORL*.tex pxTAB*.tex pxUML*.tex pxSRC*.tex pxAI*.tex" ;;
  diagrams) patterns="pxDIA*.tex" ;;
  listings) patterns="pxLST*.tex" ;;
  pmcalc) patterns="pxPM*.tex pxCALC*.tex" ;;
  integration) patterns="pxMEM*.tex pxTFG*.tex pxFULL*.tex pxANX*.tex pxGLS*.tex" ;;
  docs) patterns="" ;;
  *) echo "Unknown suite: $suite" >&2; exit 2 ;;
esac
mkdir -p "/work/.full-ci/$suite"
run_document() {
  local src="$1" kind="$2" relative="$3"
  local dir filename name out log pass ok=1
  count=$((count+1))
  dir="$(dirname "$src")"
  filename="$(basename "$src")"
  name="$(basename "$src" .tex)"
  out="/work/.full-ci/$suite/$count"
  mkdir -p "$out"
  echo "=== START $suite [$count] $relative ==="
  for pass in 1 2 3; do
    log="$out/stdout-pass-$pass.log"
    if ! (cd "$dir" && pdflatex -halt-on-error -file-line-error -interaction=nonstopmode "-output-directory=$out" "$filename" > "$log" 2>&1); then
      echo "FAIL $relative (pdfLaTeX pass $pass)"
      grep -E -A 8 '^! |^.*:[0-9]+:|Fatal error occurred' "$log" | tail -n 60 || true
      tail -n 35 "$log" || true
      ok=0
      break
    fi
    if [[ "$pass" -eq 1 && ( "$name" == P3CTeX.bibliography-*.test || "$name" == P3CTeX.ai-*.test ) ]] && grep -Fq '\bibdata' "$out/$name.aux"; then
      if ! (cd "$out" && BIBINPUTS="/work/tex/tests//:" bibtex "$name" > bibtex.log 2>&1); then
        echo "FAIL $relative (BibTeX)"
        tail -n 30 "$out/bibtex.log" || true
        ok=0
        break
      fi
    fi
  done
  # Verify that TOC entries use the document's real heading level,
  # not merely that a PDF was produced.
  if ((ok==1)) && [[ "$name" == "P3CTeX.bibliography-auto.test" ]]; then
    if ! grep -Fq '\contentsline {section}{Referències}' "$out/$name.aux"; then
      echo "FAIL $relative (article bibliography TOC level)"
      ok=0
    fi
  fi
  if ((ok==1)) && [[ "$name" == "P3CTeX.bibliography-mem.test" ]]; then
    if ! grep -Fq '\contentsline {chapter}{Referències}' "$out/$name.aux" ||
       ! grep -Fq '\citation{p3ctex-demo}' "$out/$name.aux" ||
       ! grep -Fq 'p3ctex-demo' "$out/$name.bbl"; then
      echo "FAIL $relative (MEM bibliography TOC level / annex citation)"
      ok=0
    fi
  fi
  if ((ok==1)) && [[ "$name" == "P3CTeX.bibliography-mem-no-toc.test" ]]; then
    if grep -Fq '\contentsline {chapter}{Referències}' "$out/$name.aux" ||
       grep -Fq '\contentsline {section}{Referències}' "$out/$name.aux"; then
      echo "FAIL $relative (bibliography-toc=false ignored by MEM)"
      ok=0
    fi
  fi
  if ((ok==1)) && [[ "$name" == "P3CTeX.ai-bibliography.test" ]]; then
    bibline="$(grep -nF '\contentsline {section}{Referències}' "$out/$name.aux" | head -n1 | cut -d: -f1)"
    ailine="$(grep -nF "\contentsline {section}{Declaració d'ús d'IA}" "$out/$name.aux" | head -n1 | cut -d: -f1)"
    annexline="$(grep -nF "\contentsline {section}{Annex de respostes d'IA}" "$out/$name.aux" | head -n1 | cut -d: -f1)"
    if [[ -z "$bibline" || -z "$ailine" || -z "$annexline" ]] ||
       ! (( bibline < ailine && ailine < annexline )); then
      echo "FAIL $relative (bibliography -> AI disclosure -> AI annex ordering)"
      ok=0
    fi
  fi
  if ((ok==1)) && [[ "$name" == "P3CTeX.ai-mem.test" ]]; then
    if ! grep -Fq '\contentsline {chapter}{Declaració' "$out/$name.aux" ||
       ! grep -Fq '\contentsline {chapter}{Annex de respostes' "$out/$name.aux"; then
      echo "FAIL $relative (MEM AI disclosure / annex chapter-level TOC)"
      ok=0
    fi
  fi
  if ((ok==1)) && [[ "$name" == "P3CTeX.ai-no-bib.test" ]]; then
    if grep -Fq "Declaración de uso de IA" "$out/$name.toc" ||
       grep -Fq "Anexo de respuestas de IA" "$out/$name.toc"; then
      echo "FAIL $relative (AI toc=false ignored)"
      ok=0
    fi
  fi
  if ((ok==1)) && [[ "$kind" == "document" && ! -s "$out/$name.pdf" ]]; then
    echo "FAIL $relative (expected PDF not produced)"
    ok=0
  fi
  if ((ok==1)) && [[ "$kind" == "test" && ! -s "$out/$name.pdf" ]]; then
    pdf_less=$((pdf_less+1))
    echo "ASSERTION-ONLY $relative (no PDF page)"
  fi
  if ((ok==1)); then
    if grep -Eiq 'destination with the same identifier|multiply-defined|multiply defined' "$out/stdout-pass-3.log"; then
      echo "FAIL $relative (duplicate destination/label)"
      grep -Ei 'destination with the same identifier|multiply-defined|multiply defined' "$out/stdout-pass-3.log" | tail -n 12
      ok=0
    fi
    if grep -Eiq 'LaTeX Warning: There were undefined references|LaTeX Warning: Reference .*undefined|LaTeX Warning: Citation .*undefined' "$out/stdout-pass-3.log"; then
      warned=$((warned+1))
      echo "$relative" >> "/work/.full-ci/$suite/warnings.txt"
      echo "WARNING $relative (unresolved reference/citation)"
    fi
  fi
  if ((ok==1)); then
    echo "PASS $relative (3 pdfLaTeX passes)"
  else
    failed=$((failed+1))
    echo "$relative" >> "/work/.full-ci/$suite/failures.txt"
  fi
}
if [[ "$suite" == "docs" ]]; then
  # Documentation has real standalone classes; templates may get the class
  # through \input. Do not treat the shared preambles as executables.
  while IFS= read -r -d '' src; do
    relative="$(realpath --relative-to=/work "$src")"
    if ! grep -Eq '^[[:space:]]*\\documentclass[[:space:]]*(\[|\{)' "$src"; then
      skipped=$((skipped+1))
      echo "SKIP documentation fragment: $relative"
      continue
    fi
    run_document "$src" document "$relative"
  done < <(find /work/tex/doc -maxdepth 1 -type f -name '*.tex' -print0 | sort -z)
  for relative in \
    examples/P3CTeX-example.tex \
    examples/UOCTemplates/MinimalTemplate/PAC1/MinimalTemplatePAC.tex \
    examples/UOCTemplates/MinimalTemplate/PAC1/PACTemplate.tex \
    examples/UOCTemplates/ExtendedTemplate/PAC1/ExtendedTemplatePAC.tex \
    examples/UOCTemplates/TFGTemplate/PR1/PR1.tex \
    examples/UOCTemplates/TFGTemplate/MEM/MEM.tex
  do
    if [[ -f "/work/$relative" ]]; then
      run_document "/work/$relative" document "$relative"
    else
      count=$((count+1))
      failed=$((failed+1))
      echo "$relative (missing)" >> "/work/.full-ci/$suite/failures.txt"
      echo "FAIL $relative (missing tracked entry document)"
    fi
  done
else
  cd /work/tex/tests || exit 2
  for pattern in $patterns; do
    for src in $pattern; do
      [[ -f "$src" ]] || continue
      run_document "/work/tex/tests/$src" test "tex/tests/$src"
    done
  done
fi
echo "=== SUITE SUMMARY $suite: $count attempted, $failed failed, $warned unresolved-reference warnings, $pdf_less assertion-only, $skipped fragments skipped ==="
if ((failed>0)); then
  sed 's/^/FAILED TEST: /' "/work/.full-ci/$suite/failures.txt"
fi
if ((warned>0)); then
  sed 's/^/UNRESOLVED REFS: /' "/work/.full-ci/$suite/warnings.txt"
fi
if ((count==0)); then
  echo "FAIL: no documents were selected"; exit 2
fi
if ((failed>0)); then exit 1; fi
echo "PASS SUITE $suite"
