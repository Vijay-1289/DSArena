import { VideoItem } from '@/lib/videosData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  videos: VideoItem[];
  onSelect: (v: VideoItem) => void;
};

export function VideosList({ videos, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {videos.map((v) => (
        <Card key={v.id} className="hover:shadow-md">
          <CardHeader className="p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm sm:text-base">{v.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button {...({ variant: 'ghost', size: 'sm' } as any)} onClick={() => onSelect(v)}>
                  Play
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xs text-muted-foreground">Topic: {v.topic}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
