param(
    [switch]$CleanArtifacts,
    [switch]$IncludeTemplates
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

    # pxCMP suite
    "pxCMP.probe.test.tex",
    "pxCMP.standalone.test.tex",
    "pxCMP.test.tex",
    "pxCORE.test.tex",

    # pxLST suite
    "pxLST.test.tex",
    "pxLST.languages.test.tex",
    "pxLST.io.test.tex",

    # Additional modules
    "pxUML.test.tex",
    "pxSRC.test.tex",
    "pxPRP.test.tex",
    "pxGNT.test.tex",
    "pxGNT.standalone.test.tex",
    "pxMEM.test.tex",
    "pxTFG.MEM.test.tex",
    "pxTFG.no-toc.test.tex",
    "pxTFG.PR.test.tex",
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
        & pdflatex -halt-on-error -file-line-error -interaction=nonstopmode $testFile
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
            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($testFile)
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.aux")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.log")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.out")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.pdf")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.toc")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.synctex.gz")
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
