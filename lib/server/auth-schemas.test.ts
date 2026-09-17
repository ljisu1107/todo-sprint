import { describe, expect, it } from 'vitest';
import { cookiesToWrite } from './auth-schemas';

describe('grace period', () => {
  it('null이면 access 쿠키만 쓴다', () => {
    const update = cookiesToWrite({ accessToken: 'a2', refreshToken: null });
    expect(update).toStrictEqual({ accessToken: 'a2' });
  });
});
