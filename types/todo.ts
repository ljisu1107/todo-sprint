/** GET /todos 응답의 할 일 항목입니다. 서버 스펙을 그대로 따릅니다. */
export type Todo = {
  id: number;
  teamId: string;
  userId: number;
  goalId: number;
  title: string;
  done: boolean;
  fileUrl: string | null;
  linkUrl: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  goal: TodoGoal;
  noteIds: number[];
  tags: TodoTag[];
  isFavorite: boolean;
};

export type TodoGoal = {
  id: number;
  title: string;
};

export type TodoTag = {
  id: number;
  name: string;
};
