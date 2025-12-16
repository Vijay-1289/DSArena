import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { videoLibrary, topics } from '@/lib/videosData';
import { VideosList } from '@/components/video/VideosList';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VideosPage() {
  const [topic, setTopic] = useState<string>('All');
  const [current, setCurrent] = useState<string | null>(videoLibrary[0]?.youtubeId || null);

  const filtered = topic === 'All' ? videoLibrary : videoLibrary.filter(v => v.topic === topic);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>DSA Learning Videos</CardTitle>
              </CardHeader>
              <CardContent>
                {current ? <VideoPlayer youtubeId={current} /> : <div className="h-64 bg-muted/20 rounded-md" />}
              </CardContent>
            </Card>

            <div className="mt-4">
              <label className="text-sm text-muted-foreground">Filter by topic</label>
              <div className="mt-2">
                <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option value="All">All</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <VideosList
              videos={filtered}
              onSelect={(v) => setCurrent(v.youtubeId)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
