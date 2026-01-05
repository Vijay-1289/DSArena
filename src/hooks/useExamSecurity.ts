import { useEffect, useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseExamSecurityProps {
  isActive: boolean;
  heartsRemaining: number;
  onViolation: (type: string) => void;
  onDisqualify: () => void;
  onAbandon?: () => void;
  onAutoSubmit?: () => void; // Called when lives reach 0 to auto-submit
}

const GRACE_PERIOD_MS = 10 * 1000; // 10 seconds grace period

export function useExamSecurity({
  isActive,
  heartsRemaining,
  onViolation,
  onDisqualify,
  onAbandon,
  onAutoSubmit,
}: UseExamSecurityProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const violationCountRef = useRef(0);

  // Use ref to track current hearts to avoid stale closure issues
  const heartsRef = useRef(heartsRemaining);
  useEffect(() => {
    heartsRef.current = heartsRemaining;
  }, [heartsRemaining]);

  // Grace period tracking for tab switches and blur events
  const focusLossTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFocusLostRef = useRef(false);
  const pendingViolationTypeRef = useRef<string | null>(null);

  // Clear the grace period timer
  const clearGracePeriodTimer = useCallback(() => {
    if (focusLossTimerRef.current) {
      clearTimeout(focusLossTimerRef.current);
      focusLossTimerRef.current = null;
    }
    isFocusLostRef.current = false;
    pendingViolationTypeRef.current = null;
  }, []);

  // Handle focus loss with grace period - uses ref for current hearts value
  const handleFocusLossWithGrace = useCallback((violationType: string) => {
    // If already tracking a focus loss, don't restart the timer
    if (isFocusLostRef.current) return;
    
    // Mark focus as lost and store the violation type
    isFocusLostRef.current = true;
    pendingViolationTypeRef.current = violationType;

    // Start grace period timer
    focusLossTimerRef.current = setTimeout(() => {
      // Get current hearts from ref to avoid stale closure
      const currentHearts = heartsRef.current;
      
      // Only trigger violation if still in focus-lost state and exam is active
      if (isFocusLostRef.current && currentHearts > 0) {
        onViolation(violationType);
        
        // Check if this causes lives to reach 0 (after deduction)
        const newHearts = currentHearts - 1;
        if (newHearts <= 0 && onAutoSubmit) {
          // Delay slightly to allow violation to process
          setTimeout(() => {
            onAutoSubmit();
          }, 100);
        }
      }
      // Reset tracking state
      isFocusLostRef.current = false;
      pendingViolationTypeRef.current = null;
      focusLossTimerRef.current = null;
    }, GRACE_PERIOD_MS);
  }, [onViolation, onAutoSubmit]);

  // Handle focus return (cancel pending violation)
  const handleFocusReturn = useCallback(() => {
    if (isFocusLostRef.current) {
      clearGracePeriodTimer();
    }
  }, [clearGracePeriodTimer]);

  // Request fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast.error('Please enable fullscreen mode to continue the exam');
      return false;
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
    setIsFullscreen(false);
  }, []);

  // Track fullscreen exit attempts
  const fullscreenExitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenExitCountRef = useRef(0);

  // Handle fullscreen change (no grace period - immediate for security)
  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      if (!isNowFullscreen && isActive && heartsRemaining > 0) {
        fullscreenExitCountRef.current += 1;
        const exitCount = fullscreenExitCountRef.current;
        
        onViolation('fullscreen_exit');
        
        // If this is the second consecutive exit, abandon immediately
        if (exitCount >= 2) {
          toast.error('🚫 Exam abandoned due to repeated fullscreen exits!', {
            description: 'Your exam has been terminated and you are blocked from retaking.',
            duration: 5000,
          });
          if (onAbandon) {
            onAbandon();
          } else {
            onDisqualify();
          }
          return;
        }
        
        toast.error('⚠️ Warning: Fullscreen exited!', {
          description: `You lost a heart. ${heartsRemaining - 1} hearts remaining. Return to fullscreen or your exam will be terminated.`,
          duration: 3000,
        });
        
        // Clear any existing timeout
        if (fullscreenExitTimeoutRef.current) {
          clearTimeout(fullscreenExitTimeoutRef.current);
        }
        
        // Set timeout - if user doesn't re-enter fullscreen within 3 seconds, abandon exam
        fullscreenExitTimeoutRef.current = setTimeout(() => {
          if (!document.fullscreenElement && isActive) {
            toast.error('🚫 Exam abandoned!', {
              description: 'You did not return to fullscreen mode. Your exam has been terminated.',
              duration: 5000,
            });
            if (onAbandon) {
              onAbandon();
            } else {
              onDisqualify();
            }
          }
        }, 3000);
        
        // Also try to re-enter fullscreen immediately
        setTimeout(() => {
          enterFullscreen();
        }, 100);
      } else if (isNowFullscreen) {
        // User re-entered fullscreen, clear the abandon timeout but keep exit count
        if (fullscreenExitTimeoutRef.current) {
          clearTimeout(fullscreenExitTimeoutRef.current);
          fullscreenExitTimeoutRef.current = null;
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      if (fullscreenExitTimeoutRef.current) {
        clearTimeout(fullscreenExitTimeoutRef.current);
      }
    };
  }, [isActive, heartsRemaining, onViolation, onDisqualify, onAbandon, enterFullscreen]);

  // Continuously check and enforce fullscreen while exam is active
  useEffect(() => {
    if (!isActive) return;

    const enforceFullscreen = setInterval(() => {
      if (!document.fullscreenElement && heartsRemaining > 0) {
        enterFullscreen();
      }
    }, 500);

    return () => clearInterval(enforceFullscreen);
  }, [isActive, heartsRemaining, enterFullscreen]);

  // Handle visibility change (tab switch) with 10-second grace period
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden && heartsRef.current > 0) {
        // Tab is hidden - start grace period
        handleFocusLossWithGrace('tab_switch');
      } else if (!document.hidden) {
        // Tab is visible again - cancel pending violation if within grace period
        handleFocusReturn();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearGracePeriodTimer();
    };
  }, [isActive, handleFocusLossWithGrace, handleFocusReturn, clearGracePeriodTimer]);

  // Handle window blur with 10-second grace period
  useEffect(() => {
    if (!isActive) return;

    const handleBlur = () => {
      if (heartsRef.current > 0) {
        // Window lost focus - start grace period
        handleFocusLossWithGrace('window_blur');
      }
    };

    const handleFocus = () => {
      // Window regained focus - cancel pending violation if within grace period
      handleFocusReturn();
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearGracePeriodTimer();
    };
  }, [isActive, handleFocusLossWithGrace, handleFocusReturn, clearGracePeriodTimer]);

  // Prevent copy, paste, right-click
  useEffect(() => {
    if (!isActive) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation('copy');
      toast.warning('Copying is disabled during the exam');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation('paste');
      toast.warning('Pasting is disabled during the exam');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning('Right-click is disabled during the exam');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey || e.metaKey) {
        if (['c', 'v', 'x'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          toast.warning('Keyboard shortcuts are disabled during the exam');
        }
      }
      
      // Prevent F5 refresh
      if (e.key === 'F5') {
        e.preventDefault();
        toast.warning('Page refresh is disabled during the exam');
      }
      
      // Prevent Ctrl+R refresh
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        toast.warning('Page refresh is disabled during the exam');
      }
    };

    // Prevent back navigation
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      toast.warning('Back navigation is disabled during the exam');
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive, onViolation]);

  // Prevent beforeunload
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have an exam in progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);

  // Check hearts and disqualify if needed
  useEffect(() => {
    if (heartsRemaining <= 0 && isActive) {
      onDisqualify();
    }
  }, [heartsRemaining, isActive, onDisqualify]);

  // Cleanup grace period timer on unmount or when exam becomes inactive
  useEffect(() => {
    if (!isActive) {
      clearGracePeriodTimer();
    }
    return () => {
      clearGracePeriodTimer();
    };
  }, [isActive, clearGracePeriodTimer]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}
