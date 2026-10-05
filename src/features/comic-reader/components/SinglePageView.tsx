import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';
import { colors } from '../../../theme';
import { ComicPageItem } from './ComicPageItem';

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
  // Precompute page heights & cumulative offsets for O(1) getItemLayout
  const pageHeights = useMemo(() => {
    return pages.map((p) => {
      const [w, h] = p.resolution;
      return w > 0 ? Math.round(screenWidth * (h / w)) : Math.round(screenWidth * 1.4);
    });
  }, [pages, screenWidth]);

  const pageOffsets = useMemo(() => {
    const offsets: number[] = [0];
    for (let i = 0; i < pageHeights.length - 1; i++) {
      offsets.push(offsets[i] + pageHeights[i]);
    }
    return offsets;
  }, [pageHeights]);

  return (
    <FlatList<ComicPage>
      data={pages}
      key="single-view-flatlist"
      keyExtractor={(item) => `single-page-${item.pageNum}`}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews
      getItemLayout={(_, index) => ({
        length: pageHeights[index] || screenWidth * 1.4,
        offset: pageOffsets[index] || 0,
        index,
      })}
      renderItem={({ item }) => (
        <TouchableOpacity activeOpacity={1} onPress={onTap}>
          <ComicPageItem page={item} width={screenWidth} />
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
