import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface CategoriesHeaderProps {
  onSeeAllPress?: () => void;
}

export const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ onSeeAllPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      {onSeeAllPress && (
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 20,
    color: '#8CAE9A',
    fontWeight: '600',
  },
});
