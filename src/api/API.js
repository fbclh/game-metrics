import axios from 'axios';
import md5 from 'md5';

const publicKey = 'c597ce43515503b0173b45cc41cfd39e';
const privateKey = '95ce1241b18832779f0e5f8ba3353274e6868e00';
const timeStamp = Number(new Date());
const hash = md5(timeStamp + privateKey + publicKey);

export const API = axios.create({
  baseURL: 'https://gateway.marvel.com/v1/public/comics',
  params: {
    ts: timeStamp,
    apikey: publicKey,
    hash,
    limit: 100,
  },
});
