import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BookOpen, ChevronLeft, FileText, Menu, ZoomIn } from 'lucide-react-native';
import { colors } from '../../../theme';
import { useReaderStore } from '../store';

export interface ReaderTopBarProps {
  title: string;
  isBookView: boolean;
  onBack: () => void;
  onToggleBookView: () => void;
  onOpenDrawer?: () => void;
  hasChapters?: boolean;
}

export const ReaderTopBar: React.FC<ReaderTopBarProps> = ({
  title,
  isBookView,
  onBack,
  onToggleBookView,
  onOpenDrawer,
  hasChapters,
}) => {
  const zoomScale = useReaderStore((s) => s.zoomScale);
  const resetZoomScale = useReaderStore((s) => s.resetZoomScale);
  const isZoomed = zoomScale > 1.05;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.iconButton}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightActions}>
        {isZoomed && (
          <TouchableOpacity
            style={styles.zoomBadge}
            onPress={resetZoomScale}
            activeOpacity={0.75}
          >
            <ZoomIn size={12} color={colors.primaryNeon} strokeWidth={2.5} style={styles.btnIcon} />
            <Text style={styles.zoomBadgeText}>{Math.round(zoomScale * 100)}%</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.toggleBtn, isBookView && styles.toggleBtnActive]}
          onPress={onToggleBookView}
          activeOpacity={0.75}
        >
          {isBookView ? (
            <BookOpen
              size={14}
              color={colors.primaryNeon}
              strokeWidth={2.2}
              style={styles.btnIcon}
            />
          ) : (
            <FileText
              size={14}
              color="#94A3B8"
              strokeWidth={2.2}
              style={styles.btnIcon}
            />
          )}
          <Text
            style={[
              styles.toggleBtnText,
              isBookView && styles.toggleBtnTextActive,
            ]}
          >
            {isBookView ? 'Book View' : 'Single View'}
          </Text>
        </TouchableOpacity>

        {hasChapters && onOpenDrawer && (
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.75}
            onPress={onOpenDrawer}
          >
            <Menu size={18} color="#CBD5E1" strokeWidth={2.2} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(9, 13, 11, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleBtnActive: {
    borderColor: colors.primaryNeon,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  btnIcon: {
    marginRight: 5,
  },
  toggleBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: colors.primaryNeon,
  },
  zoomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: colors.primaryNeon,
  },
  zoomBadgeText: {
    color: colors.primaryNeon,
    fontSize: 11,
    fontWeight: '800',
  },
});
