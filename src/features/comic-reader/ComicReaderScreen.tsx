import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBackHandler } from '../../core/hooks';
import { useAppStore } from '../../core/store';
import {
  ChapterDrawerModal,
  PageIndicator,
  ReaderContent,
  ReaderTopBar,
} from './components';
import { useChapterPages, useStoryChapters } from './hooks';
import { useReadProgressStore } from './store';

export interface ComicReaderScreenProps {
  chapterId?: string;
  initialPage?: number;
  onBack?: () => void;
}

export const ComicReaderScreen: React.FC<ComicReaderScreenProps> = ({
  chapterId: propChapterId,
  initialPage: propInitialPage,
  onBack: propOnBack,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;

  const storeStoryId = useAppStore((s) => s.selectedStoryId);
  const storeChapterId = useAppStore((s) => s.selectedChapterId);
  const storeChapterNum = useAppStore((s) => s.selectedChapterNum);
  const storeInitialPage = useAppStore((s) => s.selectedInitialPage);
  const closeChapter = useAppStore((s) => s.closeChapter);
  const openChapter = useAppStore((s) => s.openChapter);

  const targetInitialPage = propInitialPage ?? storeInitialPage ?? 1;

  const saveProgress = useReadProgressStore((s) => s.saveProgress);

  const activeChapterId = propChapterId || storeChapterId || '';
  const handleBack = propOnBack || closeChapter;

  useBackHandler(handleBack);

  const [isBookView, setIsBookView] = useState(isLandscape);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(targetInitialPage);

  // Auto-switch to double-page spread on rotation to landscape, and single page in portrait
  useEffect(() => {
    setIsBookView(isLandscape);
  }, [isLandscape]);

  const toggleBookView = () => setIsBookView((prev) => !prev);
  const toggleControls = () => setShowControls((prev) => !prev);

  const { pages, chapterNum, isLoading, isError, error, refetch } =
    useChapterPages(activeChapterId);
  const { chapters } = useStoryChapters(storeStoryId);
  const currentNum = chapterNum ?? storeChapterNum ?? 1;

  // Save read progress whenever the visible page changes (debounced via ref)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePageChange = useCallback(
    (pageNum: number) => {
      setCurrentPage(pageNum);

      // Debounce save by 1.5s to avoid writing on every scroll tick
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        if (!storeStoryId || !activeChapterId || pages.length === 0) return;
        saveProgress({
          storyId: storeStoryId,
          storyTitle: '', // filled from home via store if available
          thumbnailUrl: pages[0]?.pageUrl ?? '',
          chapterId: activeChapterId,
          chapterNum: currentNum,
          pageNum,
          totalPages: pages.length,
        });
      }, 1500);
    },
    [storeStoryId, activeChapterId, pages, currentNum, saveProgress]
  );

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

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

      <View style={styles.readerWrapper}>
        <ReaderContent
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
          isBookView={isBookView}
          pages={pages}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          initialPage={targetInitialPage}
          onTap={toggleControls}
          onPageChange={handlePageChange}
        />

        {/* Minimal page indicator pill */}
        <PageIndicator
          currentPage={currentPage}
          totalPages={pages.length}
          visible={showControls && !isLoading && !isError}
        />
      </View>

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
  readerWrapper: {
    flex: 1,
    position: 'relative',
  },
});
