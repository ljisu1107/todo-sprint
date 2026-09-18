export type TodoStatus = 'TO DO' | 'DONE';

export interface NoteText {
  type: 'text';
  text: string;
}

export interface NoteParagraph {
  type: 'paragraph';
  content: NoteText[];
}

export interface NoteContent {
  type: 'doc';
  content: NoteParagraph[];
}

export interface NoteTodo {
  id: number;
  title: string;
  done: boolean;
}

export interface Note {
  id: number;
  teamId: string;
  userId: number;
  todoId: number;
  title: string;
  content: NoteContent;
  linkUrl: string;
  createdAt: string;
  updatedAt: string;
  todo: NoteTodo;
}

export interface NoteProps {
  notes: Note[];
  nextCursor: number | null;
  totalCount: number;
}
