'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import ErrorRetry from '@/components/common/ErrorRetry';
import { postQueries, type PostListParams } from '@/queries/posts';
import PostListItem from './PostListItem';
import PostListSkeleton from './PostListSkeleton';

const NEXT_PAGE_SKELETON_COUNT = 2;

interface PostListProps {
  params: PostListParams;
}

const PostList = ({ params }: PostListProps) => {
  const {
    data,
    isFetchNextPageError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(postQueries.list(params));
  const sentinelRef = useRef<HTMLDivElement>(null);

  const shouldObserve =
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !shouldObserve) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shouldObserve, fetchNextPage]);

  if (data.pages[0].totalCount === 0) {
    return (
      <div className="flex flex-col items-center gap-2.5 py-60 md:gap-4.5">
        <Image
          src="/images/posts/img_empty.svg"
          alt=""
          width={130}
          height={140}
          className="w-20 md:w-32.5"
        />
        <p className="text-sm font-medium text-muted md:text-base">
          아직 등록된 게시물이 없어요.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="게시글 목록">
      <ul>
        {data.pages.flatMap((page) =>
          page.posts.map((post) => (
            <li key={post.id}>
              <PostListItem post={post} />
            </li>
          )),
        )}
      </ul>
      <div ref={sentinelRef} />
      {isFetchingNextPage && (
        <PostListSkeleton count={NEXT_PAGE_SKELETON_COUNT} />
      )}
      {isFetchNextPageError && (
        <ErrorRetry
          message="다음 게시글을 불러오지 못했어요."
          onRetry={() => fetchNextPage()}
        />
      )}
    </section>
  );
};

export default PostList;
