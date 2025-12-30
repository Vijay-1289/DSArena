import { supabase } from '@/integrations/supabase/client';
import { topicSections } from './videoData';

// Map topics to video sections
const TOPIC_TO_VIDEO_SECTION: Record<string, string> = {
  'Arrays': 'arrays',
  'Linked Lists': 'linked-lists',
  'Graphs': 'graphs',
  'Stacks': 'stacks',
  'Queues': 'queues',
  'Trees': 'trees',
  'Strings': 'arrays',
  'Sorting': 'arrays',
  'Searching': 'arrays',
  'Dynamic Programming': 'arrays',
  'Recursion': 'trees',
  'Basic Syntax': 'arrays',
  'Control Flow': 'arrays',
  'Functions': 'arrays',
  'Data Structures': 'arrays',
  'OOP': 'arrays',
};

export interface FailureRecommendation {
  type: 'lower_level' | 'watch_video';
  message: string;
  actionLabel: string;
  actionUrl: string;
  videoId?: string;
}

export async function recordProblemAttempt(
  userId: string,
  problemId: string,
  isSuccess: boolean
): Promise<FailureRecommendation | null> {
  // Update the learning plan item
  const { data: planItem } = await supabase
    .from('learning_plan')
    .select('*')
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .maybeSingle();

  if (!planItem) return null;

  if (isSuccess) {
    // Mark as completed
    await supabase
      .from('learning_plan')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', planItem.id);
    return null;
  }

  // Increment failed attempts
  const newFailedAttempts = (planItem.failed_attempts || 0) + 1;
  await supabase
    .from('learning_plan')
    .update({ failed_attempts: newFailedAttempts })
    .eq('id', planItem.id);

  // If failed 2+ times, provide recommendations
  if (newFailedAttempts >= 2) {
    return getFailureRecommendation(planItem.level, planItem.topic, planItem.track_id);
  }

  return null;
}

function getFailureRecommendation(
  level: string,
  topic: string | null,
  trackId: string
): FailureRecommendation {
  // If not at beginner level, suggest going to lower level
  if (level !== 'beginner') {
    const previousLevel = level === 'advanced' ? 'intermediate' : 'beginner';
    return {
      type: 'lower_level',
      message: `This problem might be too challenging right now. Consider practicing ${previousLevel} level problems first to build a stronger foundation.`,
      actionLabel: `Go to ${previousLevel.charAt(0).toUpperCase() + previousLevel.slice(1)} Level`,
      actionUrl: `/track/${trackId}-track?level=${previousLevel}`,
    };
  }

  // If at beginner level, suggest watching videos
  const videoSection = topic ? TOPIC_TO_VIDEO_SECTION[topic] : 'arrays';
  const section = topicSections.find(s => s.id === videoSection);
  const firstVideo = section?.videos?.[0];

  return {
    type: 'watch_video',
    message: `Don't worry! Learning takes time. Watch a video on ${topic || 'the fundamentals'} to understand the concepts better before trying again.`,
    actionLabel: 'Watch Tutorial Video',
    actionUrl: '/videos',
    videoId: firstVideo?.youtubeId,
  };
}

export async function syncLearningPlanWithSolved(userId: string, solvedProblemIds: Set<string>) {
  // Mark any solved problems in the learning plan as completed
  const { data: planItems } = await supabase
    .from('learning_plan')
    .select('id, problem_id')
    .eq('user_id', userId)
    .eq('is_completed', false);

  if (!planItems) return;

  const itemsToUpdate = planItems.filter(item => solvedProblemIds.has(item.problem_id));
  
  for (const item of itemsToUpdate) {
    await supabase
      .from('learning_plan')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', item.id);
  }
}

export function getVideoRecommendationsForTopic(topic: string): { title: string; videoId: string }[] {
  const videoSection = TOPIC_TO_VIDEO_SECTION[topic] || 'arrays';
  const section = topicSections.find(s => s.id === videoSection);
  
  if (!section) return [];
  
  return section.videos.slice(0, 3).map(v => ({
    title: v.title,
    videoId: v.youtubeId,
  }));
}
