import { ProblemData } from './problemsData';

interface ParsedSignature {
    name: string;
    params: { name: string; type: string }[];
    returnType: string;
}

function parseSignature(inputFormat: string): ParsedSignature {
    const defaultSig = { name: 'solution', params: [], returnType: 'any' };
    if (!inputFormat) return defaultSig;

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

export function generateStarterCodeLegacy(problem: ProblemData, language: string): string {
    if (problem.starterTemplates && problem.starterTemplates[language]) {
        return problem.starterTemplates[language];
    }

    if (problem.language === language && problem.starterCode) {
        return problem.starterCode;
    }

    const parsed = parseSignature(problem.inputFormat);
    const mappedReturn = mapType(parsed.returnType, language);

    if (language === 'python') {
        const params = parsed.params.map(p => `${p.name}: ${p.type}`).join(', ');
        const returnType = parsed.returnType !== 'any' ? ` -> ${parsed.returnType}` : '';

        const reads = parsed.params.map(p => {
            if (p.type.includes('List')) return `${p.name} = list(map(int, input().split()))`;
            if (p.type.includes('int')) return `${p.name} = int(input())`;
            return `${p.name} = input()`;
        }).join('\n');

        const args = parsed.params.map(p => p.name).join(', ');

        return `def ${parsed.name}(${params})${returnType}:\n    # Write your code here\n    pass\n\n# Read input\n${reads}\nprint(${parsed.name}(${args}))`;
    }

    if (language === 'javascript') {
        const params = parsed.params.map(p => p.name).join(', ');
        const reads = parsed.params.map(p => {
            if (p.type.toLowerCase().includes('list')) {
                return `const ${p.name} = readline().split(' ').map(Number);`;
            }
            if (p.type.toLowerCase().includes('int')) {
                return `const ${p.name} = parseInt(readline());`;
            }
            return `const ${p.name} = readline();`;
        }).join('\n');

        return `function ${parsed.name}(${params}) {\n    // Write your code here\n}\n\n// Read input using readline()\n${reads}\n\nconsole.log(${parsed.name}(${params}));`;
    }

    if (language === 'java') {
        const params = parsed.params.map(p => `${mapType(p.type, 'java')} ${p.name}`).join(', ');
        const reads = parsed.params.map(p => {
            if (p.type.toLowerCase().includes('list')) {
                return `        String[] parts_${p.name} = sc.nextLine().split(" ");\n        int[] ${p.name} = new int[parts_${p.name}.length];\n        for (int i = 0; i < parts_${p.name}.length; i++) {\n            ${p.name}[i] = Integer.parseInt(parts_${p.name}[i]);\n        }`;
            }
            const javaType = mapType(p.type, 'java');
            if (javaType === 'int') return `        int ${p.name} = sc.nextInt();\n        if (sc.hasNextLine()) sc.nextLine();`;
            if (javaType === 'String') return `        String ${p.name} = sc.nextLine();`;
            return `        ${javaType} ${p.name} = sc.next();`;
        }).join('\n');
        const args = parsed.params.map(p => p.name).join(', ');

        return `import java.util.*;\n\npublic class Solution {\n    // Function with logic\n    public static ${mappedReturn} ${parsed.name}(${params}) {\n        // Write your code here\n        return ${mappedReturn === 'void' ? '' : (mappedReturn.includes('[]') ? 'new ' + mappedReturn + '{}' : 'null')};\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        // Read input\n${reads}\n        \n        // Call function and output\n        System.out.println(${parsed.name}(${args}));\n    }\n}`;
    }

    if (language === 'cpp') {
        const params = parsed.params.map(p => `${mapType(p.type, 'cpp')} ${p.name}`).join(', ');
        const reads = parsed.params.map(p => {
            if (p.type.toLowerCase().includes('list')) {
                return `    int n_${p.name};\n    cin >> n_${p.name};\n    vector<int> ${p.name}(n_${p.name});\n    for (int i = 0; i < n_${p.name}; i++) cin >> ${p.name}[i];`;
            }
            const cppType = mapType(p.type, 'cpp');
            return `    ${cppType} ${p.name};\n    cin >> ${p.name};`;
        }).join('\n');
        const args = parsed.params.map(p => p.name).join(', ');

        return `#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\n// Function with logic\n${mappedReturn} ${parsed.name}(${params}) {\n    // Write your code here\n    return ${mappedReturn === 'void' ? '' : (mappedReturn == 'int' ? '0' : (mappedReturn.includes('string') ? '""' : '{}'))};\n}\n\nint main() {\n    // Read input\n${reads}\n    \n    // Call function and output\n    cout << ${parsed.name}(${args}) << endl;\n    return 0;\n}`;
    }

    return problem.starterCode || '';
}
