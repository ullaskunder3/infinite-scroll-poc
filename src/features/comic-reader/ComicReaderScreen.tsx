import React, { useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../core/store';
import { colors } from '../../theme';
import {
  BookPageView,
  ChapterDrawerModal,
  ReaderTopBar,
  SinglePageView,
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
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const storeStoryId = useAppStore((s) => s.selectedStoryId);
  const storeChapterId = useAppStore((s) => s.selectedChapterId);
  const storeChapterNum = useAppStore((s) => s.selectedChapterNum);
  const closeChapter = useAppStore((s) => s.closeChapter);
  const openChapter = useAppStore((s) => s.openChapter);

  const activeChapterId = propChapterId || storeChapterId || '';
  const handleBack = propOnBack || closeChapter;

  const [isBookView, setIsBookView] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const toggleBookView = () => setIsBookView((prev) => !prev);
  const toggleControls = () => setShowControls((prev) => !prev);

  const { pages, chapterNum, isLoading, isError, error, refetch } =
    useChapterPages(activeChapterId);
  const { chapters } = useStoryChapters(storeStoryId);
  const currentNum = chapterNum ?? storeChapterNum ?? 1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" hidden={!showControls} />

      {showControls && (
        <ReaderTopBar
          title={`Chapter ${currentNum}`}
          isBookView={isBookView}
          onBack={handleBack}
          onToggleBookView={toggleBookView}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          hasChapters={chapters.length > 0}
        />
      )}

      {/* Main Comic Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNeon} />
          <Text style={styles.statusText}>Loading chapter...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Failed to load chapter</Text>
          <Text style={styles.errorMessage}>{error?.message}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isBookView ? (
        <BookPageView
          pages={pages}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          onTap={toggleControls}
        />
      ) : (
        <SinglePageView
          pages={pages}
          screenWidth={screenWidth}
          onTap={toggleControls}
        />
      )}

      {/* Chapter Selection Drawer */}
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
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '700',
  },
  errorMessage: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
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
