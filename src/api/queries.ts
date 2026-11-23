import { useQuery } from "@tanstack/react-query";

import { getMovieDetails, searchMovies } from "./omdb";

export function useMovieSearch(query: string) {
  return useQuery({
    queryKey: ["movies", "search", query],
    queryFn: ({ signal }) => searchMovies(query, signal),
  });
}

export function useMovieDetails(id: string) {
  return useQuery({
    queryKey: ["movies", "details", id],
    queryFn: ({ signal }) => getMovieDetails(id, signal),
  });
}
