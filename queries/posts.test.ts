import { describe, expect, it } from 'vitest';
import type { PostPage } from '@/lib/api/posts';
import { postQueries } from './posts';

const page = (nextCursor: string | null): PostPage => ({
  posts: [],
  nextCursor,
  totalCount: 0,
});

describe('postQueries', () => {
  it('인기 게시글 key에 type=best, limit=3이 들어간다', () => {
    expect(postQueries.best().queryKey).toContainEqual({
      type: 'best',
      limit: 3,
    });
  });

  it('목록 key에 필터가 들어간다', () => {
    const params = { type: 'all', limit: 10, search: '루틴' } as const;
    expect(postQueries.list(params).queryKey).toContainEqual(params);
  });

  it('nextCursor가 null이면 다음 페이지를 요청하지 않는다', () => {
    const { getNextPageParam } = postQueries.list({ type: 'all', limit: 10 });
    expect(getNextPageParam(page('abc'), [], undefined, [])).toBe('abc');
    expect(getNextPageParam(page(null), [], undefined, [])).toBeUndefined();
  });
});
