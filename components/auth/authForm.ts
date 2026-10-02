import type { FormEvent } from 'react';

/** onSubmit 연결 전에는 비밀번호가 URL로 나가지 않도록 기본 제출을 막습니다. */
export const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};
