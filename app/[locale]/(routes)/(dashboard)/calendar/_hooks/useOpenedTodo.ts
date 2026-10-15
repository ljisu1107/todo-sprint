import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { parseIdParam } from '../_lib/parseIdParam';

const TODO_ID_PARAM = 'todoId';

/**
 * 상세 모달로 연 할 일을 URL의 todoId와 맞춥니다. openedTodoId가 null이면 닫힌 상태입니다.
 *   const { openedTodoId, openTodo, closeTodo } = useOpenedTodo();
 */
const useOpenedTodo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpenedByPush = useRef(false);

  const navigate = (todoId: number | null, method: 'push' | 'replace') => {
    const params = new URLSearchParams(searchParams.toString());
    if (todoId === null) {
      params.delete(TODO_ID_PARAM);
    } else {
      params.set(TODO_ID_PARAM, String(todoId));
    }

    const query = params.toString();
    router[method](query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // 열 때 기록을 남겨 뒤로가기로 닫히게 합니다. 닫을 때는 그 기록을 되돌리고,
  // 새로고침·딥링크로 열려 되돌릴 기록이 없으면 현재 기록에서 todoId만 뺍니다.
  const openTodo = (todoId: number) => {
    isOpenedByPush.current = true;
    navigate(todoId, 'push');
  };
  const closeTodo = () => {
    if (isOpenedByPush.current) {
      isOpenedByPush.current = false;
      router.back();
    } else {
      navigate(null, 'replace');
    }
  };

  return {
    openedTodoId: parseIdParam(searchParams.get(TODO_ID_PARAM)),
    openTodo,
    closeTodo,
  };
};

export default useOpenedTodo;
