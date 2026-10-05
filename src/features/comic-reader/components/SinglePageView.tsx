import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';
import { colors } from '../../../theme';
import { useReaderStore } from '../store';
import { ComicPageItem } from './ComicPageItem';

export interface SinglePageViewProps {
  pages: ComicPage[];
  screenWidth: number;
  initialPage?: number;
  onTap: () => void;
  onPageChange?: (pageNum: number) => void;
}

export const SinglePageView: React.FC<SinglePageViewProps> = ({
  pages,
  screenWidth,
  initialPage,
  onTap,
  onPageChange,
}) => {
  const zoomScale = useReaderStore((s) => s.zoomScale);
  const renderWidth = Math.round(screenWidth * zoomScale);
  const flatListRef = useRef<FlatList<ComicPage>>(null);
  const scrollViewRef = useRef<any>(null);

  // Snap back to 0 when zoomed out to prevent black void
  useEffect(() => {
    if (zoomScale <= 1.0) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }
  }, [zoomScale]);

  // Proportional height calculations
  const pageHeights = useMemo(() => {
    return pages.map((p) => {
      const [w, h] = p.resolution;
      return w > 0 ? Math.round(renderWidth * (h / w)) : Math.round(renderWidth * 1.4);
    });
  }, [pages, renderWidth]);

  const pageOffsets = useMemo(() => {
    const offsets: number[] = [0];
    for (let i = 0; i < pageHeights.length - 1; i++) {
      offsets.push(offsets[i] + pageHeights[i]);
    }
    return offsets;
  }, [pageHeights]);

  const initialIndex =
    initialPage && initialPage > 1 && pages.length >= initialPage
      ? initialPage - 1
      : undefined;

  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!hasScrolledRef.current && initialIndex !== undefined && pages.length > 0) {
      hasScrolledRef.current = true;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [initialIndex, pages.length]);

  const lastReportedPageRef = useRef<number>(initialPage || 1);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!onPageChange || pageOffsets.length === 0 || pages.length === 0) return;
      const offsetY = e.nativeEvent.contentOffset.y;

      let activeIndex = 0;
      for (let i = pageOffsets.length - 1; i >= 0; i--) {
        if (offsetY >= pageOffsets[i] - 50) {
          activeIndex = i;
          break;
        }
      }

      const activePageNum = pages[activeIndex]?.pageNum;
      if (activePageNum && activePageNum !== lastReportedPageRef.current) {
        lastReportedPageRef.current = activePageNum;
        onPageChange(activePageNum);
      }
    },
    [pageOffsets, pages, onPageChange]
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      scrollEnabled={zoomScale > 1.0}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ width: renderWidth }}
      bounces={false}
    >
      <FlatList<ComicPage>
        ref={flatListRef}
        data={pages}
        key="single-view-flatlist"
        extraData={renderWidth}
        keyExtractor={(item) => `single-page-${item.pageNum}`}
        initialScrollIndex={initialIndex}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          }, 150);
        }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={11}
        removeClippedSubviews={false}
        onScroll={handleScroll}
        scrollEventThrottle={50}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={1} onPress={onTap}>
            <ComicPageItem page={item} width={renderWidth} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.statusText}>No pages found</Text>
          </View>
        }
      />
    </ScrollView>
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
