import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme';

export const HomeLoadingView: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accentGold} />
      <Text style={styles.text}>Loading stories...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 12,
    color: colors.textSecondaryDark,
    fontSize: 14,
  },
});
