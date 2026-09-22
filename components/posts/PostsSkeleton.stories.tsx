import type { Meta, StoryObj } from '@storybook/nextjs';
import BestPostListSkeleton from './BestPostListSkeleton';
import PostListSkeleton from './PostListSkeleton';

const PostsSkeletonPreview = () => (
  <div className="flex flex-col gap-6 bg-background p-4 md:gap-10 md:p-6">
    <BestPostListSkeleton />
    <PostListSkeleton count={5} />
  </div>
);

const meta = {
  title: 'Posts/Skeleton',
  component: PostsSkeletonPreview,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PostsSkeletonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { name: '로딩' };
