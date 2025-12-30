// Dynamic Learning Service
// Generates and updates learning recommendations based on user progress

import { supabase } from '@/integrations/supabase/client';
import { getAvailableTracks } from './languageTracksData';

interface UserProgress {
  solvedProblems: string[];
  failedAttempts: Map<string, number>;
  preferredLanguage: string;
  recommendedLevel: string;
  lastSolvedTopic?: string;
}

interface RecommendedProblem {
  slug: string;
  title: string;
  difficulty: string;
  category: string;
  reason: string;
  priority: number;
}

export class DynamicLearningService {
  private static instance: DynamicLearningService;

  static getInstance(): DynamicLearningService {
    if (!this.instance) {
      this.instance = new DynamicLearningService();
    }
    return this.instance;
  }

  // Get user's current progress
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      // Get preferences
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('preferred_language, recommended_level')
        .eq('user_id', userId)
        .maybeSingle();

      if (!prefs) return null;

      // Get solved problems
      const { data: solved } = await supabase
        .from('user_solved')
        .select('problem_slug')
        .eq('user_id', userId);

      // Get current learning plan with failed attempts
      const { data: planItems } = await supabase
        .from('learning_plan')
        .select('problem_id, failed_attempts, topic')
        .eq('user_id', userId);

      const failedAttempts = new Map<string, number>();
      let lastTopic: string | undefined;
      planItems?.forEach(item => {
        if (item.failed_attempts > 0) {
          failedAttempts.set(item.problem_id, item.failed_attempts);
        }
        if (item.topic) lastTopic = item.topic;
      });

      return {
        solvedProblems: solved?.map(s => s.problem_slug).filter(Boolean) as string[] || [],
        failedAttempts,
        preferredLanguage: prefs.preferred_language,
        recommendedLevel: prefs.recommended_level || 'beginner',
        lastSolvedTopic: lastTopic,
      };
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return null;
    }
  }

  // Generate dynamic recommendations based on progress
  async generateRecommendations(userId: string): Promise<RecommendedProblem[]> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return [];

    const tracks = getAvailableTracks();
    const track = tracks.find(t => t.id === progress.preferredLanguage);
    if (!track?.problems) return [];

    const allProblems = track.problems;
    const recommendations: RecommendedProblem[] = [];

    // Difficulty order based on recommended level
    const difficultyOrder = this.getDifficultyOrder(progress.recommendedLevel);

    // 1. Continue from where user left off (same topic, unsolved)
    if (progress.lastSolvedTopic) {
      const continueProblem = allProblems.find(p => 
        p.category === progress.lastSolvedTopic &&
        !progress.solvedProblems.includes(p.slug) &&
        difficultyOrder.includes(p.difficulty)
      );
      if (continueProblem) {
        recommendations.push({
          ...continueProblem,
          reason: `Continue with ${progress.lastSolvedTopic}`,
          priority: 1,
        });
      }
    }

    // 2. Problems user struggled with (retry with easier variant or same)
    const struggledSlugs = Array.from(progress.failedAttempts.keys());
    for (const slug of struggledSlugs.slice(0, 2)) {
      const originalProblem = allProblems.find(p => p.slug === slug);
      if (originalProblem && !progress.solvedProblems.includes(slug)) {
        // Find an easier problem in same category
        const easierProblem = allProblems.find(p =>
          p.category === originalProblem.category &&
          p.difficulty === 'easy' &&
          !progress.solvedProblems.includes(p.slug) &&
          p.slug !== slug
        );
        if (easierProblem) {
          recommendations.push({
            ...easierProblem,
            reason: `Build foundations for ${originalProblem.category}`,
            priority: 2,
          });
        }
      }
    }

    // 3. New topics to explore (topics user hasn't tried)
    const solvedCategories = new Set(
      allProblems
        .filter(p => progress.solvedProblems.includes(p.slug))
        .map(p => p.category)
    );
    
    const untriedCategories = [...new Set(allProblems.map(p => p.category))]
      .filter(cat => !solvedCategories.has(cat));

    for (const category of untriedCategories.slice(0, 2)) {
      const newProblem = allProblems.find(p =>
        p.category === category &&
        difficultyOrder.includes(p.difficulty) &&
        !progress.solvedProblems.includes(p.slug)
      );
      if (newProblem) {
        recommendations.push({
          ...newProblem,
          reason: `Explore new topic: ${category}`,
          priority: 3,
        });
      }
    }

    // 4. Progressive difficulty (if user solved easy, suggest medium)
    const solvedDifficulties = new Set(
      allProblems
        .filter(p => progress.solvedProblems.includes(p.slug))
        .map(p => p.difficulty)
    );

    if (solvedDifficulties.has('easy') && !solvedDifficulties.has('medium')) {
      const mediumProblem = allProblems.find(p =>
        p.difficulty === 'medium' &&
        !progress.solvedProblems.includes(p.slug)
      );
      if (mediumProblem) {
        recommendations.push({
          ...mediumProblem,
          reason: 'Level up to medium difficulty!',
          priority: 4,
        });
      }
    }

    // 5. Fill remaining with unsolved problems matching level
    const remaining = allProblems
      .filter(p => 
        !progress.solvedProblems.includes(p.slug) &&
        difficultyOrder.includes(p.difficulty) &&
        !recommendations.find(r => r.slug === p.slug)
      )
      .slice(0, 10 - recommendations.length);

    for (const problem of remaining) {
      recommendations.push({
        ...problem,
        reason: this.getReasonForProblem(problem, progress),
        priority: 5,
      });
    }

    // Sort by priority and return unique problems
    const uniqueRecommendations = recommendations
      .filter((rec, index, self) => 
        index === self.findIndex(r => r.slug === rec.slug)
      )
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10);

    return uniqueRecommendations;
  }

  // Update learning plan in database
  async updateLearningPlan(userId: string): Promise<boolean> {
    try {
      const recommendations = await this.generateRecommendations(userId);
      if (recommendations.length === 0) return false;

      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('preferred_language')
        .eq('user_id', userId)
        .maybeSingle();

      if (!prefs) return false;

      // Get existing plan to preserve completion status
      const { data: existingPlan } = await supabase
        .from('learning_plan')
        .select('problem_id, is_completed, failed_attempts')
        .eq('user_id', userId);

      const existingMap = new Map(
        existingPlan?.map(item => [item.problem_id, item]) || []
      );

      // Delete old plan
      await supabase
        .from('learning_plan')
        .delete()
        .eq('user_id', userId);

      // Insert new plan
      const planItems = recommendations.map((rec, index) => {
        const existing = existingMap.get(rec.slug);
        return {
          user_id: userId,
          problem_id: rec.slug,
          problem_title: rec.title,
          track_id: prefs.preferred_language,
          level: this.difficultyToLevel(rec.difficulty),
          topic: rec.category,
          display_order: index,
          is_completed: existing?.is_completed || false,
          failed_attempts: existing?.failed_attempts || 0,
        };
      });

      const { error } = await supabase
        .from('learning_plan')
        .insert(planItems);

      if (error) {
        console.error('Failed to update learning plan:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating learning plan:', error);
      return false;
    }
  }

  // Mark problem as completed and refresh recommendations
  async markProblemCompleted(userId: string, problemSlug: string): Promise<void> {
    try {
      await supabase
        .from('learning_plan')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('problem_id', problemSlug);

      // Refresh the learning plan with new recommendations
      await this.updateLearningPlan(userId);
    } catch (error) {
      console.error('Failed to mark problem completed:', error);
    }
  }

  // Record a failed attempt
  async recordFailedAttempt(userId: string, problemSlug: string): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('learning_plan')
        .select('failed_attempts')
        .eq('user_id', userId)
        .eq('problem_id', problemSlug)
        .maybeSingle();

      const newCount = (existing?.failed_attempts || 0) + 1;

      await supabase
        .from('learning_plan')
        .update({ failed_attempts: newCount })
        .eq('user_id', userId)
        .eq('problem_id', problemSlug);

      // If too many failures, update plan to add easier problems
      if (newCount >= 3) {
        await this.updateLearningPlan(userId);
      }
    } catch (error) {
      console.error('Failed to record failed attempt:', error);
    }
  }

  private getDifficultyOrder(level: string): string[] {
    switch (level) {
      case 'beginner':
        return ['easy'];
      case 'intermediate':
        return ['easy', 'medium'];
      case 'advanced':
        return ['easy', 'medium', 'hard'];
      default:
        return ['easy', 'medium'];
    }
  }

  private difficultyToLevel(difficulty: string): string {
    if (difficulty === 'easy') return 'beginner';
    if (difficulty === 'medium') return 'intermediate';
    return 'advanced';
  }

  private getReasonForProblem(problem: { difficulty: string; category: string }, progress: UserProgress): string {
    const reasons = [
      `Practice ${problem.category} concepts`,
      `${problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)} challenge for you`,
      `Strengthen your ${problem.category} skills`,
      `Great ${problem.difficulty} problem to try`,
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
}

export const dynamicLearningService = DynamicLearningService.getInstance();
