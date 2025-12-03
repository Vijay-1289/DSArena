import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  acceptanceRate?: number;
  isSolved?: boolean;
  isAttempted?: boolean;
}

export function ProblemCard({
  id,
  title,
  slug,
  difficulty,
  topic,
  acceptanceRate,
  isSolved,
  isAttempted,
}: ProblemCardProps) {
  const difficultyConfig = {
    easy: { label: 'Easy', className: 'difficulty-easy' },
    medium: { label: 'Medium', className: 'difficulty-medium' },
    hard: { label: 'Hard', className: 'difficulty-hard' },
  };

  const config = difficultyConfig[difficulty];

  // Block navigation for solved problems
  const handleClick = (e: React.MouseEvent) => {
    if (isSolved) {
      e.preventDefault();
    }
  };

  return (
    <Link
      to={isSolved ? '#' : `/problem/${slug}`}
      onClick={handleClick}
      className={cn(
        "group block rounded-xl border p-4 transition-all duration-200",
        isSolved 
          ? "border-success/30 bg-success/5 cursor-default" 
          : "border-border bg-card hover:border-primary/50 hover:bg-card/80 hover:shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isSolved ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : isAttempted ? (
              <Clock className="h-5 w-5 text-warning" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-semibold transition-colors",
                isSolved ? "text-success" : "text-foreground group-hover:text-primary"
              )}>
                {title}
              </h3>
              {isSolved && (
                <Badge className="bg-success/20 text-success border-success/30 text-xs">
                  Completed ✓
                </Badge>
              )}
            </div>
            {topic && (
              <p className="mt-1 text-sm text-muted-foreground">{topic}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn('border', config.className)}>
            {config.label}
          </Badge>
          {acceptanceRate !== undefined && (
            <span className="text-xs text-muted-foreground">
              {acceptanceRate.toFixed(1)}% accepted
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
