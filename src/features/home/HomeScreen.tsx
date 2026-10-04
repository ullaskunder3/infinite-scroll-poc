import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { storiesApi, StoryList, StorySummary } from '../../api';
import { colors } from '../../theme';

const PAGE_SIZE = 10;

export const HomeScreen: React.FC = () => {

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<StoryList, Error>({
    queryKey: ['stories', 'infinite', { limit: PAGE_SIZE }],
    queryFn: ({ pageParam }) =>
      storiesApi.getStories({
        limit: PAGE_SIZE,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.continueCursor
        ? lastPage.continueCursor
        : undefined,
  });

  const stories = useMemo(() => {
    return data?.pages.flatMap((p) => p.page) ?? [];
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item, index }: { item: StorySummary; index: number }) => (
    <View style={styles.testItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemIndex}>#{index + 1}</Text>
        <Text style={styles.itemId}>ID: {item.storyId}</Text>
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemMeta}>
        👁 {item.views} • 📚 {item.chapterCount} chapters
      </Text>
      {item.tags.length > 0 && (
        <Text style={styles.itemTags}>🏷 {item.tags.join(', ')}</Text>
      )}
      {item.creators.length > 0 && (
        <Text style={styles.itemCreators}>✍️ {item.creators.join(', ')}</Text>
      )}
    </View>
  ), []);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.accentGold} />
          <Text style={styles.footerLoadingText}>Loading next page...</Text>
        </View>
      );
    }

    if (!hasNextPage && stories.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>🎉 You've reached the end ({stories.length} stories)</Text>
        </View>
      );
    }

    return null;
  }, [isFetchingNextPage, hasNextPage, stories.length]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accentGold} />
          <Text style={styles.loadingText}>Fetching initial stories...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>❌ Failed to Load Stories</Text>
          <Text style={styles.errorDetails}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.storyId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimaryDark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginTop: 2,
  },
  refreshBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.backgroundDark,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accentGold,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondaryDark,
    fontSize: 14,
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorDetails: {
    color: colors.textSecondaryDark,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.accentGold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.backgroundDark,
    fontWeight: '700',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  testItem: {
    backgroundColor: colors.surfaceDark,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemIndex: {
    fontSize: 12,
    color: colors.accentGold,
    fontWeight: '700',
  },
  itemId: {
    fontSize: 11,
    color: colors.textSecondaryDark,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimaryDark,
    marginBottom: 6,
  },
  itemMeta: {
    fontSize: 13,
    color: colors.textSecondaryDark,
    marginBottom: 3,
  },
  itemTags: {
    fontSize: 12,
    color: '#7bc5ae',
    marginTop: 2,
  },
  itemCreators: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginTop: 2,
  },
  footerLoader: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerLoadingText: {
    fontSize: 13,
    color: colors.textSecondaryDark,
  },
  footerEnd: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerEndText: {
    fontSize: 12,
    color: colors.textSecondaryDark,
  },
});
