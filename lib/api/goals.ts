import { api } from '@/lib/api/client-fetcher';
import type { GoalsResponse } from '@/types/api/goal';

/** 본인의 목표를 2개씩 조회합니다. 첫 조회에서는 cursor를 생략합니다. */
export async function getGoals(
  signal?: AbortSignal,
  cursor?: number,
): Promise<GoalsResponse> {
  const { data } = await api.get<GoalsResponse>('/goals', {
    params: { limit: 2, cursor },
    signal,
  });

  // 무한 스크롤에 사용할 nextCursor도 필요하므로 응답 전체를 반환합니다.
  return data;
}
