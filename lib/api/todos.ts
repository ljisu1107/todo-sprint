import { z } from 'zod';

import type { Todo } from '@/types/todo';
import { request } from './client-fetcher';

// types/todo.ts와 어긋나면 타입 에러가 나도록 Todo로 고정합니다.
const Todo: z.ZodType<Todo> = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  goalId: z.number().nullable(),
  title: z.string(),
  done: z.boolean(),
  fileUrl: z.string().nullable(),
  linkUrl: z.string().nullable(),
  dueDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  goal: z.object({ id: z.number(), title: z.string() }).nullable(),
  noteIds: z.array(z.number()),
  tags: z.array(z.object({ id: z.number(), name: z.string() })),
  isFavorite: z.boolean(),
});

const TodoPage = z.object({
  todos: z.array(Todo),
  nextCursor: z.number().nullable(),
  totalCount: z.number(),
});

export type TodoPage = z.infer<typeof TodoPage>;

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
  request(TodoPage, { url: '/todos', params, signal });
