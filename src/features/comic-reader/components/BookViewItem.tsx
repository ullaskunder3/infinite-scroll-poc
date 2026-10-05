import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';

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
          <View
            key={`book-${pair.id}-p-${page.pageNum}-${idx}`}
            style={[styles.pageWrapper, { width: pageWidth, height: screenHeight }]}
          >
            <Image
              source={{ uri: page.pageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>{pair.pageIndices[idx] + 1}</Text>
            </View>
          </View>
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
  pageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pageBadgeText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
});
