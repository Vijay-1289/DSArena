import { ProblemData } from './problemsData';

interface ParsedSignature {
    name: string;
    params: { name: string; type: string }[];
    returnType: string;
}

/**
 * Parses a function signature string like:
 * "def twoSum(nums: List[int], target: int) -> List[int]:"
 */
function parseSignature(inputFormat: string): ParsedSignature {
    const defaultSig = { name: 'solution', params: [], returnType: 'any' };
    if (!inputFormat) return defaultSig;

    // 1. Python: "def name(p1: type, p2: type) -> ret:"
    const pyMatch = inputFormat.match(/def\s+(\w+)\s*\((.*?)\)(\s*->\s*(.*?))?:?/);
    if (pyMatch) {
        const name = pyMatch[1];
        const paramsStr = pyMatch[2];
        const returnType = pyMatch[4] || 'any';

        const params = paramsStr.split(',').filter(s => s.trim()).map(p => {
            const [pName, pType] = p.split(':').map(s => s.trim());
            return { name: pName, type: pType || 'any' };
        });

        return { name, params, returnType };
    }

    return defaultSig;
}

/**
 * Maps bank types (List[int], etc) to language-specific types
 */
function mapType(type: string, language: string): string {
    const t = type.toLowerCase();
    if (language === 'javascript') {
        if (t.includes('int') || t.includes('float') || t.includes('double')) return 'number';
        if (t.includes('string')) return 'string';
        if (t.includes('bool')) return 'boolean';
        if (t.includes('list')) return 'Array';
        return 'any';
    }
    if (language === 'java') {
        if (t.includes('int')) return t.includes('list') ? 'int[]' : 'int';
        if (t.includes('string')) return t.includes('list') ? 'String[]' : 'String';
        if (t.includes('bool')) return 'boolean';
        if (t.includes('void')) return 'void';
        return 'Object';
    }
    if (language === 'cpp') {
        if (t.includes('int')) return t.includes('list') ? 'vector<int>' : 'int';
        if (t.includes('string')) return t.includes('list') ? 'vector<string>' : 'string';
        if (t.includes('bool')) return 'bool';
        if (t.includes('void')) return 'void';
        return 'auto';
    }
    return type;
}

/**
 * GENERATOR SYSTEM v2.0 (Whitespace Agnostic)
 * Legacy backup available in: src/lib/legacyTemplateGenerator.ts
 */
export function generateStarterCode(problem: ProblemData, language: string): string {
    // 1. Check for manual language override in problemsData
    if (problem.starterTemplates && problem.starterTemplates[language]) {
        return problem.starterTemplates[language];
    }

    // 2. If it's a "Track" problem and matches the language, return its original starterCode
    if (problem.language === language && problem.starterCode) {
        return problem.starterCode;
    }

    // 3. Generate whitespace-agnostic template based on inputFormat
    const parsed = parseSignature(problem.inputFormat);
    const mappedReturn = mapType(parsed.returnType, language);

    if (language === 'python') {
        const params = parsed.params.map(p => `${p.name}: ${p.type}`).join(', ');
        const returnType = parsed.returnType !== 'any' ? ` -> ${parsed.returnType}` : '';

        const reads = parsed.params.map((p, idx) => {
            if (p.type.includes('List')) {
                // Check if previous param was likely a count
                const prev = parsed.params[idx - 1];
                if (prev && prev.type.toLowerCase().includes('int')) {
                    return `${p.name} = [read_int() for _ in range(${prev.name})]`;
                }
                return `${p.name} = [read_int() for _ in range(read_int())]`;
            }
            if (p.type.includes('int')) return `${p.name} = read_int()`;
            if (p.type.includes('float') || p.type.includes('double')) return `${p.name} = read_float()`;
            return `${p.name} = read_next()`;
        }).join('\n');

        const args = parsed.params.map(p => p.name).join(', ');

        return `import sys

# Read all input at once and tokenize by any whitespace
# region Input Helpers
tokens = sys.stdin.read().split()
idx = 0

def read_next():
    """Get the next token from input (handles spaces, tabs, newlines)"""
    global idx
    if idx < len(tokens):
        val = tokens[idx]
        idx += 1
        return val
    return None

def read_int():
    """Read next token as integer"""
    val = read_next()
    return int(val) if val is not None else None

def read_float():
    """Read next token as float"""
    val = read_next()
    return float(val) if val is not None else None
# endregion

# ========== YOUR SOLUTION BELOW ==========

def ${parsed.name}(${params})${returnType}:
    # Write your code here
    pass

# Read input and execute
${reads}
result = ${parsed.name}(${args})

# Print result if function returns something
if result is not None:
    print(result)`;
    }

    if (language === 'javascript') {
        const params = parsed.params.map(p => p.name).join(', ');
        const reads = parsed.params.map((p, idx) => {
            if (p.type.toLowerCase().includes('list')) {
                const prev = parsed.params[idx - 1];
                if (prev && prev.type.toLowerCase().includes('int')) {
                    return `const ${p.name} = Array.from({ length: ${prev.name} }, () => readInt());`;
                }
                return `const ${p.name} = Array.from({ length: readInt() }, () => readInt());`;
            }
            if (p.type.toLowerCase().includes('int')) {
                return `const ${p.name} = readInt();`;
            }
            return `const ${p.name} = readNext();`;
        }).join('\n');

        return `const fs = require('fs');

// #region Input Helpers
// Read all input at once and tokenize by any whitespace
const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
let idx = 0;

function readNext() {
    // Get the next token from input (handles spaces, tabs, newlines)
    return idx < tokens.length ? tokens[idx++] : null;
}

function readInt() {
    // Read next token as integer
    const val = readNext();
    return val !== null ? parseInt(val, 10) : null;
}

function readFloat() {
    // Read next token as float
    const val = readNext();
    return val !== null ? parseFloat(val) : null;
}
// #endregion

// ========== YOUR SOLUTION BELOW ==========

function ${parsed.name}(${params}) {
    // Write your code here
}

// Read input and execute
${reads}

const result = ${parsed.name}(${params});

// Print result if function returns something
if (result !== undefined && result !== null) {
    console.log(result);
}`;
    }

    if (language === 'java') {
        const params = parsed.params.map(p => `${mapType(p.type, 'java')} ${p.name}`).join(', ');
        const reads = parsed.params.map(p => {
            const lowType = p.type.toLowerCase();
            if (lowType.includes('list')) {
                return `        int n_${p.name} = sc.nextInt();\n        int[] ${p.name} = new int[n_${p.name}];\n        for (int i = 0; i < n_${p.name}; i++) ${p.name}[i] = sc.nextInt();`;
            }
            const javaType = mapType(p.type, 'java');
            if (javaType === 'int') return `        int ${p.name} = sc.nextInt();`;
            if (javaType === 'String') return `        String ${p.name} = sc.next();`;
            return `        ${javaType} ${p.name} = sc.next();`;
        }).join('\n');
        const args = parsed.params.map(p => p.name).join(', ');

        return `import java.util.*;

public class Solution {
    // ========== YOUR SOLUTION BELOW ==========
    public static ${mappedReturn} ${parsed.name}(${params}) {
        // Write your code here
        return ${mappedReturn === 'void' ? '' : (mappedReturn.includes('[]') ? 'new ' + mappedReturn + '{}' : (mappedReturn === 'int' ? '0' : 'null'))};
    }
    
    public static void main(String[] args) {
        // #region Input Helpers
        Scanner sc = new Scanner(System.in);
        
        // Read input and execute
${reads}
        // #endregion
        
        // Call function and output
        ${mappedReturn === 'void' ? '' : 'System.out.println('}${parsed.name}(${args})${mappedReturn === 'void' ? '' : ')'};
    }
}`;
    }

    if (language === 'cpp') {
        const params = parsed.params.map(p => `${mapType(p.type, 'cpp')} ${p.name}`).join(', ');
        const reads = parsed.params.map(p => {
            if (p.type.toLowerCase().includes('list')) {
                return `    int n_${p.name}; cin >> n_${p.name};\n    vector<int> ${p.name}(n_${p.name});\n    for (int i = 0; i < n_${p.name}; i++) cin >> ${p.name}[i];`;
            }
            const cppType = mapType(p.type, 'cpp');
            return `    ${cppType} ${p.name}; cin >> ${p.name};`;
        }).join('\n');
        const args = parsed.params.map(p => p.name).join(', ');

        return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// ========== YOUR SOLUTION BELOW ==========
${mappedReturn} ${parsed.name}(${params}) {
    // Write your code here
    return ${mappedReturn === 'void' ? '' : (mappedReturn == 'int' ? '0' : (mappedReturn.includes('string') ? '""' : '{}'))};
}

int main() {
    // #region Input Helpers
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read input and execute
${reads}
    // #endregion
    
    // Call function and output
    ${mappedReturn === 'void' ? '' : 'cout << '}${parsed.name}(${args})${mappedReturn === 'void' ? '' : ' << endl'};
    return 0;
}`;
    }

    return problem.starterCode || '';
}

/**
 * Backward compatibility for structured helper (returns legacy format inside structured object)
 */
export function generateStructuredStarterCode(inputFormat: string, language: string): any {
    return {
        imports: '',
        userCode: generateStarterCode({ inputFormat } as any, language),
        driverCode: ''
    };
}
