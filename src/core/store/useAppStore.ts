import { create } from 'zustand';

export interface AppNavState {
  selectedStoryId: string | null;
  selectedChapterId: string | null;
  selectedChapterNum: number | null;
  selectedInitialPage: number | null;

  // Navigation Actions
  openStory: (storyId: string) => void;
  openChapter: (chapterId: string, chapterNum?: number, initialPage?: number) => void;
  closeChapter: () => void;
  closeStory: () => void;
  resetNavigation: () => void;
}

export const useAppStore = create<AppNavState>((set) => ({
  selectedStoryId: null,
  selectedChapterId: null,
  selectedChapterNum: null,
  selectedInitialPage: null,

  openStory: (storyId: string) =>
    set({
      selectedStoryId: storyId,
      selectedChapterId: null,
      selectedChapterNum: null,
      selectedInitialPage: null,
    }),

  openChapter: (chapterId: string, chapterNum = 1, initialPage = 1) =>
    set({
      selectedChapterId: chapterId,
      selectedChapterNum: chapterNum,
      selectedInitialPage: initialPage,
    }),

  closeChapter: () =>
    set({
      selectedChapterId: null,
      selectedChapterNum: null,
      selectedInitialPage: null,
    }),

  closeStory: () =>
    set({
      selectedStoryId: null,
      selectedChapterId: null,
      selectedChapterNum: null,
      selectedInitialPage: null,
    }),

  resetNavigation: () =>
    set({
      selectedStoryId: null,
      selectedChapterId: null,
      selectedChapterNum: null,
      selectedInitialPage: null,
    }),
}));
