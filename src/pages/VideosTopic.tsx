import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideosList } from '@/components/video/VideosList';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { getVideosByTopicSlug, getTopicNameFromSlug } from '@/lib/videosData';

export default function VideosTopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const [current, setCurrent] = useState<string | null>(null);

  const videos = topic ? getVideosByTopicSlug(topic) : [];
  const topicName = topic ? getTopicNameFromSlug(topic) : 'Videos';

  // default to first video
  if (!current && videos[0]) setCurrent(videos[0].youtubeId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{topicName} Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {current ? (
                <VideoPlayer youtubeId={current} title={topicName} />
              ) : (
                <div className="h-64 bg-muted/20 rounded-md" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideosList videos={videos} onSelect={(v) => setCurrent(v.youtubeId)} />
          </div>
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About this topic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Curated videos for {topicName}. Use the list to navigate through lessons and learn the topic step-by-step.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
