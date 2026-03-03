param(
    [switch]$CleanArtifacts
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$latexDir = Resolve-Path (Join-Path $scriptDir "..\latex")
$codeDir = Resolve-Path (Join-Path $scriptDir "..\code")
$testsDir = Resolve-Path $scriptDir

$testFiles = @(
    "pxTAB.test.tex",
    "pxTAB.package-option.test.tex",
    "pxTAB.raw-tabular.test.tex",
    "pxTAB.style-probe.test.tex",
    "pxTAB.layout-size.test.tex",
    "pxTAB.align-bug.test.tex"
)

$oldTexInputs = $env:TEXINPUTS
$oldLocation = Get-Location
try {
    # Keep default TeX search path by ending with ';'.
    $env:TEXINPUTS = "$latexDir;$codeDir;$testsDir;"

    Write-Host "== pxTAB quality gate =="
    Write-Host "TEXINPUTS=$($env:TEXINPUTS)"
    Write-Host ""

    $results = @()
    Set-Location $testsDir

    foreach ($testFile in $testFiles) {
        $testPath = Join-Path $testsDir $testFile
        if (-not (Test-Path $testPath)) {
            $results += [PSCustomObject]@{
                TestFile  = $testFile
                ExitCode  = 2
                Status    = "MISSING"
            }
            Write-Host "[MISSING] $testFile" -ForegroundColor Red
            continue
        }

        Write-Host "---- Running $testFile ----"
        & pdflatex -halt-on-error -file-line-error -interaction=nonstopmode $testFile
        $exitCode = $LASTEXITCODE
        $status = if ($exitCode -eq 0) { "PASS" } else { "FAIL" }

        $results += [PSCustomObject]@{
            TestFile  = $testFile
            ExitCode  = $exitCode
            Status    = $status
        }

        if ($exitCode -eq 0) {
            Write-Host "[PASS] $testFile (exit=$exitCode)" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] $testFile (exit=$exitCode)" -ForegroundColor Red
        }

        if ($CleanArtifacts) {
            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($testFile)
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.aux")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.log")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.out")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.pdf")
            Remove-Item -ErrorAction SilentlyContinue (Join-Path $testsDir "$baseName.synctex.gz")
        }

        Write-Host ""
    }

    Write-Host "== pxTAB quality gate summary =="
    foreach ($result in $results) {
        Write-Host ("{0} | exit={1} | {2}" -f $result.TestFile, $result.ExitCode, $result.Status)
    }

    $failedCount = @($results | Where-Object { $_.ExitCode -ne 0 }).Count
    if ($failedCount -gt 0) {
        Write-Host ""
        Write-Host "QUALITY GATE: FAILED ($failedCount failing test(s))" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "QUALITY GATE: PASSED" -ForegroundColor Green
    exit 0
}
finally {
    Set-Location $oldLocation
    $env:TEXINPUTS = $oldTexInputs
}
