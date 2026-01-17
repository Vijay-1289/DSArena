
import json
import os

try:
    try:
        with open('components_lint.json', 'r', encoding='utf-16') as f:
            data = json.load(f)
    except:
        with open('components_lint.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    
    for result in data:
        if result.get('errorCount', 0) > 0:
            print(f"File: {os.path.basename(result['filePath'])}")
            for msg in result.get('messages', []):
                if msg.get('severity') == 2: # 2 is error
                    print(f"  Line {msg['line']}: {msg['message']}")
except Exception as e:
    print(f"Error: {e}")
