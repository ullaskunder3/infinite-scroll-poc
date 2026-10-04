import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface ChaptersSectionHeaderProps {
  totalChapters: number;
}

export const ChaptersSectionHeader: React.FC<ChaptersSectionHeaderProps> = ({
  totalChapters,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chapters ({totalChapters})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#090D0B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
