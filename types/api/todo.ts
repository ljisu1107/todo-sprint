/** 할 일 API(GET /{teamId}/todos) 응답 DTO입니다. 서버 스펙을 그대로 따릅니다. */
import type { TodoGoal, TodoTag } from '@/types/todo';

export interface TodoDto {
  id: number;
  teamId: string;
  userId: number;
  goalId: number | null;
  title: string;
  done: boolean;
  fileUrl: string | null;
  linkUrl: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  goal: TodoGoal | null;
  noteIds: number[];
  tags: TodoTag[];
  isFavorite: boolean;
}

export interface TodoPageDto {
  todos: TodoDto[];
  nextCursor: number | null;
  totalCount: number;
}
