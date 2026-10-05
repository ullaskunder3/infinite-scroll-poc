import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookOpen, Eye, Heart, Star, Tag } from 'lucide-react-native';
import { StorySummary } from '../../../api';

export interface StoryCardProps {
  story: StorySummary;
  layout?: 'grid' | 'list';
  onPress?: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = React.memo(({
  story,
  layout = 'grid',
  onPress,
}) => {
  const handlePress = React.useCallback(() => {
    onPress?.(story.storyId);
  }, [onPress, story.storyId]);

  if (layout === 'list') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.listCard}
      >
        {/* Left Poster Image */}
        <View style={styles.listImageContainer}>
          <Image
            source={{ uri: story.thumbnailUrl }}
            style={styles.listThumbnail}
            resizeMode="cover"
          />
          <View style={styles.listGlassBadge}>
            <Text style={styles.listGlassBadgeText}>{story.chapterCount} CH</Text>
          </View>
        </View>

        {/* Right Info Section */}
        <View style={styles.listContent}>
          <View>
            <View style={styles.listTopRow}>
              <Text style={styles.listSubtitle} numberOfLines={1}>
                {story.creators?.join(', ') || 'Unknown'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { }}
                style={styles.listHeartBtn}
              >
                <Heart size={14} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <Text style={styles.listTitle} numberOfLines={2} ellipsizeMode="tail">
              {story.title}
            </Text>

            <View style={styles.listMetaRow}>
              <View style={styles.inlineMeta}>
                <Eye size={12} color="#94A3B8" />
                <Text style={styles.metaText}>{story.views}</Text>
              </View>
              <View style={styles.inlineTag}>
                <Tag size={11} color="#34D399" />
                <Text style={styles.tagBadgeText}>{story.tags?.[0] || 'Manga'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionPillList}>
            <Text style={styles.actionPillListText}>Read Now</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={styles.gridCard}
    >
      {/* Full-Bleed Poster Background Image */}
      <Image
        source={{ uri: story.thumbnailUrl }}
        style={styles.gridPosterImage}
        resizeMode="cover"
      />

      {/* Top Floating Bar */}
      <View style={styles.topFloatingBar}>
        <View style={styles.chapterBadgePill}>
          <BookOpen size={11} color="#34D399" />
          <Text style={styles.chapterBadgePillText}>{story.chapterCount} CH</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => { }}
          style={styles.glassHeartButton}
        >
          <Heart size={13} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.frostedGlassOverlay}>
        <View style={styles.textStack}>
          <View style={styles.titleWrapper}>
            <Text style={styles.posterTitle} numberOfLines={2} ellipsizeMode="tail">
              {story.title}
            </Text>
          </View>

          <Text style={styles.posterSubtitle} numberOfLines={1}>
            {story.tags?.[0] ? `${story.tags[0]} • ${story.creators?.[0] || 'Unknown'}` : story.creators?.join(', ') || 'Unknown'}
          </Text>

          <View style={styles.posterMetaRow}>
            <View style={styles.inlineTag}>
              <Tag size={10} color="#94A3B8" />
              <Text style={styles.metaItemText} numberOfLines={1} ellipsizeMode="tail">
                {story.tags?.[1] || story.tags?.[0] || 'Webtoon'}
              </Text>
            </View>
            <View style={styles.inlineMeta}>
              <Star size={11} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.metaItemTextGold} numberOfLines={1}>
                {story.views}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionPill}>
          <Text style={styles.actionPillText}>Read Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
StoryCard.displayName = 'StoryCard';

const styles = StyleSheet.create({
  // ================= GRID CARD STYLES =================
  gridCard: {
    flex: 1,
    height: 260,
    borderRadius: 22,
    backgroundColor: '#131B17',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gridPosterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#090D0B',
  },
  topFloatingBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  chapterBadgePill: {
    backgroundColor: 'rgba(9, 13, 11, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chapterBadgePillText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  glassHeartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(9, 13, 11, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frostedGlassOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(9, 13, 11, 0.90)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 104,
  },
  textStack: {
    flex: 1,
  },
  titleWrapper: {
    height: 32,
    justifyContent: 'flex-start',
    marginBottom: 2,
  },
  posterTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 15,
  },
  posterSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  posterMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 4,
  },
  inlineTag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 6,
  },
  metaItemText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
    flexShrink: 1,
  },
  inlineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  metaItemTextGold: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  actionPill: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // ================= LIST CARD STYLES =================
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#131B17',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  listImageContainer: {
    width: 82,
    height: 106,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  listThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#090D0B',
  },
  listGlassBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(9, 13, 11, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  listGlassBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  listTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  listSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  listHeartBtn: {
    padding: 2,
  },
  listTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  tagBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  actionPillList: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    marginTop: 6,
  },
  actionPillListText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
});
