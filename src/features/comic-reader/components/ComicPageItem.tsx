import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { ComicPage } from '../../../api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ComicPageItemProps {
  page: ComicPage;
}

export const ComicPageItem: React.FC<ComicPageItemProps> = ({ page }) => {
  const [nativeWidth, nativeHeight] = page.resolution;
  const aspectRatio = nativeWidth > 0 ? nativeHeight / nativeWidth : 1.4;
  const pageHeight = SCREEN_WIDTH * aspectRatio;

  return (
    <View style={[styles.container, { height: pageHeight }]}>
      <Image
        source={{ uri: page.pageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.pageNumberBadge}>
        <Text style={styles.pageNumberText}>{page.pageNum}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#090D0B',
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pageNumberText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
});
