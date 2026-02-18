import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius } from "@/lib/theme";
import type { Term } from "@/lib/types";

interface TermDetailModalProps {
  term: Term;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  onNavigateToTerm?: (termName: string) => void;
}

function SectionLabel({ label, theme }: { label: string; theme: { secondaryText: string } }) {
  return (
    <Text
      style={[
        styles.sectionLabel,
        typography.sectionLabel,
        { color: theme.secondaryText },
      ]}
    >
      {label}
    </Text>
  );
}

export default function TermDetailModal({
  term,
  isSaved,
  onToggleSave,
  onClose,
  onNavigateToTerm,
}: TermDetailModalProps) {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeIcon, { color: theme.secondaryText }]}>
            ✕
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.termHeading,
            typography.termHeadingDetail,
            { color: theme.primaryText },
          ]}
        >
          {term.term}
        </Text>

        <View style={styles.section}>
          <SectionLabel label="Definition" theme={theme} />
          <Text
            style={[
              typography.fullDefinition,
              { color: theme.primaryText },
            ]}
          >
            {term.fullDefinition}
          </Text>
        </View>

        {term.examples && term.examples.length > 0 && term.examples[0] !== "" && (
          <View style={styles.section}>
            <SectionLabel label="Examples" theme={theme} />
            {term.examples.map((example, index) => (
              <View key={index} style={styles.exampleRow}>
                <Text
                  style={[
                    styles.exampleNumber,
                    typography.example,
                    { color: theme.secondaryText },
                  ]}
                >
                  {index + 1}.
                </Text>
                <Text
                  style={[
                    styles.exampleText,
                    typography.example,
                    { color: theme.primaryText },
                  ]}
                >
                  {example}
                </Text>
              </View>
            ))}
          </View>
        )}

        {term.seeAlso && term.seeAlso.length > 0 && (
          <View style={styles.section}>
            <SectionLabel label="See Also" theme={theme} />
            <View style={styles.chipRow}>
              {term.seeAlso.map((related) => (
                <Pressable
                  key={related}
                  onPress={() => onNavigateToTerm?.(related)}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.mutedAccent },
                  ]}
                >
                  <Text style={[typography.chip, { color: theme.accent }]}>
                    {related}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {term.contrastsWith && term.contrastsWith.length > 0 && (
          <View style={styles.section}>
            <SectionLabel label="Contrasts With" theme={theme} />
            <View style={styles.chipRow}>
              {term.contrastsWith.map((contrast) => (
                <Pressable
                  key={contrast}
                  onPress={() => onNavigateToTerm?.(contrast)}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.mutedAccent },
                  ]}
                >
                  <Text style={[typography.chip, { color: theme.accent }]}>
                    {contrast}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.background,
            paddingBottom: insets.bottom + spacing.sm,
            borderTopColor: theme.divider,
          },
        ]}
      >
        <Pressable style={styles.bottomAction}>
          <Text style={[styles.bottomIcon, { color: theme.secondaryText }]}>
            ↗
          </Text>
        </Pressable>
        <Pressable onPress={onToggleSave} style={styles.bottomAction}>
          <Text
            style={[
              styles.bottomIcon,
              {
                color: isSaved ? theme.heartFilled : theme.heartOutline,
                fontSize: 28,
              },
            ]}
          >
            {isSaved ? "♥" : "♡"}
          </Text>
        </Pressable>
        <Pressable onPress={onToggleSave} style={styles.bottomAction}>
          <Text
            style={[
              styles.bottomIcon,
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
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  termHeading: {
    textAlign: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  exampleRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  exampleNumber: {
    width: 24,
    marginRight: spacing.sm,
  },
  exampleText: {
    flex: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xxl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomAction: {
    padding: spacing.sm,
  },
  bottomIcon: {
    fontSize: 24,
  },
});
