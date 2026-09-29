import { api } from './client-fetcher';
import type { NoteList } from '@/types/note';

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
// 응답 모양은 types/note.ts 참고 (Swagger: GET /{teamId}/notes)
export async function getNotes(
  params: GetNotesParams = {},
  signal?: AbortSignal,
): Promise<NoteList> {
  const { data } = await api.get<NoteList>('/notes', { params, signal });
  return data;
}
