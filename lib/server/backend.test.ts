// @vitest-environment node
import { AxiosError, CanceledError, type AxiosAdapter } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { backend, passthrough } from './backend';
import { withRouteErrorHandler } from './route-handler';

const reply =
  (
    status: number,
    data: string,
    contentType = 'application/json',
  ): AxiosAdapter =>
  async (config) => {
    const response = {
      data,
      status,
      statusText: '',
      headers: { 'content-type': contentType },
      config,
      request: {},
    };
    // Real adapters reject when validateStatus says no; mimic that.
    if (config.validateStatus && !config.validateStatus(status))
      throw new AxiosError(
        `Request failed with status code ${status}`,
        AxiosError.ERR_BAD_REQUEST,
        config,
        {},
        response,
      );
    return response;
  };

describe('backend 인스턴스', () => {
  it('4xx 응답을 throw하지 않고 status와 body를 그대로 전달한다', async () => {
    const body = '{"message":"invalid","code":"VALIDATION_ERROR"}';
    const res = await backend.get('/todos', { adapter: reply(422, body) });
    const forwarded = passthrough(res);

    expect(forwarded.status).toBe(422);
    expect(forwarded.headers.get('content-type')).toBe('application/json');
    expect(await forwarded.text()).toBe(body);
  });
});

describe('withRouteErrorHandler', () => {
  it('backend에 닿지 못하면 502 에러 body를 반환한다', async () => {
    const handler = withRouteErrorHandler(() =>
      backend
        .get('/todos', {
          adapter: async (config) => {
            throw new AxiosError('down', AxiosError.ERR_NETWORK, config, {});
          },
        })
        .then(passthrough),
    );

    const res = await handler();
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      message: 'Server is unreachable',
      code: 'UPSTREAM_UNREACHABLE',
    });
  });

  it('backend 응답이 timeout되면 504 에러 body를 반환한다', async () => {
    const handler = withRouteErrorHandler(() =>
      backend
        .get('/todos', {
          adapter: async (config) => {
            throw new AxiosError(
              'timeout of 15000ms exceeded',
              AxiosError.ECONNABORTED,
              config,
              {},
            );
          },
        })
        .then(passthrough),
    );

    const res = await handler();
    expect(res.status).toBe(504);
    expect(await res.json()).toEqual({
      message: 'Server took too long to respond',
      code: 'UPSTREAM_TIMEOUT',
    });
  });

  it('클라이언트가 취소하면 로그 없이 499를 반환한다', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const handler = withRouteErrorHandler(() =>
      backend
        .get('/todos', {
          adapter: async () => {
            throw new CanceledError();
          },
        })
        .then(passthrough),
    );

    const res = await handler();
    expect(res.status).toBe(499);
    expect(logged).not.toHaveBeenCalled();
    logged.mockRestore();
  });
});
