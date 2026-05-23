import axios from 'axios';

const apiKey = process.env.REACT_APP_RAWG_API_KEY;
const useDirectApi = Boolean(apiKey);

export const GAMES_PAGE_SIZE = 100;

export const fetchGames = ({ search, page, pageSize } = {}) => {
  const params = {
    page_size: pageSize || GAMES_PAGE_SIZE,
    ...(page && { page }),
    ...(search ? { search } : { ordering: '-released' }),
  };

  if (useDirectApi) {
    return axios.get('https://api.rawg.io/api/games', {
      params: { ...params, key: apiKey },
    });
  }

  return axios.get('/api/games', { params });
};
