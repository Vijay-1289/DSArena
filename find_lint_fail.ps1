
$files = Get-ChildItem -Recurse -File -Path src -Include *.ts, *.tsx
foreach ($file in $files) {
    $out = npx eslint $file.FullName 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAIL: $($file.FullName)"
        Write-Host $out
        exit 1
    }
}
Write-Host "All files passed individually."
