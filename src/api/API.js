import axios from 'axios';
import md5 from 'md5';

const publicKey = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
const privateKey = process.env.REACT_APP_MARVEL_PRIVATE_KEY;
const useDirectGameApi = Boolean(publicKey && privateKey);

function getAuthParams() {
  const ts = Date.now();
  return {
    ts,
    apikey: publicKey,
    hash: md5(`${ts}${privateKey}${publicKey}`),
    limit: 100,
  };
}

export const fetchComics = () => {
  if (useDirectGameApi) {
    return axios.get('https://gateway.marvel.com/v1/public/comics', {
      params: getAuthParams(),
    });
  }

  return axios.get('/api/comics');
};
