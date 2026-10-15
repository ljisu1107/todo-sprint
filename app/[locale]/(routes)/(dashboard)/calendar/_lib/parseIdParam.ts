const ID_PATTERN = /^\d+$/;

/** URL의 id 값(goalId, todoId)을 숫자로 바꿉니다. 0 이상의 정수가 아니면 null입니다. */
export const parseIdParam = (value: string | null) =>
  value !== null && ID_PATTERN.test(value) ? Number(value) : null;
