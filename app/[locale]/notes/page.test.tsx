import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '@/messages/ko.json';
import { getNotes, type NoteList } from '@/lib/api/notes';
import Page from './page';

vi.mock('@/lib/api/notes', () => ({ getNotes: vi.fn() }));

const firstPage: NoteList = {
  notes: [
    {
      id: 7,
      teamId: 'team-abc',
      userId: 1,
      todoId: 12,
      title: 'API 설계 메모',
      content: null,
      linkUrl: 'https://docs.example.com',
      createdAt: '2026-02-16T09:00:00.000Z',
      updatedAt: '2026-02-16T09:00:00.000Z',
      todo: { id: 12, title: 'API 문서 작성', done: false },
    },
  ],
  nextCursor: null,
  totalCount: 1,
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <NextIntlClientProvider locale="ko" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    </NextIntlClientProvider>,
  );
}

describe('NotesPage', () => {
  beforeEach(() => {
    vi.mocked(getNotes).mockReset();
    vi.mocked(getNotes).mockResolvedValue(firstPage);
  });

  it('페이지 제목과 목표 정보를 렌더링한다', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { level: 2, name: '노트 모아보기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: '자바스크립트로 웹 서비스 만들기',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '목표 아이콘' }),
    ).toBeInTheDocument();
  });

  it('노트 검색 입력창을 렌더링한다', () => {
    renderPage();

    expect(screen.getByPlaceholderText('노트를 검색해주세요')).toHaveAttribute(
      'type',
      'search',
    );
  });

  it('API로 조회한 노트를 렌더링한다', async () => {
    renderPage();

    const list = await screen.findByRole('list');
    const items = within(list).getAllByRole('listitem');

    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText('API 설계 메모')).toBeInTheDocument();
    expect(within(items[0]).getByText('API 문서 작성')).toBeInTheDocument();
    expect(within(items[0]).getByText('TO DO')).toBeInTheDocument();
  });

  it('노트가 없으면 빈 상태를 보여준다', async () => {
    vi.mocked(getNotes).mockResolvedValue({
      notes: [],
      nextCursor: null,
      totalCount: 0,
    });
    renderPage();

    expect(
      await screen.findByText('아직 등록된 노트가 없어요'),
    ).toBeInTheDocument();
  });

  it('조회에 실패하면 다시 시도 버튼을 보여준다', async () => {
    vi.mocked(getNotes).mockRejectedValue(new Error('boom'));
    renderPage();

    expect(
      await screen.findByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  });
});
