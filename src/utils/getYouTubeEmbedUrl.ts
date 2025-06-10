export async function getYouTubeEmbedUrl(url: string): Promise<string | null> {
  const regex =
    /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return null;
}


