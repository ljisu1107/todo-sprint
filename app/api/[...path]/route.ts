import type { NextRequest } from 'next/server';
import { backend, bearer, passthrough } from '@/lib/server/backend';
import {
  errorResponse,
  withRouteErrorHandler,
} from '@/lib/server/route-handler';
import { readAccessToken } from '@/lib/server/session';

const FORWARDABLE = new Set([
  'goals',
  'todos',
  'notes',
  'notifications',
  'users',
  'posts',
  'images',
  'files',
]);

type Context = { params: Promise<{ path: string[] }> };

const forward = withRouteErrorHandler(
  async (request: NextRequest, context: Context) => {
    const { path } = await context.params;
    if (!FORWARDABLE.has(path[0]))
      return errorResponse(404, 'NOT_FOUND', 'Not found');

    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    const res = await backend.request({
      url: `/${path.join('/')}${request.nextUrl.search}`,
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...bearer(await readAccessToken()),
      },
      data: hasBody ? await request.text() : undefined,
    });
    // 클라이언트 interceptor에서 refresh + API 재요청을 위해 401 에러는 그대로 전달
    return passthrough(res);
  },
);

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
