type Props = {
  youtubeId?: string;
  fileUrl?: string;
  title?: string;
};

export function VideoPlayer({ youtubeId, fileUrl, title }: Props) {
  // If a native file URL is provided, use the HTML5 player
  if (fileUrl) {
    return (
      <div className="w-full aspect-video rounded-md overflow-hidden border border-border bg-black flex items-center justify-center">
        <video
          controls
          className="w-full h-full bg-black"
          src={fileUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (!youtubeId) {
    return (
      <div className="w-full aspect-video rounded-md overflow-hidden border border-border flex items-center justify-center text-muted-foreground">
        No video available
      </div>
    );
  }

  // Use privacy-enhanced player (no cookie) and modest branding
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;

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
