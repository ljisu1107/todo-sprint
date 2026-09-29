import { infiniteQueryOptions } from '@tanstack/react-query';
import { getComments } from '@/lib/api/comments';
import { retryUnlessNotFound } from './retry';

const COMMENT_LIST_LIMIT = 10;

export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: number) => [...commentKeys.lists(), postId] as const,
};

export const commentQueries = {
  list: (postId: number) =>
    infiniteQueryOptions({
      queryKey: commentKeys.list(postId),
      queryFn: ({ pageParam, signal }) =>
        getComments(
          postId,
          { limit: COMMENT_LIST_LIMIT, cursor: pageParam },
          signal,
        ),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      retry: retryUnlessNotFound,
    }),
};
