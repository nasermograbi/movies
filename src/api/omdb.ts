import type { Movie, MovieDetails, MoviePage } from "../types";
import { ApiError, getJson } from "./http";

const BASE_URL = "https://www.omdbapi.com/";

type OmdbError = { Response: "False"; Error: string };

export type OmdbSearchItem = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

type OmdbSearchResponse = { Search: OmdbSearchItem[]; totalResults: string };

export type OmdbMovie = OmdbSearchItem & {
  Rated: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
};

const PAGE_SIZE = 10;

export async function searchMovies(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<MoviePage> {
  const data = await request<OmdbSearchResponse>(
    { s: query, type: "movie", page: String(page) },
    signal,
  );
  const hasMore = page * PAGE_SIZE < Number(data.totalResults);
  return {
    movies: data.Search.map(toMovie),
    nextPage: hasMore ? page + 1 : undefined,
  };
}

export async function getMovieDetails(
  id: string,
  signal?: AbortSignal,
): Promise<MovieDetails> {
  const data = await request<OmdbMovie>({ i: id, plot: "full" }, signal);
  return toMovieDetails(data);
}

async function request<T>(
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  const apiKey = process.env.EXPO_PUBLIC_OMDB_API_KEY;
  if (!apiKey) {
    throw new ApiError(
      "Missing EXPO_PUBLIC_OMDB_API_KEY. Add it to .env (see README).",
    );
  }

  const url = `${BASE_URL}?${new URLSearchParams({ apikey: apiKey, ...params })}`;
  const body = await getJson<T | OmdbError>(url, signal).catch(
    (error: unknown) => {
      // A bad or missing key is an HTTP 401 that still carries OMDb's usual error body.
      if (error instanceof ApiError && isOmdbError(error.body))
        return error.body;
      throw error;
    },
  );

  // "Movie not found!" and similar errors arrive as HTTP 200.
  if (isOmdbError(body)) throw new ApiError(body.Error);
  return body;
}

function isOmdbError(body: unknown): body is OmdbError {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as OmdbError).Response === "False"
  );
}

const orNull = (value: string): string | null =>
  value && value !== "N/A" ? value : null;

const toList = (value: string): string[] =>
  orNull(value)
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export function toMovie(raw: OmdbSearchItem): Movie {
  return {
    id: raw.imdbID,
    title: raw.Title,
    year: raw.Year,
    posterUrl: orNull(raw.Poster),
  };
}

// OMDb posters are 380px; the image host serves 1000px when the "._V1_" suffix changes.
// shortcut: relies on the host's URL format, other URLs keep the small poster.
const toLargePoster = (url: string | null): string | null =>
  url?.includes("._V1_") ? `${url.split("._V1_")[0]}._V1_SX1000.jpg` : url;

export function toMovieDetails(raw: OmdbMovie): MovieDetails {
  const movie = toMovie(raw);
  const rating = parseFloat(raw.imdbRating);
  return {
    ...movie,
    posterUrlLarge: toLargePoster(movie.posterUrl),
    rated: orNull(raw.Rated),
    runtime: orNull(raw.Runtime),
    genres: toList(raw.Genre),
    director: orNull(raw.Director),
    actors: toList(raw.Actors),
    plot: orNull(raw.Plot),
    imdbRating: Number.isFinite(rating) ? rating : null,
  };
}
