import 'server-only';
import { NextResponse } from 'next/server';
import z from 'zod';
import { toApiError } from '@/lib/api/errors';

// 약속된 에러 형식으로 변환 { message, code }
export function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ message, code }, { status });
}

export function withRouteErrorHandler<A extends unknown[]>(
  handler: (...args: A) => Promise<Response>,
) {
  return async (...args: A): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // 응답에는 원인을 담지 않으므로 서버 로그에만 남긴다
      console.error('[BFF]', error);
      if (error instanceof z.ZodError || error instanceof SyntaxError)
        return errorResponse(
          502,
          'UPSTREAM_BAD_RESPONSE',
          'Unexpected response from server',
        );
      if (toApiError(error).kind === 'network')
        return errorResponse(
          502,
          'UPSTREAM_UNREACHABLE',
          'Server is unreachable',
        );
      return errorResponse(500, 'INTERNAL_ERROR', 'Internal server error');
    }
  };
}
