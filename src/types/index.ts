export interface ExecutionStep {
    step: number;
    line: string;
    variables: { name: string; value: string }[];
    description: string;
}

export interface CompilerAnalysis {
    asciiFlow: string;
    mermaidChart: string;
    executionLogic: string;
    stateTable: ExecutionStep[];
    narration: string[];
    output: string;
    animationData: {
        nodes: { id: string; label: string }[];
        highlightSequence: {
            nodeId: string;
            value?: any;
        }[];
    };
}

export interface TestCase {
    input: string;
    expectedOutput: string;
    is_visible?: boolean;
}

export interface ExecutionResult {
    passed: boolean;
    actual_output?: string;
    error?: string;
    runtime_ms?: number;
}

export interface ExamAnswer {
    id: string;
    exam_session_id: string;
    user_id: string;
    question_id: string;
    question_index: number;
    code: string;
    is_correct: boolean;
    tests_passed: number;
    tests_total: number;
    compilation_errors: number;
    runtime_errors: number;
    created_at: string;
}
