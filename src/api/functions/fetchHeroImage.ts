import { WATCH_REGION } from "../tmdb";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchHeroImage() {
  const page = Math.floor(Math.random() * 20) + 1;

  const url =
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
    `&with_watch_providers=8|9|337&watch_region=${WATCH_REGION}` +
    `&sort_by=popularity.desc&page=${page}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("TMDB request failed");

  const { results } = await res.json();

  const withImages = results.filter(
    (m: { backdrop_path: any }) => m.backdrop_path,
  );
  if (!withImages.length) throw new Error("No featured image found");

  const movie = withImages[Math.floor(Math.random() * withImages.length)];

  return `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
}
