import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPosts } from '@/lib/api/post';
import { postQueries } from '@/queries/post';
import PostListSection from './PostListSection';

vi.mock('@/lib/api/post', () => ({
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

describe('정렬 커서 초기화', () => {
  const selectSort = async (current: RegExp, next: string) => {
    fireEvent.keyDown(screen.getByRole('button', { name: current }), {
      key: 'Enter',
    });
    fireEvent.click(await screen.findByRole('menuitemradio', { name: next }));
  };

  it('봤던 정렬로 돌아오면 1페이지만 다시 조회한다', async () => {
    const nextCursorOf: Record<string, string | null> = {
      start: 'c1',
      c1: 'c2',
      c2: null,
    };
    vi.mocked(getPosts).mockImplementation(async ({ cursor }) => ({
      posts: [],
      nextCursor: nextCursorOf[cursor ?? 'start'],
      totalCount: 0,
    }));
    // 앱과 같은 staleTime. 돌아올 때는 시간을 넘겨 stale 상태로 만듭니다.
    const STALE_TIME = 60 * 1000;
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: STALE_TIME } },
    });
    queryClient.setQueryData(
      postQueries.list({ type: 'all', limit: 10 }).queryKey,
      {
        pages: ['c1', 'c2', null].map((nextCursor) => ({
          posts: [],
          nextCursor,
          totalCount: 0,
        })),
        pageParams: [undefined, 'c1', 'c2'],
      },
    );
    render(
      <QueryClientProvider client={queryClient}>
        <PostListSection />
      </QueryClientProvider>,
    );
    await screen.findByText('아직 등록된 게시물이 없어요.');

    await selectSort(/최신순/, '인기순');
    await screen.findByRole('button', { name: /인기순/ });
    await vi.waitFor(() => expect(queryClient.isFetching()).toBe(0));
    vi.mocked(getPosts).mockClear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + STALE_TIME + 1);

    await selectSort(/인기순/, '최신순');
    await vi.waitFor(() => expect(getPosts).toHaveBeenCalled());
    await vi.waitFor(() => expect(queryClient.isFetching()).toBe(0));

    vi.useRealTimers();
    const allSortCalls = vi
      .mocked(getPosts)
      .mock.calls.filter(([params]) => params.type === 'all');
    expect(allSortCalls).toHaveLength(1);
  });
});

describe('게시글 검색', () => {
  const submitSearch = (keyword: string) => {
    const input = screen.getByRole('textbox', { name: '게시글 검색' });
    fireEvent.change(input, { target: { value: keyword } });
    fireEvent.click(screen.getByRole('button', { name: '검색' }));
  };

  const renderSection = () =>
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PostListSection />
      </QueryClientProvider>,
    );

  it('검색어를 넣고 검색하면 search 파라미터로 처음부터 다시 조회한다', async () => {
    renderSection();
    await screen.findByText('아직 등록된 게시물이 없어요.');

    submitSearch('  스터디  ');

    await vi.waitFor(() =>
      expect(getPosts).toHaveBeenLastCalledWith(
        { type: 'all', limit: 10, search: '스터디', cursor: undefined },
        expect.anything(),
      ),
    );
  });

  it('적용된 검색어와 같으면 검색 버튼이 비활성화된다', async () => {
    renderSection();
    await screen.findByText('아직 등록된 게시물이 없어요.');
    const searchButton = screen.getByRole('button', { name: '검색' });

    expect(searchButton).toBeDisabled();

    fireEvent.change(screen.getByRole('textbox', { name: '게시글 검색' }), {
      target: { value: '   ' },
    });
    expect(searchButton).toBeDisabled();

    fireEvent.change(screen.getByRole('textbox', { name: '게시글 검색' }), {
      target: { value: '스터디' },
    });
    expect(searchButton).toBeEnabled();

    fireEvent.click(searchButton);
    expect(searchButton).toBeDisabled();

    // 검색어를 지우면 다시 눌러 검색을 해제할 수 있어야 합니다.
    fireEvent.change(screen.getByRole('textbox', { name: '게시글 검색' }), {
      target: { value: '' },
    });
    expect(searchButton).toBeEnabled();
  });
});
