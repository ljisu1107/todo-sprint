'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Tabs } from 'radix-ui';
import { useState } from 'react';

import type { TodoNoteActions } from '@/components/todo/todoNoteActions';
import { todoQueries } from '@/queries/todo';
import AddTodoButton from './AddTodoButton';
import TodoList from './TodoList';
import TodosHeader from './TodosHeader';
import TodoStatusTabs from './TodoStatusTabs';
import { getTodoListParams, type TodoStatus } from './todoListParams';

const notConnected = () => {};

interface TodosViewProps {
  /** 할 일 생성 모달 열기 (FN-TD-04). 생성 모달이 생기면 연결합니다. */
  onAddTodo?: () => void;
  noteActions?: TodoNoteActions;
}

/** 모든 할 일 화면. 선택한 탭의 조건으로 제목 개수와 목록을 함께 조회합니다. */
const TodosView = ({
  onAddTodo = notConnected,
  noteActions,
}: TodosViewProps) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TodoStatus>('all');
  const params = getTodoListParams(status);

  // FN-TD-02: 이미 연 탭으로 돌아와도 이전 페이지를 복원하지 않고 커서 없이 첫 페이지부터 다시 조회합니다.
  // 이동할 탭의 목록 query 하나만 비웁니다.
  const handleStatusChange = (value: string) => {
    const nextStatus = value as TodoStatus;
    queryClient.resetQueries({
      queryKey: todoQueries.list(getTodoListParams(nextStatus)).queryKey,
      exact: true,
    });
    setStatus(nextStatus);
  };

  return (
    <div className="mx-auto flex w-full max-w-180 flex-col gap-6">
      <TodosHeader params={params} />
      <Tabs.Root
        value={status}
        onValueChange={handleStatusChange}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between px-2">
          <TodoStatusTabs />
          <AddTodoButton onClick={onAddTodo} />
        </div>
        <Tabs.Content
          value={status}
          className="flex min-h-160 flex-col rounded-3xl bg-white p-4 focus-visible:outline-2 focus-visible:outline-orange-600 md:rounded-4xl md:p-8"
        >
          <TodoList params={params} noteActions={noteActions} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default TodosView;
