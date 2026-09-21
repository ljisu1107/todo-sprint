import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import Toaster from '@/components/ui/toast/Toaster';
import '@/styles/globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Todo Sprint',
  description: '할 일을 관리하는 Todo Sprint',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        {/* 버전을 고정한 가변 다이나믹 서브셋: 필요한 글자 묶음만 다운로드합니다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
