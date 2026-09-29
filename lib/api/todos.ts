import { api } from '@/lib/api/client-fetcher';
import type { Todo } from '@/types/todo';

type TodosResponse = {
  todos: Todo[];
  nextCursor: number | null;
  totalCount: number;
};

/** 최근 등록한 할 일을 서버에서 최신순으로 최대 4개 조회합니다. */
export async function getRecentTodos(signal?: AbortSignal): Promise<Todo[]> {
  const { data } = await api.get<TodosResponse>('/todos', {
    params: { sort: 'latest', limit: 4 },
    signal,
  });
  return data.todos;
}

/** 특정 목표의 할 일을 최신순으로 10개씩 조회합니다. */
export async function getGoalTodos(
  goalId: number,
  signal?: AbortSignal,
  cursor?: number,
  done?: boolean,
  keyword?: string,
): Promise<TodosResponse> {
  const { data } = await api.get<TodosResponse>('/todos', {
    params: {
      goalId,
      keyword: keyword?.trim() || undefined,
      sort: 'latest',
      limit: 10,
      cursor,
      done: done === undefined ? undefined : String(done),
    },
    signal,
  });

  // 추가 조회에 필요한 nextCursor를 함께 반환합니다.
  return data;
}

/** 전체 할 일 중 완료한 할 일의 비율을 정수 퍼센트로 반환합니다. */
export async function getTodoProgress(signal?: AbortSignal): Promise<number> {
  // 개수(totalCount)만 필요하므로 목록은 각 요청에서 최소 1개만 받습니다.
  const [allResponse, doneResponse] = await Promise.all([
    api.get<TodosResponse>('/todos', { params: { limit: 1 }, signal }),
    api.get<TodosResponse>('/todos', {
      params: { limit: 1, done: 'true' },
      signal,
    }),
  ]);

  const totalCount = allResponse.data.totalCount;
  const doneCount = doneResponse.data.totalCount;
  if (totalCount === 0) return 0;

  // 두 요청 사이에 데이터가 변경되더라도 차트 범위(0~100)를 벗어나지 않게 합니다.
  return Math.min(100, Math.max(0, Math.round((doneCount / totalCount) * 100)));
}
