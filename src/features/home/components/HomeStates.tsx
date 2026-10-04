import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme';

// ==========================================
// 1. Initial Full-Screen Loader
// ==========================================
export const HomeLoadingView: React.FC = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color={colors.accentGold} />
    <Text style={styles.loadingText}>Loading stories...</Text>
  </View>
);

// ==========================================
// 2. Full-Screen Error State with Retry
// ==========================================
export interface HomeErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export const HomeErrorView: React.FC<HomeErrorViewProps> = ({ message, onRetry }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorTitle}>❌ Failed to Load Stories</Text>
    <Text style={styles.errorMessage}>{message ?? 'An unexpected error occurred.'}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

// ==========================================
// 3. Empty State (e.g. no results for genre)
// ==========================================
export const HomeEmptyView: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No comics found</Text>
    <Text style={styles.emptySubtitle}>Try selecting another genre above</Text>
  </View>
);

// ==========================================
// 4. Infinite Scroll Footer (Loader / End Note)
// ==========================================
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
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.accentGold} />
        <Text style={styles.footerLoaderText}>Loading more stories...</Text>
      </View>
    );
  }

  if (!hasNextPage && totalCount > 0) {
    return (
      <View style={styles.footerEnd}>
        <Text style={styles.footerEndText}>🎉 You've reached the end ({totalCount} stories)</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondaryDark,
    fontSize: 14,
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    color: colors.textSecondaryDark,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.accentGold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.backgroundDark,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 13,
    color: colors.textSecondaryDark,
  },
  footerEnd: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerEndText: {
    fontSize: 12,
    color: colors.textSecondaryDark,
  },
});
