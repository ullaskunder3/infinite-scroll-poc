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
import { AppHeader } from '../../components';
import { useAppStore } from '../../core/store';
import { colors } from '../../theme';
import {
  ChapterDrawerModal,
  ComicPageItem,
} from './components';
import { useChapterPages, useStoryChapters } from './hooks';

export interface ComicReaderScreenProps {
  chapterId?: string;
  onBack?: () => void;
}

export const ComicReaderScreen: React.FC<ComicReaderScreenProps> = ({
  chapterId: propChapterId,
  onBack: propOnBack,
}) => {
  const storeStoryId = useAppStore((s) => s.selectedStoryId);
  const storeChapterId = useAppStore((s) => s.selectedChapterId);
  const storeChapterNum = useAppStore((s) => s.selectedChapterNum);
  const closeChapter = useAppStore((s) => s.closeChapter);
  const openChapter = useAppStore((s) => s.openChapter);

  const activeChapterId = propChapterId || storeChapterId || '';
  const handleBack = propOnBack || closeChapter;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { pages, chapterNum, isLoading, isError, error, refetch } =
    useChapterPages(activeChapterId);

  const { chapters } = useStoryChapters(storeStoryId);

  const currentNum = chapterNum ?? storeChapterNum ?? 1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Shared Unified Header */}
      <AppHeader
        title={`Chapter ${currentNum} (${pages.length} Pages)`}
        onBack={handleBack}
        rightAction={
          chapters.length > 0 ? (
            <TouchableOpacity
              style={styles.drawerButton}
              activeOpacity={0.75}
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text style={styles.drawerButtonText}>☰</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNeon} />
          <Text style={styles.statusText}>Loading comic pages...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>❌ Failed to load chapter</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
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
              <Text style={styles.statusText}>No pages found for this chapter</Text>
            </View>
          }
        />
      )}

      <ChapterDrawerModal
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chapters={chapters}
        currentChapterId={activeChapterId}
        onSelectChapter={(nextId, nextNum) => openChapter(nextId, nextNum)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  drawerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerButtonText: {
    color: '#CBD5E1',
    fontSize: 16,
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
  statusText: {
    marginTop: 10,
    color: colors.textSecondaryDark,
    fontSize: 13,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '700',
  },
  retryBtn: {
    backgroundColor: colors.primaryNeon,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
