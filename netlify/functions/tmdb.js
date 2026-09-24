const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

const requestCache = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const clientBuckets = new Map();

function getClientKey(event) {
    const forwarded = event.headers["x-forwarded-for"] || event.headers["x-nf-client-connection-ip"] || "local";
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim();
}

function isRateLimited(event) {
    const key = getClientKey(event);
    const now = Date.now();
    const bucket = clientBuckets.get(key) || { timestamps: [] };

    bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (bucket.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
        clientBuckets.set(key, bucket);
        return true;
    }

    bucket.timestamps.push(now);
    clientBuckets.set(key, bucket);
    return false;
}

function cacheKeyFor(url) {
    return url;
}

export async function handler(event) {
    try {
        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "TMDB API key is missing" }),
            };
        }

        if (isRateLimited(event)) {
            return {
                statusCode: 429,
                body: JSON.stringify({ error: "Too many requests. Please try again shortly." }),
            };
        }

        const query = new URLSearchParams();
        Object.entries(event.queryStringParameters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.set(key, String(value));
            }
        });

        const mode = query.get("mode");
        const type = query.get("type") || "movie";
        const page = query.get("page") || "1";

        const params = new URLSearchParams({
            api_key: API_KEY,
            ...Object.fromEntries(query.entries()),
        });

        params.delete("mode");
        params.delete("type");
        params.delete("page");

        if (mode === "discover") {
            params.set("watch_region", searchParams.get("watch_region") || "US");
            params.set("with_watch_monetization_types", searchParams.get("with_watch_monetization_types") || "flatrate");
            params.set("with_watch_providers", searchParams.get("with_watch_providers") || "8|9|337|1899|15|350");
            params.set("sort_by", searchParams.get("sort_by") || "popularity.desc");
            params.set("vote_count.gte", searchParams.get("vote_count.gte") || "100");
        }

        if (mode === "hero") {
            params.delete("mode");
            params.delete("page");
            params.set("page", page);
        }

        const url = `${TMDB_BASE}/discover/${type}?${params.toString()}`;
        const cacheKey = cacheKeyFor(url);

        if (requestCache.has(cacheKey)) {
            const cached = requestCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(cached.body),
                    headers: { "Content-Type": "application/json" },
                };
            }
            requestCache.delete(cacheKey);
        }

        const response = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "TMDB request failed" }),
            };
        }

        const data = await response.json();

        if (mode === "hero") {
            const withImages = (data.results || []).filter((movie) => movie.backdrop_path);
            const movie = withImages[Math.floor(Math.random() * (withImages.length || 1))] || data.results?.[0];

            const result = {
                imageUrl: movie && movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
            };

            requestCache.set(cacheKey, { timestamp: Date.now(), body: result });
            return {
                statusCode: 200,
                body: JSON.stringify(result),
                headers: { "Content-Type": "application/json" },
            };
        }

        requestCache.set(cacheKey, { timestamp: Date.now(), body: data });
        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
        };
    }
}
