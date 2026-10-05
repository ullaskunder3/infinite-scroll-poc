import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { colors } from '../../../theme';

export interface ListFooterProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
}

export const ListFooter: React.FC<ListFooterProps> = ({
  isFetchingNextPage,
  hasNextPage,
  totalCount,
}) => {
  if (isFetchingNextPage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.accentGold} />
        <Text style={styles.loadingText}>Loading more stories...</Text>
      </View>
    );
  }

  if (!hasNextPage && totalCount > 0) {
    return (
      <View style={styles.endContainer}>
        <Sparkles size={14} color={colors.accentGold} />
        <Text style={styles.endText}>You've reached the end ({totalCount} stories)</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondaryDark,
  },
  endContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  endText: {
    fontSize: 12,
    color: colors.textSecondaryDark,
  },
});
