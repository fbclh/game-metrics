# Game Metrics

Game Metrics is an app that allows the user to scroll through all the comics ever released from newest to oldest. The app also allows users to search for a Marvel character.

![screenshot](src/assets/screenshot.png)

## Live Demo

[game-metrics.vercel.app](https://game-metrics.vercel.app/)

## Built With

- React

## Environment variables

Comics are loaded via the [Marvel API](https://developer.marvel.com/). In production, requests go through a Vercel serverless function so your private key stays on the server.

1. Create or open your API keys at [developer.marvel.com/account](https://developer.marvel.com/account).
2. In Vercel → **Project** → **Settings** → **Environment Variables**, add:
   - `MARVEL_PUBLIC_KEY`
   - `MARVEL_PRIVATE_KEY`
3. Redeploy after saving.

For local development with `npm start`, copy `.env.example` to `.env` and set `REACT_APP_MARVEL_*`, or run `npx vercel dev` to use the `/api/comics` proxy.

## Setup

Clone

```sh
   git clone git@github.com:fbclh/game-metrics.git
```

Run

```sh
   cd game-metrics
   npm install
   npm start
```

## Authors

### Fabio Coelho

- GitHub: [github.com/fbclh](https://github.com/fbclh)
- LinkedIn: [linkedin.com/in/fbclh](https://www.linkedin.com/in/fbclh)

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](../../issues/).

## License

This project is [MIT](LICENSE) licensed.
