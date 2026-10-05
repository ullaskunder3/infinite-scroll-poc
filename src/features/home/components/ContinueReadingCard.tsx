import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookOpen, X } from 'lucide-react-native';
import { ReadProgress, useReadProgressStore } from '../../comic-reader/store';
import { colors } from '../../../theme';

export interface ContinueReadingCardProps {
  progress: ReadProgress;
  onPress: () => void;
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({
  progress,
  onPress,
}) => {
  const clearProgress = useReadProgressStore((s) => s.clearProgress);
  const percent = Math.min(
    100,
    Math.max(1, Math.round((progress.pageNum / Math.max(1, progress.totalPages)) * 100))
  );

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {progress.thumbnailUrl ? (
          <Image
            source={{ uri: progress.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.fallback]}>
            <BookOpen size={18} color={colors.textSecondaryDark} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            Continue: Chapter {progress.chapterNum}
          </Text>
          <Text style={styles.subtitle}>
            Page {progress.pageNum} of {progress.totalPages} ({percent}%)
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={clearProgress}
        style={styles.closeBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <X size={15} color={colors.textSecondaryDark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121915',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 44,
    height: 58,
    borderRadius: 6,
    backgroundColor: '#1A231E',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: colors.textSecondaryDark,
    fontSize: 12,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
    width: '90%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryNeon,
    borderRadius: 2,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 6,
  },
});
