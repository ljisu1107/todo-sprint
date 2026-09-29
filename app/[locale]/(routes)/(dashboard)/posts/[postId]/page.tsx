import { notFound } from 'next/navigation';
import ClientSuspense from '@/components/boundaries/ClientSuspense';
import PostDetail from '@/components/posts/PostDetail';
import PostDetailErrorBoundary from '@/components/posts/PostDetailErrorBoundary';
import PostDetailSkeleton from '@/components/posts/PostDetailSkeleton';

export default async function PostDetailPage({
  params,
}: PageProps<'/[locale]/posts/[postId]'>) {
  const postId = Number((await params).postId);
  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white-section px-5 py-6 md:rounded-4xl md:p-10 lg:p-14">
      <PostDetailErrorBoundary>
        <ClientSuspense fallback={<PostDetailSkeleton />}>
          <PostDetail postId={postId} />
        </ClientSuspense>
      </PostDetailErrorBoundary>
    </div>
  );
}
