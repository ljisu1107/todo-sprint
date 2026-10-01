export interface WriterDto {
  id: number;
  name: string;
  image: string | null;
}

export interface PostDto {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  content: string;
  image: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  writer: WriterDto;
  commentCount: number;
}

export interface PostPageDto {
  posts: PostDto[];
  nextCursor: string | null;
  totalCount: number;
}
