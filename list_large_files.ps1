
Get-ChildItem -Recurse -File -Path src -Include *.ts,*.tsx | 
    ForEach-Object { 
        $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
        if ($lines -gt 800) {
            Write-Output "$($_.FullName) - $lines lines"
        }
    } | Out-File -Encoding UTF8 large_files.txt
