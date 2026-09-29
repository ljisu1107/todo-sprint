import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from './page';

const { getGoals, getGoalTodos } = vi.hoisted(() => ({
  getGoals: vi.fn(),
  getGoalTodos: vi.fn(),
}));

vi.mock('@/lib/api/goals', () => ({ getGoals }));
vi.mock('@/lib/api/todos', () => ({
  getGoalTodos,
  getRecentTodos: vi.fn().mockResolvedValue([]),
  getTodoProgress: vi.fn().mockResolvedValue(0),
}));
vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/components/dashboard/ProgressChart', () => ({
  default: () => null,
}));
vi.mock('@/components/todo/TodoItem', () => ({
  default: ({ todo }: { todo: { title: string } }) => <li>{todo.title}</li>,
}));

const makeTodos = (done: boolean) =>
  Array.from({ length: 13 }, (_, index) => ({
    id: (done ? 100 : 0) + index,
    title: `${done ? 'DONE' : 'TODO'} 테스트 ${index + 1}`,
    done,
  }));
const page = (done: boolean, cursor?: number) => ({
  todos:
    cursor === undefined
      ? makeTodos(done).slice(0, 10)
      : makeTodos(done).slice(10),
  nextCursor: cursor === undefined ? (done ? 110 : 10) : null,
  totalCount: 13,
});

beforeEach(() => {
  vi.clearAllMocks();
  getGoals.mockResolvedValue({
    goals: [
      { id: 678, title: '테스트 목표', todoCount: 26, completedCount: 13 },
    ],
    nextCursor: null,
    totalCount: 1,
  });
  getGoalTodos.mockReset();
});
afterEach(cleanup);

describe('목표별 영역별 더보기', () => {
  it.each([false, true])(
    '완료 여부 %s인 영역만 추가하고 마지막이면 해당 버튼만 숨긴다',
    async (done) => {
      let finish!: (value: ReturnType<typeof page>) => void;
      getGoalTodos.mockImplementation((_id, _signal, cursor, requestedDone) =>
        cursor === undefined
          ? Promise.resolve(page(requestedDone))
          : new Promise((resolve) => {
              finish = resolve;
            }),
      );
      render(<Dashboard />);
      const label = done ? 'DONE' : 'TO DO';
      const prefix = done ? 'DONE' : 'TODO';
      const otherPrefix = done ? 'TODO' : 'DONE';
      const button = await screen.findByRole('button', {
        name: `테스트 목표 ${label} 더보기`,
      });
      expect(screen.getAllByText(/^TODO 테스트 /)).toHaveLength(10);
      expect(screen.getAllByText(/^DONE 테스트 /)).toHaveLength(10);
      expect(getGoalTodos).toHaveBeenCalledWith(
        678,
        expect.any(AbortSignal),
        undefined,
        false,
        undefined,
      );
      expect(getGoalTodos).toHaveBeenCalledWith(
        678,
        expect.any(AbortSignal),
        undefined,
        true,
        undefined,
      );
      fireEvent.click(button);
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(getGoalTodos).toHaveBeenCalledTimes(3);
      expect(getGoalTodos).toHaveBeenLastCalledWith(
        678,
        expect.any(AbortSignal),
        done ? 110 : 10,
        done,
        undefined,
      );
      finish(page(done, 1));
      await waitFor(() =>
        expect(
          screen.getAllByText(new RegExp(`^${prefix} 테스트 `)),
        ).toHaveLength(13),
      );
      expect(
        screen.getAllByText(new RegExp(`^${otherPrefix} 테스트 `)),
      ).toHaveLength(10);
      expect(
        screen.queryByRole('button', { name: `테스트 목표 ${label} 더보기` }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: `테스트 목표 ${done ? 'TO DO' : 'DONE'} 더보기`,
        }),
      ).toBeEnabled();
    },
  );

  it('추가 조회 실패 시 양쪽 목록을 유지하고 같은 커서와 완료 여부로 재시도한다', async () => {
    let fail = true;
    getGoalTodos.mockImplementation((_id, _signal, cursor, done) => {
      if (cursor !== undefined && fail) {
        fail = false;
        return Promise.reject(new Error('network'));
      }
      return Promise.resolve(page(done, cursor));
    });
    render(<Dashboard />);
    fireEvent.click(
      await screen.findByRole('button', { name: '테스트 목표 TO DO 더보기' }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '추가 할 일을 불러오지 못했어요',
    );
    expect(screen.getAllByText(/^TODO 테스트 /)).toHaveLength(10);
    expect(screen.getAllByText(/^DONE 테스트 /)).toHaveLength(10);
    fireEvent.click(
      screen.getByRole('button', { name: '테스트 목표 TO DO 더보기' }),
    );
    await waitFor(() =>
      expect(screen.getAllByText(/^TODO 테스트 /)).toHaveLength(13),
    );
    expect(getGoalTodos).toHaveBeenLastCalledWith(
      678,
      expect.any(AbortSignal),
      10,
      false,
      undefined,
    );
  });
});

describe('목표별 검색', () => {
  it('Enter로 해당 목표만 검색하고 더보기에도 실행한 검색어를 유지한다', async () => {
    getGoals.mockResolvedValue({
      goals: [
        { id: 678, title: '테스트 목표', todoCount: 26, completedCount: 13 },
        { id: 679, title: '다른 목표', todoCount: 1, completedCount: 0 },
      ],
    });
    getGoalTodos.mockImplementation((id, _signal, cursor, done, keyword) => {
      if (id === 679)
        return Promise.resolve({
          todos: done
            ? []
            : [{ id: 99, title: '다른 목표 할 일', done: false }],
          nextCursor: null,
        });
      const result = page(done, cursor);
      return Promise.resolve(
        keyword
          ? {
              ...result,
              todos: result.todos.map((todo) => ({
                ...todo,
                title: `검색 ${todo.title}`,
              })),
            }
          : result,
      );
    });
    render(<Dashboard />);
    await screen.findByText('다른 목표 할 일');
    const input = screen.getByRole('searchbox', {
      name: '테스트 목표 할 일 검색',
    });
    fireEvent.change(input, { target: { value: ' 공부 ' } });
    const beforeSearch = getGoalTodos.mock.calls.length;
    fireEvent.keyDown(input, { key: 'Enter' });
    await screen.findByText('검색 TODO 테스트 1');
    expect(getGoalTodos.mock.calls.slice(beforeSearch)).toEqual([
      [678, expect.any(AbortSignal), undefined, false, '공부'],
      [678, expect.any(AbortSignal), undefined, true, '공부'],
    ]);
    expect(screen.getByText('다른 목표 할 일')).toBeInTheDocument();
    expect(screen.getByLabelText('목표 진행률 50%')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '아직 실행하지 않은 검색어' } });
    fireEvent.click(
      screen.getByRole('button', { name: '테스트 목표 TO DO 더보기' }),
    );
    await screen.findByText('검색 TODO 테스트 13');
    expect(getGoalTodos).toHaveBeenLastCalledWith(
      678,
      expect.any(AbortSignal),
      10,
      false,
      '공부',
    );
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await screen.findByText('TODO 테스트 1');
    expect(screen.queryByText('검색 TODO 테스트 13')).not.toBeInTheDocument();
    expect(getGoalTodos).toHaveBeenLastCalledWith(
      678,
      expect.any(AbortSignal),
      undefined,
      true,
      undefined,
    );
  });

  it('돋보기 검색의 결과가 없으면 양쪽에 검색 결과 없음 안내를 표시한다', async () => {
    getGoalTodos.mockImplementation((_id, _signal, cursor, done, keyword) =>
      Promise.resolve(
        keyword ? { todos: [], nextCursor: null } : page(done, cursor),
      ),
    );
    render(<Dashboard />);
    await screen.findByText('TODO 테스트 1');
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: '없는 제목' } });
    fireEvent.click(screen.getByRole('button', { name: '검색' }));
    await waitFor(() =>
      expect(screen.getAllByText('검색 결과가 없습니다.')).toHaveLength(2),
    );
    expect(
      screen.queryByRole('button', { name: '테스트 목표 TO DO 더보기' }),
    ).not.toBeInTheDocument();
  });

  it('새 검색 후 늦게 도착한 이전 더보기 응답을 무시한다', async () => {
    let finish!: (value: ReturnType<typeof page>) => void;
    let oldSignal!: AbortSignal;
    getGoalTodos.mockImplementation((_id, signal, cursor, done, keyword) => {
      if (cursor !== undefined) {
        oldSignal = signal;
        return new Promise((resolve) => {
          finish = resolve;
        });
      }
      return Promise.resolve(
        keyword ? { todos: [], nextCursor: null } : page(done),
      );
    });
    render(<Dashboard />);
    fireEvent.click(
      await screen.findByRole('button', { name: '테스트 목표 TO DO 더보기' }),
    );
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: '새 검색' },
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    await waitFor(() =>
      expect(screen.getAllByText('검색 결과가 없습니다.')).toHaveLength(2),
    );
    expect(oldSignal.aborted).toBe(true);
    await act(async () => {
      finish(page(false, 10));
    });
    expect(screen.queryByText('TODO 테스트 13')).not.toBeInTheDocument();
  });
});
