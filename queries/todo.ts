import { infiniteQueryOptions } from '@tanstack/react-query';

import { getTodos, type GetTodosParams } from '@/lib/api/todos';

export type TodoListParams = Omit<GetTodosParams, 'cursor'>;

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params: TodoListParams) => [...todoKeys.lists(), params] as const,
};

export const todoQueries = {
  list: (params: TodoListParams) =>
    infiniteQueryOptions({
      queryKey: todoKeys.list(params),
      queryFn: ({ pageParam, signal }) =>
        getTodos({ ...params, cursor: pageParam }, signal),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }),
};
