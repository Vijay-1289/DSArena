import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, Rocket, ChevronLeft, ChevronRight, Settings, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { getMonacoLanguage, ExamLanguage } from '@/lib/examUtils';
import { cn } from '@/lib/utils';

interface ExamCodeEditorProps {
  language: ExamLanguage;
  code: string;
  onChange: (code: string) => void;
  onRunCode: () => void;
  onFinalize: () => void;
  questionIndex: number;
  onSave?: (code: string) => Promise<void>;
  canSubmit: boolean;
  isSubmitting: boolean;
  isCompiling: boolean;
  questionStatuses: ('unanswered' | 'attempted' | 'completed')[];
  onPrevious: () => void;
  onNext: () => void;
  totalQuestions: number;
  disabled?: boolean;
}

const LANGUAGE_LOGOS: Record<string, string> = {
  python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  javascript: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  java: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
  cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
};

export function ExamCodeEditor({
  language,
  code,
  onChange,
  onRunCode,
  onFinalize,
  questionIndex,
  onSave,
  canSubmit,
  isSubmitting,
  isCompiling,
  questionStatuses,
  onPrevious,
  onNext,
  totalQuestions,
  disabled = false,
}: ExamCodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Disable paste
    editor.onKeyDown((e: any) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 52) { // KeyV
        e.preventDefault();
        e.stopPropagation();
        toast.error('Pasting is disabled during the exam');
      }
    });

    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      automaticLayout: true,
      tabSize: 4,
      wordWrap: 'on',
      theme: 'vs-dark',
      fontFamily: 'JetBrains Mono',
      folding: true,
      foldingHighlight: true,
      foldingStrategy: 'indentation',
    });

    // 1. Define the One-Shot Fold Logic
    const performInitialFold = () => {
      setTimeout(() => {
        editor.getAction('editor.foldAllMarkerRegions')?.run();
      }, 500); // 500ms delay to ensure tokenization
    };

    // 2. Trigger for Initial Load
    const changeListener = editor.onDidChangeModelContent(() => {
      performInitialFold();
      changeListener.dispose();
    });

    // 3. Fallback
    performInitialFold();
  };

  // Block paste at DOM level
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.monaco-editor')) {
        e.preventDefault();
        toast.error('Pasting is disabled during the exam');
      }
    };

    document.addEventListener('paste', handlePaste, true);
    return () => document.removeEventListener('paste', handlePaste, true);
  }, []);

  // Re-trigger folding when problem or code changes
  useEffect(() => {
    if (editorRef.current && (code.includes('#region') || code.includes('# region'))) {
      const fold = () => editorRef.current.getAction('editor.foldAllMarkerRegions')?.run();
      setTimeout(fold, 100);
      setTimeout(fold, 400);
      setTimeout(fold, 800);
    }
  }, [code, language, questionIndex]);

  const fileName = language === 'python' ? 'main.py' :
    language === 'javascript' ? 'solution.js' :
      language === 'java' ? 'Solution.java' : 'main.cpp';

  return (
    <div className="flex flex-col h-full bg-[#05050A] border border-red-600/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,19,19,0.05)] font-display">
      {/* Editor Header / Tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 opacity-80">Editor.js</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded border border-white/10">
              <img src={LANGUAGE_LOGOS[language]} alt={language} className="h-3.5 w-3.5 object-contain" />
              <span className="text-[10px] font-bold text-gray-300 font-mono tracking-tight">{fileName}</span>
            </div>
            {/* Nav Indicators */}
            <div className="flex gap-1 ml-4 items-center">
              {questionStatuses.map((status, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    idx === questionIndex ? "bg-red-600 shadow-[0_0_8px_#ec1313] scale-125" :
                      status === 'completed' ? "bg-green-500" :
                        status === 'attempted' ? "bg-yellow-500" : "bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 text-gray-500">
          <Settings className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
          <Maximize2 className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-0 bg-[#05050A]">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          loading={
            <div className="flex h-full items-center justify-center bg-black/40">
              <div className="text-gray-600 animate-pulse font-mono text-xs uppercase tracking-widest">Initialising Terminal...</div>
            </div>
          }
        />
      </div>

      {/* Submission Controls (Action Bar) */}
      <div className="p-4 border-top border-white/10 bg-black/40 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={questionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded font-bold text-[10px] transition-all uppercase tracking-widest border border-white/10"
          >
            <ChevronLeft className="h-3 w-3" />
            Prev
          </button>
          <button
            onClick={onNext}
            disabled={questionIndex === totalQuestions - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded font-bold text-[10px] transition-all uppercase tracking-widest border border-white/10"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </button>

          <div className="w-px h-8 bg-white/10 mx-2" />

          <button
            onClick={onRunCode}
            disabled={isCompiling || disabled}
            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 rounded font-bold text-[10px] transition-all uppercase tracking-widest border border-white/10"
          >
            {isCompiling ? (
              <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            Run Tests
          </button>
        </div>

        <button
          onClick={onFinalize}
          disabled={!canSubmit || isSubmitting || disabled}
          className={cn(
            "flex items-center gap-3 px-8 py-2 rounded font-bold text-[10px] transition-all uppercase tracking-[0.15em] border border-red-600/50",
            canSubmit
              ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(236,19,19,0.3)]"
              : "bg-red-950/20 text-red-600/40 opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="h-3 w-3 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <Rocket className="h-3.5 w-3.5" />
          )}
          Finalize Submission
        </button>
      </div>
    </div>
  );
}

