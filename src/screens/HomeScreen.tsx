import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useMovieDetails,
  useMovieSearch,
  useRefreshMovies,
} from "../api/queries";
import { MovieRow } from "../components/MovieRow";
import { FEATURED_MOVIE_ID, HOME_ROWS, type HomeRowConfig } from "../homeRows";
import type { RootStackScreenProps } from "../navigation/types";
import { colors, spacing, typography } from "../theme";
import type { Movie } from "../types";
import { HeroBanner } from "./HeroBanner";

export function HomeScreen({ navigation }: RootStackScreenProps<"Home">) {
  const insets = useSafeAreaInsets();
  const refreshMovies = useRefreshMovies();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const openMovie = (movie: Movie) =>
    navigation.navigate("MovieDetails", { id: movie.id });

  const refresh = async () => {
    setIsRefreshing(true);
    await refreshMovies();
    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={HOME_ROWS}
      keyExtractor={(row) => row.query}
      renderItem={({ item }) => <HomeRow row={item} onPressMovie={openMovie} />}
      ListHeaderComponent={
        <View>
          <FeaturedMovie onPressMovie={openMovie} />
          <Text
            style={[styles.brand, { top: insets.top + spacing.sm }]}
            accessibilityRole="header"
          >
            ExWo
          </Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={colors.text}
        />
      }
      contentContainerStyle={styles.content}
    />
  );
}

function FeaturedMovie({
  onPressMovie,
}: {
  onPressMovie: (movie: Movie) => void;
}) {
  const { data, error, isFetching, refetch } =
    useMovieDetails(FEATURED_MOVIE_ID);

  return (
    <HeroBanner
      movie={data}
      isLoading={isFetching}
      error={error}
      onRetry={refetch}
      onPress={onPressMovie}
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
  const {
    data,
    error,
    isFetching,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMovieSearch(row.query);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <MovieRow
      title={row.title}
      movies={data ?? []}
      onPressMovie={onPressMovie}
      isLoading={isFetching}
      error={error}
      onRetry={refetch}
      onEndReached={loadMore}
      isLoadingMore={isFetchingNextPage}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brand: {
    ...typography.title,
    position: "absolute",
    left: spacing.md,
    color: colors.accent,
    letterSpacing: 1,
  },
});
