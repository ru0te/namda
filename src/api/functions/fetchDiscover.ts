import type {
  DiscoverFilters,
  DiscoverResponse,
  MediaItem,
} from "../../types/types";

const TMDB_ENDPOINT = import.meta.env.DEV ? "/api/tmdb" : "/.netlify/functions/tmdb";

export async function fetchDiscover(
  filters: DiscoverFilters,
): Promise<MediaItem[]> {
  const { type, genre, minRating, maxRuntime, provider } = filters;

  const params = new URLSearchParams({
    mode: "discover",
    type,
    watch_region: import.meta.env.VITE_TMDB_WATCH_REGION || "US",
    with_watch_monetization_types: "flatrate",
    with_watch_providers: provider || "8|9|337|1899|15|350",
    sort_by: "popularity.desc",
    "vote_count.gte": "100",
  });

  if (genre) params.set("with_genres", genre);
  if (minRating) params.set("vote_average.gte", minRating);
  if (maxRuntime) params.set("with_runtime.lte", maxRuntime);

  const res = await fetch(`${TMDB_ENDPOINT}?${params}`);
  if (!res.ok) throw new Error("TMDB request failed");

  const data: DiscoverResponse = await res.json();
  return data.results;
}
