import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '@/messages/ko.json';
import {
  getNotes,
  type Note,
  type NoteList as NoteListResponse,
} from '@/lib/api/notes';
import NoteList from './NoteList';

vi.mock('@/lib/api/notes', () => ({ getNotes: vi.fn() }));

const mockedGetNotes = vi.mocked(getNotes);

function makeNote(id: number, title: string): Note {
  return {
    id,
    teamId: 'team-abc',
    userId: 1,
    todoId: id,
    title,
    content: null,
    linkUrl: null,
    createdAt: '2026-02-16T09:00:00.000Z',
    updatedAt: '2026-02-16T09:00:00.000Z',
    todo: { id, title: `할 일 ${id}`, done: false },
  };
}

function page(
  notes: Note[],
  nextCursor: number | null,
  totalCount = notes.length,
): NoteListResponse {
  return { notes, nextCursor, totalCount };
}

function renderNoteList(props: Parameters<typeof NoteList>[0] = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <NextIntlClientProvider locale="ko" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <NoteList {...props} />
      </QueryClientProvider>
    </NextIntlClientProvider>,
  );
}

describe('NoteList', () => {
  beforeEach(() => {
    mockedGetNotes.mockReset();
  });

  it('응답을 기다리는 동안 로딩 문구를 보여준다', () => {
    mockedGetNotes.mockReturnValue(new Promise(() => {}));
    renderNoteList();

    expect(screen.getByText('불러오는 중…')).toBeInTheDocument();
  });

  it('조회한 노트를 목록으로 렌더링한다', async () => {
    mockedGetNotes.mockResolvedValue(
      page([makeNote(1, '첫 번째 노트'), makeNote(2, '두 번째 노트')], null),
    );
    renderNoteList();

    const items = within(await screen.findByRole('list')).getAllByRole(
      'listitem',
    );
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText('첫 번째 노트')).toBeInTheDocument();
    expect(within(items[1]).getByText('두 번째 노트')).toBeInTheDocument();
  });

  it('필터 props를 cursor 없이 첫 요청 파라미터로 전달한다', async () => {
    mockedGetNotes.mockResolvedValue(page([], null));
    renderNoteList({ goalId: 3, search: 'API', sort: 'oldest' });

    await screen.findByText('아직 등록된 노트가 없어요');
    expect(mockedGetNotes).toHaveBeenCalledWith(
      { goalId: 3, search: 'API', sort: 'oldest', cursor: undefined },
      expect.any(AbortSignal),
    );
  });

  it('노트가 없으면 빈 상태를 보여준다', async () => {
    mockedGetNotes.mockResolvedValue(page([], null));
    renderNoteList();

    expect(
      await screen.findByText('아직 등록된 노트가 없어요'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('조회에 실패하면 에러 문구를 보여주고, 다시 시도하면 목록을 불러온다', async () => {
    const user = userEvent.setup();
    mockedGetNotes
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(page([makeNote(1, '복구된 노트')], null));
    renderNoteList();

    expect(
      await screen.findByText('노트를 불러오지 못했어요.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('복구된 노트')).toBeInTheDocument();
    expect(mockedGetNotes).toHaveBeenCalledTimes(2);
  });

  it('다음 페이지가 있으면 더 보기로 nextCursor를 요청해 목록 뒤에 붙인다', async () => {
    const user = userEvent.setup();
    mockedGetNotes
      .mockResolvedValueOnce(page([makeNote(10, '1페이지 노트')], 10, 2))
      .mockResolvedValueOnce(page([makeNote(9, '2페이지 노트')], null, 2));
    renderNoteList();

    await screen.findByText('1페이지 노트');
    await user.click(screen.getByRole('button', { name: '더 보기' }));

    expect(await screen.findByText('2페이지 노트')).toBeInTheDocument();
    expect(screen.getByText('1페이지 노트')).toBeInTheDocument();
    expect(mockedGetNotes).toHaveBeenLastCalledWith(
      { cursor: 10 },
      expect.any(AbortSignal),
    );
    // nextCursor가 null이면 마지막 페이지이므로 버튼이 사라진다
    expect(
      screen.queryByRole('button', { name: '더 보기' }),
    ).not.toBeInTheDocument();
  });

  it('다음 페이지를 불러오는 동안 더 보기 버튼을 비활성화한다', async () => {
    const user = userEvent.setup();
    mockedGetNotes
      .mockResolvedValueOnce(page([makeNote(10, '1페이지 노트')], 10, 2))
      .mockReturnValueOnce(new Promise(() => {}));
    renderNoteList();

    await screen.findByText('1페이지 노트');
    await user.click(screen.getByRole('button', { name: '더 보기' }));

    expect(
      await screen.findByRole('button', { name: '불러오는 중…' }),
    ).toBeDisabled();
  });
});
