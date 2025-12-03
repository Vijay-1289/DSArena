import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  ArrowRight,
  Code2,
  Loader2,
  Code,
  BookOpen,
} from 'lucide-react';
import { problemsData } from '@/lib/problemsData';
import { pythonProblemsData, PYTHON_TRACK_TOTAL, getPythonTrackIds } from '@/lib/pythonProblemsData';

interface Profile {
  username: string | null;
  display_name: string | null;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  streak_days: number;
}

interface UserSolved {
  problem_id: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('username, display_name, total_solved, easy_solved, medium_solved, hard_solved, streak_days')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch solved problems
    const { data: solvedData } = await supabase
      .from('user_solved')
      .select('problem_id')
      .eq('user_id', user.id);

    if (solvedData) {
      setSolvedIds(new Set(solvedData.map((d: UserSolved) => d.problem_id)));
    }

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Calculate DSA stats (excluding Python Track)
  const pythonTrackIds = new Set(getPythonTrackIds());
  const dsaProblems = problemsData.filter(p => !pythonTrackIds.has(p.id));
  const dsaSolvedCount = [...solvedIds].filter(id => 
    dsaProblems.some(p => p.id === id)
  ).length;
  const dsaCounts = {
    easy: dsaProblems.filter(p => p.difficulty === 'easy').length,
    medium: dsaProblems.filter(p => p.difficulty === 'medium').length,
    hard: dsaProblems.filter(p => p.difficulty === 'hard').length,
    total: dsaProblems.length,
  };
  const dsaSolvedByDifficulty = {
    easy: [...solvedIds].filter(id => dsaProblems.find(p => p.id === id && p.difficulty === 'easy')).length,
    medium: [...solvedIds].filter(id => dsaProblems.find(p => p.id === id && p.difficulty === 'medium')).length,
    hard: [...solvedIds].filter(id => dsaProblems.find(p => p.id === id && p.difficulty === 'hard')).length,
  };

  // Calculate Python Track stats
  const pythonSolvedCount = pythonProblemsData.filter(p => solvedIds.has(p.id)).length;
  const pythonCounts = {
    easy: pythonProblemsData.filter(p => p.difficulty === 'easy').length,
    medium: pythonProblemsData.filter(p => p.difficulty === 'medium').length,
    hard: pythonProblemsData.filter(p => p.difficulty === 'hard').length,
    total: PYTHON_TRACK_TOTAL,
  };
  const pythonSolvedByDifficulty = {
    easy: pythonProblemsData.filter(p => p.difficulty === 'easy' && solvedIds.has(p.id)).length,
    medium: pythonProblemsData.filter(p => p.difficulty === 'medium' && solvedIds.has(p.id)).length,
    hard: pythonProblemsData.filter(p => p.difficulty === 'hard' && solvedIds.has(p.id)).length,
  };

  const totalSolved = dsaSolvedCount + pythonSolvedCount;
  const totalProblems = dsaCounts.total + pythonCounts.total;
  const dsaProgress = dsaCounts.total > 0 ? (dsaSolvedCount / dsaCounts.total) * 100 : 0;
  const pythonProgress = pythonCounts.total > 0 ? (pythonSolvedCount / pythonCounts.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile.display_name || profile.username || 'Coder'}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your progress and keep improving
          </p>
        </div>

        {/* Overall Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Solved
              </CardTitle>
              <Trophy className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSolved}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                of {totalProblems} problems
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Flame className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.streak_days}</div>
              <p className="mt-1 text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                DSA Progress
              </CardTitle>
              <Code2 className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dsaProgress.toFixed(0)}%</div>
              <Progress value={dsaProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Python Track
              </CardTitle>
              <Target className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pythonProgress.toFixed(0)}%</div>
              <Progress value={pythonProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Two Column Progress */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* DSA Problems Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <CardTitle>DSA Problems</CardTitle>
              </div>
              <Link to="/problems">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">{dsaSolvedCount}</span>
                <span className="text-muted-foreground">/ {dsaCounts.total} solved</span>
              </div>
              
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-success">Easy</span>
                  <span className="text-muted-foreground">
                    {dsaSolvedByDifficulty.easy} / {dsaCounts.easy}
                  </span>
                </div>
                <Progress
                  value={dsaCounts.easy > 0 ? (dsaSolvedByDifficulty.easy / dsaCounts.easy) * 100 : 0}
                  className="h-2 bg-success/20"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-warning">Medium</span>
                  <span className="text-muted-foreground">
                    {dsaSolvedByDifficulty.medium} / {dsaCounts.medium}
                  </span>
                </div>
                <Progress
                  value={dsaCounts.medium > 0 ? (dsaSolvedByDifficulty.medium / dsaCounts.medium) * 100 : 0}
                  className="h-2 bg-warning/20"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-destructive">Hard</span>
                  <span className="text-muted-foreground">
                    {dsaSolvedByDifficulty.hard} / {dsaCounts.hard}
                  </span>
                </div>
                <Progress
                  value={dsaCounts.hard > 0 ? (dsaSolvedByDifficulty.hard / dsaCounts.hard) * 100 : 0}
                  className="h-2 bg-destructive/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Python Track Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Python Learning Track</CardTitle>
              </div>
              <Link to="/python-track">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">{pythonSolvedCount}</span>
                <span className="text-muted-foreground">/ {pythonCounts.total} solved</span>
              </div>

              {pythonSolvedCount === PYTHON_TRACK_TOTAL && (
                <div className="rounded-lg bg-success/10 border border-success/30 p-3 text-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-1" />
                  <p className="text-success font-medium text-sm">Track Completed! 🎉</p>
                </div>
              )}
              
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-success">🟢 Beginner</span>
                  <span className="text-muted-foreground">
                    {pythonSolvedByDifficulty.easy} / {pythonCounts.easy}
                  </span>
                </div>
                <Progress
                  value={pythonCounts.easy > 0 ? (pythonSolvedByDifficulty.easy / pythonCounts.easy) * 100 : 0}
                  className="h-2 bg-success/20"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-warning">🟡 Intermediate</span>
                  <span className="text-muted-foreground">
                    {pythonSolvedByDifficulty.medium} / {pythonCounts.medium}
                  </span>
                </div>
                <Progress
                  value={pythonCounts.medium > 0 ? (pythonSolvedByDifficulty.medium / pythonCounts.medium) * 100 : 0}
                  className="h-2 bg-warning/20"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-destructive">🔴 Advanced</span>
                  <span className="text-muted-foreground">
                    {pythonSolvedByDifficulty.hard} / {pythonCounts.hard}
                  </span>
                </div>
                <Progress
                  value={pythonCounts.hard > 0 ? (pythonSolvedByDifficulty.hard / pythonCounts.hard) * 100 : 0}
                  className="h-2 bg-destructive/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
            <div>
              <h3 className="text-xl font-bold">Ready to practice?</h3>
              <p className="text-muted-foreground">
                Keep your streak going with a new problem today.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/problems">
                <Button variant="outline" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  DSA Problems
                </Button>
              </Link>
              <Link to="/python-track">
                <Button variant="hero" size="lg">
                  <Code className="mr-2 h-5 w-5" />
                  Python Track
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}