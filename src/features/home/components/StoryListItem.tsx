import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BookOpen, Eye, Pencil, Tag } from 'lucide-react-native';
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
      
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Eye size={13} color={colors.textSecondaryDark} />
          <Text style={styles.metaText}>{story.views}</Text>
        </View>
        <Text style={styles.metaDot}>•</Text>
        <View style={styles.metaItem}>
          <BookOpen size={13} color={colors.textSecondaryDark} />
          <Text style={styles.metaText}>{story.chapterCount} chapters</Text>
        </View>
      </View>

      {story.tags.length > 0 && (
        <View style={styles.tagRow}>
          <Tag size={12} color="#7bc5ae" />
          <Text style={styles.tags}>{story.tags.join(', ')}</Text>
        </View>
      )}
      {story.creators.length > 0 && (
        <View style={styles.creatorRow}>
          <Pencil size={12} color={colors.textSecondaryDark} />
          <Text style={styles.creators}>{story.creators.join(', ')}</Text>
        </View>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDot: {
    color: colors.textSecondaryDark,
    fontSize: 11,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondaryDark,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  tags: {
    fontSize: 12,
    color: '#7bc5ae',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  creators: {
    fontSize: 12,
    color: colors.textSecondaryDark,
  },
});
