import { QueryClient, environmentManager } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR로 받아온 데이터를 클라이언트에서 곧바로 다시 요청하지 않도록
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // 서버: 요청마다 항상 새로 만든다 → 사용자끼리 캐시 공유 X
    return makeQueryClient();
  }
  // 브라우저: 없을 때만 한 번 만들고, 이후엔 재사용
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
