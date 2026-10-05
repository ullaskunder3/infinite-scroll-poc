import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

export interface DynamicSkeletonProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const DynamicSkeleton: React.FC<DynamicSkeletonProps> = ({
  width,
  height,
  borderRadius = 0,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.8,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [shimmerAnim]);

  return (
    <View
      style={[
        styles.skeletonContainer,
        {
          width: width as any,
          height: height as any,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmerLayer,
          {
            opacity: shimmerAnim,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#0E1310',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmerLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1C2621',
  },
});
