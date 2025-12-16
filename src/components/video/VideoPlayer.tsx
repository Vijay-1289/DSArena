type Props = {
  youtubeId: string;
  title?: string;
};

export function VideoPlayer({ youtubeId, title }: Props) {
  const src = `https://www.youtube.com/embed/${youtubeId}`;

  return (
    <div className="w-full aspect-video rounded-md overflow-hidden border border-border">
      <iframe
        title={title || 'DSArena Video'}
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
