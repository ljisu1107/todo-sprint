import { NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { withRouteErrorHandler } from '@/lib/server/route-handler';
import { clearSession, readRefreshToken } from '@/lib/server/session';

export const POST = withRouteErrorHandler(async () => {
  const current = await readRefreshToken();
  if (current) {
    // BE 호출 실패해도 클라이언트 로그아웃 진행
    await backend
      .post(
        '/auth/logout',
        { refreshToken: current },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .catch((error) => console.error('[BFF] logout', error));
  }
  await clearSession();
  return new NextResponse(null, { status: 204 });
});
