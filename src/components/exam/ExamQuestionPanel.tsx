import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExamQuestion } from '@/lib/examUtils';
import { cn } from '@/lib/utils';

interface ExamQuestionPanelProps {
  question: ExamQuestion;
  questionIndex: number;
}

export function ExamQuestionPanel({ question, questionIndex }: ExamQuestionPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#0B1121] border border-white/10 rounded-xl overflow-hidden font-display">
      {/* Label & Difficulty */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Problem Description</span>
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-tight",
          question.difficulty === 'easy' ? "bg-green-600/20 text-green-500 border-green-600/30" :
            question.difficulty === 'medium' ? "bg-yellow-600/20 text-yellow-500 border-yellow-600/30" :
              "bg-red-600 text-white border-red-600"
        )}>
          {question.difficulty}
        </span>
      </div>

      <ScrollArea className="flex-1 p-6 custom-scrollbar">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
              {question.title}
            </h2>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed font-sans">
              {question.description}
            </div>
          </div>

          {/* Example 1 Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] opacity-60">Example 1</h3>
            <div className="bg-[#05050A] rounded-lg p-4 border border-white/5 space-y-3 font-mono">
              <div className="bg-black/40 rounded p-4 border border-white/5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">Input:</span>
                  <span className="text-gray-400 break-all">{question.visibleTestCases[0]?.input || 'n/a'}</span>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-red-500 font-bold shrink-0">Output:</span>
                  <span className="text-gray-400 break-all">{question.visibleTestCases[0]?.expectedOutput || 'n/a'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] opacity-60">Constraints</h3>
            <ul className="text-xs text-gray-400 list-disc list-inside space-y-1.5 font-sans italic opacity-80">
              {question.constraints ? (
                question.constraints.split('\n').map((constraint, i) => (
                  <li key={i}>{constraint.replace(/^- /, '')}</li>
                ))
              ) : (
                <>
                  <li>Time complexity: O(n)</li>
                  <li>Space complexity: O(1)</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
