import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideosList } from '@/components/video/VideosList';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { getVideosByTopicSlug, getTopicNameFromSlug } from '@/lib/videosData';

export default function VideosTopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const videos = topic ? getVideosByTopicSlug(topic) : [];
  const topicName = topic ? getTopicNameFromSlug(topic) : 'Videos';
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // default to first video
  if (videos.length > 0 && currentIndex >= videos.length) setCurrentIndex(0);

  const current = videos[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left playlist */}
          <aside className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{topicName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{videos.length} lessons</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {videos.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full text-left p-4 flex items-start gap-3 hover:bg-accent/5 transition-colors ${idx === currentIndex ? 'bg-accent/5' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium truncate">{v.title}</div>
                        {v.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.description}</div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{/* duration / metadata could go here */}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right player */}
          <section className="lg:col-span-3">
            <div className="space-y-4">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">{current?.title || topicName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{current?.topic}</p>
                  </CardHeader>
                  <CardContent>
                    {current ? (
                      <VideoPlayer youtubeId={current.youtubeId} fileUrl={current.fileUrl} title={current.title} />
                    ) : (
                      <div className="h-64 bg-muted/20 rounded-md" />
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>About this lesson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{current?.description || 'No description available.'}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
