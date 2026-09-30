import { useMutation } from '@tanstack/react-query';
import { commentMutations } from '@/queries/comments';

const useDeleteComment = (postId: number) => {
  const { mutate, isPending } = useMutation(commentMutations.delete(postId));

  return { deleteComment: mutate, isDeleting: isPending };
};

export default useDeleteComment;
