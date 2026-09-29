'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import TodoItem from '@/components/todo/TodoItem';
import type { TodoNoteActions } from '@/components/todo/todoNoteActions';
import useTodoItemLabels from '@/components/todo/useTodoItemLabels';
import Button from '@/components/ui/button/Button';
import { toast } from '@/components/ui/toast/Toaster';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useMediaQuery from '@/hooks/useMediaQuery';
import { todoQueries, type TodoListParams } from '@/queries/todo';
import TodoListEmpty from './TodoListEmpty';
import useTodoItemActions from './useTodoItemActions';

// globals.css의 --breakpoint-md(744px)와 같은 값입니다.
const TABLET_QUERY = '(min-width: 46.5rem)';

interface TodoListProps {
  params: TodoListParams;
  noteActions?: TodoNoteActions;
}

/** 모든 할 일 목록 (FN-TD-01). 커서 기반 무한 스크롤, nextCursor가 null이면 멈춥니다. */
const TodoList = ({ params, noteActions }: TodoListProps) => {
  const {
    data,
    isPending,
    isError,
    errorUpdatedAt,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery(todoQueries.list(params));
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    // 다음 페이지 요청이 실패하면 자동 재요청이 반복되지 않도록 감시를 멈춥니다.
    hasNextPage: hasNextPage && !isFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
  });
  const isTablet = useMediaQuery(TABLET_QUERY);
  const actions = useTodoItemActions(noteActions);
  const labels = useTodoItemLabels();
  const t = useTranslations('Todo');

  useEffect(() => {
    if (isError) {
      toast.error(t('fetchTodosError'));
    }
  }, [isError, errorUpdatedAt, t]);

  if (isPending) {
    return (
      <p role="status" className="py-10 text-center text-sm text-grayscale-400">
        {t('loadingTodos')}
      </p>
    );
  }

  if (isError && !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-sm text-grayscale-500">{t('fetchTodosError')}</p>
        <Button
          variant="neutral"
          size="sm"
          className="w-auto"
          onClick={() => refetch()}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  const todos = data.pages.flatMap((page) => page.todos);

  // 탭마다 조회 결과로 따로 판단합니다 (FN-TD-03).
  if (todos.length === 0) {
    return <TodoListEmpty />;
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            labels={labels}
            size={isTablet ? 'large' : 'small'}
            // FN-TD-01: 새 항목이 부드럽게 올라오는 애니메이션
            className="transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none starting:translate-y-2 starting:opacity-0"
            {...actions}
          />
        ))}
      </ul>
      <div ref={sentinelRef} aria-hidden="true" />
      {isFetchingNextPage && (
        <p
          role="status"
          className="pt-4 text-center text-sm text-grayscale-400"
        >
          {t('loadingMoreTodos')}
        </p>
      )}
      {isFetchNextPageError && (
        <div className="flex justify-center pt-4">
          <Button
            variant="neutral"
            size="sm"
            className="w-auto"
            onClick={() => fetchNextPage()}
          >
            {t('retry')}
          </Button>
        </div>
      )}
    </>
  );
};

export default TodoList;
