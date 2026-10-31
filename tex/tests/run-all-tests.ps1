param(
    [switch]$CleanArtifacts,
    [switch]$IncludeTemplates,
    [string]$JobPrefix = "",
    [ValidateRange(1,5)][int]$Passes = 1
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$latexDir = Resolve-Path (Join-Path $scriptDir "..\latex")
$codeDir = Resolve-Path (Join-Path $scriptDir "..\code")
$testsDir = Resolve-Path $scriptDir
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

$testFiles = @(
    # pxTAB suite
    "pxTAB.test.tex",
    "pxTAB.package-option.test.tex",
    "pxTAB.raw-tabular.test.tex",
    "pxTAB.style-probe.test.tex",
    "pxTAB.layout-size.test.tex",
    "pxTAB.align-bug.test.tex",
    "pxTAB.pxtbl.test.tex",
    "pxTAB.preset.test.tex",

    # pxDIAG suite
    "pxDIAG.probe.test.tex",
    "pxDIAG.standalone.test.tex",
    "pxDIAG.test.tex",
    "pxDIAG.languages.test.tex",
    "pxDIAG.uncaptioned-label.test.tex",
    "pxDIAG.nonfloating-label.test.tex",
    "pxCORE.test.tex",
    "pxCORE.config-tokens.test.tex",
    "pxCORE.forwarding.test.tex",
    "public-api.test.tex",
    "pxSRC.dependencies.test.tex",
    "pxSRC.nested.test.tex",
    "pxSRC.labels.test.tex",

    # pxLST suite
    "pxLST.test.tex",
    "pxLST.languages.test.tex",
    "pxLST.io.test.tex",
    "pxLST.legacy.test.tex",
    "pxLST.quotes.test.tex",
    "pxCALC.test.tex",
    "student-tools.test.tex",

    # Additional modules
    "pxUML.test.tex",
    "pxSRC.test.tex",
    "pxSRC.settings.test.tex",
    "pxSRC.defaults.test.tex",
    "pxSRC.input.test.tex",
    "pxSRC.input-PR.test.tex",
    "pxSRC.input-MEM.test.tex",
    "pxSRC.input-errors.test.tex",
    "pxSRC.external.test.tex",
    "pxGLS.test.tex",
    "pxGLS.automatic.test.tex",
    "pxGLS.external.test.tex",
    "pxGLS.entries.test.tex",
    "pxPM.languages.test.tex",
    "pxPM.test.tex",
    "pxSRC.preview.test.tex",
    "pxANN.automatic.test.tex",
    "pxANN.bibliography-integration.test.tex",
    "pxPRP.test.tex",
    "pxPM.gantt.test.tex",
    "pxPM.gantt-standalone.test.tex",
    "pxMEM.test.tex",
    "pxMEM.labels.test.tex",
    "pxMEM.standalone.test.tex",
    "pxTFG.MEM.test.tex",
    "pxTFG.no-toc.test.tex",
    "pxTFG.PR.test.tex",
    "pxTFG.languages.test.tex",
    "pxGDX.test.tex",
    "pxORL.test.tex",
    "P3CTeX.test.tex"
)

$oldTexInputs = $env:TEXINPUTS
$oldLocation = Get-Location
try {
    # Keep default TeX search path by ending with ';'.
    $env:TEXINPUTS = "$latexDir;$codeDir;$testsDir;"

    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "       P3CTeX Quality Gate: All Tests     " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "TEXINPUTS: $($env:TEXINPUTS)"
    Write-Host "Test suite count: $($testFiles.Count)"
    Write-Host ""

    $results = @()
    Set-Location $testsDir

    foreach ($testFile in $testFiles) {
        $testPath = Join-Path $testsDir $testFile
        if (-not (Test-Path $testPath)) {
            $results += [PSCustomObject]@{
                TestFile = $testFile
                ExitCode = 2
                Status   = "MISSING"
            }
            Write-Host "[MISSING] $testFile" -ForegroundColor Red
            continue
        }

        Write-Host "---- Running $testFile ----" -ForegroundColor DarkGray
        $jobName = $JobPrefix + [System.IO.Path]::GetFileNameWithoutExtension($testFile)
        if ($testFile -eq "pxGLS.external.test.tex") {
            # Never allow an earlier glossary build to mask a missing index.
            Remove-Item -ErrorAction SilentlyContinue "$jobName.gls", "$jobName.acr"
        }
        for ($pass = 1; $pass -le $Passes; $pass++) {
            & pdflatex "-jobname=$jobName" -halt-on-error -file-line-error -interaction=nonstopmode $testFile
            if ($LASTEXITCODE -ne 0) { break }
            if ($testFile -eq "pxGLS.external.test.tex" -and $pass -eq 1) {
                & makeglossaries $jobName
                if ($LASTEXITCODE -ne 0) { break }
                if (-not (Test-Path "$jobName.gls") -or -not (Test-Path "$jobName.acr")) {
                    Write-Host "[FAIL] External glossary output is missing" -ForegroundColor Red
                    $global:LASTEXITCODE = 1
                    break
                }
                & pdflatex "-jobname=$jobName" -halt-on-error -file-line-error -interaction=nonstopmode $testFile
                if ($LASTEXITCODE -ne 0) { break }
            }
        }
        $exitCode = $LASTEXITCODE
        $status = if ($exitCode -eq 0) { "PASS" } else { "FAIL" }

        $results += [PSCustomObject]@{
            TestFile = $testFile
            ExitCode = $exitCode
            Status   = $status
        }

        if ($exitCode -eq 0) {
            Write-Host "[PASS] $testFile" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] $testFile (exit=$exitCode)" -ForegroundColor Red
        }

        if ($CleanArtifacts) {
            $baseName = $jobName
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.aux")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.log")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.out")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.pdf")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.toc")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.synctex.gz")
            if ($testFile -eq "pxGLS.external.test.tex") {
                foreach ($ext in @("glo", "gls", "glg", "ist", "acn", "acr", "alg")) {
                    Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.$ext")
                }
            }
        }
    }

    if ($IncludeTemplates) {
        Write-Host ""
        Write-Host "---- Validating UOC Templates & Examples ----" -ForegroundColor Cyan
        $templates = @(
            "examples\P3CTeX-example.tex",
            "examples\UOCTemplates\MinimalTemplate\PAC1\MinimalTemplatePAC.tex",
            "examples\UOCTemplates\MinimalTemplate\PAC1\PACTemplate.tex",
            "examples\UOCTemplates\ExtendedTemplate\PAC1\ExtendedTemplatePAC.tex",
            "examples\UOCTemplates\TFGTemplate\PR1\PR1.tex",
            "examples\UOCTemplates\TFGTemplate\PR2\PR2.tex",
            "examples\UOCTemplates\TFGTemplate\MEM\MEM.tex"
        )
        foreach ($tplRel in $templates) {
            $tplPath = Join-Path $repoRoot $tplRel
            $tplDir = Split-Path -Parent $tplPath
            $tplFile = Split-Path -Leaf $tplPath
            Set-Location $tplDir
            $env:TEXINPUTS = "$latexDir;$codeDir;$tplDir;"
            & pdflatex -halt-on-error -file-line-error -interaction=nonstopmode $tplFile
            $exitCode = $LASTEXITCODE
            $status = if ($exitCode -eq 0) { "PASS" } else { "FAIL" }
            $results += [PSCustomObject]@{
                TestFile = $tplRel
                ExitCode = $exitCode
                Status   = $status
            }
            if ($exitCode -eq 0) {
                Write-Host "[PASS] $tplRel" -ForegroundColor Green
            } else {
                Write-Host "[FAIL] $tplRel (exit=$exitCode)" -ForegroundColor Red
            }
            if ($CleanArtifacts) {
                $baseName = [System.IO.Path]::GetFileNameWithoutExtension($tplFile)
                Remove-Item -ErrorAction SilentlyContinue (Join-Path $tplDir "$baseName.aux")
                Remove-Item -ErrorAction SilentlyContinue (Join-Path $tplDir "$baseName.log")
                Remove-Item -ErrorAction SilentlyContinue (Join-Path $tplDir "$baseName.out")
                Remove-Item -ErrorAction SilentlyContinue (Join-Path $tplDir "$baseName.toc")
                Remove-Item -ErrorAction SilentlyContinue (Join-Path $tplDir "$baseName.lof")
                Remove-Item -ErrorAction SilentlyContinue (Join-Path $tplDir "$baseName.lot")
            }
        }
    }

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "         Quality Gate Summary             " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    foreach ($result in $results) {
        $color = if ($result.ExitCode -eq 0) { "Green" } else { "Red" }
        Write-Host ("{0,-36} | exit={1,2} | {2}" -f $result.TestFile, $result.ExitCode, $result.Status) -ForegroundColor $color
    }

    $failedCount = @($results | Where-Object { $_.ExitCode -ne 0 }).Count
    Write-Host ""
    if ($failedCount -gt 0) {
        Write-Host "QUALITY GATE: FAILED ($failedCount failing test(s))" -ForegroundColor Red
        exit 1
    }

    Write-Host "QUALITY GATE: ALL PASSED ($($results.Count)/$($results.Count))" -ForegroundColor Green
    exit 0
}
finally {
    Set-Location $oldLocation
    $env:TEXINPUTS = $oldTexInputs
}
