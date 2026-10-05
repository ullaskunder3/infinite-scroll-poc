import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { ComicPage } from '../../../api';
import { DynamicSkeleton } from '../../../components';

const { width: DEFAULT_SCREEN_WIDTH } = Dimensions.get('window');

export interface ComicPageItemProps {
  page: ComicPage;
  width?: number;
}

export const ComicPageItem: React.FC<ComicPageItemProps> = ({
  page,
  width = DEFAULT_SCREEN_WIDTH,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [nativeWidth, nativeHeight] = page.resolution;
  const aspectRatio = nativeWidth > 0 ? nativeHeight / nativeWidth : 1.4;
  const pageHeight = Math.round(width * aspectRatio);

  return (
    <View style={[styles.container, { width, height: pageHeight }]}>
      {!isLoaded && (
        <View style={StyleSheet.absoluteFill}>
          <DynamicSkeleton width={width} height={pageHeight} />
        </View>
      )}
      <Image
        source={{ uri: page.pageUrl }}
        style={[styles.image, { opacity: isLoaded ? 1 : 0 }]}
        resizeMode="contain"
        onLoadEnd={() => setIsLoaded(true)}
      />
      <View style={styles.pageNumberBadge}>
        <Text style={styles.pageNumberText}>{page.pageNum}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pageNumberBadge: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pageNumberText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
});
