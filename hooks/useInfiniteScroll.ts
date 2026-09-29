import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  enabled: boolean;
  onIntersect: () => void;
}

const useInfiniteScroll = <T extends Element>({
  enabled,
  onIntersect,
}: UseInfiniteScrollOptions) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || !enabled) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return ref;
};

export default useInfiniteScroll;
