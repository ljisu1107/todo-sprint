import type { ReactNode } from 'react';

interface EditorPageLayoutProps {
  /** 페이지 제목 (노트 작성하기, 게시물 작성하기 등) */
  heading: string;
  /** 제목 오른쪽 버튼 영역 (임시저장·취소·등록하기 등) */
  actions: ReactNode;
  /** 흰 카드 안에 들어갈 에디터 영역 */
  children: ReactNode;
}

/** 에디터 작성 화면의 공통 틀: 제목·버튼 줄과 흰 카드 */
export default function EditorPageLayout({
  heading,
  actions,
  children,
}: EditorPageLayoutProps) {
  return (
    <div className="mx-auto my-0 max-w-3xl items-center bg-grayscale-100">
      <div className="mb-[1.4rem] flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">{heading}</h2>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="gap-2.5 rounded-4xl bg-white px-8.5 py-8">{children}</div>
    </div>
  );
}
