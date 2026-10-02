import type { AxiosAdapter } from 'axios';

import { api } from '@/lib/api/client-fetcher';
import type { TodoDto, TodoPageDto } from '@/types/api/todo';

const TITLES = [
  '사용자 데이터 렌더링 구현',
  '자바스크립트 기초 챕터4 듣기',
  '개발 폴더 구조 세팅 (src, public, components)',
  '실제 디자인 시스템 사례 조사 (예: Polaris, Carbon 등)',
  '로그인/회원가입 폼 만들기',
];

export const makeTodo = (
  id: number,
  overrides: Partial<TodoDto> = {},
): TodoDto => ({
  id,
  teamId: 'team',
  userId: 1,
  goalId: null,
  title: TITLES[(id - 1) % TITLES.length],
  done: id % 3 === 0,
  fileUrl: null,
  linkUrl: id % 2 === 0 ? 'https://example.com' : null,
  dueDate: null,
  createdAt: '2026-09-28T09:00:00.000Z',
  updatedAt: '2026-09-28T09:00:00.000Z',
  goal: null,
  noteIds: id % 4 === 0 ? [id] : [],
  tags: [],
  isFavorite: id % 5 === 0,
  ...overrides,
});

interface MockTodosApiOptions {
  /** ALL 기준 전체 개수. id가 3의 배수인 할 일이 완료 상태입니다. */
  totalCount: number;
  /** false면 완료된 할 일이 없어 DONE 탭이 비어 있습니다. */
  hasDone?: boolean;
  /** 몇 번째 요청(0부터)을 실패시킬지 */
  failAt?: number;
  /** 응답을 보내지 않고 로딩 상태로 둡니다. */
  isPending?: boolean;
  delay?: number;
}

/**
 * axios adapter를 바꿔 GET /todos를 흉내 냅니다. done으로 거르고, cursor는 다음에 줄 할 일의 id입니다.
 * 브라우저 Network 탭에는 잡히지 않으므로 요청마다 콘솔에 [mock GET /todos]로 남깁니다.
 * 되돌리는 함수를 반환합니다.
 */
export const mockTodosApi = ({
  totalCount,
  hasDone = true,
  failAt,
  isPending = false,
  delay = 400,
}: MockTodosApiOptions) => {
  const originalAdapter = api.defaults.adapter;
  let requestCount = 0;
  const allTodos = Array.from({ length: totalCount }, (_, i) =>
    makeTodo(i + 1, hasDone ? {} : { done: false }),
  );

  const adapter: AxiosAdapter = async (config) => {
    const requestIndex = requestCount;
    requestCount += 1;
    const cursor: number = config.params?.cursor ?? 1;
    const done: string | undefined = config.params?.done;
    const label = `[mock GET /todos] 요청 #${requestIndex + 1} done=${done ?? '없음'} cursor=${config.params?.cursor ?? '없음'}`;

    if (isPending) {
      console.info(`${label} → 응답 없음(로딩 유지)`);
      return new Promise(() => {});
    }
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (requestIndex === failAt) {
      console.info(`${label} → 실패`);
      return Promise.reject(new Error('mock network error'));
    }

    const limit: number = config.params?.limit ?? 40;
    const filtered = done
      ? allTodos.filter((todo) => String(todo.done) === done)
      : allTodos;
    const start = filtered.findIndex((todo) => todo.id >= cursor);
    const todos = start === -1 ? [] : filtered.slice(start, start + limit);
    const data: TodoPageDto = {
      todos,
      nextCursor: start === -1 ? null : (filtered[start + limit]?.id ?? null),
      totalCount: filtered.length,
    };
    console.info(`${label} → ${todos.length}개, nextCursor=${data.nextCursor}`);
    return { data, status: 200, statusText: '', headers: {}, config };
  };

  api.defaults.adapter = adapter;
  return () => {
    api.defaults.adapter = originalAdapter;
  };
};
