import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ReaderTopBarProps {
  title: string;
  onBack: () => void;
  onOpenDrawer?: () => void;
  hasChapters?: boolean;
}

export const ReaderTopBar: React.FC<ReaderTopBarProps> = ({
  title,
  onBack,
  onOpenDrawer,
  hasChapters,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {hasChapters && onOpenDrawer && (
        <TouchableOpacity
          style={styles.drawerButton}
          activeOpacity={0.75}
          onPress={onOpenDrawer}
        >
          <Text style={styles.drawerButtonText}>☰</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#090D0B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '300',
    marginTop: -2,
    lineHeight: 28,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  drawerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#131B17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  drawerButtonText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '700',
  },
});
