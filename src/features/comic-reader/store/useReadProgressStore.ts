import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ReadProgress {
  storyId: string;
  storyTitle: string;
  thumbnailUrl: string;
  chapterId: string;
  chapterNum: number;
  pageNum: number;
  totalPages: number;
  savedAt: number;
}

export interface ReadProgressState {
  lastRead: ReadProgress | null;
  saveProgress: (progress: Omit<ReadProgress, 'savedAt'>) => void;
  clearProgress: () => void;
}

export const useReadProgressStore = create<ReadProgressState>()(
  persist(
    (set) => ({
      lastRead: null,

      saveProgress: (progress) =>
        set({ lastRead: { ...progress, savedAt: Date.now() } }),

      clearProgress: () => set({ lastRead: null }),
    }),
    {
      name: 'fanon-read-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
