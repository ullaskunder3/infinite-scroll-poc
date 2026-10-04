import { create } from 'zustand';

export interface AppNavState {
  selectedStoryId: string | null;
  selectedChapterId: string | null;
  selectedChapterNum: number | null;

  // Navigation Actions
  openStory: (storyId: string) => void;
  openChapter: (chapterId: string, chapterNum?: number) => void;
  closeChapter: () => void;
  closeStory: () => void;
  resetNavigation: () => void;
}

export const useAppStore = create<AppNavState>((set) => ({
  selectedStoryId: null,
  selectedChapterId: null,
  selectedChapterNum: null,

  openStory: (storyId: string) =>
    set({
      selectedStoryId: storyId,
      selectedChapterId: null,
      selectedChapterNum: null,
    }),

  openChapter: (chapterId: string, chapterNum = 1) =>
    set({
      selectedChapterId: chapterId,
      selectedChapterNum: chapterNum,
    }),

  closeChapter: () =>
    set({
      selectedChapterId: null,
      selectedChapterNum: null,
    }),

  closeStory: () =>
    set({
      selectedStoryId: null,
      selectedChapterId: null,
      selectedChapterNum: null,
    }),

  resetNavigation: () =>
    set({
      selectedStoryId: null,
      selectedChapterId: null,
      selectedChapterNum: null,
    }),
}));
