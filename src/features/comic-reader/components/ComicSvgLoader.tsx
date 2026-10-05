import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { colors } from '../../../theme';

export interface ComicSvgLoaderProps {
  size?: number;
  color?: string;
}

export const ComicSvgLoader: React.FC<ComicSvgLoaderProps> = ({
  size = 60,
  color = colors.primaryNeon,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.92,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loaderWrapper,
          {
            opacity: pulseAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 50 50">
          <G fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer Document */}
            <Path d="M15 10h15l5 5v20H15V10" />
            {/* Folded Corner */}
            <Path d="M30 10v5h5" />
            {/* Content Lines */}
            <Path d="M20 20h10M20 25h10M20 30h10" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
