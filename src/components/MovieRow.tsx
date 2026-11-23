import type { ReactNode } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "../theme";
import type { Movie } from "../types";
import { POSTER_HEIGHT, PosterCard } from "./PosterCard";

type Props = {
  title: string;
  movies: Movie[];
  onPressMovie: (movie: Movie) => void;
  fallback?: ReactNode;
};

export function MovieRow({ title, movies, onPressMovie, fallback }: Props) {
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
        />
      ) : (
        <View style={styles.fallback}>{fallback}</View>
      )}
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
});
