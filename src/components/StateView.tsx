import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, spacing, typography } from "../theme";

type Props = {
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyText?: string;
};

export function StateView({
  isLoading,
  error,
  onRetry,
  emptyText = "Nothing to show yet.",
}: Props) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.text} accessibilityLabel="Loading" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{error.message}</Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            style={styles.button}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{emptyText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.md,
  },
  message: {
    ...typography.caption,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  buttonText: {
    ...typography.body,
    fontWeight: "600",
  },
});
