import { request } from './client-fetcher';
import type { GetNotesParams, NoteList } from '@/types/api/note';

// 브라우저 → /api/notes (Next BFF) → 백엔드 /{teamId}/notes
export async function getNotes(
  params: GetNotesParams = {},
  signal?: AbortSignal,
) {
  return request<NoteList>({ method: 'GET', url: '/notes', params, signal });
}
