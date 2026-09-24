const TMDB_ENDPOINT = import.meta.env.DEV ? "/api/tmdb" : "/.netlify/functions/tmdb";

export async function fetchHeroImage() {
  const page = Math.floor(Math.random() * 20) + 1;

  const params = new URLSearchParams({
    mode: "hero",
    page: String(page),
    with_watch_providers: "8|9|337",
    watch_region: import.meta.env.VITE_TMDB_WATCH_REGION || "US",
  });

  const res = await fetch(`${TMDB_ENDPOINT}?${params}`);

  if (!res.ok) throw new Error("TMDB request failed");

  const { imageUrl } = await res.json();
  if (!imageUrl) throw new Error("No featured image found");

  return imageUrl;
}
