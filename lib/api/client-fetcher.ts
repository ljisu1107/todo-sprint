import axios, { AxiosRequestConfig } from 'axios';
import { ApiError, toApiError } from './errors';
import z from 'zod';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

//
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Single-flight: 동시에 발생한 401들이 하나의 refresh를 공유한다.
// 백엔드가 refresh 토큰을 rotate하므로, 이미 쓴 토큰을 재사용하면 모든 세션이 만료된다.
// 같은 탭에서 요청들은 refreshing을 공유하여 한 곳에서 refresh 요청 진행 중이면 다른 요청들은 추가 refresh 요청하지 않고 대기한다
let refreshing: Promise<unknown> | null = null;

function refreshSession() {
  refreshing ??= api.post('/auth/refresh').finally(() => {
    refreshing = null;
  });
  return refreshing;
}

api.interceptors.response.use(undefined, async (error) => {
  if (!axios.isAxiosError(error)) return Promise.reject(error);
  const config = error.config;
  // /auth/* 401은 retry하지 않는다
  const isAuthCall = config?.url?.startsWith('/auth/') ?? false;
  const isNotUnauthorized = error.response?.status !== 401;
  const hasRetried = config?._retry;

  if (isNotUnauthorized || !config || hasRetried || isAuthCall) {
    return Promise.reject(error);
  }
  config._retry = true;
  await refreshSession();
  return api.request(config);
});

api.interceptors.response.use(undefined, (error) =>
  Promise.reject(toApiError(error)),
);

export async function request<T>(
  schema: z.ZodType<T>,
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await api.request(config);
  const parsedResponse = schema.safeParse(response.data);
  if (!parsedResponse.success)
    throw new ApiError('parse', 'Unexpected response shape', {
      cause: parsedResponse.error,
    });
  return parsedResponse.data;
}

export async function requestVoid(config: AxiosRequestConfig) {
  await api.request(config);
}
