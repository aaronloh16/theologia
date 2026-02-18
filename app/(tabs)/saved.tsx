import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getSavedTerms, toggleSavedTerm } from "@/lib/database";
import { colors, typography, spacing, borderRadius } from "@/lib/theme";
import { mediumTap } from "@/lib/haptics";
import type { Term } from "@/lib/types";

export default function SavedScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [savedTerms, setSavedTerms] = useState<Term[]>([]);

  const loadSaved = useCallback(async () => {
    const terms = await getSavedTerms();
    setSavedTerms(terms);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved])
  );

  const handleUnsave = useCallback(
    async (termId: string) => {
      mediumTap();
      await toggleSavedTerm(termId);
      setSavedTerms((prev) => prev.filter((t) => t.id !== termId));
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Term }) => (
      <Pressable
        onPress={() =>
          router.push({ pathname: "/detail", params: { termId: item.id } })
        }
        style={[styles.row, { borderBottomColor: theme.divider }]}
      >
        <View style={styles.rowContent}>
          <Text
            style={[
              typography.listTitle,
              { color: theme.primaryText },
            ]}
          >
            {item.term}
          </Text>
          <Text
            style={[
              typography.listSubtitle,
              { color: theme.secondaryText },
            ]}
            numberOfLines={2}
          >
            {item.shortDefinition}
          </Text>
        </View>
        <Pressable
          onPress={() => handleUnsave(item.id)}
          hitSlop={12}
          style={styles.heartButton}
        >
          <Text style={{ fontSize: 22, color: theme.heartFilled }}>♥</Text>
        </Pressable>
      </Pressable>
    ),
    [theme, router, handleUnsave]
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
        Saved
      </Text>

      {savedTerms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48, marginBottom: spacing.md }}>♡</Text>
          <Text
            style={[
              typography.body,
              { color: theme.secondaryText, textAlign: "center" },
            ]}
          >
            Save terms from the feed to{"\n"}build your study list.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedTerms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  screenTitle: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  heartButton: {
    padding: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
});
