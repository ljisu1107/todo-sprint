'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { postQueries } from '@/queries/posts';
import BestPostCard from './BestPostCard';

const BestPostList = () => {
  const { data } = useSuspenseQuery(postQueries.best());

  if (data.totalCount === 0) {
    return null;
  }

  return (
    <section aria-label="인기 게시글">
      <ul className="flex gap-4 overflow-x-auto p-2 md:gap-6 lg:grid lg:grid-cols-3">
        {data.posts.map((post) => (
          <li key={post.id} className="flex">
            <BestPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BestPostList;
