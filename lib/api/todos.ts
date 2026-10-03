import type {
  CreateTodoRequestDto,
  TodoDto,
  TodoPageDto,
} from '@/types/api/todo';
import { request } from './client-fetcher';

export type TodoSortType = 'latest' | 'dueSoon';

export type GetTodosParams = {
  cursor?: number;
  limit?: number;
  sort?: TodoSortType;
  goalId?: number;
  /** 서버가 문자열 'true' | 'false'로 받습니다. */
  done?: 'true' | 'false';
};

export const getTodos = (params: GetTodosParams, signal?: AbortSignal) =>
  request<TodoPageDto>({ url: '/todos', params, signal });

export const createTodo = (body: CreateTodoRequestDto) =>
  request<TodoDto>({ url: '/todos', method: 'POST', data: body });
