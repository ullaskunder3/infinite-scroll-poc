import React, { useRef } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { MAX_ZOOM_SCALE, MIN_ZOOM_SCALE, useReaderStore } from '../store';

export interface PinchZoomWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onTap?: () => void;
}

function getDistance(touches: readonly any[]): number {
  if (touches.length < 2) return 0;
  const [t1, t2] = touches;
  return Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
}

export const PinchZoomWrapper: React.FC<PinchZoomWrapperProps> = ({
  children,
  style,
  onTap,
}) => {
  const zoomScale = useReaderStore((s) => s.zoomScale);
  const setZoomScale = useReaderStore((s) => s.setZoomScale);

  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(zoomScale);
  const tapStartRef = useRef<{ time: number; x: number; y: number } | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt: GestureResponderEvent) => {
        // Record tap start time and position
        if (evt.nativeEvent.touches.length === 1) {
          const touch = evt.nativeEvent.touches[0];
          tapStartRef.current = {
            time: Date.now(),
            x: touch.pageX,
            y: touch.pageY,
          };
        }
        return evt.nativeEvent.touches.length === 2;
      },

      onMoveShouldSetPanResponder: (evt: GestureResponderEvent) => {
        return evt.nativeEvent.touches.length === 2;
      },

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2) {
          initialDistanceRef.current = getDistance(evt.nativeEvent.touches);
          initialScaleRef.current = useReaderStore.getState().zoomScale;
        }
      },

      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2 && initialDistanceRef.current) {
          const currentDistance = getDistance(evt.nativeEvent.touches);
          if (currentDistance > 0 && initialDistanceRef.current > 0) {
            const factor = currentDistance / initialDistanceRef.current;
            const newScale = initialScaleRef.current * factor;
            setZoomScale(newScale);
          }
        }
      },

      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        initialDistanceRef.current = null;
        const currentScale = useReaderStore.getState().zoomScale;
        if (currentScale < 1.05) {
          useReaderStore.getState().resetZoomScale();
        }

        // Check if single tap occurred
        if (tapStartRef.current && evt.nativeEvent.touches.length === 0) {
          const duration = Date.now() - tapStartRef.current.time;
          const moved = Math.hypot(gestureState.dx, gestureState.dy);
          if (duration < 250 && moved < 10 && onTap) {
            onTap();
          }
          tapStartRef.current = null;
        }
      },

      onPanResponderTerminate: () => {
        initialDistanceRef.current = null;
        const currentScale = useReaderStore.getState().zoomScale;
        if (currentScale < 1.05) {
          useReaderStore.getState().resetZoomScale();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
