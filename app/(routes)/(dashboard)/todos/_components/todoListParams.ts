import type { TodoListParams } from '@/queries/todo';

export type TodoStatus = 'all' | 'todo' | 'done';

/** 완료 상태 탭 (FN-TD-02). ALL은 done을 보내지 않습니다. */
export const TODO_STATUS_TABS = [
  { value: 'all', label: 'ALL' },
  { value: 'todo', label: 'TO DO', done: 'false' },
  { value: 'done', label: 'DONE', done: 'true' },
] as const satisfies readonly {
  value: TodoStatus;
  label: string;
  done?: TodoListParams['done'];
}[];

/** 모든 할 일 목록 조회 조건 (FN-TD-01) */
const BASE_PARAMS = { sort: 'latest', limit: 40 } as const;

/** 탭마다 done이 달라 query key와 캐시가 따로 잡힙니다. */
export const getTodoListParams = (status: TodoStatus): TodoListParams => {
  const tab = TODO_STATUS_TABS.find(({ value }) => value === status);
  return tab && 'done' in tab
    ? { ...BASE_PARAMS, done: tab.done }
    : BASE_PARAMS;
};
