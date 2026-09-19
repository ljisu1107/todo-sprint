import type { ReactNode } from 'react';
import Gnb from '@/components/common/Gnb';
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background font-sans text-base font-normal text-foreground">
      <div className="relative min-h-dvh">
        <Gnb />
        <main className="min-w-0 motion-reduce:transition-none md:ml-15 lg:ml-90.5 lg:transition-[margin-left] lg:duration-400 lg:ease-out lg:peer-data-[open=true]/gnb:ml-24">
          <div className="px-4 pt-8 pb-4 md:p-[3rem_1.5rem_4rem] lg:p-[5rem_1.5rem_6.25rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
