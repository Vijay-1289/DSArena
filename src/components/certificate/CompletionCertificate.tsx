import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Award, Star } from 'lucide-react';

interface CompletionCertificateProps {
  userName: string;
  completionDate: string;
  trackName: string;
  totalProblems: number;
}

export function CompletionCertificate({
  userName,
  completionDate,
  trackName,
  totalProblems,
}: CompletionCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = () => {
    // Create a canvas from the certificate
    const certificate = certificateRef.current;
    if (!certificate) return;

    import('html2canvas').then((html2canvas) => {
      html2canvas.default(certificate, {
        scale: 2,
        backgroundColor: null,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${trackName.replace(/\s+/g, '_')}_Certificate_${userName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate */}
      <div
        ref={certificateRef}
        className="relative w-full max-w-2xl aspect-[1.4/1] rounded-2xl p-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--background)) 50%, hsl(var(--accent)/0.1) 100%)',
          border: '3px solid hsl(var(--primary))',
          boxShadow: '0 0 40px hsl(var(--primary)/0.3), inset 0 0 60px hsl(var(--primary)/0.05)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-4 left-4">
          <Star className="w-6 h-6 text-primary animate-pulse" fill="currentColor" />
        </div>
        <div className="absolute top-4 right-4">
          <Star className="w-6 h-6 text-primary animate-pulse" fill="currentColor" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Star className="w-6 h-6 text-primary animate-pulse" fill="currentColor" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Star className="w-6 h-6 text-primary animate-pulse" fill="currentColor" />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary/50 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary/50 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary/50 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/50 rounded-br-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          {/* Logo/Badge */}
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            Certificate of Completion
          </h1>

          <p className="text-muted-foreground text-sm mb-4">This is to certify that</p>

          {/* Name */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-mono">
            {userName}
          </h2>

          <p className="text-muted-foreground text-sm mb-2">has successfully completed</p>

          {/* Track Name */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-6 py-2 mb-3">
            <h3 className="text-xl md:text-2xl font-bold text-primary">
              {trackName}
            </h3>
          </div>

          {/* Problems count */}
          <p className="text-muted-foreground text-sm mb-4">
            Solving all <span className="text-primary font-bold">{totalProblems}</span> coding challenges
          </p>

          {/* Date */}
          <div className="mt-auto pt-4 border-t border-border/50 w-full">
            <p className="text-sm text-muted-foreground">
              Completed on{' '}
              <span className="text-foreground font-medium">{completionDate}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <span className="text-primary">🏆</span> DSArena <span className="text-primary">🏆</span>
            </p>
          </div>
        </div>

        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Download Button */}
      <Button onClick={downloadCertificate} className="gap-2">
        <Download className="w-4 h-4" />
        Download Certificate
      </Button>
    </div>
  );
}
