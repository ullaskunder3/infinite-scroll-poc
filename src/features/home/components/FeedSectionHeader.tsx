import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme';

export interface FeedSectionHeaderProps {
  selectedGenre: string;
  layout: 'grid' | 'list';
  onSelectLayout: (layout: 'grid' | 'list') => void;
}

export const FeedSectionHeader: React.FC<FeedSectionHeaderProps> = ({
  selectedGenre,
  layout,
  onSelectLayout,
}) => {
  const title = selectedGenre === 'All' ? 'Popular Series' : `${selectedGenre} Series`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* View Mode Toggle Segment */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => onSelectLayout('grid')}
          activeOpacity={0.75}
          style={[styles.toggleBtn, layout === 'grid' && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleIcon, layout === 'grid' && styles.toggleIconActive]}>
            ⊞
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectLayout('list')}
          activeOpacity={0.75}
          style={[styles.toggleBtn, layout === 'list' && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleIcon, layout === 'list' && styles.toggleIconActive]}>
            ☰
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 10,
    backgroundColor: '#090D0B',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#131B17',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: colors.primaryNeon,
  },
  toggleIcon: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  toggleIconActive: {
    color: '#FFFFFF',
  },
});
