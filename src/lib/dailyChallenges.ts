// Daily Challenge Service - Manages daily coding challenges and user progress (Local Storage Version)
import { problemsData } from './problemsData';

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    is_visible: boolean;
  }>;
  story?: string;
}

export interface DailyChallengeProgress {
  challengeDate: string;
  isCompleted: boolean;
  solvedAt?: string;
  runtimeMs?: number;
  language?: string;
}

class DailyChallengeService {
  private readonly STORAGE_KEY = 'daily_challenge_progress';
  private readonly STREAK_KEY = 'daily_streak';

  // Get today's challenge
  async getTodayChallenge(): Promise<DailyChallenge> {
    const today = new Date().toISOString().split('T')[0];
    return await this.generateDailyChallenge(today);
  }

  // Generate a daily challenge (on-the-fly, no storage)
  async generateDailyChallenge(date: string): Promise<DailyChallenge> {
    try {
      // Select a problem based on date (deterministic)
      const availableProblems = problemsData;
      if (!availableProblems || availableProblems.length === 0) {
        throw new Error('No problems available for daily challenge generation');
      }

      // Use date as seed for consistent daily challenge
      const seed = this.getSeedFromDate(date);
      const selectedIndex = seed % availableProblems.length;
      const randomProblem = availableProblems[selectedIndex];

      return {
        id: `${date}-${selectedIndex}`,
        date,
        title: randomProblem.title,
        description: randomProblem.description,
        category: randomProblem.category,
        difficulty: randomProblem.difficulty,
        inputFormat: randomProblem.inputFormat,
        outputFormat: randomProblem.outputFormat,
        constraints: randomProblem.constraints,
        timeLimitMs: randomProblem.timeLimitMs,
        memoryLimitMb: randomProblem.memoryLimitMb,
        testCases: [
          ...randomProblem.visibleTestCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            is_visible: true
          })),
          ...randomProblem.hiddenTestCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            is_visible: false
          }))
        ],
        story: randomProblem.story
      };
    } catch (error) {
      console.error('Error generating daily challenge:', error);
      throw new Error('Failed to generate daily challenge');
    }
  }

  // Generate deterministic seed from date
  private getSeedFromDate(date: string): number {
    let seed = 0;
    for (let i = 0; i < date.length; i++) {
      seed = (seed * 31 + date.charCodeAt(i)) >>> 0;
    }
    return seed;
  }

  // Get today's challenge progress
  async getTodayChallengeProgress(): Promise<DailyChallengeProgress | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.getChallengeProgress(today);
  }

  // Get challenge progress from localStorage
  getChallengeProgress(challengeDate: string): DailyChallengeProgress | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const progressData = JSON.parse(stored);
      return progressData[challengeDate] || null;
    } catch (error) {
      console.error('Error reading challenge progress:', error);
      return null;
    }
  }

  // Check if user has solved today's challenge
  async hasUserSolvedToday(): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const progress = this.getChallengeProgress(today);
    return progress?.isCompleted || false;
  }

  // Update challenge progress and streak
  async updateChallengeProgress(challengeDate: string, progress: Partial<DailyChallengeProgress>): Promise<void> {
    try {
      // Get existing progress data
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const progressData = stored ? JSON.parse(stored) : {};

      // Update progress for this challenge
      const updatedProgress: DailyChallengeProgress = {
        challengeDate,
        isCompleted: progress.isCompleted || false,
        solvedAt: progress.solvedAt,
        runtimeMs: progress.runtimeMs,
        language: progress.language
      };

      progressData[challengeDate] = updatedProgress;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progressData));

      // Update streak if challenge was completed
      if (progress.isCompleted) {
        await this.updateDailyStreak(challengeDate);
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }

  // Update daily streak
  private async updateDailyStreak(completionDate: string): Promise<void> {
    try {
      const streak = this.calculateStreak(completionDate);
      localStorage.setItem(this.STREAK_KEY, JSON.stringify({ 
        currentStreak: streak, 
        lastUpdated: completionDate 
      }));
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  // Get user's daily streak
  async getUserDailyStreak(): Promise<number> {
    try {
      const stored = localStorage.getItem(this.STREAK_KEY);
      if (!stored) return 0;

      const streakData = JSON.parse(stored);
      return streakData.currentStreak || 0;
    } catch (error) {
      console.error('Error fetching streak:', error);
      return 0;
    }
  }

  // Calculate streak from completion data
  private calculateStreak(latestCompletionDate: string): number {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return 1;

    const progressData = JSON.parse(stored);
    const completions = Object.values(progressData)
      .filter((p: any) => p.isCompleted)
      .map((p: any) => p.challengeDate)
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

    if (completions.length === 0) return 1;

    // Calculate consecutive days from the latest completion
    let streak = 1;
    let currentDate = new Date(latestCompletionDate);

    for (let i = 1; i < completions.length; i++) {
      const completionDate = new Date(completions[i]);
      const daysDiff = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streak++;
        currentDate = completionDate;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get user's challenge history
  async getChallengeHistory(limit: number = 30): Promise<DailyChallengeProgress[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const progressData = JSON.parse(stored);
      const history = Object.values(progressData)
        .sort((a: any, b: any) => new Date(b.challengeDate).getTime() - new Date(a.challengeDate).getTime())
        .slice(0, limit);

      return history as DailyChallengeProgress[];
    } catch (error) {
      console.error('Error fetching challenge history:', error);
      return [];
    }
  }

  // Get available challenges for a date range (for calendar view)
  async getChallengeCalendar(startDate: string, endDate: string): Promise<Array<{
    date: string;
    challenge?: DailyChallenge;
    userCompleted?: boolean;
  }>> {
    try {
      const calendarItems = [];
      const current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        const challenge = await this.generateDailyChallenge(dateStr);
        const progress = this.getChallengeProgress(dateStr);
        
        calendarItems.push({
          date: dateStr,
          challenge,
          userCompleted: progress?.isCompleted || false
        });

        current.setDate(current.getDate() + 1);
      }

      return calendarItems;
    } catch (error) {
      console.error('Error fetching challenge calendar:', error);
      return [];
    }
  }

  // Get daily challenge statistics for the user
  async getUserChallengeStats(): Promise<{
    totalCompleted: number;
    currentStreak: number;
    longestStreak: number;
    averageRuntime: number;
    difficultyBreakdown: {
      easy: number;
      medium: number;
      hard: number;
    };
  }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return {
          totalCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageRuntime: 0,
          difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
        };
      }

      const progressData = JSON.parse(stored);
      const completedChallenges = Object.values(progressData).filter((p: any) => p.isCompleted) as DailyChallengeProgress[];
      
      const totalCompleted = completedChallenges.length;
      const currentStreak = await this.getUserDailyStreak();
      
      // Calculate difficulty breakdown
      const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
      let totalRuntime = 0;
      let runtimeCount = 0;

      for (const challenge of completedChallenges) {
        // Get challenge details to determine difficulty
        const challengeData = await this.generateDailyChallenge(challenge.challengeDate);
        const difficulty = challengeData.difficulty;
        
        if (difficultyBreakdown.hasOwnProperty(difficulty)) {
          difficultyBreakdown[difficulty as keyof typeof difficultyBreakdown]++;
        }
        
        if (challenge.runtimeMs) {
          totalRuntime += challenge.runtimeMs;
          runtimeCount++;
        }
      }

      return {
        totalCompleted,
        currentStreak,
        longestStreak: currentStreak, // For now, same as current
        averageRuntime: runtimeCount > 0 ? Math.round(totalRuntime / runtimeCount) : 0,
        difficultyBreakdown
      };
    } catch (error) {
      console.error('Error fetching challenge stats:', error);
      return {
        totalCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageRuntime: 0,
        difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
      };
    }
  }

  // Clear all progress data (for testing)
  clearAllProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STREAK_KEY);
  }
}

export const dailyChallengeService = new DailyChallengeService();
