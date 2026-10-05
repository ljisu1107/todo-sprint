import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it } from 'vitest';
import { login, signup } from './auth';
import { api } from './client-fetcher';

const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

const user = { id: 1, email: 'user@example.com', name: '홍길동', image: null };

const replyWith = (data: unknown) => {
  const sent: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    sent.push(config);
    return { data, status: 200, statusText: '', headers: {}, config };
  };
  api.defaults.adapter = adapter;
  return sent;
};

describe('auth endpoints', () => {
  it('login은 /auth/login으로 이메일·비밀번호를 POST한다', async () => {
    const sent = replyWith({ user });
    const body = { email: 'user@example.com', password: 'password123' };

    const result = await login(body);

    expect(sent[0].url).toBe('/auth/login');
    expect(sent[0].method).toBe('post');
    expect(JSON.parse(sent[0].data)).toEqual(body);
    expect(result.user).toEqual(user);
  });

  it('signup은 /auth/signup으로 이름·이메일·비밀번호를 POST한다', async () => {
    const sent = replyWith({ user });
    const body = {
      name: '홍길동',
      email: 'user@example.com',
      password: 'password123',
    };

    await signup(body);

    expect(sent[0].url).toBe('/auth/signup');
    expect(sent[0].method).toBe('post');
    expect(JSON.parse(sent[0].data)).toEqual(body);
  });
});
