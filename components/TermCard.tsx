import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  Animated,
} from "react-native";
import { colors, typography, spacing, borderRadius, SCREEN_HEIGHT } from "@/lib/theme";
import type { Term } from "@/lib/types";

interface TermCardProps {
  term: Term;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDetail: () => void;
}

export default function TermCard({
  term,
  isSaved,
  onToggleSave,
  onOpenDetail,
}: TermCardProps) {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [term.id]);

  return (
    <View style={[styles.container, { height: SCREEN_HEIGHT }]}>
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.term,
            typography.termHeadingFeed,
            { color: theme.primaryText, opacity: fadeAnim },
          ]}
        >
          {term.term}
        </Animated.Text>

        <Pressable
          onPress={onOpenDetail}
          style={[
            styles.detailPill,
            { backgroundColor: theme.mutedAccent },
          ]}
        >
          <Text style={[typography.pill, { color: theme.secondaryText }]}>
            Word details {"ⓘ"}
          </Text>
        </Pressable>

        <Animated.Text
          style={[
            styles.definition,
            typography.shortDefinition,
            { color: theme.secondaryText, opacity: fadeAnim },
          ]}
          numberOfLines={4}
        >
          {term.shortDefinition}
        </Animated.Text>
      </View>

      <View style={styles.actionBar}>
        <Pressable onPress={() => {}} style={styles.actionButton}>
          <Text style={[styles.actionIcon, { color: theme.secondaryText }]}>
            ↗
          </Text>
        </Pressable>
        <Pressable onPress={onToggleSave} style={styles.actionButton}>
          <Text
            style={[
              styles.actionIcon,
              {
                color: isSaved ? theme.heartFilled : theme.heartOutline,
                fontSize: 26,
              },
            ]}
          >
            {isSaved ? "♥" : "♡"}
          </Text>
        </Pressable>
        <Pressable onPress={onToggleSave} style={styles.actionButton}>
          <Text
            style={[
              styles.actionIcon,
              {
                color: isSaved ? theme.heartFilled : theme.secondaryText,
              },
            ]}
          >
            {isSaved ? "▪" : "▫"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 120,
  },
  term: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  detailPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.lg,
  },
  definition: {
    textAlign: "center",
    paddingHorizontal: spacing.md,
  },
  actionBar: {
    position: "absolute",
    bottom: 140,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxl,
  },
  actionButton: {
    padding: spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
});
