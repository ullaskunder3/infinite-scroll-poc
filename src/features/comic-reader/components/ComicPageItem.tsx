import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { ComicPage } from '../../../api';
import { PageLoader } from './PageLoader';

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
      {!isLoaded && <PageLoader pageNum={page.pageNum} />}
      <Image
        source={{ uri: page.pageUrl }}
        style={[styles.image, { opacity: isLoaded ? 1 : 0 }]}
        resizeMode="contain"
        onLoadEnd={() => setIsLoaded(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#090D0B',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
