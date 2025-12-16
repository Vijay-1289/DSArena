export type VideoItem = {
  id: string;
  title: string;
  youtubeId: string;
  topic: string;
  description?: string;
};

export const videoLibrary: VideoItem[] = [
  // Arrays
  {
    id: 'arr-1',
    topic: 'Arrays',
    title: 'Introduction to Arrays - Crash Course',
    youtubeId: 'w5m7J5J0Y2Y',
  },
  {
    id: 'arr-2',
    topic: 'Arrays',
    title: 'Array problems & techniques',
    youtubeId: 'sXk2qJmXKk8',
  },

  // Linked Lists
  {
    id: 'll-1',
    topic: 'Linked Lists',
    title: 'Linked List Data Structure - Explained',
    youtubeId: 'njTh_OwMljA',
  },
  {
    id: 'll-2',
    topic: 'Linked Lists',
    title: 'Linked List problems & interview patterns',
    youtubeId: 'UaQxnl2jVnI',
  },

  // Stacks & Queues
  {
    id: 'st-1',
    topic: 'Stacks & Queues',
    title: 'Stacks and Queues - Implementation & Problems',
    youtubeId: 'wjI1WNcIntg',
  },

  // Trees
  {
    id: 'tree-1',
    topic: 'Trees',
    title: 'Binary Trees & Traversals',
    youtubeId: 'vRbi1Y3h1X0',
  },

  // Graphs
  {
    id: 'graph-1',
    topic: 'Graphs',
    title: 'Graph algorithms - BFS & DFS',
    youtubeId: 'pcKY4hjDrxk',
  },

  // DP
  {
    id: 'dp-1',
    topic: 'Dynamic Programming',
    title: 'Dynamic Programming - Beginner to Advanced',
    youtubeId: 'OQ5jsbhAv_M',
  },

  // Marker for automated playlist imports. Tools/scripts can insert generated items
  // between IMPORTED_VIDEOS_START and IMPORTED_VIDEOS_END. Do not remove these markers.
  // IMPORTED_VIDEOS_START
  // IMPORTED_VIDEOS_END
];

export const topics = Array.from(new Set(videoLibrary.map((v) => v.topic)));

export function getVideosByTopicSlug(slug: string) {
  const normalized = slug.replace(/-/g, ' ').toLowerCase();
  return videoLibrary.filter((v) => v.topic.toLowerCase() === normalized);
}

export function getTopicNameFromSlug(slug: string) {
  const normalized = slug.replace(/-/g, ' ').toLowerCase();
  const found = topics.find((t) => t.toLowerCase() === normalized);
  return found || slug;
}
