import type {
  CreateTodoRequestDto,
  TodoDto,
  TodoPageDto,
} from '@/types/api/todo';
import { request, requestVoid } from './client-fetcher';

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

/** PATCH /todos/{todoId} 본문. 보낸 필드만 수정되고 tags는 전체 교체됩니다. */
export type UpdateTodoBody = Partial<{
  title: string;
  done: boolean;
  goalId: number | null;
  fileUrl: string | null;
  linkUrl: string | null;
  dueDate: string | null;
  tags: string[];
}>;

// 수정·삭제·찜 응답 본문은 쓰지 않고, 성공 후 목록을 다시 받아 맞춥니다.
export const updateTodo = (todoId: number, body: UpdateTodoBody) =>
  requestVoid({ method: 'PATCH', url: `/todos/${todoId}`, data: body });

export const deleteTodo = (todoId: number) =>
  requestVoid({ method: 'DELETE', url: `/todos/${todoId}` });

export const addTodoFavorite = (todoId: number) =>
  requestVoid({ method: 'POST', url: `/todos/${todoId}/favorites` });

export const removeTodoFavorite = (todoId: number) =>
  requestVoid({ method: 'DELETE', url: `/todos/${todoId}/favorites` });
