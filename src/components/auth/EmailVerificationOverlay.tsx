import React, { useState } from 'react';
import { Mail, ArrowRight, Shield, AlertTriangle, Sparkles, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface EmailVerificationOverlayProps {
    email: string;
    onClose?: () => void;
}

export function EmailVerificationOverlay({ email, onClose }: EmailVerificationOverlayProps) {
    const { resendVerification } = useAuth();
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        try {
            const { error } = await resendVerification(email);
            if (error) {
                toast.error('Uplink resend failed: ' + error.message, {
                    className: 'bg-[#0B1121] border-red-500/50 text-red-400 font-mono text-[10px] uppercase tracking-widest'
                });
            } else {
                toast.success('New activation signal dispatched!', {
                    className: 'bg-[#0B1121] border-emerald-500/50 text-emerald-400 font-mono text-[10px] uppercase tracking-widest'
                });
            }
        } finally {
            setIsResending(false);
        }
    };

    const openMailApp = () => {
        window.location.href = 'mailto:';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="relative w-full max-w-md">
                {/* Decorative Background Elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-2xl blur-xl opacity-50"></div>

                <div className="relative glass-panel bg-[#0B1121]/80 border border-white/10 rounded-2xl overflow-hidden p-8 shadow-2xl">
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative group">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all animate-pulse"></div>
                            <Mail className="size-8 text-primary relative z-10" />
                            <div className="absolute -top-1 -right-1">
                                <div className="size-4 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                                    <AlertTriangle className="size-2.5 text-black" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase mb-2">
                             Verify your Email!
                        </h2>
                        <div className="h-0.5 w-12 bg-primary/50 mb-6 mx-auto rounded-full"></div>

                        <p className="text-white/60 text-sm font-light leading-relaxed">
                            A secure uplink has been sent to your inbox. Activate it immediately to secure your <span className="text-primary font-bold">3 Lives</span>.
                        </p>
                    </div>

                    {/* Motivational Body */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 mb-8">
                        <div className="flex items-start gap-3">
                            <Shield className="size-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] text-white/40 leading-relaxed italic">
                                Unverified profiles cannot earn XP and are invisible on the Global Leaderboard. Don't let your code go to waste.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    

                    {/* Footer Sub-text */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                            Didn't receive the signal?
                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-primary hover:text-primary/80 font-bold transition-colors disabled:opacity-50 flex items-center gap-1 group/resend underline decoration-primary/20 underline-offset-4"
                            >
                                {isResending ? (
                                    <RefreshCcw className="size-3 animate-spin" />
                                ) : (
                                    <RefreshCcw className="size-3 group-hover/resend:rotate-180 transition-transform duration-500" />
                                )}
                                Resend Uplink
                            </button>
                        </p>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-[9px] text-white/10 hover:text-white/30 uppercase tracking-widest transition-colors font-mono"
                            >
                                [ Proceed to Command Console ]
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
