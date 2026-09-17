import { NextResponse } from 'next/server';
import { cookiesToWrite, RefreshResult } from '@/lib/server/auth-schemas';
import { backend, isOk, parseOk } from '@/lib/server/backend';
import {
  errorResponse,
  withRouteErrorHandler,
} from '@/lib/server/route-handler';
import {
  clearSession,
  readRefreshToken,
  setSession,
} from '@/lib/server/session';

export const POST = withRouteErrorHandler(async () => {
  const current = await readRefreshToken();
  if (!current) return errorResponse(401, 'TOKEN_INVALID', 'No session');

  const res = await backend.post(
    '/auth/refresh',
    { refreshToken: current },
    { headers: { 'Content-Type': 'application/json' } },
  );
  if (!isOk(res)) {
    await clearSession();
    return errorResponse(401, 'TOKEN_INVALID', 'Session expired');
  }

  await setSession(cookiesToWrite(parseOk(RefreshResult, res)));
  return new NextResponse(null, { status: 204 });
});
