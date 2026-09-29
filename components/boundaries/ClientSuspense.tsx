'use client';

import { Suspense, useSyncExternalStore, type ReactNode } from 'react';

interface ClientSuspenseProps {
  fallback: ReactNode;
  children: ReactNode;
}

const subscribe = () => () => {};

// API 요청은 브라우저의 BFF(/api)와 세션 쿠키가 있어야 하므로,
// 서버 렌더링에서는 fallback만 그리고 요청은 하이드레이션 이후에 시작합니다.
const ClientSuspense = ({ fallback, children }: ClientSuspenseProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return fallback;
  }
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default ClientSuspense;
