import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '../../../theme';

export interface HomeErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export const HomeErrorView: React.FC<HomeErrorViewProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <AlertCircle size={32} color="#ff6b6b" style={styles.icon} />
      <Text style={styles.title}>Failed to Load Stories</Text>
      <Text style={styles.message}>{message ?? 'An unexpected error occurred.'}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
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
  icon: {
    marginBottom: 8,
  },
  title: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: colors.textSecondaryDark,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.accentGold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.backgroundDark,
    fontWeight: '700',
    fontSize: 14,
  },
});
