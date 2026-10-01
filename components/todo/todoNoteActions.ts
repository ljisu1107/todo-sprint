/**
 * 할 일 → 노트 연결 계약 (FN-TD-11, 12). 노트 담당과 연결 방식을 확정한 뒤 구현을 주입합니다.
 *
 * onViewNote   노트 상세를 Drawer(모바일 바텀시트)로 엽니다. 개별 페이지가 아니므로
 *              경로만으로는 연결되지 않고, 할 일 화면 위에 띄울 Drawer와 열림 상태를
 *              노트 쪽에서 제공해야 합니다. noteId는 noteIds[0]입니다.
 * onCreateNote 할 일 ID를 넘겨 노트 작성 화면을 엽니다.
 */
export interface TodoNoteActions {
  onViewNote: (noteId: number) => void;
  onCreateNote: (todoId: number) => void;
}
