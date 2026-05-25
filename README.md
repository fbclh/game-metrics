# GameMetrics

GameMetrics is a game discovery and analytics platform built to demonstrate full-stack engineering beyond UI — anonymous telemetry, real usage dashboards, play list persistence, and AI-powered recommendations from live Supabase data.

![screenshot](src/assets/screenshot.png)

## Live Demo

[game-metrics.vercel.app](https://game-metrics.vercel.app/)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres)
- Recharts
- RAWG API
- Google Gemini API
- Vercel

## Features

- Game discovery via the RAWG API with search and pagination
- Anonymous session tracking — no auth required
- Search and view telemetry logged to Supabase
- Play list with want to play, playing, and finished statuses
- Analytics dashboard powered by real usage data
- AI recommendations powered by Google Gemini
- Keep-alive cron to maintain the Supabase free tier

## Setup

### 1. Clone and install

```sh
git clone git@github.com:fbclh/game-metrics.git
cd game-metrics
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- `RAWG_API_KEY` — from [rawg.io/apidocs](https://rawg.io/apidocs)
- `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/)
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — legacy JWT anon key from Supabase **Settings → API → Legacy anon, service_role API keys** (not the `sb_publishable_` key)

Optional: `ANTHROPIC_API_KEY` for future Claude integrations.

### 3. Supabase SQL

Run the SQL documented in `lib/supabase.ts` in your Supabase SQL editor (tables, RLS policies, and analytics RPC functions).

### 4. Run locally

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Author

**Fabio Coelho**

- GitHub: [github.com/fbclh](https://github.com/fbclh)
- LinkedIn: [linkedin.com/in/fbclh](https://www.linkedin.com/in/fbclh)

## Attribution

Game data provided by [RAWG](https://rawg.io/).

## License

This project is [MIT](LICENSE) licensed.
