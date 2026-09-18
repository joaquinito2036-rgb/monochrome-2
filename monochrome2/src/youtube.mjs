const YOUTUBE_SEARCH = "https://www.googleapis.com/youtube/v3/search";

export async function searchYouTube(query, { apiKey = process.env.YOUTUBE_API_KEY, maxResults = 20, fetchImpl = fetch } = {}) {
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured");
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    videoCategoryId: "10",
    q: query,
    maxResults: String(Math.min(Math.max(Number(maxResults) || 20, 1), 50)),
    key: apiKey
  });
  const response = await fetchImpl(`${YOUTUBE_SEARCH}?${params}`);
  if (!response.ok) throw new Error(`YouTube Data API returned ${response.status}`);
  const body = await response.json();
  return (body.items || []).map((item) => ({
    provider: "youtube",
    id: item.id.videoId,
    title: item.snippet.title,
    creator: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || null,
    playback: { mode: "youtube_embed", videoId: item.id.videoId },
    downloadable: false,
    transcodable: false
  }));
}

export function youtubeEmbedUrl(videoId) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new TypeError("Invalid YouTube video ID");
  return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1`;
}
