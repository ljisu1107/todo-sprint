import z from 'zod';
import { request } from './client-fetcher';

// ── 응답 스키마 (Swagger: GET /{teamId}/notes) ──
// 서버 응답이 이 모양과 다르면 request()가 ApiError('parse')를 던집니다.

export const NoteTodo = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean(),
  createdAt: z.string().optional(),
  goal: z.object({ id: z.number(), title: z.string() }).nullish(),
  tags: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
});
export type NoteTodo = z.infer<typeof NoteTodo>;

export const Note = z.object({
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
  todo: NoteTodo,
});
export type Note = z.infer<typeof Note>;

export const NoteList = z.object({
  notes: z.array(Note),
  nextCursor: z.number().nullable(),
  totalCount: z.number(),
});
export type NoteList = z.infer<typeof NoteList>;

// ── 요청 파라미터 ──
export type GetNotesParams = {
  cursor?: number;
  limit?: number;
  todoId?: number;
  goalId?: number;
  search?: string;
  sort?: 'latest' | 'oldest';
};

// 브라우저 → /api/notes (Next BFF) → 백엔드 /{teamId}/notes
export function getNotes(params: GetNotesParams = {}, signal?: AbortSignal) {
  return request(NoteList, { method: 'GET', url: '/notes', params, signal });
}
