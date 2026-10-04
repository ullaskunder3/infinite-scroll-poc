import React, { useState } from 'react';
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
import { ComicPage } from '../../api';
import { useAppStore } from '../../core/store';
import { colors } from '../../theme';
import { ChapterDrawerModal, ComicPageItem } from './components';
import { useChapterPages, useStoryChapters } from './hooks';

export interface ComicReaderScreenProps {
  chapterId?: string;
  chapterNum?: number;
  onBack?: () => void;
}

export const ComicReaderScreen: React.FC<ComicReaderScreenProps> = ({
  chapterId: propChapterId,
  chapterNum: propChapterNum,
  onBack: propOnBack,
}) => {
  const storeStoryId = useAppStore((s) => s.selectedStoryId);
  const storeChapterId = useAppStore((s) => s.selectedChapterId);
  const storeChapterNum = useAppStore((s) => s.selectedChapterNum);
  const closeChapter = useAppStore((s) => s.closeChapter);
  const openChapter = useAppStore((s) => s.openChapter);

  const activeChapterId = propChapterId || storeChapterId || '';
  const activeChapterNum = propChapterNum ?? storeChapterNum ?? 1;
  const handleBack = propOnBack || closeChapter;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { pages, chapterNum, isLoading, isError, error, refetch } =
    useChapterPages(activeChapterId);

  const { chapters } = useStoryChapters(storeStoryId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Top Navigation Bar with Back and Chapter Drawer Trigger */}
      <View style={styles.topBar}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.topBarTitle} numberOfLines={1}>
            Chapter {chapterNum ?? activeChapterNum} ({pages.length} Pages)
          </Text>
        </View>

        {/* Quick Chapter Selector Sheet Trigger */}
        {chapters.length > 0 && (
          <TouchableOpacity
            style={styles.drawerButton}
            activeOpacity={0.75}
            onPress={() => setIsDrawerOpen(true)}
          >
            <Text style={styles.drawerButtonText}>☰ Chapters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Reader Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNeon} />
          <Text style={styles.loadingText}>Loading comic pages...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>❌ Failed to load chapter</Text>
          <Text style={styles.errorMessage}>{error?.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList<ComicPage>
          data={pages}
          keyExtractor={(item) => `page-${item.pageNum}`}
          renderItem={({ item }) => <ComicPageItem page={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No pages found for this chapter</Text>
            </View>
          }
        />
      )}

      {/* Collapsed Chapter List Drawer Sheet */}
      <ChapterDrawerModal
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chapters={chapters}
        currentChapterId={activeChapterId}
        onSelectChapter={(nextId, nextNum) => {
          openChapter(nextId, nextNum);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#090D0B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  drawerButton: {
    backgroundColor: '#131B17',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerButtonText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    backgroundColor: '#000000',
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
  emptyText: {
    color: colors.textSecondaryDark,
    fontSize: 14,
  },
});
