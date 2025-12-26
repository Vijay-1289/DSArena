// AI Story Generation Service using Supabase Edge Function
import { supabase } from '@/integrations/supabase/client';

export interface StoryGenerationOptions {
  problemTitle: string;
  problemDescription: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  language?: string;
}

export interface StoryResult {
  success: boolean;
  story?: string;
  error?: string;
}

class AIStoryGenerator {
  private cache: Map<string, string> = new Map();
  private isGenerating: Map<string, Promise<StoryResult>> = new Map();

  /**
   * Generate a story-based description for a problem
   */
  async generateStory(options: StoryGenerationOptions): Promise<StoryResult> {
    const { problemTitle, problemDescription, difficulty, category, language = 'python' } = options;
    
    // Create cache key
    const cacheKey = `${problemTitle}-${difficulty}-${category}-${language}`;
    
    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return {
        success: true,
        story: this.cache.get(cacheKey)!
      };
    }

    // Return existing generation promise if already in progress
    if (this.isGenerating.has(cacheKey)) {
      return this.isGenerating.get(cacheKey)!;
    }

    // Start new generation
    const generationPromise = this.performGeneration(cacheKey, options);
    this.isGenerating.set(cacheKey, generationPromise);
    
    try {
      const result = await generationPromise;
      this.isGenerating.delete(cacheKey);
      return result;
    } catch (error) {
      this.isGenerating.delete(cacheKey);
      throw error;
    }
  }

  private async performGeneration(cacheKey: string, options: StoryGenerationOptions): Promise<StoryResult> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: {
          problemTitle: options.problemTitle,
          problemDescription: options.problemDescription,
          difficulty: options.difficulty,
          category: options.category,
          language: options.language || 'python',
        },
      });

      if (error) {
        console.error('Story generation failed:', error);
        return {
          success: false,
          error: error.message || 'Failed to generate story',
        };
      }

      if (data?.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      const story = data?.story;

      if (!story || story.trim().length === 0) {
        return {
          success: false,
          error: 'Empty response from AI',
        };
      }

      // Cache the result
      this.cache.set(cacheKey, story);
      
      // Store in localStorage for persistence
      this.storeInLocalStorage(cacheKey, story);

      return {
        success: true,
        story
      };

    } catch (error) {
      console.error('Story generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private storeInLocalStorage(cacheKey: string, story: string): void {
    try {
      const stories = this.getStoredStories();
      stories[cacheKey] = {
        story,
        timestamp: Date.now()
      };
      localStorage.setItem('aiGeneratedStories', JSON.stringify(stories));
    } catch (error) {
      console.warn('Failed to store story in localStorage:', error);
    }
  }

  private getStoredStories(): Record<string, { story: string; timestamp: number }> {
    try {
      const stored = localStorage.getItem('aiGeneratedStories');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Load stories from localStorage cache
   */
  loadFromCache(): void {
    const stored = this.getStoredStories();
    const now = Date.now();
    const weekInMs = 7 * 24 * 60 * 60 * 1000; // 1 week cache

    Object.entries(stored).forEach(([key, data]) => {
      // Only cache for a week
      if (now - data.timestamp < weekInMs) {
        this.cache.set(key, data.story);
      }
    });
  }

  /**
   * Clear all cached stories
   */
  clearCache(): void {
    this.cache.clear();
    try {
      localStorage.removeItem('aiGeneratedStories');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Check if a story is being generated for the given key
   */
  isGeneratingStory(cacheKey: string): boolean {
    return this.isGenerating.has(cacheKey);
  }
}

// Export singleton instance
export const aiStoryGenerator = new AIStoryGenerator();

// Load cache on module initialization
aiStoryGenerator.loadFromCache();
