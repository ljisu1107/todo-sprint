'use client';

import { useTranslations } from 'next-intl';

import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/toast/Toaster';
import { useDeleteTodo } from '@/queries/todoMutations';
import type { TodoDto } from '@/types/api/todo';

interface DeleteTodoModalProps {
  /** 삭제할 할 일. null이면 닫힌 상태입니다. */
  todo: Pick<TodoDto, 'id' | 'title'> | null;
  onClose: () => void;
  /**
   * 삭제가 성공한 뒤 실행할 화면별 후처리 (통계·진행률 갱신 등).
   * 목록 캐시에서 빼는 일은 useDeleteTodo가 이미 했으므로 여기서 하지 않습니다.
   */
  onDeleted?: (todoId: number) => void;
}

/**
 * 할 일 삭제 확인 (FN-TD-10). 확인하면 DELETE를 보내고, 성공하면 닫습니다.
 * 실패하면 토스트를 띄우고 모달은 열어 둬 다시 시도하거나 취소할 수 있게 합니다.
 */
const DeleteTodoModal = ({
  todo,
  onClose,
  onDeleted,
}: DeleteTodoModalProps) => {
  const t = useTranslations('Todo');
  const { mutate: deleteTodo, isPending } = useDeleteTodo();

  const handleConfirm = () => {
    if (!todo) {
      return;
    }
    deleteTodo(todo.id, {
      onSuccess: (_data, todoId) => {
        // 삭제는 이미 성공했으므로 onDeleted의 예외를 삭제 실패로 다루지 않고, 모달은 항상 닫습니다.
        try {
          onDeleted?.(todoId);
        } catch (error) {
          console.error(
            '[DeleteTodoModal] onDeleted 실행 중 오류가 났습니다.',
            error,
          );
        } finally {
          onClose();
        }
      },
      onError: () => toast.error(t('deleteTodoError')),
    });
  };

  return (
    <ConfirmModal
      isOpen={todo !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
      title={t('deleteTodoConfirm', { title: todo?.title ?? '' })}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      onConfirm={handleConfirm}
      isPending={isPending}
    />
  );
};

export default DeleteTodoModal;
