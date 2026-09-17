import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthResult } from '@/lib/server/auth-schemas';
import { backend, isOk, parseOk, passthrough } from '@/lib/server/backend';
import { withRouteErrorHandler } from '@/lib/server/route-handler';
import { setSession } from '@/lib/server/session';

export const POST = withRouteErrorHandler(async (request: NextRequest) => {
  const res = await backend.post('/auth/signup', await request.text(), {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!isOk(res)) return passthrough(res);

  const { accessToken, refreshToken, user } = parseOk(AuthResult, res);
  await setSession({ accessToken, refreshToken });
  return NextResponse.json({ user }, { status: res.status });
});
