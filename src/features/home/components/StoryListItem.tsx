import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StorySummary } from '../../../api';
import { colors } from '../../../theme';

export interface StoryListItemProps {
  story: StorySummary;
  index: number;
}

export const StoryListItem: React.FC<StoryListItemProps> = ({ story, index }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.indexBadge}>#{index + 1}</Text>
        <Text style={styles.storyId}>ID: {story.storyId}</Text>
      </View>
      <Text style={styles.title}>{story.title}</Text>
      <Text style={styles.meta}>
        👁 {story.views} • 📚 {story.chapterCount} chapters
      </Text>
      {story.tags.length > 0 && (
        <Text style={styles.tags}>🏷 {story.tags.join(', ')}</Text>
      )}
      {story.creators.length > 0 && (
        <Text style={styles.creators}>✍️ {story.creators.join(', ')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceDark,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  indexBadge: {
    fontSize: 12,
    color: colors.accentGold,
    fontWeight: '700',
  },
  storyId: {
    fontSize: 11,
    color: colors.textSecondaryDark,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimaryDark,
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondaryDark,
    marginBottom: 3,
  },
  tags: {
    fontSize: 12,
    color: '#7bc5ae',
    marginTop: 2,
  },
  creators: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginTop: 2,
  },
});
