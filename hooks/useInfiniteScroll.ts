import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  /** false면 감시하지 않습니다. 요청 가능 여부는 호출부가 조합해서 넘깁니다. */
  enabled: boolean;
  /** 감시 요소가 화면에 들어왔을 때 실행할 동작 */
  onIntersect: () => void;
  /** 목록 끝에 닿기 전에 미리 실행할 여유 */
  rootMargin?: string;
}

/**
 * 목록 맨 끝에 둘 감시 요소의 ref를 돌려줍니다.
 * enabled일 때 요소가 보이면 onIntersect를 실행합니다.
 */
const useInfiniteScroll = <T extends Element>({
  enabled,
  onIntersect,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) => {
  const targetRef = useRef<T>(null);
  // 매 렌더마다 새로 만들어지는 콜백 때문에 observer를 다시 만들지 않도록 최신 값만 보관합니다.
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  });

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
};

export default useInfiniteScroll;
