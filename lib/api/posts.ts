import type { PostPageDto } from '@/types/api/posts';
import { request } from './client-fetcher';

export type PostSortType = 'all' | 'best';

export type GetPostsParams = {
  type?: PostSortType;
  limit?: number;
  cursor?: string;
  search?: string;
};

export const getPosts = (params: GetPostsParams, signal?: AbortSignal) =>
  request<PostPageDto>({ url: '/posts', params, signal });
