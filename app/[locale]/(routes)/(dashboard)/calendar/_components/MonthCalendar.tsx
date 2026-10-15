'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import NoteDetailDrawer from '@/components/note/note-detail/NoteDetailDrawer';
import TodoCreateModal from '@/components/todo/todo-create/TodoCreateModal';
import TodoDetailModal from '@/components/todo/todo-detail/TodoDetailModal';
import Button from '@/components/ui/button/Button';
import IcPlus from '@/components/ui/icons/IcPlus';
import useAllGoals from '@/hooks/goal/useAllGoals';
import useCalendarTodos from '@/hooks/todo/useCalendarTodos';
import { useRouter } from '@/i18n/navigation';
import {
  addMonths,
  getCalendarDays,
  getMonthKey,
  groupTodosByDueDate,
  type DateKey,
} from '../_lib/calendarDates';
import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';
import CalendarPageHeader from './CalendarPageHeader';
import DayTodosModal from './DayTodosModal';

interface MonthCalendarProps {
  today: DateKey;
  /** null이면 전체 목표 */
  selectedGoalId: number | null;
  onSelectGoal: (goalId: number | null) => void;
  /** 상세 모달로 연 할 일. null이면 닫힌 상태입니다. */
  openedTodoId: number | null;
  onOpenTodo: (todoId: number) => void;
  onCloseTodo: () => void;
}

const MonthCalendar = ({
  today,
  selectedGoalId,
  onSelectGoal,
  openedTodoId,
  onOpenTodo,
  onCloseTodo,
}: MonthCalendarProps) => {
  const t = useTranslations('Todo');
  const [month, setMonth] = useState(() => getMonthKey(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [openedDate, setOpenedDate] = useState<DateKey | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [openedNoteId, setOpenedNoteId] = useState<number | null>(null);
  const router = useRouter();
  const { goals } = useAllGoals();
  const selectedGoal = goals?.find(({ id }) => id === selectedGoalId);

  const days = getCalendarDays(month);
  const { todos, isLoading, isError, retry } = useCalendarTodos({
    from: days[0],
    to: days[days.length - 1],
    goalId: selectedGoalId ?? undefined,
  });
  const todosByDate = groupTodosByDueDate(todos ?? []);

  const handlePreviousMonth = () => setMonth(addMonths(month, -1));
  const handleNextMonth = () => setMonth(addMonths(month, 1));
  const handleSelectDate = (dateKey: DateKey) => {
    setSelectedDate(dateKey);
    if (todosByDate.has(dateKey)) {
      setOpenedDate(dateKey);
    }
  };
  const handleCloseDay = () => setOpenedDate(null);
  const handleAddTodo = () => setIsCreateOpen(true);
  const handleCreateNote = (todoId: number) =>
    router.push(`/notes/write?todoId=${todoId}`);

  return (
    <div className="mx-auto w-full max-w-7xl pb-16 md:pb-0">
      <CalendarPageHeader onAddTodo={handleAddTodo} />
      <section className="-mx-4 overflow-hidden bg-white-section shadow-lg md:mx-0 md:rounded-3xl lg:rounded-4xl">
        <CalendarHeader
          month={month}
          selectedGoalId={selectedGoalId}
          onSelectGoal={onSelectGoal}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        {isLoading && (
          <p role="status" className="sr-only">
            {t('loadingTodos')}
          </p>
        )}
        {isError && (
          <div
            role="alert"
            className="flex items-center justify-center gap-4 border-b border-subtle px-4 py-3"
          >
            <p className="text-sm text-muted">{t('fetchTodosError')}</p>
            <Button
              variant="neutral"
              size="sm"
              className="w-auto"
              onClick={retry}
            >
              {t('retry')}
            </Button>
          </div>
        )}
        <CalendarGrid
          days={days}
          month={month}
          today={today}
          selectedDate={selectedDate}
          todosByDate={todosByDate}
          isLoading={isLoading}
          onSelectDate={handleSelectDate}
        />
      </section>

      {/* 할 일 상세·노트 상세가 열린 동안 날짜 모달을 숨겼다가, 닫으면 다시 보여 줍니다. */}
      {openedDate !== null &&
        openedTodoId === null &&
        openedNoteId === null && (
          <DayTodosModal
            dateKey={openedDate}
            todos={todosByDate.get(openedDate) ?? []}
            onClose={handleCloseDay}
            onOpenTodo={onOpenTodo}
            onViewNote={setOpenedNoteId}
            onCreateNote={handleCreateNote}
          />
        )}
      <TodoDetailModal
        todoId={openedTodoId}
        onClose={onCloseTodo}
        // 상세를 닫고 노트 상세를 엽니다.
        onOpenNote={(noteId) => {
          onCloseTodo();
          setOpenedNoteId(noteId);
        }}
      />
      <NoteDetailDrawer
        noteId={openedNoteId}
        onClose={() => setOpenedNoteId(null)}
      />
      {/* 생성에 성공하면 생성 mutation이 할 일 목록 query를 무효화해서 달력도 다시 조회합니다. */}
      <TodoCreateModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialGoal={selectedGoal}
        initialDueDate={selectedDate}
      />

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-subtle bg-white-section px-4 py-3 shadow-lg md:hidden">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleAddTodo}
        >
          <IcPlus className="size-5 shrink-0" />
          {t('addTodo')}
        </Button>
      </div>
    </div>
  );
};

export default MonthCalendar;
