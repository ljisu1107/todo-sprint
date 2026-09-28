import type { TodoListParams } from '@/queries/todo';

/** 모든 할 일 목록 조회 조건 (FN-TD-01) */
export const TODO_LIST_PARAMS = {
  sort: 'latest',
  limit: 40,
} as const satisfies TodoListParams;
