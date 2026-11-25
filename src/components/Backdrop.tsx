import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../theme";

type Props = {
  imageUrl: string | null;
  placeholderUrl?: string | null;
  height: number;
  children?: ReactNode;
};

export function Backdrop({
  imageUrl,
  placeholderUrl,
  height,
  children,
}: Props) {
  return (
    <View style={[styles.container, { height }]}>
      {imageUrl !== null && (
        <Image
          source={imageUrl}
          placeholder={placeholderUrl}
          placeholderContentFit="cover"
          contentFit="cover"
          transition={300}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.fade} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  fade: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `linear-gradient(to bottom, ${colors.background}E6 0%, ${colors.background}80 15%, transparent 30%, transparent 40%, ${colors.background}D9 78%, ${colors.background} 100%)`,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    gap: spacing.sm,
    padding: spacing.md,
  },
});
