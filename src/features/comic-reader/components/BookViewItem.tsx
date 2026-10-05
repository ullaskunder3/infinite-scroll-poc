import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';
import { isPageImageCached, markPageImageCached } from '../utils/imageCache';
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
  onPrev?: () => void;
  onNext?: () => void;
}

const BookSinglePage: React.FC<{
  page: ComicPage;
  pageIndex: number;
  pageWidth: number;
  screenHeight: number;
}> = ({ page, pageIndex, pageWidth, screenHeight }) => {
  const [isLoaded, setIsLoaded] = useState(() => isPageImageCached(page.pageUrl));

  useEffect(() => {
    if (isPageImageCached(page.pageUrl)) {
      setIsLoaded(true);
    }
  }, [page.pageUrl]);

  const handleLoadSuccess = () => {
    markPageImageCached(page.pageUrl);
    setIsLoaded(true);
  };

  return (
    <View style={[styles.pageWrapper, { width: pageWidth, height: screenHeight }]}>
      {!isLoaded && <PageLoader pageNum={pageIndex + 1} />}
      <Image
        source={{ uri: page.pageUrl }}
        style={[styles.image, { opacity: isLoaded ? 1 : 0 }]}
        resizeMode="contain"
        onLoadEnd={handleLoadSuccess}
      />
    </View>
  );
};

export const BookViewItem: React.FC<BookViewItemProps> = ({
  pair,
  screenWidth,
  screenHeight,
  onTap,
  onPrev,
  onNext,
}) => {
  const isSingle = pair.pages.length === 1;
  const pageWidth = isSingle ? screenWidth : screenWidth / 2;

  const handlePress = (e: any) => {
    const x = e.nativeEvent?.locationX ?? screenWidth / 2;
    if (x < screenWidth * 0.2 && onPrev) {
      onPrev();
    } else if (x > screenWidth * 0.8 && onNext) {
      onNext();
    } else {
      onTap();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
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
