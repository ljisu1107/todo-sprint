import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPosts } from '@/lib/api/posts';
import PostListSection from './PostListSection';

vi.mock('@/lib/api/posts', () => ({
  getPosts: vi.fn(async () => ({ posts: [], nextCursor: null, totalCount: 0 })),
}));

afterEach(cleanup);

describe('게시글 정렬', () => {
  it('인기순을 고르면 type=best로 처음부터 다시 조회하고 정렬명을 바꾼다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PostListSection />
      </QueryClientProvider>,
    );
    await screen.findByText('아직 등록된 게시물이 없어요.');
    expect(getPosts).toHaveBeenLastCalledWith(
      { type: 'all', limit: 10, cursor: undefined },
      expect.anything(),
    );

    fireEvent.keyDown(screen.getByRole('button', { name: /최신순/ }), {
      key: 'Enter',
    });
    fireEvent.click(
      await screen.findByRole('menuitemradio', { name: '인기순' }),
    );

    await vi.waitFor(() =>
      expect(getPosts).toHaveBeenLastCalledWith(
        { type: 'best', limit: 10, cursor: undefined },
        expect.anything(),
      ),
    );
    expect(screen.getByRole('button', { name: /인기순/ })).toBeInTheDocument();
  });
});
