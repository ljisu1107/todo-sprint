import type { ReactNode } from 'react';
import Gnb from '@/components/common/Gnb';
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background font-sans text-base font-normal text-foreground">
      <div className="relative min-h-dvh">
        {/* 디자인 확인용: true로 세 위치의 알림 배지를 함께 표시합니다.
            props를 생략한 <Gnb />의 기본값은 false입니다.
            개발 연동 시 이 고정값을 제거하고, Gnb 내부의 알림 연동 주석을 따라주세요.
            이 layout은 서버 컴포넌트이므로 클라이언트 훅이나 클릭 함수를 여기에 추가하지 않습니다.
            Gnb 또는 별도 클라이언트 부모에서 공통 알림 로직을 연결합니다. */}
        <Gnb hasNotification={true} />
        <main className="min-w-0 motion-reduce:transition-none md:ml-15 lg:ml-90.5 lg:transition-[margin-left] lg:duration-400 lg:ease-out lg:peer-data-[open=true]/gnb:ml-24">
          <div className="px-4 pt-8 pb-4 md:p-[3rem_1.5rem_4rem] lg:p-[5rem_1.5rem_6.25rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
