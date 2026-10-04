import { fetchApi } from './client';
import {
  ChapterDetail,
  ChapterList,
  GetChaptersParams,
  GetStoriesParams,
  StoryDetail,
  StoryList,
} from './types';

export const storiesApi = {
  getStories: (params?: GetStoriesParams): Promise<StoryList> => {
    const searchParams = new URLSearchParams();
    if (params?.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }
    if (params?.cursor) {
      searchParams.set('cursor', params.cursor);
    }
    const query = searchParams.toString();
    return fetchApi<StoryList>(`/stories${query ? `?${query}` : ''}`);
  },

  getStoryDetail: (storyId: string): Promise<StoryDetail> => {
    return fetchApi<StoryDetail>(`/stories/${storyId}`);
  },

  getChapters: (params: GetChaptersParams): Promise<ChapterList> => {
    const searchParams = new URLSearchParams();
    searchParams.set('story', params.story);
    if (params.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }
    if (params.cursor) {
      searchParams.set('cursor', params.cursor);
    }
    return fetchApi<ChapterList>(`/chapters?${searchParams.toString()}`);
  },

  getChapterDetail: (chapterId: string): Promise<ChapterDetail> => {
    return fetchApi<ChapterDetail>(`/chapters/${chapterId}`);
  },
};