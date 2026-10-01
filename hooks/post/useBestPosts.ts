import { useSuspenseQuery } from '@tanstack/react-query';
import { postQueries } from '@/queries/post';

const useBestPosts = () => {
  const { data } = useSuspenseQuery(postQueries.best());

  return {
    posts: data.posts,
    isEmpty: data.totalCount === 0,
  };
};

export default useBestPosts;
