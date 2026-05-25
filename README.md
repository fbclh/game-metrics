# Game Metrics

Game Metrics is an app that lets you browse video games from newest to oldest and search by title.

![screenshot](src/assets/screenshot.png)

## Live Demo

[game-metrics.vercel.app](https://game-metrics.vercel.app/)

## Built With

- React

## Environment variables

Games are loaded via the [RAWG API](https://rawg.io/apidocs). In production, requests go through a Vercel serverless function so your API key stays on the server.

1. Create an API key at [rawg.io/apidocs](https://rawg.io/apidocs).
2. In Vercel → **Project** → **Settings** → **Environment Variables**, add:
   - `RAWG_API_KEY`
3. Redeploy after saving.

For local development, copy `.env.local.example` to `.env.local` and set `RAWG_API_KEY`.

## Setup

Clone

```sh
   git clone git@github.com:fbclh/game-metrics.git
```

Run

```sh
   cd game-metrics
   npm install
   npm run dev
```

## Authors

### Fabio Coelho

- GitHub: [github.com/fbclh](https://github.com/fbclh)
- LinkedIn: [linkedin.com/in/fbclh](https://www.linkedin.com/in/fbclh)

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](../../issues/).

## License

This project is [MIT](LICENSE) licensed.
