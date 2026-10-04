import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IMAGES } from '../../../assets';
import { colors } from '../../../theme';

export interface HomeHeaderProps {
  onProfilePress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onProfilePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.greetingBox}>
          <Text style={styles.welcomeTitle}>
            Welcome to <Text style={styles.brandHighlight}>Fanon!</Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onProfilePress}
          style={styles.avatarButton}
        >
          <Image
            source={IMAGES.splashLogo}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingBox: {
    flex: 1,
    paddingRight: 10,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  brandHighlight: {
    color: colors.primaryNeon,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '400',
  },
  readHighlight: {
    color: '#FBBF24',
    fontWeight: '600',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 32,
    height: 32,
  },
});
