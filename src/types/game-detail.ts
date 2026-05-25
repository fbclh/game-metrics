export type GameScreenshot = {
  id: number;
  image: string;
};

export type GameGenre = {
  id: number;
  name: string;
};

export type GameDetailData = {
  id: number;
  name: string;
  description_raw?: string;
  released?: string;
  metacritic?: number;
  background_image?: string;
  genres?: GameGenre[];
  screenshots?: GameScreenshot[];
};
