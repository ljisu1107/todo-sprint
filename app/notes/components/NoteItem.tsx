import { NoteProps } from '@/types/note';

interface NoteItemProps {
  noteProps: NoteProps;
}

export default function NoteItem({ noteProps }: NoteItemProps) {
  const { title, date, status, content } = noteProps;
  return (
    <div className={'mt-4 box-border flex flex-col overflow-hidden px-9.5'}>
      <div className={'flex flex-row items-center justify-between'}>
        <p className={'text-lg'}>{title}</p>
        <span className="material-symbols-outlined">more_vert</span>
      </div>

      <div className={'flex flex-row flex-nowrap justify-between'}>
        <div>
          <span>{status}</span>
          <p>{content}</p>
        </div>
        <span>{date}</span>
      </div>
    </div>
  );
}
