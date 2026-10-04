import { useQuery } from '@tanstack/react-query';
import { ChapterDetail, storiesApi } from '../../../api';

export function useChapterPages(chapterId: string) {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ChapterDetail, Error>({
      queryKey: ['chapter', chapterId],
      queryFn: () => storiesApi.getChapterDetail(chapterId),
      enabled: Boolean(chapterId),
    });

  return {
    chapter: data,
    pages: data?.chapterPages ?? [],
    creatorNotes: data?.creatorsNotes ?? [],
    chapterNum: data?.chapterNum,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
}
