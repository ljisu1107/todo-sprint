import { z } from 'zod';
import { request } from './client-fetcher';

const Writer = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().nullable(),
});

const Post = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  viewCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  writer: Writer,
  commentCount: z.number(),
});

const PostPage = z.object({
  posts: z.array(Post),
  nextCursor: z.string().nullable(),
  totalCount: z.number(),
});

export type Post = z.infer<typeof Post>;
export type PostPage = z.infer<typeof PostPage>;

export type PostSortType = 'all' | 'best';

export type GetPostsParams = {
  type?: PostSortType;
  limit?: number;
  cursor?: string;
  search?: string;
};

export const getPosts = (params: GetPostsParams, signal?: AbortSignal) =>
  request(PostPage, { url: '/posts', params, signal });
