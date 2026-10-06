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

// 노트 보기·작성은 노트 화면 연결 전까지 동작을 보류합니다.
const noteNotConnected = () => {};

const DayTodosModal = ({
  dateKey,
  todos,
  onClose,
  onOpenTodo,
}: DayTodosModalProps) => {
  const labels = useTodoItemLabels();
  // 완료·찜·링크 복사는 공통 훅으로 연결합니다. 노트·더보기는 후속 연동입니다.
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
            onViewNote={noteNotConnected}
            onCreateNote={noteNotConnected}
          />
        ))}
      </ul>
    </Modal>
  );
};

export default DayTodosModal;
