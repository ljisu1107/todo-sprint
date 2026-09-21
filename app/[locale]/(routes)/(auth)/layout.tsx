import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      {/* S:.auth-layout: 인증 레이아웃 */}
      <div className="flex min-h-dvh flex-wrap items-center">
        <main className="mx-auto w-[clamp(12.5rem,88.27vw,25rem)]">
          {children}
        </main>
      </div>
      {/* E: .auth-layout: 인증 레이아웃 */}
    </div>
  );
}
