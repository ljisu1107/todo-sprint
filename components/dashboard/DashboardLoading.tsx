type DashboardLoadingProps = {
  /** 조회하는 내용에 맞는 로딩 안내 문구입니다. */
  message: string;
};

/** 대시보드 카드에서 사용하는 로딩 표시와 안내 메시지입니다. */
export default function DashboardLoading({ message }: DashboardLoadingProps) {
  return (
    <div
      role="status"
      className="relative z-10 flex h-full items-center justify-center text-base font-semibold text-white"
    >
      <p className="text-center">
        <span
          aria-hidden="true"
          className="mx-auto mb-2 block size-6 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
        />
        <span className="block">{message}</span>
      </p>
    </div>
  );
}
