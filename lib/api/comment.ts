import type { CommentPageDto } from '@/types/api/comment';
import { request } from './client-fetcher';

export type GetCommentsParams = {
  limit?: number;
  cursor?: string;
};

// 백엔드는 문자열 'null'을 받아야 대댓글을 빼고 최상위 댓글만 돌려줍니다.
const TOP_LEVEL_PARENT_ID = 'null';

export const getComments = (
  postId: number,
  params: GetCommentsParams,
  signal?: AbortSignal,
) =>
  request<CommentPageDto>({
    url: `/posts/${postId}/comments`,
    params: { parentId: TOP_LEVEL_PARENT_ID, ...params },
    signal,
  });
