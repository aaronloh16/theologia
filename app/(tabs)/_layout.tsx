import { Tabs } from "expo-router";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, borderRadius, spacing } from "@/lib/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const insets = useSafeAreaInsets();

  const icons: Record<string, string> = {
    index: "◉",
    saved: "♡",
    search: "⌕",
    profile: "⊞",
  };

  const labels: Record<string, string> = {
    index: "Feed",
    saved: "Saved",
    search: "Search",
    profile: "Profile",
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.surface,
            borderColor: theme.divider,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name;

          return (
            <View key={route.key} style={styles.tabItem}>
              <Text
                onPress={() => {
                  if (!isFocused) {
                    navigation.navigate(route.name);
                  }
                }}
                style={[
                  styles.tabIcon,
                  {
                    color: isFocused ? theme.accent : theme.secondaryText,
                  },
                ]}
              >
                {icons[routeName] ?? "•"}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? theme.accent : theme.secondaryText,
                    ...typography.tabLabel,
                  },
                ]}
              >
                {labels[routeName] ?? routeName}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    width: "100%",
    maxWidth: 320,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
  },
});
