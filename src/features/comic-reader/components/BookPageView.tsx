import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';
import { colors } from '../../../theme';
import { useReaderStore } from '../store';
import { BookPair, BookViewItem } from './BookViewItem';
import { prefetchPages } from '../utils/imageCache';

export interface BookPageViewProps {
  pages: ComicPage[];
  screenWidth: number;
  screenHeight: number;
  onTap: () => void;
}

export const BookPageView: React.FC<BookPageViewProps> = ({
  pages,
  screenWidth,
  screenHeight,
  onTap,
}) => {
  const zoomScale = useReaderStore((s) => s.zoomScale);

  // Measure actual rendered width (excludes safe area insets) to avoid overflow/bleed
  const [actualWidth, setActualWidth] = useState(screenWidth);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setActualWidth(w);
  }, []);

  const renderWidth = Math.round(actualWidth * zoomScale);
  const renderHeight = Math.round(screenHeight * zoomScale);
  const flatListRef = useRef<FlatList<BookPair>>(null);
  const currentIndexRef = useRef(0);

  // Background-prefetch pages
  useEffect(() => {
    prefetchPages(pages);
  }, [pages]);

  // Pair pages for 2-page horizontal spread (Page 1 cover alone, then 2-3, 4-5...)
  const bookPairs: BookPair[] = useMemo(() => {
    if (pages.length === 0) return [];
    const pairs: BookPair[] = [
      {
        id: 'book-pair-0',
        pages: [pages[0]],
        pageIndices: [0],
      },
    ];

    for (let i = 1; i < pages.length; i += 2) {
      if (i + 1 < pages.length) {
        pairs.push({
          id: `book-pair-${i}-${i + 1}`,
          pages: [pages[i], pages[i + 1]],
          pageIndices: [i, i + 1],
        });
      } else {
        pairs.push({
          id: `book-pair-${i}`,
          pages: [pages[i]],
          pageIndices: [i],
        });
      }
    }
    return pairs;
  }, [pages]);

  const goToPrev = () => {
    if (currentIndexRef.current > 0) {
      const nextIndex = currentIndexRef.current - 1;
      currentIndexRef.current = nextIndex;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const goToNext = () => {
    if (currentIndexRef.current < bookPairs.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      currentIndexRef.current = nextIndex;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / renderWidth);
    if (index >= 0 && index < bookPairs.length) {
      currentIndexRef.current = index;
    }
  };

  return (
    <FlatList<BookPair>
      ref={flatListRef}
      onLayout={onLayout}
      data={bookPairs}
      key={`book-page-flatlist-${renderWidth}`}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews
      keyExtractor={(item) => item.id}
      onMomentumScrollEnd={handleScrollEnd}
      renderItem={({ item }) => (
        <BookViewItem
          pair={item}
          screenWidth={renderWidth}
          screenHeight={renderHeight}
          onTap={onTap}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
      getItemLayout={(_, index) => ({
        length: renderWidth,
        offset: renderWidth * index,
        index,
      })}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={styles.statusText}>No pages found</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
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
});
