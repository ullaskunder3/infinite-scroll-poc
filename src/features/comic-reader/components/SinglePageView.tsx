import React, { useEffect, useMemo } from 'react';
import {
  FlatList,
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
import { prefetchPages } from '../utils/imageCache';

export interface SinglePageViewProps {
  pages: ComicPage[];
  screenWidth: number;
  onTap: () => void;
}

export const SinglePageView: React.FC<SinglePageViewProps> = ({
  pages,
  screenWidth,
  onTap,
}) => {
  const zoomScale = useReaderStore((s) => s.zoomScale);
  const renderWidth = Math.round(screenWidth * zoomScale);

  // Background-prefetch pages immediately so fast scrolling finds cached images
  useEffect(() => {
    prefetchPages(pages);
  }, [pages]);

  // Precompute proportional page heights & cumulative offsets for O(1) getItemLayout
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

  const listContent = (
    <FlatList<ComicPage>
      data={pages}
      key={`single-view-flatlist-${renderWidth}`}
      keyExtractor={(item) => `single-page-${item.pageNum}`}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={9}
      removeClippedSubviews
      getItemLayout={(_, index) => ({
        length: pageHeights[index] || renderWidth * 1.4,
        offset: pageOffsets[index] || 0,
        index,
      })}
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
  );

  if (zoomScale > 1.0) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: renderWidth }}
        bounces={false}
      >
        {listContent}
      </ScrollView>
    );
  }

  return listContent;
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
