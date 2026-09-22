const BEST_POST_COUNT = 3;

const BestPostListSkeleton = () => (
  <ul
    aria-hidden
    className="flex animate-pulse gap-4 overflow-x-auto p-2 md:gap-6 lg:grid lg:grid-cols-3"
  >
    {Array.from({ length: BEST_POST_COUNT }, (_, index) => (
      <li
        key={index}
        className="flex w-65 shrink-0 flex-col gap-4 rounded-3xl bg-white-section px-6 py-4 shadow-md md:w-96 md:rounded-4xl md:p-8 lg:w-full"
      >
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="h-6 w-4/5 rounded-md bg-muted/20 md:h-7.5" />
          <div className="size-25 rounded-2xl bg-muted/20" />
        </div>
        <div className="h-4 w-3/5 rounded-md bg-muted/20 md:h-6" />
      </li>
    ))}
  </ul>
);

export default BestPostListSkeleton;
