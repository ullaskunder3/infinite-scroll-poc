import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ReaderSettingsState {
  zoomScale: number;
  setZoomScale: (scale: number) => void;
  resetZoomScale: () => void;
}

export const MIN_ZOOM_SCALE = 1.0;
export const MAX_ZOOM_SCALE = 3.0;

export const useReaderStore = create<ReaderSettingsState>()(
  persist(
    (set) => ({
      zoomScale: 1.0,

      setZoomScale: (scale: number) => {
        const clampedScale = Math.min(
          MAX_ZOOM_SCALE,
          Math.max(MIN_ZOOM_SCALE, Math.round(scale * 100) / 100)
        );
        set({ zoomScale: clampedScale });
      },

      resetZoomScale: () => set({ zoomScale: 1.0 }),
    }),
    {
      name: 'fanon-reader-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
