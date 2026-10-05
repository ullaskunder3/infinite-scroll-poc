import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export interface CategoriesHeaderProps {
  onSeeAllPress?: () => void;
}

export const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ onSeeAllPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      {onSeeAllPress && (
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ChevronRight size={18} color="#8CAE9A" strokeWidth={2.5} />
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
});
