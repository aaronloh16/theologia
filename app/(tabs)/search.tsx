import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllTerms } from "@/lib/database";
import { colors, typography, spacing, borderRadius } from "@/lib/theme";
import type { Term } from "@/lib/types";

export default function SearchScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllTerms().then(setAllTerms);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allTerms;
    const q = query.toLowerCase();
    return allTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.shortDefinition.toLowerCase().includes(q)
    );
  }, [allTerms, query]);

  const renderItem = useCallback(
    ({ item }: { item: Term }) => (
      <Pressable
        onPress={() =>
          router.push({ pathname: "/detail", params: { termId: item.id } })
        }
        style={[styles.row, { borderBottomColor: theme.divider }]}
      >
        <Text
          style={[typography.listTitle, { color: theme.primaryText }]}
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
      </Pressable>
    ),
    [theme, router]
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
      <View
        style={[
          styles.searchBar,
          { backgroundColor: theme.mutedAccent },
        ]}
      >
        <Text style={[styles.searchIcon, { color: theme.secondaryText }]}>
          ⌕
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search terms..."
          placeholderTextColor={theme.secondaryText}
          style={[
            styles.searchInput,
            typography.body,
            { color: theme.primaryText },
          ]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[
              typography.body,
              { color: theme.secondaryText, textAlign: "center" },
            ]}
          >
            {query.trim()
              ? `No terms found for "${query}".`
              : "Start typing to search."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
});
