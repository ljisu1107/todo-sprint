import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getTodos, type GetTodosParams } from '@/lib/api/todos';
import TestProviders from '@/test/TestProviders';
import { makeTodo } from '@/test/todoMocks';
import CalendarView from './CalendarView';

vi.mock('@/lib/api/todos', () => ({ getTodos: vi.fn() }));

const mockedGetTodos = vi.mocked(getTodos);

const JAN_8 = '2025-01-08T00:00:00.000Z';
const JAN_8_TODOS = [1, 2, 3, 4].map((id) =>
  makeTodo(id, { title: `할 일 ${id}`, dueDate: JAN_8, done: false }),
);

// 1월 범위는 두 페이지로 나눠 주고, 다른 달은 비어 있습니다.
const respond = ({ from, cursor }: GetTodosParams) => {
  if (from !== '2024-12-30') {
    return Promise.resolve({ todos: [], nextCursor: null, totalCount: 0 });
  }
  return Promise.resolve(
    cursor
      ? { todos: JAN_8_TODOS.slice(2), nextCursor: null, totalCount: 4 }
      : { todos: JAN_8_TODOS.slice(0, 2), nextCursor: 3, totalCount: 4 },
  );
};

const renderCalendar = () =>
  render(
    <TestProviders>
      <CalendarView />
    </TestProviders>,
  );

beforeEach(() => {
  // KST로는 2025-01-10 00:30
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2025-01-09T15:30:00.000Z'));
  mockedGetTodos.mockImplementation(respond);
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('CalendarView', () => {
  it('오늘(KST)이 포함된 달의 보이는 범위를 nextCursor가 null이 될 때까지 요청한다', async () => {
    renderCalendar();

    expect(
      screen.getByRole('heading', { name: '2025년 1월' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '2025년 1월 10일' }),
    ).toHaveAttribute('aria-current', 'date');

    await screen.findAllByText('할 일 1');
    const range = { from: '2024-12-30', to: '2025-02-02', limit: 100 };
    expect(mockedGetTodos.mock.calls.map(([params]) => params)).toEqual([
      { ...range, cursor: undefined },
      { ...range, cursor: 3 },
    ]);
  });

  it('다음 달로 이동하면 범위를 새로 계산해 재조회한다', async () => {
    const user = userEvent.setup();
    renderCalendar();

    await user.click(screen.getByRole('button', { name: '다음 달' }));

    expect(
      screen.getByRole('heading', { name: '2025년 2월' }),
    ).toBeInTheDocument();
    expect(mockedGetTodos).toHaveBeenLastCalledWith(
      expect.objectContaining({ from: '2025-01-27', to: '2025-03-02' }),
      expect.anything(),
    );
  });

  it('셀에는 3개까지 표시하고 나머지는 +N으로 표시한다', async () => {
    renderCalendar();

    expect(await screen.findByText('+1')).toBeInTheDocument();
    expect(screen.getAllByText('할 일 3')).not.toHaveLength(0);
    expect(screen.queryByText('할 일 4')).not.toBeInTheDocument();
  });

  it('이어 받기에 실패하면 에러를 표시하고 다시 시도하면 채운다', async () => {
    const user = userEvent.setup();
    mockedGetTodos.mockImplementation((params) =>
      params.cursor
        ? Promise.reject(new Error('mock network error'))
        : respond(params),
    );
    renderCalendar();

    const alert = await screen.findByRole('alert');
    expect(screen.queryByText('할 일 1')).not.toBeInTheDocument();

    mockedGetTodos.mockImplementation(respond);
    await user.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(await screen.findAllByText('할 일 1')).not.toHaveLength(0);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('할 일이 없는 날짜를 누르면 선택만 된다', async () => {
    const user = userEvent.setup();
    renderCalendar();
    await screen.findAllByText('할 일 1');

    const january9 = screen.getByRole('button', { name: '2025년 1월 9일' });
    await user.click(january9);

    expect(january9).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('할 일이 있는 날짜를 누르면 선택되고 그날의 할 일 전체를 모달로 보여준다', async () => {
    const user = userEvent.setup();
    const onOpenTodo = vi.fn();
    render(
      <TestProviders>
        <CalendarView onOpenTodo={onOpenTodo} />
      </TestProviders>,
    );

    const january8 = await screen.findByRole('button', {
      name: '2025년 1월 8일, 할 일 4개',
    });
    await user.click(january8);

    const modal = screen.getByRole('dialog');
    expect(within(modal).getByText('2025. 01. 08')).toBeInTheDocument();
    expect(within(modal).getAllByRole('listitem')).toHaveLength(4);

    await user.click(within(modal).getByRole('button', { name: '할 일 4' }));
    expect(onOpenTodo).toHaveBeenCalledWith(4);

    await user.click(within(modal).getByRole('button', { name: '닫기' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(january8).toHaveAttribute('aria-pressed', 'true');
  });
});
