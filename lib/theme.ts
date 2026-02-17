import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export { SCREEN_WIDTH, SCREEN_HEIGHT };

export const colors = {
  dark: {
    background: "#1C1C1E",
    surface: "#2C2C2E",
    primaryText: "#F5F5F5",
    secondaryText: "#8E8E93",
    accent: "#C9A96E",
    mutedAccent: "#3A3A3C",
    divider: "#38383A",
    quizCorrect: "#4A6741",
    quizIncorrect: "#9B4D4D",
    heartFilled: "#C9A96E",
    heartOutline: "#8E8E93",
  },
  light: {
    background: "#F5F2EE",
    surface: "#FFFFFF",
    primaryText: "#2C2C2C",
    secondaryText: "#6B6B6B",
    accent: "#8B7355",
    mutedAccent: "#E8E4DF",
    divider: "#E0DCD7",
    quizCorrect: "#4A6741",
    quizIncorrect: "#9B4D4D",
    heartFilled: "#8B7355",
    heartOutline: "#6B6B6B",
  },
} as const;

export type ThemeColors = typeof colors.dark;

export const typography = {
  termHeadingFeed: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 38,
    lineHeight: 46,
  },
  termHeadingDetail: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 32,
    lineHeight: 40,
  },
  shortDefinition: {
    fontFamily: "Inter_400Regular",
    fontSize: 17,
    lineHeight: 24,
  },
  fullDefinition: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  },
  example: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  chip: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  tabLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    lineHeight: 14,
  },
  pill: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  quizQuestion: {
    fontFamily: "CormorantGaramond_500Medium",
    fontSize: 24,
    lineHeight: 32,
  },
  quizOption: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 22,
  },
  statNumber: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 36,
    lineHeight: 42,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  listTitle: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 20,
    lineHeight: 26,
  },
  listSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;
