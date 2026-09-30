import type { WriterDto } from './posts';

export interface CommentDto {
  id: number;
  teamId: string;
  userId: number;
  postId: number;
  parentId: number | null;
  content: string;
  likeCount: number;
  replyCount?: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  writer: WriterDto;
}

export interface CommentPageDto {
  comments: CommentDto[];
  nextCursor: string | null;
  totalCount: number;
}

export interface CreateCommentBodyDto {
  content: string;
}
