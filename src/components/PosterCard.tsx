import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "../theme";
import type { Movie } from "../types";

export const POSTER_WIDTH = 112;
export const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

type Props = {
  movie: Movie;
  onPress: (movie: Movie) => void;
};

export function PosterCard({ movie, onPress }: Props) {
  // Some OMDb poster links are dead (404), so fall back to the title.
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = movie.posterUrl !== null && !imageFailed;

  return (
    <Pressable
      onPress={() => onPress(movie)}
      accessibilityRole="button"
      accessibilityLabel={`${movie.title} (${movie.year})`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {showImage ? (
        <Image
          source={movie.posterUrl}
          style={styles.poster}
          contentFit="cover"
          transition={200}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Text style={styles.fallbackTitle} numberOfLines={4}>
          {movie.title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  fallbackTitle: {
    ...typography.caption,
    color: colors.text,
    textAlign: "center",
    padding: spacing.sm,
  },
});
