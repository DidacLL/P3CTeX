#!/usr/bin/env bash
# Use the PowerShell test list as the single source of test names.
set -euo pipefail
cd /work/tex/tests

mapfile -t tests < <(
  grep -E '^[[:space:]]*"[^"]+\.test\.tex",?$' run-all-tests.ps1 |
    cut -d '"' -f2
)
if (( ${#tests[@]} == 0 )); then
  echo "No registered module tests were found." >&2
  exit 1
fi

failures=()
for test in "${tests[@]}"; do
  echo "=== Module test: ${test} ==="
  job="${test%.tex}"
  if ! pdflatex -halt-on-error -file-line-error -interaction=nonstopmode "-jobname=${job}" "${test}" > "${job}.pass1.log" 2>&1; then
    tail -50 "${job}.pass1.log"
    failures+=("${test} (first pass)")
    continue
  fi
  if [[ "${test}" == "pxGLS.external.test.tex" ]]; then
    if ! makeglossaries "${job}" > "${job}.index.log" 2>&1; then
      tail -50 "${job}.index.log"
      failures+=("${test} (makeglossaries)")
      continue
    fi
    if [[ ! -f "${job}.gls" || ! -f "${job}.acr" ]]; then
      echo "Glossary or acronym index output was not generated."
      failures+=("${test} (missing indexes)")
      continue
    fi
  fi
  if ! pdflatex -halt-on-error -file-line-error -interaction=nonstopmode "-jobname=${job}" "${test}" > "${job}.pass2.log" 2>&1; then
    tail -50 "${job}.pass2.log"
    failures+=("${test} (second pass)")
  fi
done

for template in \
  examples/P3CTeX-example.tex \
  examples/UOCTemplates/MinimalTemplate/PAC1/MinimalTemplatePAC.tex \
  examples/UOCTemplates/MinimalTemplate/PAC1/PACTemplate.tex \
  examples/UOCTemplates/ExtendedTemplate/PAC1/ExtendedTemplatePAC.tex \
  examples/UOCTemplates/TFGTemplate/PR1/PR1.tex \
  examples/UOCTemplates/TFGTemplate/PR2/PR2.tex \
  examples/UOCTemplates/TFGTemplate/MEM/MEM.tex
do
  echo "=== Template: ${template} ==="
  if ! (cd "/work/$(dirname "${template}")" &&
      latexmk -pdf -halt-on-error -file-line-error -interaction=nonstopmode "$(basename "${template}")"); then
    failures+=("${template}")
  fi
done
if (( ${#failures[@]} )); then
  printf 'FAILED: %s\n' "${failures[@]}"
  exit 1
fi
echo "All ${#tests[@]} module tests and 7 templates passed."
