import { useTranslations } from 'next-intl';

import type { TodoNoteActions } from '@/components/todo/todoNoteActions';
import { toast } from '@/components/ui/toast/Toaster';
import {
  useToggleTodoDone,
  useToggleTodoFavorite,
} from '@/queries/todoMutations';

const notConnected = () => {};

/**
 * TodoItem에 넘길 콜백 묶음.
 * 상세 열기(FN-TD-13)는 상세 모달이 생기면, 노트 보기·작성(FN-TD-11, 12)은
 * 노트 담당과 연결 방식을 확정한 뒤 연결합니다.
 */
const useTodoItemActions = (noteActions?: TodoNoteActions) => {
  const t = useTranslations('Todo');
  const { mutate: toggleDone } = useToggleTodoDone();
  const { mutate: toggleFavorite } = useToggleTodoFavorite();

  const handleToggleDone = (todoId: number, done: boolean) => {
    toggleDone(
      { todoId, done },
      { onError: () => toast.error(t('toggleTodoDoneError')) },
    );
  };

  const handleToggleFavorite = (todoId: number, isFavorite: boolean) => {
    toggleFavorite(
      { todoId, isFavorite },
      { onError: () => toast.error(t('toggleFavoriteError')) },
    );
  };

  // FN-TD-14
  const handleCopyLink = async (linkUrl: string) => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success(t('linkCopied'));
    } catch {
      toast.error(t('copyLinkError'));
    }
  };

  return {
    onToggleDone: handleToggleDone,
    onToggleFavorite: handleToggleFavorite,
    onCopyLink: handleCopyLink,
    onOpenDetail: notConnected,
    onViewNote: noteActions?.onViewNote ?? notConnected,
    onCreateNote: noteActions?.onCreateNote ?? notConnected,
  };
};

export default useTodoItemActions;
