// @ts-nocheck - This is a Deno Edge Function, not regular TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface ExecuteRequest {
  code: string;
  testCases: TestCase[];
  language?: string;
}

interface TestResult {
  passed: boolean;
  actual_output?: string;
  error?: string;
  runtime_ms?: number;
}

// Piston API language mappings
const languageConfig: Record<string, { language: string; version: string; fileName: string }> = {
  python: { language: 'python', version: '3.10.0', fileName: 'main.py' },
  javascript: { language: 'javascript', version: '18.15.0', fileName: 'main.js' },
  java: { language: 'java', version: '15.0.2', fileName: 'Solution.java' }, // Changed from Main.java to Solution.java
  cpp: { language: 'c++', version: '10.2.0', fileName: 'main.cpp' },
  go: { language: 'go', version: '1.16.2', fileName: 'main.go' },
  rust: { language: 'rust', version: '1.68.2', fileName: 'main.rs' },
  csharp: { language: 'csharp', version: '6.12.0', fileName: 'Main.cs' },
  ruby: { language: 'ruby', version: '3.0.1', fileName: 'main.rb' },
  swift: { language: 'swift', version: '5.3.3', fileName: 'main.swift' },
  kotlin: { language: 'kotlin', version: '1.8.20', fileName: 'main.kt' },
};

// Wrap code for different languages to handle input and provide driver logic
function wrapCodeForLanguage(code: string, input: string, language: string): string {
  switch (language) {
    case 'python':
      // Problem data already uses input() and Piston provides stdin.
      // No wrapping needed, avoiding fragile string injection.
      return code;

    case 'javascript':
      // Provide a robust readline() that uses stdin properly
      return `
const fs = require('fs');
const __input = fs.readFileSync(0, 'utf8').split('\\n');
let __line = 0;

function readline() {
    return __line < __input.length ? __input[__line++] : null;
}

function print(...args) {
    console.log(...args);
}

// User code starts here
${code}
`;

    case 'java':
      // Ensure Java has a main method if missing
      if (!code.includes('public static void main')) {
        // Attempt to close the class and add a main method if it looks like a simple Solution class
        // This is a basic heuristic for automated driver code
        if (code.includes('class Solution') && code.trim().endsWith('}')) {
          const lastBraceIndex = code.lastIndexOf('}');
          const strippedCode = code.substring(0, lastBraceIndex);

          return `
${strippedCode}
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        // Automatically handle common problem patterns if main is missing
        // This is a safety driver for compiled languages
        try {
            Solution sol = new Solution();
            // Since we don't know the exact method signature here without reflection,
            // we rely on the fact that existing problems already HAVE main. 
            // This block is for robustness and future multi-language completeness.
            if (sc.hasNextLine()) {
                // Generic invocation logic would go here if signatures were standardized
            }
        } catch (Exception e) {}
    }
}
`;
        }
      }
      return code;

    case 'cpp':
      // Ensure C++ has a main function if missing
      if (!code.includes('int main(') && !code.includes('int main ()')) {
        return `
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

${code}

int main() {
    // Boilerplate for missing driver code
    return 0;
}
`;
      }
      return code;

    case 'ruby':
      return `
$input_data = STDIN.read
$input_lines = $input_data.strip.split("\\n")
$input_index = 0

def gets
  if $input_index < $input_lines.length
    result = $input_lines[$input_index]
    $input_index += 1
    result + "\\n"
  else
    nil
  end
end

# User code starts here
${code}
`;
    case 'go':
      // For Go, we don't wrap - assume user handles bufio
      return code;
    case 'rust':
      // For Rust, we don't wrap - assume user handles stdin
      return code;
    case 'csharp':
      // For C#, we don't wrap - assume user handles Console.ReadLine
      return code;
    case 'swift':
      // For Swift, we don't wrap - assume user handles readLine()
      return code;
    case 'kotlin':
      // For Kotlin, we don't wrap - assume user handles readLine()
      return code;
    default:
      return code;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, testCases, language = 'python' }: ExecuteRequest = await req.json();

    // Generate unique request ID for debugging
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] Executing ${language} code with ${testCases.length} test cases`);

    const config = languageConfig[language] || languageConfig.python;
    const results: TestResult[] = [];
    let consoleOutput = '';

    // IMPORTANT: Each request creates fresh results array (no state leakage between requests)
    // Each test case runs in isolated Piston execution environment

    for (const testCase of testCases) {
      const startTime = Date.now();

      try {
        // Wrap user code based on language
        const wrappedCode = wrapCodeForLanguage(code, testCase.input, language);

        // Call Piston API for code execution
        const pistonResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: config.language,
            version: config.version,
            files: [
              {
                name: config.fileName,
                content: wrappedCode,
              },
            ],
            stdin: testCase.input,
            run_timeout: 5000, // 5 second timeout
          }),
        });

        const pistonResult = await pistonResponse.json();
        console.log('Piston result:', JSON.stringify(pistonResult));

        const endTime = Date.now();
        const runtime = endTime - startTime;

        // Check for compile errors first
        if (pistonResult.compile?.stderr) {
          results.push({
            passed: false,
            error: `Compile Error: ${pistonResult.compile.stderr}`,
            runtime_ms: runtime,
          });
          consoleOutput += `Compile error:\n${pistonResult.compile.stderr}\n`;
        } else if (pistonResult.run?.stderr) {
          results.push({
            passed: false,
            error: pistonResult.run.stderr,
            runtime_ms: runtime,
          });
          consoleOutput += `Test case error:\n${pistonResult.run.stderr}\n`;
        } else {
          const actualOutput = (pistonResult.run?.stdout || '').trim();
          const expectedOutput = testCase.expectedOutput.trim();
          const passed = actualOutput === expectedOutput;

          results.push({
            passed,
            actual_output: actualOutput,
            runtime_ms: runtime,
          });

          if (!passed) {
            consoleOutput += `Expected: ${expectedOutput}\nGot: ${actualOutput}\n\n`;
          }
        }
      } catch (error: unknown) {
        console.error('Execution error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Execution failed';
        results.push({
          passed: false,
          error: errorMessage,
          runtime_ms: Date.now() - startTime,
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    consoleOutput = `[${config.language.toUpperCase()}] Passed ${passedCount}/${results.length} test cases\n\n` + consoleOutput;

    console.log(`[${requestId}] Execution complete: ${passedCount}/${results.length} passed`);

    return new Response(
      JSON.stringify({ results, consoleOutput }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in execute-code function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute code';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
