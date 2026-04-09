export function VideoRenderer({ youtubeId }: { youtubeId: string | null }) {
    if (!youtubeId) {
        return (
            <p className="text-muted-foreground">No hay vídeo asociado a esta publicación.</p>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
            <div className="relative aspect-video w-full">
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
