import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { postQueries, type PostListParams } from '@/queries/posts';

const usePostList = (params: PostListParams) => {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(postQueries.list(params));

  return {
    posts: data.pages.flatMap((page) => page.posts),
    isEmpty: data.pages[0].totalCount === 0,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoadMoreError: isFetchNextPageError,
    loadMore: fetchNextPage,
  };
};

export default usePostList;
