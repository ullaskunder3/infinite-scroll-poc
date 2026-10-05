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
import { AlertCircle } from 'lucide-react-native';
import { ChapterSummary } from '../../api';
import { AppHeader } from '../../components';
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
  const handleSelectChapter = propOnSelectChapter || openChapter;

  const {
    story,
    chapters,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStoryDetails(activeStoryId);

  const renderHeader = useCallback(() => {
    return (
      <View>
        <StoryHeroHeader
          story={story}
          chapters={chapters}
          onStartReading={handleSelectChapter}
        />
        <ChaptersSectionHeader totalChapters={chapters.length} />
      </View>
    );
  }, [story, chapters, handleSelectChapter]);

  const renderItem = useCallback(
    ({ item }: { item: ChapterSummary }) => {
      return (
        <ChapterCard
          chapter={item}
          onPress={() => handleSelectChapter(item.chapterId, item.chapterNum)}
        />
      );
    },
    [handleSelectChapter]
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primaryNeon} />
          <Text style={styles.footerLoaderText}>Loading more chapters...</Text>
        </View>
      );
    }
    return <View style={styles.footerSpacer} />;
  }, [isFetchingNextPage]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNeon} />
          <Text style={styles.loadingText}>Loading chapters...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <AlertCircle size={32} color="#ff6b6b" style={{ marginBottom: 8 }} />
          <Text style={styles.errorTitle}>Unable to load story</Text>
          <Text style={styles.errorMessage}>{error?.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
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
            onRefresh={refetch}
            tintColor={colors.primaryNeon}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Unified App Header */}
      <AppHeader
        title={story?.title || 'Story Details'}
        onBack={handleBack}
      />

      {renderContent()}
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
    paddingBottom: 32,
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
    marginBottom: 6,
  },
  errorMessage: {
    color: colors.textSecondaryDark,
    fontSize: 12,
    textAlign: 'center',
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
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerLoaderText: {
    color: colors.textSecondaryDark,
    fontSize: 12,
  },
  footerSpacer: {
    height: 16,
  },
});
