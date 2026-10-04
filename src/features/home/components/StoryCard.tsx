import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StorySummary } from '../../../api';

export interface StoryCardProps {
  story: StorySummary;
  layout?: 'grid' | 'list';
  onPress?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  layout = 'grid',
  onPress,
}) => {

  if (layout === 'list') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
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
                <Text style={{ fontSize: 13, color: '#FFFFFF' }}>
                  {'🤍'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.listTitle} numberOfLines={2} ellipsizeMode="tail">
              {story.title}
            </Text>

            <View style={styles.listMetaRow}>
              <Text style={styles.metaText}>👁 {story.views}</Text>
              <Text style={styles.tagBadgeText}>🏷 {story.tags?.[0] || 'Manga'}</Text>
            </View>
          </View>

          <View style={styles.actionPillList}>
            <Text style={styles.actionPillListText}>Read Now</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Modern Poster-Style Grid Card
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
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
          <Text style={styles.chapterBadgePillText}>📖 {story.chapterCount} CH</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => { }}
          style={styles.glassHeartButton}
        >
          <Text style={{ fontSize: 12, color: '#FFFFFF' }}>
            {'🤍'}
          </Text>
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
            <Text style={styles.metaItemText} numberOfLines={1}>
              🏷 {story.tags?.[1] || story.tags?.[0] || 'Webtoon'}
            </Text>
            <Text style={styles.metaItemTextGold}>
              ★ {story.views}
            </Text>
          </View>
        </View>

        <View style={styles.actionPill}>
          <Text style={styles.actionPillText}>Read Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ================= GRID CARD STYLES =================
  gridCard: {
    flex: 1,
    height: 320,
    backgroundColor: '#0E1612',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  gridPosterImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    backgroundColor: '#0E1612',
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
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  chapterBadgePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  glassHeartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(9, 13, 11, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frostedGlassOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 156,
    backgroundColor: 'rgba(9, 13, 11, 0.88)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  textStack: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleWrapper: {
    height: 36,
    justifyContent: 'center',
    marginBottom: 2,
  },
  posterTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  posterSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 6,
  },
  posterMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItemText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  metaItemTextGold: {
    fontSize: 11,
    color: '#FBBF24',
    fontWeight: '700',
  },
  actionPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  actionPillText: {
    color: '#090D0B',
    fontSize: 12,
    fontWeight: '800',
  },

  // ================= LIST CARD STYLES =================
  listCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#131B17',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  listImageContainer: {
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0E1612',
  },
  listThumbnail: {
    width: '100%',
    height: '100%',
  },
  listGlassBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(9, 13, 11, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  listGlassBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  listTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 11,
    color: '#8CAE9A',
    fontWeight: '600',
    flex: 1,
  },
  listHeartBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(9, 13, 11, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 19,
    marginBottom: 4,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 11,
    color: '#FBBF24',
    fontWeight: '600',
  },
  tagBadgeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  actionPillList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  actionPillListText: {
    color: '#090D0B',
    fontSize: 12,
    fontWeight: '800',
  },
});
