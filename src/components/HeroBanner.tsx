import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { colors, spacing, typography } from "../theme";
import type { MovieDetails } from "../types";
import { Backdrop } from "./Backdrop";
import { Skeleton } from "./Skeleton";
import { StateView } from "./StateView";

type Props = {
  movie: MovieDetails | undefined;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onPress: (movie: MovieDetails) => void;
};

export function HeroBanner({
  movie,
  isLoading,
  error,
  onRetry,
  onPress,
}: Props) {
  const { width } = useWindowDimensions();
  const height = Math.min(width * 1.25, 560);

  if (!movie) {
    return isLoading ? (
      <Skeleton style={{ height, borderRadius: 0 }} />
    ) : (
      <View style={{ height }}>
        <StateView error={error} onRetry={onRetry} />
      </View>
    );
  }

  return (
    <Backdrop
      imageUrl={movie.posterUrlLarge}
      placeholderUrl={movie.posterUrl}
      height={height}
    >
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      {movie.genres.length > 0 && (
        <Text style={styles.genres}>{movie.genres.join("  •  ")}</Text>
      )}
      <Pressable
        onPress={() => onPress(movie)}
        accessibilityRole="button"
        accessibilityLabel={`More info about ${movie.title}`}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>More info</Text>
      </Pressable>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    fontSize: 34,
    textAlign: "center",
  },
  genres: {
    ...typography.caption,
    color: colors.text,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: 6,
    backgroundColor: colors.text,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.body,
    fontWeight: "700",
    color: colors.background,
  },
});
