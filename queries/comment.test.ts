import { MutationObserver, QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import type { CommentPageDto } from '@/types/api/comment';
import type { PostDto } from '@/types/api/post';
import { commentKeys, commentMutations, commentQueries } from './comment';
import { postKeys } from './post';

vi.mock('@/lib/api/comment', () => ({
  getComments: vi.fn(),
  createComment: vi.fn(async () => ({})),
}));

const page = (nextCursor: string | null): CommentPageDto => ({
  comments: [],
  nextCursor,
  totalCount: 0,
});

describe('commentQueries', () => {
  it('목록 key에 게시글 ID가 들어간다', () => {
    expect(commentQueries.list(7).queryKey).toContain(7);
  });

  it('nextCursor가 null이면 다음 페이지를 요청하지 않는다', () => {
    const { getNextPageParam } = commentQueries.list(7);
    expect(getNextPageParam(page('abc'), [], undefined, [])).toBe('abc');
    expect(getNextPageParam(page(null), [], undefined, [])).toBeUndefined();
  });
});

describe('commentMutations.create', () => {
  it('성공하면 게시글의 댓글 수를 1 늘리고 댓글 목록을 무효화한다', async () => {
    const client = new QueryClient();
    client.setQueryData(postKeys.detail(7), { commentCount: 3 } as PostDto);
    client.setQueryData(commentKeys.list(7), { pages: [], pageParams: [] });

    await new MutationObserver(client, commentMutations.create(7)).mutate(
      '댓글',
    );

    expect(client.getQueryData<PostDto>(postKeys.detail(7))?.commentCount).toBe(
      4,
    );
    expect(client.getQueryState(commentKeys.list(7))?.isInvalidated).toBe(true);
  });
});
