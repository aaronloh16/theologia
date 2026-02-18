import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing } from "@/lib/theme";

export default function QuizScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + spacing.xl,
        },
      ]}
    >
      <Pressable onPress={() => router.back()} style={styles.closeButton}>
        <Text style={[styles.closeIcon, { color: theme.secondaryText }]}>
          ✕
        </Text>
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[
            typography.termHeadingDetail,
            { color: theme.primaryText, textAlign: "center" },
          ]}
        >
          Quiz
        </Text>
        <Text
          style={[
            typography.body,
            {
              color: theme.secondaryText,
              textAlign: "center",
              marginTop: spacing.md,
            },
          ]}
        >
          Coming in Phase 3
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: "300",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
});
