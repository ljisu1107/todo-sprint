import { infiniteQueryOptions, mutationOptions } from '@tanstack/react-query';
import { createComment, getComments } from '@/lib/api/comment';
import { postQueries } from './post';
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

export const commentMutations = {
  create: (postId: number) =>
    mutationOptions({
      mutationFn: (content: string) => createComment(postId, { content }),
      // 게시글 상세를 다시 받으면 서버가 조회수를 올리므로, 댓글 수는 캐시에서 직접 늘립니다.
      onSuccess: (_data, _content, _onMutateResult, context) => {
        context.client.setQueryData(
          postQueries.detail(postId).queryKey,
          (post) => post && { ...post, commentCount: post.commentCount + 1 },
        );
        return context.client.invalidateQueries({
          queryKey: commentKeys.list(postId),
        });
      },
    }),
};
