import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme';

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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.iconButton}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.toggleBtn, isBookView && styles.toggleBtnActive]}
          onPress={onToggleBookView}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.toggleBtnText,
              isBookView && styles.toggleBtnTextActive,
            ]}
          >
            {isBookView ? '📖 Book View' : '📄 Single View'}
          </Text>
        </TouchableOpacity>

        {hasChapters && onOpenDrawer && (
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.75}
            onPress={onOpenDrawer}
          >
            <Text style={styles.drawerIcon}>☰</Text>
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
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
    lineHeight: 26,
  },
  drawerIcon: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '700',
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleBtnActive: {
    borderColor: colors.primaryNeon,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  toggleBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: colors.primaryNeon,
  },
});
