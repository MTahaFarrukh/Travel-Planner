# Waymark

**Plan the journey. Mark the moments.**

Waymark is a responsive travel planner built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**. Search destinations, check live weather, build a day-by-day itinerary, estimate your budget, and mock-book hotels — all in the browser with data saved locally.

## Features

| Tab | What it does |
|-----|----------------|
| **Explore** | Search and filter destinations by name, country, and category. Live weather via [Open-Meteo](https://open-meteo.com/). 5-day forecast panel. |
| **Itinerary** | Add/remove activities per day (Day 1–5) with optional time and notes. Hotel bookings appear automatically. |
| **Budget** | Adjust per-category estimates (Flights, Hotels, Food, Activities) with a live-updating bar chart. |
| **Hotels** | Browse mock hotels per destination, pick check-in/check-out dates, book stays, and view reservations. |

**Also included:** Waymark branding, skeleton loaders, scroll animations, `localStorage` persistence, and Vitest test coverage.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```
src/
├── components/      # UI components (cards, forms, charts, footer, etc.)
├── pages/           # Tab views (Itinerary, Budget, Hotels, Home)
├── sections/        # Composed sections (Explore hero + grid)
├── context/         # TripContext — activities, reservations, budget
├── hooks/           # useWeather, useScrollReveal, usePrefersReducedMotion
├── utils/           # Formatting, filtering, storage, weather codes
├── data/            # Mock destinations and hotels
├── types/           # TypeScript interfaces
└── index.css        # Tailwind + design tokens + animations
```

## Design system

Tokens are defined in `src/index.css` via Tailwind `@theme`.

| Token | Value | Tailwind class |
|-------|-------|----------------|
| Background (ink navy) | `#152438` | `bg-ink`, `text-ink` |
| Surface (parchment) | `#F4EEDD` | `bg-parchment`, `text-parchment` |
| Accent (brass gold) | `#C99A3D` | `bg-brass`, `text-brass` |
| Secondary (rust clay) | `#B1502F` | `bg-rust`, `text-rust` |
| Tertiary (teal) | `#3E6259` | `bg-teal`, `text-teal` |

**Fonts:** Fraunces (display), DM Sans (body), IBM Plex Mono (labels/stats).

## Data persistence

Trip data (itinerary, reservations, budget) is saved to `localStorage` under the key `waymark-app-state`. No backend required — refreshing the page keeps your plan.

## Tech notes

- **Weather:** Open-Meteo API (no key required)
- **Images:** Unsplash CDN for destination and hotel photos
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library

## License

Demo project — no real bookings or payments.
