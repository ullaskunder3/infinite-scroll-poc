import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorySummary } from '../../api';
import { useAppStore } from '../../core/store';
import { colors } from '../../theme';
import { useReadProgressStore } from '../comic-reader/store';
import {
  ContinueReadingCard,
  FeedSectionHeader,
  GenreFilter,
  HomeEmptyView,
  HomeErrorView,
  HomeHeader,
  HomeLoadingView,
  ListFooter,
  StoryCard,
} from './components';
import { useHomeStories } from './hooks';

export interface HomeScreenProps {
  onNavigateToProfile?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToProfile }) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const openStory = useAppStore((state) => state.openStory);
  const openChapter = useAppStore((state) => state.openChapter);

  const lastRead = useReadProgressStore((s) => s.lastRead);

  const handleContinueReading = useCallback(() => {
    if (!lastRead) return;
    openStory(lastRead.storyId);
    openChapter(lastRead.chapterId, lastRead.chapterNum, lastRead.pageNum);
  }, [lastRead, openStory, openChapter]);

  const {
    stories,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useHomeStories(20);

  const flatListRef = useRef<FlatList<StorySummary>>(null);

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedGenre(category);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  // Derive unique categories dynamically
  const genres = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => s.tags?.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [stories]);

  // Filter stories by selected category
  const filteredStories = useMemo(() => {
    if (selectedGenre === 'All') return stories;
    return stories.filter((story) => story.tags?.includes(selectedGenre));
  }, [stories, selectedGenre]);

  // Auto-fetch more stories in the background if a selected category is sparse (< 4 items)
  useEffect(() => {
    if (
      selectedGenre !== 'All' &&
      filteredStories.length < 4 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isLoading
    ) {
      fetchNextPage();
    }
  }, [
    selectedGenre,
    filteredStories.length,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  ]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: StorySummary }) => (
      <StoryCard
        story={item}
        layout={layout}
        onPress={openStory}
      />
    ),
    [layout, openStory]
  );

  const renderItemSeparator = useCallback(() => {
    if (layout === 'list') {
      return <View style={styles.listSeparator} />;
    }
    return null;
  }, [layout]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" />
        <HomeLoadingView />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" />
        <HomeErrorView message={error?.message} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* 1. Header */}
      <HomeHeader onProfilePress={onNavigateToProfile} />

      {/* 2. Categories Filter */}
      <GenreFilter
        categories={genres}
        selectedCategory={selectedGenre}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Feed List */}
      <FlatList
        ref={flatListRef}
        key={layout}
        data={filteredStories}
        extraData={selectedGenre}
        numColumns={layout === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.storyId}
        renderItem={renderItem}
        columnWrapperStyle={layout === 'grid' ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={renderItemSeparator}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <View style={styles.listHeaderWrapper}>
            {lastRead ? (
              <ContinueReadingCard
                progress={lastRead}
                onPress={handleContinueReading}
              />
            ) : null}
            <FeedSectionHeader
              selectedGenre={selectedGenre}
              layout={layout}
              onSelectLayout={setLayout}
              style={styles.feedHeader}
            />
          </View>
        }
        ListFooterComponent={
          <ListFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            totalCount={filteredStories.length}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={colors.primaryNeon}
            colors={[colors.primaryNeon, colors.accentGold]}
          />
        }
        ListEmptyComponent={<HomeEmptyView />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D0B',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  listHeaderWrapper: {
    marginBottom: 8,
  },
  feedHeader: {
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  listSeparator: {
    height: 12,
  },
});
