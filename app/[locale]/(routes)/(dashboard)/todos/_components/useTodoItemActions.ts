import type { TodoNoteActions } from '@/components/todo/todoNoteActions';

const notConnected = () => {};

/**
 * TodoItem에 넘길 콜백 묶음.
 * 완료·찜 토글, 링크 복사(FN-TD-06, 07, 14)와 상세 열기(FN-TD-13)는 다음 단계에서,
 * 노트 보기·작성(FN-TD-11, 12)은 노트 담당과 연결 방식을 확정한 뒤 연결합니다.
 */
const useTodoItemActions = (noteActions?: TodoNoteActions) => ({
  onToggleDone: notConnected,
  onToggleFavorite: notConnected,
  onOpenDetail: notConnected,
  onCopyLink: notConnected,
  onViewNote: noteActions?.onViewNote ?? notConnected,
  onCreateNote: noteActions?.onCreateNote ?? notConnected,
});

export default useTodoItemActions;
