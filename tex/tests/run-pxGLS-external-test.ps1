# External-backend regression without requiring the Perl makeglossaries wrapper.
$ErrorActionPreference = 'Stop'
$before = Get-Location
$previousInputs = $env:TEXINPUTS
try {
    Set-Location $PSScriptRoot
    $env:TEXINPUTS = ".;$PSScriptRoot/../latex;$PSScriptRoot/../code;"
    $job = 'pxGLS.external.test'
    & pdflatex -halt-on-error -interaction=nonstopmode "$job.tex"
    if ($LASTEXITCODE) { throw 'Initial glossary compile failed' }
    & makeindex -s "$job.ist" -t "$job.glg" -o "$job.gls" "$job.glo"
    if ($LASTEXITCODE) { throw 'Glossary index failed' }
    & makeindex -s "$job.ist" -t "$job.alg" -o "$job.acr" "$job.acn"
    if ($LASTEXITCODE) { throw 'Acronym index failed' }
    & pdflatex -halt-on-error -interaction=nonstopmode "$job.tex"
    if ($LASTEXITCODE) { throw 'Indexed glossary compile failed' }
    $terms = Get-Content "$job.gls" -Raw
    $acronyms = Get-Content "$job.acr" -Raw
    if (!$terms.Contains('\glossentry{used}') -or !$terms.Contains('\glossentry{unused}') -or !$acronyms.Contains('\glossentry{cpu}')) {
        throw 'Expected include=all glossary entries missing'
    }
} finally {
    Set-Location $before
    $env:TEXINPUTS = $previousInputs
}
