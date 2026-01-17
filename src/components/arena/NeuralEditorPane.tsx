import { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LanguageSelector } from '@/components/editor/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Play, Send, Loader2, Save, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NeuralEditorPaneProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    isLanguageLocked: boolean;
    onRun: () => void;
    onSubmit: () => void;
    onSave?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onVisualize?: () => void;
    running?: boolean;
    submitting?: boolean;
}

export const NeuralEditorPane = ({
    code,
    setCode,
    language,
    setLanguage,
    isLanguageLocked,
    onRun,
    onSubmit,
    onSave,
    onNext,
    onPrev,
    onVisualize,
    running,
    submitting
}: NeuralEditorPaneProps) => {
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

    // In a real scenario, this would be hooked more deeply into Monaco's state
    // For now we'll maintain a simpler version or just show static/approximate if needed
    // But let's try to make it feel "Connected"

    return (
        <div className="flex h-full flex-col bg-[#05050A] relative group">
            {/* Floating Header */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-2xl">
                <div className="bg-[#0B1121]/80 backdrop-blur-md border border-slate-800/50 rounded-full px-4 py-2 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3">
                        <LanguageSelector
                            value={language}
                            onChange={setLanguage}
                            disabled={isLanguageLocked}
                            restrictedLanguage={isLanguageLocked ? language : null}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {onSave && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onSave}
                                disabled={running || submitting}
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
                                title="Save Progress"
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                        )}
                        <div className="w-px h-4 bg-slate-800/50 mx-1" />

                        {onPrev && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onPrev}
                                disabled={running || submitting}
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all font-bold"
                                title="Previous Question"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {onNext && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onNext}
                                disabled={running || submitting}
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all font-bold"
                                title="Next Question"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}

                        <div className="w-px h-4 bg-slate-800/50 mx-1" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRun}
                            disabled={running || submitting}
                            className="h-8 px-4 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-bold text-xs tracking-widest gap-2"
                        >
                            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                            RUN
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSubmit}
                            disabled={running || submitting}
                            className="h-8 px-4 rounded-full bg-violet-600/10 text-violet-400 hover:text-violet-300 hover:bg-violet-600/20 transition-all font-bold text-xs tracking-widest gap-2 border border-violet-500/20"
                        >
                            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            SUBMIT
                        </Button>
                    </div>
                </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 pt-20 relative overflow-hidden group/editor">
                <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={language}
                    hideHeader
                    hideBorder
                />

                {onVisualize && (
                    <div className="absolute bottom-6 right-24 z-30">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-indigo-500/50 hover:border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-110 transition-all duration-300 group"
                                        onClick={onVisualize}
                                    >
                                        <img
                                            src="/src/assets/neural-lens-avatar.png"
                                            alt="Neural Lens"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/0 transition-colors duration-300" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="bg-[#0B1121] border-slate-800 text-slate-300 text-[10px] font-bold tracking-widest uppercase mb-2">
                                    Visualize Logic (Neural Lens)
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="h-8 bg-[#030712] border-t border-slate-800/50 px-4 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wider">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-500/80 font-bold uppercase">Connected</span>
                    </div>
                    <span>UTF-8</span>
                    <span>Spaces: 4</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                </div>
            </div>
        </div>
    );
};
