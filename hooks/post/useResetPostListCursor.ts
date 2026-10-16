import { useQueryClient } from '@tanstack/react-query';
import {
  keepFirstPage,
  postQueries,
  type PostListParams,
} from '@/queries/post';

const useResetPostListCursor = () => {
  const queryClient = useQueryClient();

  const resetCursor = (params: PostListParams) =>
    queryClient.setQueryData(postQueries.list(params).queryKey, keepFirstPage);

  return { resetCursor };
};

export default useResetPostListCursor;
