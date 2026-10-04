import React from 'react';
import { FlatList, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorySummary } from '../../api';
import { colors } from '../../theme';
import {
  HomeErrorView,
  HomeLoadingView,
  ListFooter,
  StoryListItem,
} from './components';
import { useHomeStories } from './hooks';

export const HomeScreen: React.FC = () => {
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {isLoading ? (
        <HomeLoadingView />
      ) : isError ? (
        <HomeErrorView message={error?.message} onRetry={refetch} />
      ) : (
        <FlatList<StorySummary>
          data={stories}
          keyExtractor={(item) => item.storyId}
          renderItem={({ item, index }) => (
            <StoryListItem story={item} index={index} />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <ListFooter
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              totalCount={stories.length}
            />
          }
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
  listContent: {
    padding: 16,
    gap: 12,
  },
});
