import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  updateStreak,
  getTermsSeenCount,
  getSavedCount,
  getQuizStats,
  getAllTerms,
} from "@/lib/database";
import { colors, typography, spacing, borderRadius } from "@/lib/theme";

interface StatCardProps {
  value: string;
  label: string;
  theme: { primaryText: string; secondaryText: string; surface: string };
}

function StatCard({ value, label, theme }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
      <Text style={[typography.statNumber, { color: theme.primaryText }]}>
        {value}
      </Text>
      <Text style={[typography.statLabel, { color: theme.secondaryText }]}>
        {label}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const insets = useSafeAreaInsets();

  const [streak, setStreak] = useState(0);
  const [termsSeen, setTermsSeen] = useState(0);
  const [termsSaved, setTermsSaved] = useState(0);
  const [quizAccuracy, setQuizAccuracy] = useState(0);
  const [totalTerms, setTotalTerms] = useState(0);

  const loadStats = useCallback(async () => {
    const [s, seen, saved, quiz, all] = await Promise.all([
      updateStreak(),
      getTermsSeenCount(),
      getSavedCount(),
      getQuizStats(),
      getAllTerms(),
    ]);
    setStreak(s);
    setTermsSeen(seen);
    setTermsSaved(saved);
    setQuizAccuracy(Math.round(quiz.avgScore * 100));
    setTotalTerms(all.length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + spacing.md,
        },
      ]}
    >
      <Text
        style={[
          styles.screenTitle,
          typography.termHeadingDetail,
          { color: theme.primaryText },
        ]}
      >
        Profile
      </Text>

      <View style={styles.grid}>
        <StatCard
          value={String(streak)}
          label="Day Streak"
          theme={theme}
        />
        <StatCard
          value={String(termsSeen)}
          label="Terms Seen"
          theme={theme}
        />
        <StatCard
          value={String(termsSaved)}
          label="Terms Saved"
          theme={theme}
        />
        <StatCard
          value={`${quizAccuracy}%`}
          label="Quiz Accuracy"
          theme={theme}
        />
      </View>

      <View style={[styles.progressSection, { borderTopColor: theme.divider }]}>
        <Text
          style={[
            typography.sectionLabel,
            { color: theme.secondaryText, marginBottom: spacing.md },
          ]}
        >
          LIBRARY PROGRESS
        </Text>
        <View style={styles.progressRow}>
          <Text style={[typography.body, { color: theme.primaryText }]}>
            {termsSeen} of {totalTerms} terms explored
          </Text>
        </View>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.mutedAccent },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.accent,
                width: `${totalTerms > 0 ? (termsSeen / totalTerms) * 100 : 0}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  screenTitle: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: "47%",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  progressSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.xl,
  },
  progressRow: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
