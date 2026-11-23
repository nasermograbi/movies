import type { Movie, MovieDetails } from "../types";
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

export async function searchMovies(
  query: string,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const data = await request<OmdbSearchResponse>(
    { s: query, type: "movie" },
    signal,
  );
  return data.Search.map(toMovie);
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

export function toMovieDetails(raw: OmdbMovie): MovieDetails {
  const rating = parseFloat(raw.imdbRating);
  return {
    ...toMovie(raw),
    rated: orNull(raw.Rated),
    runtime: orNull(raw.Runtime),
    genres: toList(raw.Genre),
    director: orNull(raw.Director),
    actors: toList(raw.Actors),
    plot: orNull(raw.Plot),
    imdbRating: Number.isFinite(rating) ? rating : null,
  };
}
