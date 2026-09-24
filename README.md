# Namda

Namda helps you find something to watch without endless scrolling. 
This project is a focused app for finding movies and TV shows available on
streaming services. It is designed to help narrow down choices quickly without
endless scrolling.

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

## Data attribution

Namda uses the [TMDB API](https://developer.themoviedb.org/) for movie and TV
metadata and images. This product uses the TMDB API but is not endorsed or
certified by TMDB.
