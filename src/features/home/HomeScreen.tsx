import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { storiesApi } from '../../api';
import { colors } from '../../theme';

export const HomeScreen: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['stories', { limit: 10 }],
    queryFn: () => storiesApi.getStories({ limit: 10 }),
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>API Test — Stories</Text>
        <Text style={styles.statusText}>
          {isFetching ? '⚡ Fetching...' : '✅ Idle'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accentGold} />
          <Text style={styles.loadingText}>Loading stories from API...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>❌ API Request Failed</Text>
          <Text style={styles.errorDetails}>{error instanceof Error ? error.message : String(error)}</Text>
        </View>
      ) : (
        <FlatList
          data={data?.page}
          keyExtractor={(item) => item.storyId}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item, index }) => (
            <View style={styles.testItem}>
              <Text style={styles.itemIndex}>#{index + 1} ID: {item.storyId}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemMeta}>
                👁 {item.views} • 📚 {item.chapterCount} chaps • 🏷 {item.tags.join(', ')}
              </Text>
              <Text style={styles.itemMeta}>✍️ {item.creators.join(', ')}</Text>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                hasMore: {String(data?.hasMore)} | continueCursor: {data?.continueCursor ?? 'null'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimaryDark,
  },
  statusText: {
    fontSize: 12,
    color: colors.accentGold,
  },
  centered: {
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
  errorDetails: {
    color: colors.textSecondaryDark,
    textAlign: 'center',
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  testItem: {
    backgroundColor: colors.surfaceDark,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemIndex: {
    fontSize: 11,
    color: colors.accentGold,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimaryDark,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginTop: 2,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondaryDark,
  },
});
