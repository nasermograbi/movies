import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import type { Movie, MoviePage } from "../types";
import { getMovieDetails, searchMovies } from "./omdb";

export function useMovieSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["movies", "search", query],
    queryFn: ({ pageParam, signal }) => searchMovies(query, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: toUniqueMovies,
  });
}

export function useMovieDetails(id: string) {
  return useQuery({
    queryKey: ["movies", "details", id],
    queryFn: ({ signal }) => getMovieDetails(id, signal),
  });
}

export function useRefreshMovies() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.refetchQueries({ queryKey: ["movies"], type: "active" });
}

// OMDb sometimes repeats a movie across pages; duplicate ids break list keys.
function toUniqueMovies(data: InfiniteData<MoviePage>): Movie[] {
  const movies = data.pages.flatMap((page) => page.movies);
  return [...new Map(movies.map((movie) => [movie.id, movie])).values()];
}
