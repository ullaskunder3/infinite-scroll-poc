import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBackHandler } from '../../core/hooks';
import { useAppStore } from '../../core/store';
import {
  ChapterDrawerModal,
  ReaderContent,
  ReaderTopBar,
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
  const isLandscape = screenWidth > screenHeight;

  const storeStoryId = useAppStore((s) => s.selectedStoryId);
  const storeChapterId = useAppStore((s) => s.selectedChapterId);
  const storeChapterNum = useAppStore((s) => s.selectedChapterNum);
  const closeChapter = useAppStore((s) => s.closeChapter);
  const openChapter = useAppStore((s) => s.openChapter);

  const activeChapterId = propChapterId || storeChapterId || '';
  const handleBack = propOnBack || closeChapter;

  useBackHandler(handleBack);

  const [isBookView, setIsBookView] = useState(isLandscape);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);

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

      <ReaderContent
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        isBookView={isBookView}
        pages={pages}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        onTap={toggleControls}
      />

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
});

