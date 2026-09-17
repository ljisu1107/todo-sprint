import z from 'zod';

export const AuthResult = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.unknown(),
});
export type AuthResult = z.infer<typeof AuthResult>;

export const RefreshResult = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
});
export type RefreshResult = z.infer<typeof RefreshResult>;

export type SessionCookies = { accessToken: string; refreshToken?: string };

// 서버 grace period 정책 적용: refreshToken: null을 받으면 cookie에 refreshToken을 작성하지 않는다 (최신화하지 않는다. 이미 최신화되어 있으니까)
export function cookiesToWrite(result: RefreshResult): SessionCookies {
  return result.refreshToken === null
    ? { accessToken: result.accessToken }
    : { accessToken: result.accessToken, refreshToken: result.refreshToken };
}
