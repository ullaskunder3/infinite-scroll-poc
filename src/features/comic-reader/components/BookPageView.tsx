import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ComicPage } from '../../../api';
import { colors } from '../../../theme';
import { BookPair, BookViewItem } from './BookViewItem';

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

  return (
    <FlatList<BookPair>
      data={bookPairs}
      key="book-page-flatlist"
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <BookViewItem
          pair={item}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          onTap={onTap}
        />
      )}
      getItemLayout={(_, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
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
