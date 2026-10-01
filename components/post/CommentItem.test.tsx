import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { userKeys } from '@/queries/user';
import type { UserDto } from '@/types/api/user';
import CommentItem from './CommentItem';

afterEach(cleanup);

const MY_ID = 1;

const renderComment = (writerId: number) => {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  client.setQueryData(userKeys.me(), { id: MY_ID } as UserDto);
  render(
    <QueryClientProvider client={client}>
      <CommentItem
        comment={{
          content: '좋은 글이네요!',
          createdAt: '2026-02-16T10:00:00.000Z',
          writer: { id: writerId, name: '고양이', image: null },
        }}
      />
    </QueryClientProvider>,
  );
};

describe('댓글 아이템', () => {
  it('내 댓글이면 뱃지와 케밥을 표시한다', () => {
    renderComment(MY_ID);

    expect(screen.getByText('내 댓글')).toBeTruthy();
    expect(screen.getByRole('button', { name: '댓글 메뉴' })).toBeTruthy();
  });

  it('다른 사람 댓글이면 뱃지와 케밥을 표시하지 않는다', () => {
    renderComment(MY_ID + 1);

    expect(screen.queryByText('내 댓글')).toBeNull();
    expect(screen.queryByRole('button', { name: '댓글 메뉴' })).toBeNull();
  });
});
