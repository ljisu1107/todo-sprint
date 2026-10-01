import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PostListItem, { type PostListItemData } from './PostListItem';

afterEach(cleanup);

const post: PostListItemData = {
  title: '디지털 정리의 날',
  content: '오래된 할 일들을 정리했어요.',
  image: null,
  writer: { id: 1, name: '체다치즈', image: null },
  createdAt: '2026-02-16T09:00:00.000Z',
  viewCount: 6,
  commentCount: 28,
};

const thumbnail = () => screen.queryByAltText(`${post.title} 첨부 이미지`);

describe('PostListItem', () => {
  it('이미지가 없으면 썸네일을 표시하지 않는다', () => {
    render(<PostListItem post={post} />);
    expect(thumbnail()).toBeNull();
  });

  it('이미지가 있으면 썸네일을 표시한다', () => {
    render(
      <PostListItem post={{ ...post, image: 'https://cdn.test/a.png' }} />,
    );
    expect(thumbnail()).toBeInTheDocument();
  });
});
