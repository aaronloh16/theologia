import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  ViewToken,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getAllTerms,
  getSavedTermIds,
  getSrsStates,
  toggleSavedTerm,
  recordTermSeen,
} from "@/lib/database";
import { generateFeedQueue } from "@/lib/feed-algorithm";
import { colors, SCREEN_HEIGHT } from "@/lib/theme";
import { mediumTap } from "@/lib/haptics";
import type { Term } from "@/lib/types";
import TermCard from "@/components/TermCard";

export default function FeedScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? colors.light : colors.dark;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [feed, setFeed] = useState<Term[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [swipeCount, setSwipeCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const loadFeed = useCallback(async () => {
    const [allTerms, srsStates, saved] = await Promise.all([
      getAllTerms(),
      getSrsStates(),
      getSavedTermIds(),
    ]);
    setSavedIds(saved);
    const queue = generateFeedQueue(allTerms, srsStates, saved, 50);
    setFeed(queue);
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleToggleSave = useCallback(
    async (termId: string) => {
      mediumTap();
      const nowSaved = await toggleSavedTerm(termId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (nowSaved) {
          next.add(termId);
        } else {
          next.delete(termId);
        }
        return next;
      });
    },
    []
  );

  const handleOpenDetail = useCallback(
    (term: Term) => {
      router.push({
        pathname: "/detail",
        params: { termId: term.id },
      });
    },
    [router]
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const item = viewableItems[0].item as Term;
        recordTermSeen(item.id);
        setSwipeCount((prev) => {
          const next = prev + 1;
          if (next > 0 && next % 10 === 0) {
            // Quiz trigger handled here in future
          }
          return next;
        });
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: Term }) => (
      <TermCard
        term={item}
        isSaved={savedIds.has(item.id)}
        onToggleSave={() => handleToggleSave(item.id)}
        onOpenDetail={() => handleOpenDetail(item)}
      />
    ),
    [savedIds, handleToggleSave, handleOpenDetail]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={flatListRef}
        data={feed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
