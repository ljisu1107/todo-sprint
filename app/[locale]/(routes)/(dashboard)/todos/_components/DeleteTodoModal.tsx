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
}

/**
 * 할 일 삭제 확인 (FN-TD-10). 확인하면 DELETE를 보내고, 성공하면 닫습니다.
 * 실패하면 토스트를 띄우고 모달은 열어 둬 다시 시도하거나 취소할 수 있게 합니다.
 */
const DeleteTodoModal = ({ todo, onClose }: DeleteTodoModalProps) => {
  const t = useTranslations('Todo');
  const { mutate: deleteTodo, isPending } = useDeleteTodo();

  const handleConfirm = () => {
    if (!todo) {
      return;
    }
    deleteTodo(todo.id, {
      onSuccess: onClose,
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
