import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChapterList, ChapterSummary, storiesApi, StoryDetail } from '../../../api';

export function useStoryDetails(storyId: string) {
  const storyQuery = useQuery<StoryDetail, Error>({
    queryKey: ['story', storyId],
    queryFn: () => storiesApi.getStoryDetail(storyId),
    enabled: Boolean(storyId),
  });

  // 2. Fetch paginated chapters for this story
  const chaptersQuery = useInfiniteQuery<ChapterList, Error>({
    queryKey: ['chapters', { story: storyId }],
    queryFn: ({ pageParam }) =>
      storiesApi.getChapters({
        story: storyId,
        limit: 20,
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
    chaptersQuery.data?.pages.flatMap((page) => page.page) ?? [];

  return {
    story: storyQuery.data,
    chapters,
    isLoading: storyQuery.isLoading || chaptersQuery.isLoading,
    isError: storyQuery.isError || chaptersQuery.isError,
    error: storyQuery.error || chaptersQuery.error,
    refetch: () => {
      storyQuery.refetch();
      chaptersQuery.refetch();
    },
    isRefetching: storyQuery.isRefetching || chaptersQuery.isRefetching,
    hasNextPage: Boolean(chaptersQuery.hasNextPage),
    isFetchingNextPage: chaptersQuery.isFetchingNextPage,
    fetchNextPage: chaptersQuery.fetchNextPage,
  };
}
