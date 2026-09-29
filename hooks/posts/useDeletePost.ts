import { useMutation } from '@tanstack/react-query';
import { postMutations } from '@/queries/posts';

const useDeletePost = () => {
  const { mutate, isPending } = useMutation(postMutations.delete());

  return { deletePost: mutate, isDeleting: isPending };
};

export default useDeletePost;
