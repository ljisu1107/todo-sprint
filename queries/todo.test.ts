import { describe, expect, it } from 'vitest';

import type { TodoPage } from '@/lib/api/todos';
import { todoKeys, todoQueries } from './todo';

const page = (nextCursor: number | null): TodoPage => ({
  todos: [],
  nextCursor,
  totalCount: 0,
});

describe('todoQueries', () => {
  it('목록 key에 필터가 들어간다', () => {
    const params = { sort: 'latest', limit: 40, done: 'false' } as const;
    expect(todoQueries.list(params).queryKey).toContainEqual(params);
  });

  it('목록 key는 todoKeys.lists() 아래에 묶인다', () => {
    const { queryKey } = todoQueries.list({ limit: 40 });
    expect(queryKey.slice(0, 2)).toEqual([...todoKeys.lists()]);
  });

  it('nextCursor가 null이면 다음 페이지를 요청하지 않는다', () => {
    const { getNextPageParam } = todoQueries.list({ limit: 40 });
    expect(getNextPageParam(page(41), [], undefined, [])).toBe(41);
    expect(getNextPageParam(page(null), [], undefined, [])).toBeUndefined();
  });
});
