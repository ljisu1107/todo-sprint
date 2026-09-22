import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getPosts, type GetPostsParams } from '@/lib/api/posts';

const BEST_POSTS_PARAMS = { type: 'best', limit: 3 } as const;

export type PostListParams = Omit<GetPostsParams, 'cursor'>;

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostListParams) => [...postKeys.lists(), params] as const,
  best: () => [...postKeys.all, 'best', BEST_POSTS_PARAMS] as const,
};

export const postQueries = {
  best: () =>
    queryOptions({
      queryKey: postKeys.best(),
      queryFn: ({ signal }) => getPosts(BEST_POSTS_PARAMS, signal),
    }),
  list: (params: PostListParams) =>
    infiniteQueryOptions({
      queryKey: postKeys.list(params),
      queryFn: ({ pageParam, signal }) =>
        getPosts({ ...params, cursor: pageParam }, signal),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }),
};
