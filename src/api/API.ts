export const GAMES_PAGE_SIZE = 100;

export type FetchGamesParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type Game = {
  id: number;
  name: string;
  released?: string;
  background_image?: string;
  metacritic?: number;
};

export type GamesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
};

export async function fetchGames({
  search,
  page,
  pageSize,
}: FetchGamesParams = {}): Promise<GamesResponse> {
  const params = new URLSearchParams();
  params.set('page_size', String(pageSize || GAMES_PAGE_SIZE));

  if (page) {
    params.set('page', String(page));
  }

  if (search) {
    params.set('search', search);
    params.set('search_precise', 'true');
  } else {
    params.set('ordering', '-released');
  }

  const response = await fetch(`/api/games?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    const message =
      data.detail || data.message || data.code || 'Failed to load games.';
    throw new Error(message);
  }

  return data as GamesResponse;
}
