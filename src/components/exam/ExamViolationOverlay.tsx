import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExamViolationOverlayProps {
    isOpen: boolean;
    message: string;
    endTime: number | null;
    onReturn: () => void;
}

export function ExamViolationOverlay({ isOpen, message, endTime, onReturn }: ExamViolationOverlayProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'f') {
                onReturn();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onReturn]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <Card className="w-full max-w-md border-red-600 bg-[#05050A] shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-in fade-in zoom-in duration-300">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white tracking-tighter uppercase italic">Focus Required</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-red-600 font-mono text-xs uppercase tracking-[0.2em] font-bold">Unauthorized Action Detected</p>
                        <p className="text-gray-400 text-sm">{message}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-mono font-bold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                <CountdownTimer endTime={endTime || 0} />
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Grace Period Remaining</span>
                        </div>
                        <Button
                            variant="destructive"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs h-12 shadow-[0_0_20px_rgba(236,19,19,0.3)]"
                            onClick={onReturn}
                        >
                            Return to Exam (Press 'F')
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CountdownTimer({ endTime }: { endTime: number }) {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0) clearInterval(interval);
        }, 100);

        return () => clearInterval(interval);
    }, [endTime, timeLeft]);

    return (
        <span>
            {timeLeft}s
        </span>
    );
}
