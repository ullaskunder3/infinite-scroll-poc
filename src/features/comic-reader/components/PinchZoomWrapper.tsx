import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MAX_ZOOM_SCALE, MIN_ZOOM_SCALE, useReaderStore } from '../store';

export interface PinchZoomWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onTap?: () => void;
}

function getTouchDistance(touches: readonly any[]): number {
  if (touches.length < 2) return 0;
  const [t1, t2] = touches;
  return Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
}

export const PinchZoomWrapper: React.FC<PinchZoomWrapperProps> = ({
  children,
  style,
  onTap,
}) => {
  const setZoomScale = useReaderStore((s) => s.setZoomScale);
  const resetZoomScale = useReaderStore((s) => s.resetZoomScale);

  // Transient visual scale during active pinch (GPU native, zero React re-renders)
  const pinchScaleAnim = useRef(new Animated.Value(1)).current;
  const initialDistRef = useRef<number | null>(null);
  const initialStoreScaleRef = useRef<number>(1);
  const currentRatioRef = useRef<number>(1);

  // Tap tracking
  const tapStartRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 1) {
          const t = evt.nativeEvent.touches[0];
          tapStartRef.current = { time: Date.now(), x: t.pageX, y: t.pageY };
        }
        return evt.nativeEvent.touches.length === 2;
      },

      onMoveShouldSetPanResponder: (evt: GestureResponderEvent) => {
        return evt.nativeEvent.touches.length === 2;
      },

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2) {
          initialDistRef.current = getTouchDistance(evt.nativeEvent.touches);
          initialStoreScaleRef.current = useReaderStore.getState().zoomScale;
          currentRatioRef.current = 1;
        }
      },

      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2 && initialDistRef.current && initialDistRef.current > 0) {
          const dist = getTouchDistance(evt.nativeEvent.touches);
          if (dist > 0) {
            const ratio = dist / initialDistRef.current;
            currentRatioRef.current = ratio;
            pinchScaleAnim.setValue(ratio);
          }
        }
      },

      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const wasPinching = initialDistRef.current !== null;
        initialDistRef.current = null;

        if (wasPinching) {
          const target = initialStoreScaleRef.current * currentRatioRef.current;
          pinchScaleAnim.setValue(1);

          if (target < 1.1) {
            resetZoomScale();
          } else {
            const clamped = Math.min(
              MAX_ZOOM_SCALE,
              Math.max(MIN_ZOOM_SCALE, Math.round(target * 10) / 10)
            );
            setZoomScale(clamped);
          }
          return;
        }

        // Tap handling
        if (tapStartRef.current && evt.nativeEvent.touches.length === 0) {
          const now = Date.now();
          const elapsed = now - tapStartRef.current.time;
          const moved = Math.hypot(gestureState.dx, gestureState.dy);
          tapStartRef.current = null;

          if (elapsed < 260 && moved < 12) {
            // Double-tap detection
            if (now - lastTapTimeRef.current < 300) {
              lastTapTimeRef.current = 0;
              const current = useReaderStore.getState().zoomScale;
              if (current > 1.05) {
                resetZoomScale();
              } else {
                setZoomScale(2.0);
              }
            } else {
              lastTapTimeRef.current = now;
              setTimeout(() => {
                if (Date.now() - lastTapTimeRef.current >= 280 && onTap) {
                  onTap();
                }
              }, 290);
            }
          }
        }
      },

      onPanResponderTerminate: () => {
        initialDistRef.current = null;
        pinchScaleAnim.setValue(1);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ scale: pinchScaleAnim }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
