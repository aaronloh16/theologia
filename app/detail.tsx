import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTermById, isTermSaved, toggleSavedTerm, getAllTerms } from "@/lib/database";
import { mediumTap } from "@/lib/haptics";
import type { Term } from "@/lib/types";
import TermDetailModal from "@/components/TermDetailModal";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import { colors } from "@/lib/theme";

export default function DetailScreen() {
  const { termId } = useLocalSearchParams<{ termId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;

  const [term, setTerm] = useState<Term | null>(null);
  const [saved, setSaved] = useState(false);
  const [allTerms, setAllTerms] = useState<Term[]>([]);

  useEffect(() => {
    async function load() {
      if (!termId) return;
      const [t, s, all] = await Promise.all([
        getTermById(termId),
        isTermSaved(termId),
        getAllTerms(),
      ]);
      setTerm(t);
      setSaved(s);
      setAllTerms(all);
    }
    load();
  }, [termId]);

  const handleToggleSave = useCallback(async () => {
    if (!termId) return;
    mediumTap();
    const nowSaved = await toggleSavedTerm(termId);
    setSaved(nowSaved);
  }, [termId]);

  const handleNavigateToTerm = useCallback(
    (termName: string) => {
      const found = allTerms.find(
        (t) =>
          t.term.toLowerCase().includes(termName.toLowerCase()) ||
          t.id.includes(termName.toLowerCase().replace(/\s+/g, "-"))
      );
      if (found) {
        router.replace({
          pathname: "/detail",
          params: { termId: found.id },
        });
      }
    },
    [allTerms, router]
  );

  if (!term) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <TermDetailModal
      term={term}
      isSaved={saved}
      onToggleSave={handleToggleSave}
      onClose={() => router.back()}
      onNavigateToTerm={handleNavigateToTerm}
    />
  );
}
