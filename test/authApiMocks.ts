import {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from 'axios';

import { api } from '@/lib/api/client-fetcher';

/** 인증 폼 테스트용 가짜 adapter. status가 2xx가 아니면 HTTP 에러로 응답합니다. */
export const replyToAuthRequest = (status: number) => {
  const sent: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    sent.push(config);
    const response = {
      data:
        status < 300
          ? { user: { id: 1, email: 'a@b.co', name: '홍길동', image: null } }
          : { message: 'failed', code: 'FAILED' },
      status,
      statusText: '',
      headers: {},
      config,
    };
    if (status >= 300) {
      throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, response);
    }
    return response;
  };
  api.defaults.adapter = adapter;
  return sent;
};
