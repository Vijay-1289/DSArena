import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

interface CompletionCertificateProps {
  completionDate: string;
  trackName: string;
  totalProblems: number;
}

export function CompletionCertificate({
  completionDate,
  trackName,
  totalProblems,
}: CompletionCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('');
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);

  const downloadCertificate = () => {
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

  // Name input form
  if (!isNameConfirmed) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Enter Your Name</h2>
          <p className="text-muted-foreground text-sm">
            This name will appear on your certificate
          </p>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          <Input
            type="text"
            placeholder="Your Full Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-center text-lg"
            autoFocus
          />
          
          <Button 
            onClick={() => setIsNameConfirmed(true)}
            disabled={!userName.trim()}
            className="w-full"
          >
            Generate Certificate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate */}
      <div
        ref={certificateRef}
        className="relative w-full max-w-2xl aspect-[1.4/1] rounded-sm overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f5f5f0 0%, #f0ebe3 50%, #e8e4dc 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Decorative floral pattern on right side */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 400'%3E%3Cpath d='M150 50 Q180 80 160 120 Q140 160 170 200 Q200 240 160 280 Q120 320 150 360' stroke='%23364e68' fill='none' stroke-width='2'/%3E%3Cpath d='M120 30 Q150 60 130 100 Q110 140 140 180 Q170 220 130 260 Q90 300 120 340' stroke='%23364e68' fill='none' stroke-width='1.5'/%3E%3Ccircle cx='140' cy='70' r='8' fill='none' stroke='%23364e68'/%3E%3Ccircle cx='155' cy='150' r='6' fill='none' stroke='%23364e68'/%3E%3Ccircle cx='125' cy='220' r='10' fill='none' stroke='%23364e68'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-y',
            backgroundPosition: 'right center',
          }}
        />

        {/* Ribbon/Medal decoration */}
        <div className="absolute right-8 top-4">
          <div className="relative">
            {/* Ribbon tails */}
            <div 
              className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: '40px solid #364e68',
              }}
            />
            {/* Medal circle */}
            <div 
              className="relative w-16 h-16 rounded-full border-4 flex items-center justify-center z-10"
              style={{
                background: 'linear-gradient(135deg, #e8e4dc 0%, #c9c5bd 100%)',
                borderColor: '#a0998e',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #f5f5f0 0%, #d4d0c8 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
          {/* Title */}
          <div className="mb-6">
            <h1 
              className="text-4xl sm:text-5xl font-bold tracking-wide"
              style={{ 
                color: '#364e68',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.1em',
              }}
            >
              CERTIFICATE
            </h1>
            <p 
              className="text-lg sm:text-xl tracking-[0.3em] mt-1"
              style={{ color: '#364e68' }}
            >
              OF COMPLETION
            </p>
          </div>

          {/* Award text */}
          <p 
            className="text-sm tracking-[0.2em] mb-8"
            style={{ color: '#364e68' }}
          >
            THE FOLLOWING AWARD IS GIVEN TO
          </p>

          {/* Name section */}
          <div className="mb-4">
            <div 
              className="border-b-2 pb-2 inline-block min-w-[280px]"
              style={{ borderColor: '#364e68' }}
            >
              <p 
                className="text-xl sm:text-2xl font-medium"
                style={{ 
                  color: '#2a3a4a',
                  fontFamily: 'Georgia, serif',
                }}
              >
                This certificate is given to <span className="font-bold">{userName}</span>
              </p>
            </div>
          </div>

          {/* Achievement text */}
          <p 
            className="text-sm max-w-md mb-auto"
            style={{ color: '#4a5568' }}
          >
            for successfully completing the <strong>{trackName}</strong> with all {totalProblems} coding challenges, 
            demonstrating exceptional proficiency and dedication in the field of programming.
          </p>

          {/* Signature section */}
          <div className="mt-6">
            <p 
              className="text-3xl mb-1"
              style={{ 
                fontFamily: "'Brush Script MT', cursive",
                color: '#2a3a4a',
              }}
            >
              S.Vijay
            </p>
            <p 
              className="text-sm"
              style={{ color: '#364e68' }}
            >
              Founder, DSArena
            </p>
            <p 
              className="text-xs mt-2"
              style={{ color: '#6b7280' }}
            >
              {completionDate}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setIsNameConfirmed(false)}
        >
          Edit Name
        </Button>
        <Button onClick={downloadCertificate} className="gap-2">
          <Download className="w-4 h-4" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
}
