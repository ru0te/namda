import type {
  DiscoverFilters,
  DiscoverResponse,
  MediaItem,
} from "../../types/types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

export async function fetchDiscover(
  filters: DiscoverFilters,
): Promise<MediaItem[]> {
  const { type, genre, minRating, maxRuntime, provider } = filters;

  const params = new URLSearchParams({
    api_key: API_KEY,
    watch_region: "US",
    with_watch_monetization_types: "flatrate",
    with_watch_providers: provider || "8|9|337|1899|15|350",
    sort_by: "popularity.desc",
    "vote_count.gte": "100",
  });

  if (genre) params.set("with_genres", genre);
  if (minRating) params.set("vote_average.gte", minRating);
  if (maxRuntime) params.set("with_runtime.lte", maxRuntime);

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/${type}?${params}`,
  );
  if (!res.ok) throw new Error("TMDB request failed");

  const data: DiscoverResponse = await res.json();
  return data.results;
}
