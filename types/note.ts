// 노트 타입은 API 응답 스키마(lib/api/notes.ts)에서 만들어 서버 응답과 항상 일치시킵니다.
export type { Note, NoteTodo, NoteList as NoteProps } from '@/lib/api/notes';

export type TodoStatus = 'TO DO' | 'DONE';
