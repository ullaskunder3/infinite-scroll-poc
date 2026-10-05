import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Eye, FileText } from 'lucide-react-native';
import { ChapterSummary } from '../../../api';
import { colors } from '../../../theme';

export interface ChapterCardProps {
  chapter: ChapterSummary;
  onPress?: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Image
        source={{ uri: chapter.thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.chapterNum}>Chapter {chapter.chapterNum}</Text>
          <Text style={styles.chapterTypeBadge}>Type {chapter.type}</Text>
        </View>

        <Text style={styles.description} numberOfLines={1}>
          {chapter.description || `Chapter ${chapter.chapterNum}`}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <FileText size={12} color="#94A3B8" />
            <Text style={styles.metaText}>{chapter.pageCount} pages</Text>
          </View>
          <View style={styles.metaItem}>
            <Eye size={12} color="#94A3B8" />
            <Text style={styles.metaText}>{chapter.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B17',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#0E1612',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chapterNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryNeon,
  },
  chapterTypeBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accentGold,
    backgroundColor: 'rgba(249, 168, 37, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
