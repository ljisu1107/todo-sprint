import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it } from 'vitest';

import { api } from './client-fetcher';
import { getTodos } from './todos';

const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

const todo = {
  id: 1,
  teamId: 'team',
  userId: 1,
  goalId: null,
  title: '할 일',
  done: false,
  fileUrl: null,
  linkUrl: null,
  dueDate: null,
  createdAt: '2026-09-28T09:00:00.000Z',
  updatedAt: '2026-09-28T09:00:00.000Z',
  goal: null,
  noteIds: [],
  tags: [],
  isFavorite: false,
};

const replyWith = (data: unknown) => {
  const sent: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    sent.push(config);
    return { data, status: 200, statusText: '', headers: {}, config };
  };
  api.defaults.adapter = adapter;
  return sent;
};

describe('getTodos', () => {
  it('/todos로 정렬·개수·커서 파라미터를 보낸다', async () => {
    const sent = replyWith({ todos: [todo], nextCursor: 41, totalCount: 90 });

    const page = await getTodos({ sort: 'latest', limit: 40, cursor: 1 });

    expect(sent[0].url).toBe('/todos');
    expect(sent[0].params).toEqual({ sort: 'latest', limit: 40, cursor: 1 });
    expect(page.nextCursor).toBe(41);
    expect(page.totalCount).toBe(90);
  });

  it('필수 필드가 빠지면 parse 에러로 실패한다', async () => {
    const todoWithoutTitle: Partial<typeof todo> = { ...todo };
    delete todoWithoutTitle.title;
    replyWith({ todos: [todoWithoutTitle], nextCursor: null, totalCount: 1 });

    await expect(getTodos({ limit: 40 })).rejects.toMatchObject({
      kind: 'parse',
    });
  });
});
