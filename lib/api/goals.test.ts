import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it } from 'vitest';

import { api } from './client-fetcher';
import { getGoals } from './goals';

const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe('getGoals', () => {
  it('/goals로 개수·커서 파라미터를 보낸다', async () => {
    const sent: InternalAxiosRequestConfig[] = [];
    const adapter: AxiosAdapter = async (config) => {
      sent.push(config);
      return {
        data: { goals: [], nextCursor: 21, totalCount: 30 },
        status: 200,
        statusText: '',
        headers: {},
        config,
      };
    };
    api.defaults.adapter = adapter;

    const page = await getGoals({ limit: 20, cursor: 1 });

    expect(sent[0].url).toBe('/goals');
    expect(sent[0].params).toEqual({ limit: 20, cursor: 1 });
    expect(page.nextCursor).toBe(21);
  });
});
