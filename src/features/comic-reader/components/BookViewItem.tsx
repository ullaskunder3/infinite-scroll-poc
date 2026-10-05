import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';
import { PageLoader } from './PageLoader';

export interface BookPair {
  id: string;
  pages: ComicPage[];
  pageIndices: number[];
}

export interface BookViewItemProps {
  pair: BookPair;
  screenWidth: number;
  screenHeight: number;
  onTap: () => void;
}

const BookSinglePage: React.FC<{
  page: ComicPage;
  pageIndex: number;
  pageWidth: number;
  screenHeight: number;
}> = ({ page, pageIndex, pageWidth, screenHeight }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={[styles.pageWrapper, { width: pageWidth, height: screenHeight }]}>
      {!isLoaded && <PageLoader pageNum={pageIndex + 1} />}
      <Image
        source={{ uri: page.pageUrl }}
        style={[styles.image, { opacity: isLoaded ? 1 : 0 }]}
        resizeMode="contain"
        onLoadEnd={() => setIsLoaded(true)}
      />
    </View>
  );
};

export const BookViewItem: React.FC<BookViewItemProps> = ({
  pair,
  screenWidth,
  screenHeight,
  onTap,
}) => {
  const isSingle = pair.pages.length === 1;
  const pageWidth = isSingle ? screenWidth : screenWidth / 2;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onTap}
      style={[styles.container, { width: screenWidth, height: screenHeight }]}
    >
      <View style={styles.pairRow}>
        {pair.pages.map((page, idx) => (
          <BookSinglePage
            key={`book-${pair.id}-p-${page.pageNum}-${idx}`}
            page={page}
            pageIndex={pair.pageIndices[idx]}
            pageWidth={pageWidth}
            screenHeight={screenHeight}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  pageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
