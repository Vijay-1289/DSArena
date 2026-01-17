import { CompilerAnalysis } from '../types';

const GEMINI_API_KEY = 'AIzaSyB53Bog_-7EFFY9rP3kW8DedPkfmnFE4XE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function analyzeCode(code: string, language: string, input: string = ''): Promise<CompilerAnalysis> {
    const systemPrompt = `You are a Code Analysis Engine. Analyze the provided code snippet and return a strict JSON object (no markdown, no code blocks) matching this TypeScript interface:

interface CompilerAnalysis {
  asciiFlow: string; // A vertical ASCII art flowchart of the logic
  mermaidChart: string; // Valid Mermaid.js flowchart syntax (TD)
  executionLogic: string; // A clear text explanation of the code's flow
  stateTable: {
    step: number;
    line: string; // The code line content
    variables: { name: string; value: string }[];
    description: string;
  }[];
  narration: string[]; // Step-by-step narration strings
  output: string; // Predicted console output
  animationData: {
    nodes: { id: string; label: string }[]; // Flowchart nodes
    highlightSequence: { 
      nodeId: string; // Which node is active
      value?: string; // Current value being processed (optional)
    }[];
  };
}

**Constraint:** Ensure mermaidChart uses simple node IDs (A, B, C) and avoids brackets in labels if possible to prevent syntax errors. Ensure highlightSequence maps correctly to the nodes IDs.`;

    const userPrompt = `Language: ${language}\nInput: ${input}\nCode:\n${code}`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
                }]
            })
        });

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Gemini API error:', data);
            throw new Error('Failed to generate visualization from Gemini');
        }

        let generatedText = data.candidates[0].content.parts[0].text;

        // Clean up markdown code blocks if present
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed: CompilerAnalysis = JSON.parse(generatedText);
        return parsed;
    } catch (error) {
        console.error('Error analyzing code with Gemini:', error);
        throw error;
    }
}

export interface ExtractedQuestion {
    title: string;
    description: string;
    test_cases: {
        input: string;
        output: string;
        hidden: boolean;
    }[];
}

export async function extractQuestionsFromText(text: string): Promise<ExtractedQuestion[]> {
    const systemPrompt = `You are an Educational Content Parser. Analyze the raw text from an exam paper and extract individual questions. 
Return a strict JSON array (no markdown, no preamble) of objects matching this interface:

interface ExtractedQuestion {
  title: string;
  description: string;
  test_cases: {
    input: string;
    output: string;
    hidden: boolean;
  }[];
}

**Requirements:**
1. Extract the question title and full description.
2. Identify or generate 3-5 test cases (at least one hidden).
3. If the input/output format isn't explicit, infer logical test cases based on the description.
4. Return ONLY the JSON array.`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt + "\n\nRaw Exam Text:\n" + text }]
                }]
            })
        });

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Gemini API error:', data);
            throw new Error('Failed to extract questions from Gemini');
        }

        let generatedText = data.candidates[0].content.parts[0].text;
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(generatedText);
    } catch (error) {
        console.error('Error extracting questions with Gemini:', error);
        throw error;
    }
}
