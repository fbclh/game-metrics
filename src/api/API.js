import axios from 'axios';

const apiKey = process.env.REACT_APP_RAWG_API_KEY;
const useDirectApi = Boolean(apiKey);

export const fetchGames = () => {
  const params = {
    page_size: 40,
    ordering: '-released',
  };

  if (useDirectApi) {
    return axios.get('https://api.rawg.io/api/games', {
      params: { ...params, key: apiKey },
    });
  }

  return axios.get('/api/games', { params });
};
