import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useMovieDetails } from "../api/queries";
import { Backdrop } from "../components/Backdrop";
import { StateView } from "../components/StateView";
import type { RootStackScreenProps } from "../navigation/types";
import { colors, spacing, typography } from "../theme";

export function MovieDetailsScreen({
  route,
}: RootStackScreenProps<"MovieDetails">) {
  const { width } = useWindowDimensions();
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
      <Backdrop
        imageUrl={movie.posterUrlLarge}
        placeholderUrl={movie.posterUrl}
        height={Math.min(width * 1.2, 520)}
      >
        <Text style={typography.title}>{movie.title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </Backdrop>

      <View style={styles.body}>
        {movie.imdbRating !== null && (
          <Text
            style={styles.rating}
            accessibilityLabel={`IMDb rating ${movie.imdbRating} out of 10`}
          >
            ★ {movie.imdbRating.toFixed(1)}
            <Text style={styles.ratingScale}> / 10 IMDb</Text>
          </Text>
        )}

        {movie.genres.length > 0 && (
          <View style={styles.chips}>
            {movie.genres.map((genre) => (
              <View key={genre} style={styles.chip}>
                <Text style={styles.chipText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        {movie.plot !== null && (
          <Text style={typography.body}>{movie.plot}</Text>
        )}
        <Credit label="Director" value={movie.director} />
        <Credit label="Cast" value={movie.actors.join(", ")} />
      </View>
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
    paddingBottom: spacing.xl,
  },
  meta: {
    ...typography.caption,
    color: colors.text,
  },
  body: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rating: {
    ...typography.heading,
    color: colors.rating,
  },
  ratingScale: {
    ...typography.caption,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
  },
  label: {
    color: colors.textMuted,
  },
});
