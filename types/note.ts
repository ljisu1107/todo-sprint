export type NoteStatus = 'TO DO' | 'DONE';
export interface NoteProps {
  title: string;
  status: NoteStatus | string;
  content: string;
  date: string;
}
