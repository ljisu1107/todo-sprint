import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { getNotes, type GetNotesParams } from '@/lib/api/notes';

// 캐시 키를 한곳에서 관리합니다. 노트 생성·수정·삭제 후
// queryClient.invalidateQueries({ queryKey: noteKeys.lists() })로 목록을 새로고침할 수 있습니다.
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (params: Omit<GetNotesParams, 'cursor'>) =>
    [...noteKeys.lists(), params] as const,
};

// 커서 기반 페이지네이션: nextCursor가 null이면 마지막 페이지입니다.
export function useNotesInfiniteQuery(
  params: Omit<GetNotesParams, 'cursor'> = {},
) {
  return useInfiniteQuery({
    queryKey: noteKeys.list(params),
    queryFn: ({ pageParam, signal }) =>
      getNotes({ ...params, cursor: pageParam }, signal),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  });
}
