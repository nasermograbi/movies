export type Movie = {
  id: string;
  title: string;
  year: string;
  posterUrl: string | null;
};

export type MovieDetails = Movie & {
  posterUrlLarge: string | null;
  rated: string | null;
  runtime: string | null;
  genres: string[];
  director: string | null;
  actors: string[];
  plot: string | null;
  imdbRating: number | null;
};

export type MoviePage = {
  movies: Movie[];
  nextPage?: number;
};
