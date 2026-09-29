/** GET /{teamId}/notes 응답 타입입니다. 서버 스펙을 그대로 따릅니다. */
export interface NoteGoal {
  id: number;
  title: string;
}

export interface NoteTag {
  id: number;
  name: string;
}

export interface NoteTodo {
  id: number;
  title: string;
  done: boolean;
  createdAt?: string;
  goal?: NoteGoal | null;
  tags?: NoteTag[];
}

export interface Note {
  id: number;
  teamId: string;
  userId: number;
  todoId: number;
  title: string;
  // 에디터 JSON이라 형태가 다양하므로 unknown으로 둡니다.
  content?: unknown;
  linkUrl: string | null;
  createdAt: string;
  updatedAt: string;
  todo: NoteTodo;
}

export interface NoteList {
  notes: Note[];
  nextCursor: number | null;
  totalCount: number;
}

export type TodoStatus = 'TO DO' | 'DONE';
