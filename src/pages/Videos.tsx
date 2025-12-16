import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { topics, videoLibrary } from '@/lib/videosData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function topicSlug(topic: string) {
  return topic.toLowerCase().replace(/\s+/g, '-');
}

export default function VideosIndexPage() {
  // Group counts per topic
  const counts = topics.map((t) => ({ name: t, count: videoLibrary.filter(v => v.topic === t).length }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">DSA Video Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Browse curated topic playlists and watch step-by-step videos for core DSA topics.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {counts.map((c) => (
            <Card key={c.name} className="hover:shadow-lg">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.count} videos</p>
                  </div>
                  <div>
                    <Link to={`/videos/${topicSlug(c.name)}`}>
                      <Button {...({ variant: 'ghost', size: 'sm' } as any)}>Open</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
