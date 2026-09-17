import { AxiosError, type AxiosAdapter } from 'axios';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { api, request } from './client';
import { ApiError } from './errors';

const reply =
  (status: number, data: unknown): AxiosAdapter =>
  async (config) => {
    const response = {
      data,
      status,
      statusText: '',
      headers: {},
      config,
      request: {},
    };
    if (status >= 200 && status < 300) return response;
    const code =
      status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
    throw new AxiosError(
      `Request failed with status code ${status}`,
      code,
      config,
      {},
      response,
    );
  };

const fail =
  (code: string): AxiosAdapter =>
  async (config) => {
    throw new AxiosError('boom', code, config, {});
  };

async function caught(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    return error as ApiError;
  }
  throw new Error('expected the request to fail');
}

describe('api 클라이언트: 모든 요청 실패를 ApiError로 통일한다', () => {
  it('에러 body가 스펙 형태이면 code와 message를 가져온다', async () => {
    const error = await caught(
      api.get('/todos', {
        adapter: reply(401, {
          code: 'TOKEN_INVALID',
          message: 'Invalid or expired token',
        }),
      }),
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      kind: 'http',
      status: 401,
      code: 'TOKEN_INVALID',
      message: 'Invalid or expired token',
    });
  });

  it('에러 body가 스펙 형태가 아닌 http 에러도 분류한다', async () => {
    const error = await caught(
      api.get('/todos', { adapter: reply(502, '<html>Bad Gateway</html>') }),
    );
    expect(error).toMatchObject({ kind: 'http', status: 502, code: undefined });
  });

  it('응답이 없으면 network로 분류한다', async () => {
    const error = await caught(
      api.get('/todos', { adapter: fail(AxiosError.ERR_NETWORK) }),
    );
    expect(error).toMatchObject({ kind: 'network', status: undefined });
  });

  it('타임아웃을 분류한다', async () => {
    const error = await caught(
      api.get('/todos', { adapter: fail(AxiosError.ECONNABORTED) }),
    );
    expect(error.kind).toBe('timeout');
  });

  it('중단된 요청을 canceled로 분류한다', async () => {
    const controller = new AbortController();
    controller.abort();
    const error = await caught(
      api.get('/todos', { signal: controller.signal, adapter: reply(200, []) }),
    );
    expect(error.kind).toBe('canceled');
  });
});

describe('request 함수', () => {
  const Todo = z.object({
    id: z.number(),
    title: z.string(),
    done: z.boolean(),
  });

  it('스펙과 일치하면 파싱된 데이터를 반환한다', async () => {
    const data = await request(Todo, {
      url: '/todos/1',
      adapter: reply(200, { id: 1, title: 'ship api layer', done: false }),
    });
    expect(data).toEqual({ id: 1, title: 'ship api layer', done: false });
  });

  it('형식이 잘못된 2xx 응답을 parse ApiError로 바꾼다', async () => {
    const error = await caught(
      request(Todo, {
        url: '/todos/1',
        adapter: reply(200, { id: '1', title: null }),
      }),
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe('parse');
  });

  it('전송 계층 에러는 그대로 전달한다', async () => {
    const error = await caught(
      request(Todo, {
        url: '/todos/1',
        adapter: reply(404, { code: 'NOT_FOUND', message: 'nope' }),
      }),
    );
    expect(error).toMatchObject({
      kind: 'http',
      status: 404,
      code: 'NOT_FOUND',
    });
  });
});
