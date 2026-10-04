import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChapterSummary, StoryDetail } from '../../../api';
import { colors } from '../../../theme';

export interface StoryHeroHeaderProps {
  story?: StoryDetail;
  chapters: ChapterSummary[];
  onStartReading?: (chapterId: string, chapterNum: number) => void;
}

export const StoryHeroHeader: React.FC<StoryHeroHeaderProps> = ({
  story,
  chapters,
  onStartReading,
}) => {
  if (!story) return null;

  const firstChapter = chapters[0];

  return (
    <View style={styles.container}>
      {/* Backdrop Cover */}
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: story.thumbnailUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      </View>

      {/* Story Metadata */}
      <View style={styles.metaContainer}>
        <View style={styles.badgeRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{story.status}</Text>
          </View>
          <View style={styles.viewsBadge}>
            <Text style={styles.viewsText}>👁 {story.views}</Text>
          </View>
        </View>

        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.creators}>
          By {story.creators?.join(', ') || 'Unknown'}
        </Text>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <View style={styles.tagRow}>
            {story.tags.map((t, idx) => (
              <View key={`tag-${idx}`} style={styles.tagChip}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        <Text style={styles.description}>{story.description}</Text>

        {/* Quick Start Reading CTA */}
        {firstChapter && onStartReading && (
          <TouchableOpacity
            style={styles.startReadingBtn}
            activeOpacity={0.8}
            onPress={() =>
              onStartReading(firstChapter.chapterId, firstChapter.chapterNum)
            }
          >
            <Text style={styles.startReadingText}>
              Start Reading (Chapter {firstChapter.chapterNum})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  coverWrapper: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#131B17',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  metaContainer: {
    paddingHorizontal: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusText: {
    color: colors.primaryNeon,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  viewsBadge: {
    backgroundColor: '#131B17',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  viewsText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 4,
  },
  creators: {
    fontSize: 13,
    color: '#8CAE9A',
    fontWeight: '500',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tagChip: {
    backgroundColor: '#131B17',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tagText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 18,
  },
  startReadingBtn: {
    backgroundColor: colors.primaryNeon,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primaryNeon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startReadingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
