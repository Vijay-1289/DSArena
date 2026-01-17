import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamHeaderProps {
  language: string;
  currentQuestion: number;
  totalQuestions: number;
  heartsRemaining: number;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  canSubmit: boolean;
  timeUntilSubmit: number;
}

export function ExamHeader({
  language,
  currentQuestion,
  totalQuestions,
  heartsRemaining,
  timeRemaining,
  formatTime,
  canSubmit,
  timeUntilSubmit,
}: ExamHeaderProps) {
  // Parse timeRemaining into HH:MM:SS for the digital clock
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <header className="relative flex items-center justify-between w-full h-16 px-6 bg-[#030712] border-b border-white/10 shrink-0">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-red-600 text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 leading-tight">
            Zen Mode Active
          </h2>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 leading-tight">
            DSArena Exam <span className="text-white/40 font-mono text-sm ml-1">#402</span>
          </h1>
        </div>
      </div>

      {/* Center: Large Red Digital Clock */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-baseline gap-1 font-mono text-red-500">
          <span className="text-3xl font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            {pad(hours)}
          </span>
          <span className="text-xl opacity-30 animate-pulse">:</span>
          <span className="text-3xl font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            {pad(minutes)}
          </span>
          <span className="text-xl opacity-30 animate-pulse">:</span>
          <span className="text-3xl font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            {pad(seconds)}
          </span>
        </div>
        <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Remaining Time</p>
      </div>

      {/* Right: Integrity Widget */}
      <div className="flex items-center gap-6 bg-white/5 px-6 py-2 rounded-full border border-white/10">
        <div className="flex flex-col items-end">
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-0.5">Integrity</p>
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <Heart
                key={index}
                className={cn(
                  "h-4 w-4 transition-all duration-500",
                  index < heartsRemaining
                    ? "fill-red-600 text-red-600 drop-shadow-[0_0_5px_rgba(220,38,38,0.6)]"
                    : "text-white/10 fill-transparent"
                )}
              />
            ))}
          </div>
        </div>

        {/* Pulsing Recording Dot */}
        <div className="relative flex items-center justify-center p-2 rounded-lg bg-black/40 border border-white/10 group overflow-hidden">
          <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
        </div>
      </div>
    </header>
  );
}

