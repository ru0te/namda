const TMDB_BASE = "https://api.themoviedb.org/3";

const requestCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const clientBuckets = new Map();

function getClientKey(event) {
    const forwarded =
        event.headers["x-forwarded-for"] ||
        event.headers["x-nf-client-connection-ip"] ||
        "local";
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

function json(statusCode, body) {
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };
}

export async function handler(event) {
    try {
        const API_KEY = process.env.TMDB_API_KEY;

        if (!API_KEY) {
            return json(500, { error: "TMDB API key is missing" });
        }

        if (isRateLimited(event)) {
            return json(429, { error: "Too many requests. Please try again shortly." });
        }

        const query = new URLSearchParams();
        Object.entries(event.queryStringParameters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.set(key, String(value));
            }
        });

        const mode = query.get("mode");
        const type = query.get("type") === "tv" ? "tv" : "movie";
        const page = query.get("page") || "1";

        // Copy the client's params, then strip the ones we handle ourselves.
        // api_key is set LAST so a visitor can't override it via the URL.
        const params = new URLSearchParams(query);
        params.delete("mode");
        params.delete("type");
        params.delete("page");
        params.delete("api_key");

        if (mode === "discover") {
            params.set("watch_region", query.get("watch_region") || "US");
            params.set(
                "with_watch_monetization_types",
                query.get("with_watch_monetization_types") || "flatrate"
            );
            params.set(
                "with_watch_providers",
                query.get("with_watch_providers") || "8|9|337|1899|15|350"
            );
            params.set("sort_by", query.get("sort_by") || "popularity.desc");
            params.set("vote_count.gte", query.get("vote_count.gte") || "100");
        }

        params.set("page", page);
        params.set("api_key", API_KEY);

        const url = `${TMDB_BASE}/discover/${type}?${params.toString()}`;

        const cached = requestCache.get(url);
        if (cached) {
            if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
                return json(200, cached.body);
            }
            requestCache.delete(url);
        }

        const response = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            return json(response.status, { error: "TMDB request failed" });
        }

        const data = await response.json();

        if (mode === "hero") {
            const withImages = (data.results || []).filter((movie) => movie.backdrop_path);
            const movie =
                withImages[Math.floor(Math.random() * (withImages.length || 1))] ||
                data.results?.[0];

            const result = {
                imageUrl:
                    movie && movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                        : null,
            };

            requestCache.set(url, { timestamp: Date.now(), body: result });
            return json(200, result);
        }

        requestCache.set(url, { timestamp: Date.now(), body: data });
        return json(200, data);
    } catch (error) {
        return json(500, {
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}