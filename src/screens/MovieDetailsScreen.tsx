import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useMovieDetails } from "../api/queries";
import { POSTER_HEIGHT, POSTER_WIDTH } from "../components/PosterCard";
import { StateView } from "../components/StateView";
import type { RootStackScreenProps } from "../navigation/types";
import { colors, spacing, typography } from "../theme";

export function MovieDetailsScreen({
  route,
}: RootStackScreenProps<"MovieDetails">) {
  const {
    data: movie,
    error,
    isFetching,
    refetch,
  } = useMovieDetails(route.params.id);

  if (!movie) {
    return <StateView isLoading={isFetching} error={error} onRetry={refetch} />;
  }

  const meta = [movie.year, movie.rated, movie.runtime]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {movie.posterUrl !== null && (
          <Image
            source={movie.posterUrl}
            style={styles.poster}
            contentFit="cover"
            transition={200}
          />
        )}
        <View style={styles.headerText}>
          <Text style={typography.title}>{movie.title}</Text>
          <Text style={typography.caption}>{meta}</Text>
          {movie.imdbRating !== null && (
            <Text style={styles.rating}>
              ★ {movie.imdbRating.toFixed(1)} IMDb
            </Text>
          )}
        </View>
      </View>

      {movie.genres.length > 0 && (
        <Text style={typography.caption}>{movie.genres.join(", ")}</Text>
      )}
      {movie.plot !== null && <Text style={typography.body}>{movie.plot}</Text>}
      <Credit label="Director" value={movie.director} />
      <Credit label="Cast" value={movie.actors.join(", ")} />
    </ScrollView>
  );
}

function Credit({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <Text style={typography.body}>
      <Text style={styles.label}>{label}: </Text>
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    gap: spacing.md,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 6,
  },
  headerText: {
    flex: 1,
    gap: spacing.sm,
  },
  rating: {
    ...typography.body,
    fontWeight: "700",
  },
  label: {
    color: colors.textMuted,
  },
});
