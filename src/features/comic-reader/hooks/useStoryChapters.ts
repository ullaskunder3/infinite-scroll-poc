import { useInfiniteQuery } from '@tanstack/react-query';
import { ChapterList, ChapterSummary, storiesApi } from '../../../api';

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
