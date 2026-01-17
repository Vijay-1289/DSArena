
import os
import sys

try:
    try:
        with open('lint_final_6.txt', 'r', encoding='utf-16') as f:
            lines = f.readlines()
    except:
        with open('lint_final_6.txt', 'r', encoding='utf-8') as f:
            lines = f.readlines()

    current_file = "Unknown"
    for line in lines:
        line = line.strip()
        if (line.endswith('.ts') or line.endswith('.tsx')) and ('src' in line or 'D:' in line):
            current_file = os.path.basename(line)
        
        if "warning" in line.lower() or "error" in line.lower():
            if "Total" not in line and "scan" not in line: # Skip summary lines if any
                print(f"File: {current_file} | {line}")

except Exception as e:
    print(e)
