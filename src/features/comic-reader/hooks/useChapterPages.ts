import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChapterDetail, storiesApi } from '../../../api';
import { prefetchPages } from '../utils/imageCache';

export function useChapterPages(chapterId: string) {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ChapterDetail, Error>({
      queryKey: ['chapter', chapterId],
      queryFn: () => storiesApi.getChapterDetail(chapterId),
      enabled: Boolean(chapterId),
    });

  const pages = data?.chapterPages ?? [];

  // Automatically prefetch chapter page images at the data layer
  useEffect(() => {
    if (data?.chapterPages && data.chapterPages.length > 0) {
      prefetchPages(data.chapterPages);
    }
  }, [data?.chapterPages]);

  return {
    chapter: data,
    pages,
    creatorNotes: data?.creatorsNotes ?? [],
    chapterNum: data?.chapterNum,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
}
