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
const PROVIDER_URLS: Record<string, string> = {
  "8": "https://www.netflix.com/search?q=",
  "9": "https://www.primevideo.com/search?phrase=",
  "15": "https://www.hulu.com/search?q=",
  "337": "https://www.disneyplus.com/search?q=",
  "350": "https://tv.apple.com/search?term=",
  "1899": "https://play.max.com/search?query=",
};

function buildProviderLink(title: string, providerId: string | undefined) {
  if (!providerId || !PROVIDER_URLS[providerId]) return null;

  return `${PROVIDER_URLS[providerId]}${encodeURIComponent(title)}`;
}

function MediaCard({
  item,
  provider,
  providerId,
}: {
  item: MediaItem;
  provider: string;
  providerId?: string;
}) {
  const title = item.title ?? item.name ?? "Untitled";
  const date = item.release_date ?? item.first_air_date;
  const year = date ? date.slice(0, 4) : "N/A";
  const mediaType = item.name ? "tv" : "movie";
  const providerLink = buildProviderLink(title, providerId);
  const directLink = `https://www.themoviedb.org/${mediaType}/${item.id}`;

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
      <div className="card-links">
        {providerLink ? (
          <a
            className="card-link card-link-primary"
            href={providerLink}
            target="_blank"
            rel="noreferrer"
          >
            Watch now
          </a>
        ) : null}
        <a
          className="card-link card-link-secondary"
          href={directLink}
          target="_blank"
          rel="noreferrer"
        >
          View details
        </a>
      </div>
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
          <MediaCard
            item={item}
            provider={provider}
            providerId={filters.provider}
          />
        </div>
      ))}
    </section>
  );
}
