import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface GlitchyAssistantProps {
  code: string;
  language: string;
  problemDescription: string;
  lastError?: string | null;
}

type GlitchyMood = 'idle' | 'thinking' | 'alert' | 'happy' | 'curious' | 'impressed' | 'sleepy' | 'tired';

export function GlitchyAssistant({ code, language, problemDescription, lastError }: GlitchyAssistantProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [mood, setMood] = useState<GlitchyMood>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCodeLength, setLastCodeLength] = useState(0);

  // Show Glitchy when there's an error
  useEffect(() => {
    if (lastError && lastError.length > 0) {
      setMood('alert');
      setIsVisible(true);
      fetchHint(true);
    }
  }, [lastError]);

  // Track code changes for curious reactions
  useEffect(() => {
    const diff = Math.abs(code.length - lastCodeLength);
    if (diff > 50 && lastCodeLength > 0) {
      setMood('curious');
      setIsVisible(true);
    }
    setLastCodeLength(code.length);
  }, [code]);

  const fetchHint = useCallback(async (hasError = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setMood('thinking');

    try {
      const { data, error } = await supabase.functions.invoke('glitchy-hint', {
        body: {
          code,
          problem: problemDescription.slice(0, 500),
          language,
          error: hasError ? lastError : null,
        },
      });

      if (error) throw error;

      setHint(data.hint);
      setMood(data.mood || 'happy');
    } catch (err) {
      console.error('Glitchy error:', err);
      setHint("*purrs* I'm here to help! Keep coding! 🐱");
      setMood('sleepy');
    } finally {
      setIsLoading(false);
    }
  }, [code, language, problemDescription, lastError, isLoading]);

  const handleGlitchyClick = () => {
    if (!isVisible) {
      setIsVisible(true);
      setMood('curious');
    } else if (!hint) {
      fetchHint(false);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setHint(null);
        setMood('idle');
      }, 300);
    }
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case 'alert': return '😾';
      case 'happy': return '😸';
      case 'curious': return '🙀';
      case 'thinking': return '🤔';
      case 'impressed': return '😻';
      case 'sleepy': return '😿';
      case 'tired': return '😴';
      default: return '😺';
    }
  };

  const getMoodAnimation = () => {
    switch (mood) {
      case 'alert': return 'animate-bounce';
      case 'thinking': return 'animate-pulse';
      case 'curious': return 'animate-wiggle';
      default: return '';
    }
  };

  return (
    <div className="absolute top-0 right-16 z-50">
      {/* Glitchy Cat - Peeking from top like Snapchat avatar */}
      <div 
        className={cn(
          "relative cursor-pointer transition-all duration-300 ease-out",
          getMoodAnimation()
        )}
        onClick={handleGlitchyClick}
      >
        {/* Cat Avatar Container - Peeking effect */}
        <div 
          className={cn(
            "relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50 shadow-lg overflow-hidden transition-all duration-300",
            "hover:scale-110 hover:border-primary",
            isVisible ? "translate-y-0" : "-translate-y-2",
            mood === 'alert' && "border-destructive animate-pulse"
          )}
        >
          {/* Cat Face SVG */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
          >
            {/* Cat head */}
            <ellipse cx="50" cy="55" rx="35" ry="30" fill="hsl(var(--muted))" />
            
            {/* Left ear */}
            <polygon points="20,35 30,15 40,35" fill="hsl(var(--muted))" />
            <polygon points="23,33 30,20 37,33" fill="hsl(var(--primary)/0.3)" />
            
            {/* Right ear */}
            <polygon points="60,35 70,15 80,35" fill="hsl(var(--muted))" />
            <polygon points="63,33 70,20 77,33" fill="hsl(var(--primary)/0.3)" />
            
            {/* Eyes */}
            <ellipse 
              cx="35" 
              cy="50" 
              rx={mood === 'alert' ? '8' : '6'} 
              ry={mood === 'sleepy' || mood === 'tired' ? '2' : '8'} 
              fill="hsl(var(--primary))" 
            />
            <ellipse 
              cx="65" 
              cy="50" 
              rx={mood === 'alert' ? '8' : '6'} 
              ry={mood === 'sleepy' || mood === 'tired' ? '2' : '8'} 
              fill="hsl(var(--primary))" 
            />
            
            {/* Pupils */}
            {mood !== 'sleepy' && mood !== 'tired' && (
              <>
                <circle cx="35" cy="50" r="3" fill="hsl(var(--background))" />
                <circle cx="65" cy="50" r="3" fill="hsl(var(--background))" />
              </>
            )}
            
            {/* Nose */}
            <polygon points="50,58 46,64 54,64" fill="hsl(var(--primary))" />
            
            {/* Mouth */}
            <path 
              d={mood === 'happy' || mood === 'impressed' 
                ? "M 42 68 Q 50 76 58 68" 
                : mood === 'alert' 
                  ? "M 42 70 Q 50 65 58 70" 
                  : "M 42 68 Q 50 72 58 68"
              } 
              stroke="hsl(var(--foreground))" 
              strokeWidth="2" 
              fill="none" 
            />
            
            {/* Whiskers */}
            <line x1="10" y1="55" x2="30" y2="58" stroke="hsl(var(--foreground)/0.5)" strokeWidth="1" />
            <line x1="10" y1="62" x2="30" y2="62" stroke="hsl(var(--foreground)/0.5)" strokeWidth="1" />
            <line x1="70" y1="58" x2="90" y2="55" stroke="hsl(var(--foreground)/0.5)" strokeWidth="1" />
            <line x1="70" y1="62" x2="90" y2="62" stroke="hsl(var(--foreground)/0.5)" strokeWidth="1" />
          </svg>
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Mood Indicator Bubble */}
        <span className={cn(
          "absolute -bottom-1 -left-1 text-sm bg-card rounded-full w-5 h-5 flex items-center justify-center border border-border shadow-sm",
          mood === 'alert' && "animate-bounce"
        )}>
          {getMoodEmoji()}
        </span>
        
        {/* Thinking dots when curious or thinking */}
        {(mood === 'thinking' || mood === 'curious') && !hint && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {/* Speech Bubble */}
        {isVisible && hint && (
          <div 
            className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-3 rounded-lg",
              "bg-card border border-border shadow-xl",
              "animate-in fade-in slide-in-from-top-2 duration-200"
            )}
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-border transform rotate-45" />
            
            {/* Content */}
            <p className="text-sm text-foreground relative z-10 leading-relaxed">{hint}</p>
            
            {/* Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchHint(!!lastError);
              }}
              className="mt-2 text-xs text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Thinking...' : '🐱 Ask for another hint'}
            </button>
          </div>
        )}

        {/* Tooltip when not showing hint */}
        {!hint && !isLoading && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-xs bg-card border border-border px-2 py-1 rounded shadow whitespace-nowrap">
              Click for hints! 🐱
            </span>
          </div>
        )}
      </div>
    </div>
  );
}