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

export interface BookPageViewProps {
  pages: ComicPage[];
  screenWidth: number;
  screenHeight: number;
  initialPage?: number;
  onTap: () => void;
  onPageChange?: (pageNum: number) => void;
}

export const BookPageView: React.FC<BookPageViewProps> = ({
  pages,
  screenWidth,
  screenHeight,
  initialPage,
  onTap,
  onPageChange,
}) => {
  const zoomScale = useReaderStore((s) => s.zoomScale);

  const [actualWidth, setActualWidth] = useState(screenWidth);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setActualWidth(w);
  }, []);

  const renderWidth = Math.round(actualWidth * zoomScale);
  const renderHeight = Math.round(screenHeight * zoomScale);
  const flatListRef = useRef<FlatList<BookPair>>(null);
  const currentIndexRef = useRef(0);

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

  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!hasScrolledRef.current && initialPage && initialPage > 1 && bookPairs.length > 0) {
      hasScrolledRef.current = true;
      const targetPairIndex = bookPairs.findIndex((pair) =>
        pair.pageIndices.includes(initialPage - 1)
      );
      if (targetPairIndex >= 0) {
        currentIndexRef.current = targetPairIndex;
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: targetPairIndex,
            animated: false,
          });
        }, 100);
      }
    }
  }, [initialPage, bookPairs]);

  // Snap back to the current active index when zoom resets to prevent left-shift
  useEffect(() => {
    if (zoomScale <= 1.0 && bookPairs.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndexRef.current,
        animated: false,
      });
    }
  }, [zoomScale, bookPairs.length]);

  const updateActivePage = useCallback(
    (index: number) => {
      if (index >= 0 && index < bookPairs.length) {
        currentIndexRef.current = index;
        if (onPageChange) {
          const pair = bookPairs[index];
          const firstPageNum = pages[pair.pageIndices[0]]?.pageNum ?? 1;
          onPageChange(firstPageNum);
        }
      }
    },
    [bookPairs, pages, onPageChange]
  );

  const goToPrev = () => {
    if (currentIndexRef.current > 0) {
      const nextIndex = currentIndexRef.current - 1;
      updateActivePage(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const goToNext = () => {
    if (currentIndexRef.current < bookPairs.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      updateActivePage(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / renderWidth);
    if (index !== currentIndexRef.current) {
      updateActivePage(index);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / renderWidth);
    updateActivePage(index);
  };

  return (
    <FlatList<BookPair>
      ref={flatListRef}
      onLayout={onLayout}
      data={bookPairs}
      key="book-page-flatlist"
      extraData={renderWidth}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews={false}
      keyExtractor={(item) => item.id}
      onScroll={handleScroll}
      scrollEventThrottle={32}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: false,
          });
        }, 150);
      }}
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
