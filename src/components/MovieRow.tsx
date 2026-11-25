import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, spacing, typography } from "../theme";
import type { Movie } from "../types";
import { POSTER_HEIGHT, POSTER_WIDTH, PosterCard } from "./PosterCard";
import { Skeleton } from "./Skeleton";
import { StateView } from "./StateView";

type Props = {
  title: string;
  movies: Movie[];
  onPressMovie: (movie: Movie) => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
};

export function MovieRow({
  title,
  movies,
  onPressMovie,
  isLoading,
  error,
  onRetry,
  onEndReached,
  isLoadingMore,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {movies.length > 0 ? (
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(movie) => movie.id}
          renderItem={({ item }) => (
            <PosterCard movie={item} onPress={onPressMovie} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <LoadingMore /> : undefined}
        />
      ) : isLoading ? (
        <PosterSkeletons />
      ) : (
        <View style={styles.fallback}>
          <StateView error={error} onRetry={onRetry} />
        </View>
      )}
    </View>
  );
}

function PosterSkeletons() {
  return (
    <View style={styles.skeletons} accessible accessibilityLabel="Loading">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <Skeleton key={index} style={styles.posterSize} />
      ))}
    </View>
  );
}

function LoadingMore() {
  return (
    <View style={styles.loadingMore}>
      <ActivityIndicator
        color={colors.textMuted}
        accessibilityLabel="Loading more"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    paddingHorizontal: spacing.md,
  },
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  fallback: {
    height: POSTER_HEIGHT,
  },
  skeletons: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    overflow: "hidden",
  },
  posterSize: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
  },
  loadingMore: {
    height: POSTER_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
});
