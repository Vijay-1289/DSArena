import React from 'react';
import { ExamHeader } from './ExamHeader';
import { ExamQuestionPanel } from './ExamQuestionPanel';
import { ExamCodeEditor } from './ExamCodeEditor';
import { ExamConsole } from './ExamConsole';
import { ExamQuestion, ExamLanguage } from '@/lib/examUtils';

interface ActiveExamInterfaceProps {
    language: ExamLanguage;
    question: ExamQuestion;
    questionIndex: number;
    totalQuestions: number;
    heartsRemaining: number;
    timeRemaining: number;
    formatTime: (seconds: number) => string;
    canSubmit: boolean;
    timeUntilSubmit: number;
    code: string;
    onCodeChange: (code: string) => void;
    onSaveCode: (code: string) => Promise<void>;
    onRunCode: () => void;
    onSubmit: () => void;
    results: any[];
    consoleOutput: string;
    isCompiling: boolean;
    isSubmitting: boolean;
    questionStatuses: ('unanswered' | 'attempted' | 'completed')[];
    onPrevious: () => void;
    onNext: () => void;
}

export function ActiveExamInterface({
    language,
    question,
    questionIndex,
    totalQuestions,
    heartsRemaining,
    timeRemaining,
    formatTime,
    canSubmit,
    timeUntilSubmit,
    code,
    onCodeChange,
    onSaveCode,
    onRunCode,
    onSubmit,
    results,
    consoleOutput,
    isCompiling,
    isSubmitting,
    questionStatuses,
    onPrevious,
    onNext,
}: ActiveExamInterfaceProps) {
    return (
        <div className="h-screen w-full flex flex-col bg-[#030712] text-white p-6 gap-6 font-display overflow-hidden">
            {/* Header / Vitals */}
            <ExamHeader
                language={language}
                currentQuestion={questionIndex}
                totalQuestions={totalQuestions}
                heartsRemaining={heartsRemaining}
                timeRemaining={timeRemaining}
                formatTime={formatTime}
                canSubmit={canSubmit}
                timeUntilSubmit={timeUntilSubmit}
            />

            {/* Main IDE 3-Pane Layout */}
            <main className="flex-1 flex gap-4 overflow-hidden min-h-0">
                {/* Left Pane: Problem Description */}
                <div className="w-1/4 min-w-[300px]">
                    <ExamQuestionPanel
                        question={question}
                        questionIndex={questionIndex}
                    />
                </div>

                {/* Center Pane: Editor */}
                <div className="flex-1 min-w-0">
                    <ExamCodeEditor
                        key={questionIndex}
                        language={language}
                        code={code}
                        onChange={onCodeChange}
                        onRunCode={onRunCode}
                        onFinalize={onSubmit}
                        questionIndex={questionIndex}
                        onSave={onSaveCode}
                        canSubmit={canSubmit}
                        isSubmitting={isSubmitting}
                        isCompiling={isCompiling}
                        questionStatuses={questionStatuses}
                        onPrevious={onPrevious}
                        onNext={onNext}
                        totalQuestions={totalQuestions}
                    />
                </div>

                {/* Right Pane: Output */}
                <div className="w-1/4 min-w-[300px]">
                    <ExamConsole
                        results={results}
                        consoleOutput={consoleOutput}
                        isCompiling={isCompiling}
                    />
                </div>
            </main>

            {/* Footer Stats */}
            <footer className="flex justify-between items-center px-4 py-2 border-t border-white/5 opacity-50">
                <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                        <span className="text-gray-500">Secure Connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 italic">Auto-sync Enabled</span>
                    </div>
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    System ID: <span className="text-red-500/70">DS-ZEN-{question.id.substring(0, 4).toUpperCase()}</span>
                </div>
            </footer>
        </div>
    );
}
