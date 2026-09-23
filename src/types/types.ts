export type MediaType = "movie" | "tv";

export interface DiscoverFilters {
  type: MediaType;
  genre?: string;
  provider?: string;
  minRating?: string;
  maxRuntime?: string;
}

export interface MediaItem {
  id: number;
  title?: string; // movies
  name?: string; // tv shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string; // movies
  first_air_date?: string; // tv shows
}

export interface DiscoverResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}
