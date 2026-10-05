import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Custom hook to intercept Android hardware back button / edge-swipe back gesture.
 * Invokes `onBack` and prevents the OS from closing the application.
 */
export function useBackHandler(onBack?: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled || !onBack) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });

    return () => subscription.remove();
  }, [onBack, enabled]);
}
