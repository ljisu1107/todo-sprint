'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * 테스트·Storybook 전용 Provider. 앱 Provider(#18)가 들어오기 전에도 화면을 검수하고,
 * 실패 상황을 바로 보려고 재시도를 끕니다. 제품 코드에서는 쓰지 않습니다.
 */
const QueryTestProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryTestProvider;
