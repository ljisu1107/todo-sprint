import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  /** 목록 끝에 닿기 전에 미리 불러올 여유 */
  rootMargin?: string;
}

/**
 * 목록 맨 끝에 둘 감시 요소의 ref를 돌려줍니다.
 * 요소가 보이면 다음 페이지를 요청하고, 다음 페이지가 없거나 요청 중이면 감시하지 않습니다.
 */
const useInfiniteScroll = <T extends Element>({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<T>(null);
  const shouldObserve = hasNextPage && !isFetchingNextPage;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !shouldObserve) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shouldObserve, fetchNextPage, rootMargin]);

  return sentinelRef;
};

export default useInfiniteScroll;
