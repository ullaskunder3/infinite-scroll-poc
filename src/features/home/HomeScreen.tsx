import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorySummary } from '../../api';
import { useAppStore } from '../../core/store';
import { colors } from '../../theme';
import {
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

const COLLAPSIBLE_HEADER_HEIGHT = 64;
const STICKY_CONTROLS_HEIGHT = 104;
const TOTAL_HEADER_HEIGHT = COLLAPSIBLE_HEADER_HEIGHT + STICKY_CONTROLS_HEIGHT;

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToProfile }) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const scrollY = useRef(new Animated.Value(0)).current;

  const openStory = useAppStore((state) => state.openStory);

  const {
    stories,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    handleEndReached,
  } = useHomeStories(10);

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

  // Collapsible animation: slides HomeHeader up and locks controls at top
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, COLLAPSIBLE_HEADER_HEIGHT],
    outputRange: [0, -COLLAPSIBLE_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSIBLE_HEADER_HEIGHT * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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

      <View style={styles.contentWrapper}>
        {/* 1. Collapsible Top Welcome Header */}
        <Animated.View
          style={[
            styles.collapsibleHeader,
            {
              transform: [{ translateY: headerTranslateY }],
              opacity: headerOpacity,
            },
          ]}
        >
          <HomeHeader onProfilePress={onNavigateToProfile} />
        </Animated.View>

        {/* 2. Sticky Action Area (Categories + Feed Controls) */}
        <Animated.View
          style={[
            styles.stickyControls,
            {
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <GenreFilter
            categories={genres}
            selectedCategory={selectedGenre}
            onSelectCategory={setSelectedGenre}
          />
          <FeedSectionHeader
            selectedGenre={selectedGenre}
            layout={layout}
            onSelectLayout={setLayout}
          />
        </Animated.View>

        {/* 3. Main Virtualized Feed */}
        <Animated.FlatList
          key={layout}
          data={filteredStories}
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
          ListFooterComponent={
            <ListFooter
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              totalCount={filteredStories.length}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
              progressViewOffset={TOTAL_HEADER_HEIGHT}
              tintColor={colors.primaryNeon}
              colors={[colors.primaryNeon, colors.accentGold]}
            />
          }
          ListEmptyComponent={<HomeEmptyView />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D0B',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  collapsibleHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COLLAPSIBLE_HEADER_HEIGHT,
    zIndex: 10,
    backgroundColor: '#090D0B',
  },
  stickyControls: {
    position: 'absolute',
    top: COLLAPSIBLE_HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: '#090D0B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  listContent: {
    paddingTop: TOTAL_HEADER_HEIGHT + 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  listSeparator: {
    height: 12,
  },
});
