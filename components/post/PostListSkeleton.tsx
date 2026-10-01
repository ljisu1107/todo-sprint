interface PostListSkeletonProps {
  count: number;
}

const PostListSkeleton = ({ count }: PostListSkeletonProps) => (
  <ul aria-hidden className="animate-pulse">
    {Array.from({ length: count }, (_, index) => (
      <li
        key={index}
        className="flex items-center gap-6 border-b border-subtle px-2 py-6 md:gap-8 md:px-4 md:py-10"
      >
        <div className="flex flex-1 flex-col gap-3 md:gap-6.5">
          <div className="flex flex-col gap-1 md:gap-4">
            <div className="h-5 w-3/5 rounded-md bg-muted/20 md:h-7.5" />
            <div className="h-5 w-full rounded-md bg-muted/20 md:h-12" />
          </div>
          <div className="h-4 w-40 rounded-md bg-muted/20 md:h-6" />
        </div>
        <div className="size-18 shrink-0 rounded-xl bg-muted/20 md:size-30 md:rounded-2xl" />
      </li>
    ))}
  </ul>
);

export default PostListSkeleton;
