
import os

def read_log():
    lines = []
    try:
        with open('exam_lint_v2.txt', 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except:
        try:
            with open('exam_lint_v2.txt', 'r', encoding='utf-16') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"Error: {e}")
            return

    for line in lines:
        if "error" in line or "warning" in line:
            print(line.strip())

if __name__ == "__main__":
    read_log()
