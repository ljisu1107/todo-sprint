import TodoItem from '@/components/todo/TodoItem';
import Modal from '@/components/ui/Modal';
import ModalHeader from '@/components/ui/ModalHeader';
import useTodoItemActions from '@/hooks/todo/useTodoItemActions';
import useTodoItemLabels from '@/hooks/todo/useTodoItemLabels';
import type { TodoDto } from '@/types/api/todo';
import { formatDateKey, type DateKey } from '../_lib/calendarDates';

interface DayTodosModalProps {
  dateKey: DateKey;
  todos: TodoDto[];
  onClose: () => void;
  onOpenTodo: (todoId: number) => void;
}

const DayTodosModal = ({
  dateKey,
  todos,
  onClose,
  onOpenTodo,
}: DayTodosModalProps) => {
  const labels = useTodoItemLabels();
  // TODO: [2026.10.01] 완료·찜·링크 복사·노트·더보기(kebabSlot)는 아직 동작하지 않음. useTodoItemActions에 연결되면 여기에도 적용됨
  const actions = useTodoItemActions();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen
      onOpenChange={handleOpenChange}
      size="md"
      className="min-h-80 gap-4 overflow-hidden"
    >
      <ModalHeader>
        {formatDateKey(dateKey)}
        <span className="text-orange-600">{todos.length}</span>
      </ModalHeader>
      <ul className="flex min-h-0 flex-1 scrollbar-thin flex-col gap-1 overflow-y-auto overscroll-contain">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            labels={labels}
            size="small"
            {...actions}
            onOpenDetail={onOpenTodo}
          />
        ))}
      </ul>
    </Modal>
  );
};

export default DayTodosModal;
