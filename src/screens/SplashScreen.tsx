import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IMAGES } from '../assets';
import { colors } from '../theme';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2000,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeAnim, onFinish, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={IMAGES.splashLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>FanonApp</Text>
        <Text style={styles.tagline}>Welcome aboard</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.surfaceDark,
    borderWidth: 3,
    borderColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 150,
  },
  appName: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimaryDark,
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondaryDark,
    letterSpacing: 0.5,
  },
});
