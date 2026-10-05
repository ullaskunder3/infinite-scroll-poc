import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme';
import { ComicSvgLoader } from './ComicSvgLoader';

export interface PageLoaderProps {
  pageNum?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ pageNum }) => {
  return (
    <View style={styles.container}>
      <ComicSvgLoader size={48} color={colors.primaryNeon} />

      {/* Page Number Indicator */}
      {pageNum !== undefined && (
        <View style={styles.pageBadge}>
          <Text style={styles.pageBadgeText}>{pageNum}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0A0E0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(19, 27, 23, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pageBadgeText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
});

