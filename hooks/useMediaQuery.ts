import { useCallback, useSyncExternalStore } from 'react';

/**
 * 미디어 쿼리 일치 여부. 서버 렌더에서는 false로 시작하고 하이드레이션 후 실제 값으로 바뀝니다.
 *   const isTablet = useMediaQuery('(min-width: 46.5rem)');
 */
const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};

export default useMediaQuery;
