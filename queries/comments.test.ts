import { describe, expect, it } from 'vitest';
import type { CommentPageDto } from '@/types/api/comments';
import { commentQueries } from './comments';

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
