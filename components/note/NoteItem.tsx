import { Note } from '@/types/note';
import Image from 'next/image';
import TodoStatusChip from '@/components/todo/TodoStatusChip';

interface NoteItemProps {
  noteProps: Note;
}

export default function NoteItem({ noteProps }: NoteItemProps) {
  const { title, updatedAt: date, todo } = noteProps;
  const isTodo = todo?.done;
  const todoTitle = todo?.title;
  return (
    <div
      className={
        'mt-4 box-border flex flex-col overflow-hidden rounded-3xl bg-white px-9.5 pt-7 pb-8'
      }
    >
      <div className={'flex flex-row items-center justify-between'}>
        <div className="mb-4 flex flex-row flex-nowrap items-center">
          <Image
            src="../icons/img_note.svg"
            width={40}
            height={40}
            alt="노트 아이콘"
            className="mr-4"
          />
          <p className={'truncate text-xl font-semibold'}>{title}</p>
        </div>

        <span className="material-symbols-outlined cursor-pointer text-2xl text-[#A4A4A4]">
          more_vert
        </span>
      </div>

      <div className={'flex flex-row flex-nowrap items-center justify-between'}>
        <div className={'flex flex-row flex-nowrap items-center gap-x-2'}>
          <TodoStatusChip isTodo={isTodo} />
          <p className={'truncate text-sm'}>{todoTitle}</p>
        </div>
        <span className={'text-xs text-[#A4A4A4]'}>{date}</span>
      </div>
    </div>
  );
}
