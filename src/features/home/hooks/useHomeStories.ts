import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { storiesApi, StoryList } from '../../../api';

const DEFAULT_PAGE_SIZE = 20;

export const HOME_QUERY_KEYS = {
  all: ['stories'] as const,
  infinite: (limit: number) => [...HOME_QUERY_KEYS.all, 'infinite', { limit }] as const,
};

export function useHomeStories(limit = DEFAULT_PAGE_SIZE) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<StoryList, Error>({
    queryKey: HOME_QUERY_KEYS.infinite(limit),
    queryFn: ({ pageParam }) =>
      storiesApi.getStories({
        limit,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.continueCursor
        ? lastPage.continueCursor
        : undefined,
  });

  // Flatten paginated responses into a continuous list
  const stories = useMemo(() => {
    return data?.pages.flatMap((page) => page.page) ?? [];
  }, [data]);

  const totalPages = data?.pages.length ?? 0;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    stories,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
    handleEndReached,
  };
}
