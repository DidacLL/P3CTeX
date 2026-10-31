#!/usr/bin/env bash
# CI uses the PowerShell test list as its single source of test names.
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

for test in "${tests[@]}"; do
  echo "=== Module test: ${test} ==="
  job="${test%.tex}"
  pdflatex -halt-on-error -file-line-error -interaction=nonstopmode "-jobname=${job}" "${test}" > "${job}.pass1.log" 2>&1 ||
    { tail -80 "${job}.pass1.log"; exit 1; }
  if [[ "${test}" == "pxGLS.external.test.tex" ]]; then
    makeglossaries "${job}" > "${job}.index.log" 2>&1 ||
      { tail -80 "${job}.index.log"; exit 1; }
    test -f "${job}.gls" && test -f "${job}.acr"
  fi
  pdflatex -halt-on-error -file-line-error -interaction=nonstopmode "-jobname=${job}" "${test}" > "${job}.pass2.log" 2>&1 ||
    { tail -80 "${job}.pass2.log"; exit 1; }
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
  (cd "/work/$(dirname "${template}")" &&
    latexmk -pdf -halt-on-error -file-line-error -interaction=nonstopmode "$(basename "${template}")")
done
echo "TeX module tests and templates passed."
