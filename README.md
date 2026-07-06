# Travel Planner

A responsive Travel Planner web app built with **Vite**, **React**, and **Tailwind CSS**. This scaffold supports the MVP scope defined in the project technical requirements (destination search, trips, itineraries, favorites, weather, budget, mock hotels, and share links).

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Project structure

```
travel-planner/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (buttons, cards, modals, etc.)
│   ├── pages/           # Route-level page components
│   ├── sections/        # Page sections (hero, itinerary panel, weather widget, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Pure helpers (formatting, API clients, constants)
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind + design tokens
├── index.html
└── vite.config.ts
```

## Design system

Tokens are defined as CSS variables in `src/index.css` and mapped to Tailwind utilities via `@theme`.

| Token | Value | Tailwind class |
|-------|-------|----------------|
| Background (ink navy) | `#152438` | `bg-ink`, `text-ink` |
| Surface (parchment) | `#F4EEDD` | `bg-parchment`, `text-parchment` |
| Accent (brass gold) | `#C99A3D` | `bg-brass`, `text-brass` |
| Secondary (rust clay) | `#B1502F` | `bg-rust`, `text-rust` |
| Tertiary (teal) | `#3E6259` | `bg-teal`, `text-teal` |

**Fonts**

| Role | Family | Tailwind class |
|------|--------|----------------|
| Display / headings | Fraunces | `font-display` |
| Body | DM Sans | `font-body` (default on `body`) |
| Labels / stats | IBM Plex Mono | `font-mono` |

CSS variables are also available for non-Tailwind use: `--color-bg-ink`, `--color-surface-parchment`, `--color-accent-brass`, `--color-accent-rust`, `--color-accent-teal`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Next steps

Refer to `travel-planner-technical-doc.md` Section 6 for MVP feature scope. Build features into `components/`, compose them in `sections/`, and wire pages in `pages/` as routes are added.
