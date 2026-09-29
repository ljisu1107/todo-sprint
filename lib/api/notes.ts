import z from 'zod';
import { request } from './client-fetcher';
import type { Note, NoteList, NoteTodo } from '@/types/note';

// ── 응답 스키마 (Swagger: GET /{teamId}/notes) ──
// 서버 응답이 이 모양과 다르면 request()가 ApiError('parse')를 던집니다.
// z.ZodType<타입>으로 적어 두면 types/note.ts와 모양이 어긋날 때 타입 에러가 납니다.

export const NoteTodoSchema: z.ZodType<NoteTodo> = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean(),
  createdAt: z.string().optional(),
  goal: z.object({ id: z.number(), title: z.string() }).nullish(),
  tags: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
});

export const NoteSchema: z.ZodType<Note> = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  todoId: z.number(),
  title: z.string(),
  // 에디터 JSON이라 형태가 다양하므로 여기서는 검사하지 않습니다.
  content: z.unknown().nullish(),
  linkUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  todo: NoteTodoSchema,
});

export const NoteListSchema: z.ZodType<NoteList> = z.object({
  notes: z.array(NoteSchema),
  nextCursor: z.number().nullable(),
  totalCount: z.number(),
});

// ── 요청 파라미터 ──
export interface GetNotesParams {
  cursor?: number;
  limit?: number;
  todoId?: number;
  goalId?: number;
  search?: string;
  sort?: 'latest' | 'oldest';
}

// 브라우저 → /api/notes (Next BFF) → 백엔드 /{teamId}/notes
export function getNotes(params: GetNotesParams = {}, signal?: AbortSignal) {
  return request(NoteListSchema, {
    method: 'GET',
    url: '/notes',
    params,
    signal,
  });
}
