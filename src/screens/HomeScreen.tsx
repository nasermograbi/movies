import { FlatList, StyleSheet } from "react-native";

import { useMovieSearch } from "../api/queries";
import { MovieRow } from "../components/MovieRow";
import { StateView } from "../components/StateView";
import { HOME_ROWS, type HomeRowConfig } from "../homeRows";
import type { RootStackScreenProps } from "../navigation/types";
import { spacing } from "../theme";
import type { Movie } from "../types";

export function HomeScreen({ navigation }: RootStackScreenProps<"Home">) {
  const openMovie = (movie: Movie) =>
    navigation.navigate("MovieDetails", { id: movie.id });

  return (
    <FlatList
      data={HOME_ROWS}
      keyExtractor={(row) => row.query}
      renderItem={({ item }) => <HomeRow row={item} onPressMovie={openMovie} />}
      contentContainerStyle={styles.content}
    />
  );
}

function HomeRow({
  row,
  onPressMovie,
}: {
  row: HomeRowConfig;
  onPressMovie: (movie: Movie) => void;
}) {
  const { data, error, isFetching, refetch } = useMovieSearch(row.query);

  return (
    <MovieRow
      title={row.title}
      movies={data ?? []}
      onPressMovie={onPressMovie}
      fallback={
        <StateView isLoading={isFetching} error={error} onRetry={refetch} />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
});
