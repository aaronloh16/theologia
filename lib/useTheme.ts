import { useColorScheme } from "react-native";
import { colors, type ThemeColors } from "./theme";

export function useTheme(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === "light" ? colors.light : colors.dark;
}
