import { useDiscover } from "../api/hooks/useDiscover";
import type { DiscoverFilters, MediaItem } from "../types/types";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const SKELETON_COUNT = 8;
const PROVIDER_NAMES: Record<string, string> = {
  "8": "Netflix",
  "9": "Prime Video",
  "15": "Hulu",
  "337": "Disney+",
  "350": "Apple TV+",
  "1899": "Max",
};

function MediaCard({ item, provider }: { item: MediaItem; provider: string }) {
  const title = item.title ?? item.name ?? "Untitled";
  const date = item.release_date ?? item.first_air_date;
  const year = date ? date.slice(0, 4) : "N/A";

  return (
    <article className="card">
      {item.poster_path ? (
        <img
          src={`${IMG_BASE}${item.poster_path}`}
          alt={title}
          loading="lazy"
        />
      ) : (
        <div className="card-placeholder">No image</div>
      )}
      <h3>{title}</h3>
      <p className="card-meta">
        <span>{year}</span>
        <span>⭐ {item.vote_average.toFixed(1)}</span>
      </p>
      <p className="card-provider">Watch on {provider}</p>
    </article>
  );
}

export default function Results({
  filters,
}: {
  filters: DiscoverFilters | null;
}) {
  const { data, isLoading, isError } = useDiscover(filters);

  if (!filters) return null;
  if (isLoading) {
    return (
      <section
        className="results-grid results-grid-loading"
        aria-label="Loading movies"
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <article
            className="card card-skeleton"
            key={index}
            aria-hidden="true"
          >
            <div className="skeleton-poster" />
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
          </article>
        ))}
      </section>
    );
  }
  if (isError) return <p>Something went wrong. Try again.</p>;
  if (!data?.length) return <p>No matches. Try loosening your filters.</p>;

  const provider = filters.provider
    ? (PROVIDER_NAMES[filters.provider] ?? "your selected platform")
    : "your streaming platforms";

  return (
    <section className="results-grid">
      {data.map((item, index) => (
        <div
          className="card-reveal"
          style={{ "--card-index": index } as React.CSSProperties}
          key={item.id}
        >
          <MediaCard item={item} provider={provider} />
        </div>
      ))}
    </section>
  );
}
