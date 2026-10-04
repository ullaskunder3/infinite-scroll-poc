import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChapterDetail, ChapterList, ChapterSummary, storiesApi } from '../../../api';

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

export function useStoryChapters(storyId: string | null) {
  const query = useInfiniteQuery<ChapterList, Error>({
    queryKey: ['chapters', { story: storyId }],
    queryFn: ({ pageParam }) =>
      storiesApi.getChapters({
        story: storyId!,
        limit: 30,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.continueCursor
        ? lastPage.continueCursor
        : undefined,
    enabled: Boolean(storyId),
  });

  const chapters: ChapterSummary[] =
    query.data?.pages.flatMap((page) => page.page) ?? [];

  return {
    chapters,
    isLoading: query.isLoading,
  };
}
