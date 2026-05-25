# GameMetrics

A game discovery and behavioral analytics platform built to demonstrate
data engineering, telemetry pipelines, and full-stack development skills.

## Live Demo

[game-metrics.vercel.app](https://game-metrics.vercel.app/)

## Features

- Game discovery powered by RAWG API (500,000+ games)
- Anonymous session tracking — no login required
- Search and view telemetry logged to Supabase Postgres
- Play list with Want to Play / Playing / Finished statuses
- Analytics dashboard with real usage data (Recharts)
- Smart game recommendations based on library
- Keep-alive cron to maintain Supabase free tier

## Tech Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase (Postgres)
- Recharts
- RAWG REST API
- Vercel

## Setup

1. Clone the repo
2. Copy `.env.local.example` to `.env.local` and fill in values
3. Run the SQL in `lib/supabase.ts` in your Supabase SQL editor
4. `npm install && npm run dev`

## Attribution

Data provided by [RAWG](https://rawg.io)

## Author

Fabio C.
