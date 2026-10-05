import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  visible: boolean;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  currentPage,
  totalPages,
  visible,
}) => {
  if (!visible || totalPages === 0) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.pill}>
        <Text style={styles.text}>
          {currentPage} / {totalPages}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  pill: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
