import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme';

export interface GenreFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  title?: string;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  title = 'Categories',
}) => {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#090D0B',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8CAE9A',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryNeon,
  },
  chipUnselected: {
    backgroundColor: '#131B17',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipTextUnselected: {
    color: '#94A3B8',
  },
});
