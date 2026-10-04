import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChapterSummary } from '../../api';
import { useAppStore } from '../../core/store';
import { colors } from '../../theme';
import {
  ChapterCard,
  ChaptersSectionHeader,
  StoryHeroHeader,
} from './components';
import { useStoryDetails } from './hooks';

export interface StoryDetailScreenProps {
  storyId?: string;
  onBack?: () => void;
  onSelectChapter?: (chapterId: string, chapterNum: number) => void;
}

export const StoryDetailScreen: React.FC<StoryDetailScreenProps> = ({
  storyId: propStoryId,
  onBack: propOnBack,
  onSelectChapter: propOnSelectChapter,
}) => {
  const storeStoryId = useAppStore((s) => s.selectedStoryId);
  const closeStory = useAppStore((s) => s.closeStory);
  const openChapter = useAppStore((s) => s.openChapter);

  const activeStoryId = propStoryId || storeStoryId || '';
  const handleBack = propOnBack || closeStory;
  const handleSelectChapter =
    propOnSelectChapter ||
    ((chapId: string, chapNum: number) => {
      openChapter(chapId, chapNum);
    });

  const {
    story,
    chapters,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useStoryDetails(activeStoryId);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderHeader = useCallback(
    () => (
      <View>
        <StoryHeroHeader
          story={story}
          chapters={chapters}
          onStartReading={handleSelectChapter}
        />
        <ChaptersSectionHeader totalChapters={chapters.length} />
      </View>
    ),
    [story, chapters, handleSelectChapter]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChapterSummary }) => (
      <ChapterCard
        chapter={item}
        onPress={() => handleSelectChapter(item.chapterId, item.chapterNum)}
      />
    ),
    [handleSelectChapter]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primaryNeon} />
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNeon} />
          <Text style={styles.loadingText}>Loading chapters...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>❌ Unable to load story</Text>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.chapterId}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.primaryNeon}
              colors={[colors.primaryNeon, colors.accentGold]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No chapters available</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D0B',
  },
  topBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '300',
    marginTop: -2,
    lineHeight: 28,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  centerContainer: {
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
  errorMessage: {
    color: colors.textSecondaryDark,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primaryNeon,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondaryDark,
    fontSize: 14,
  },
});
