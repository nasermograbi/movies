import type { TextStyle } from "react-native";

export const colors = {
  background: "#0B0B0F",
  surface: "#1C1C24",
  text: "#FFFFFF",
  textMuted: "#A1A1AA",
  accent: "#E5383B",
  rating: "#F5C518",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  heading: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
} satisfies Record<string, TextStyle>;
