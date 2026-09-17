import type { MouseEvent } from 'react';

/** 클릭 이벤트가 부모로 전파되지 않게 막고 핸들러를 실행합니다. */
export const stopPropagation = (fn: () => void) => (event: MouseEvent) => {
  event.stopPropagation();
  fn();
};
