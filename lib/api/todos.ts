import type { TodoPageDto } from '@/types/api/todo';
import { request } from './client-fetcher';

export type TodoSortType = 'latest' | 'dueSoon';

export type GetTodosParams = {
  cursor?: number;
  limit?: number;
  sort?: TodoSortType;
  goalId?: number;
  /** 서버가 문자열 'true' | 'false'로 받습니다. */
  done?: 'true' | 'false';
  /** 마감일 범위 시작 (KST, 해당일 포함, YYYY-MM-DD) */
  from?: string;
  /** 마감일 범위 끝 (KST, 해당일 포함, YYYY-MM-DD) */
  to?: string;
};

export const getTodos = (params: GetTodosParams, signal?: AbortSignal) =>
  request<TodoPageDto>({ url: '/todos', params, signal });
