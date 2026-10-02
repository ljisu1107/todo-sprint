'use client';

import useBestPosts from '@/hooks/post/useBestPosts';
import BestPostCard from './BestPostCard';

const BestPostList = () => {
  const { posts, isEmpty } = useBestPosts();

  if (isEmpty) {
    return null;
  }

  return (
    <section aria-label="인기 게시글">
      <ul className="flex gap-4 overflow-x-auto p-2 md:gap-6 lg:grid lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id} className="flex">
            <BestPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BestPostList;
