interface VideoRendererProps {
    youtubeId: string;
    title?: string;
}

export function VideoRenderer({ youtubeId, title = 'Video' }: VideoRendererProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-border">
            <div className="relative aspect-video w-full bg-black">
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                />
            </div>
        </div>
    );
}
