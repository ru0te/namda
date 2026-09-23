# Namda

Namda helps you find something to watch without endless scrolling. Choose a
movie or TV show, filter by genre, streaming provider, rating, and runtime, and
get a list of matching titles.

This is an open-source project for anyone who wants to explore the code,
learn from it, or help improve it. The app works today, but there is plenty of
room to optimize and extend it further if people want to contribute.

## For curious people

The app is built with React and TypeScript. It uses TanStack Query to request
and cache discovery results from TMDB. The main code lives in `src/`:

- `components/` contains the hero, search form, and result cards.
- `api/` contains TMDB requests and query hooks.
- `pages/` and `layouts/` compose the application screens.
- `types/` contains the shared TypeScript types.

## Run locally

You will need Node.js and a TMDB API key.

```bash
git clone <repository-url>
cd namda
npm install
```

Create a `.env` file in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
# Optional: defaults to US
VITE_TMDB_WATCH_REGION=US
```

Start the development server:

```bash
npm run dev
```

Other useful commands:

```bash
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Contributing

Bug fixes, accessibility improvements, performance work, design ideas, and
new filters are welcome. Open an issue to discuss a larger change, or submit
a pull request with a clear description of what changed and how it was tested.

## Data attribution

Namda uses the [TMDB API](https://developer.themoviedb.org/) for movie and TV
metadata and images. This product uses the TMDB API but is not endorsed or
certified by TMDB.
