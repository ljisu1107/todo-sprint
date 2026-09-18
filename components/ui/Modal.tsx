'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * 모달 껍데기. 오버레이 / 배치 / 카드 스타일만 담당하고 내용은 전부 children으로 받습니다.
 * 제목 행과 X 버튼은 ModalHeader가 그립니다.
 *
 * 모바일 배치가 variant마다 다릅니다.
 *   sm                 → 가운데 정렬 다이얼로그 (좌우 16 여백, 343px)
 *   md / lg / detail   → 화면 바닥에 붙는 바텀시트 (전체 폭, 위 모서리만 둥금)
 * 데스크톱에서는 넷 다 가운데 정렬입니다.
 */
const modalVariants = cva(
  [
    'fixed z-50 flex flex-col bg-white',
    'focus:outline-none',
    // 시안에 없는 부분: 내용이 화면보다 길어질 때를 위한 스크롤 처리
    'max-h-dvh overflow-y-auto md:max-h-[calc(100dvh-4rem)]',
  ],
  {
    variants: {
      size: {
        // popup, link_modal
        sm: [
          'top-1/2 left-1/2 -translate-1/2',
          'w-85.75 rounded-4xl p-4',
          'md:w-114 md:rounded-[2.5rem] md:p-8',
          'shadow-[0_0_1.875rem_0_rgba(0,0,0,0.05)]',
        ],
        // plugin_modal, setting modal
        md: [
          'inset-x-0 bottom-0 w-full rounded-t-4xl p-6',
          'md:top-1/2 md:right-auto md:bottom-auto md:left-1/2',
          'md:-translate-1/2',
          'md:w-114 md:rounded-[2.5rem] md:p-8',
          'shadow-[0_0_3.75rem_0_rgba(0,0,0,0.05)]',
        ],
        // TaskForm modal
        lg: [
          'inset-x-0 bottom-0 w-full rounded-t-4xl p-6',
          'md:top-1/2 md:right-auto md:bottom-auto md:left-1/2',
          'md:-translate-1/2',
          'md:w-122 md:rounded-[2.5rem] md:p-8',
          'shadow-[0_0_3.75rem_0_rgba(0,0,0,0.05)]',
        ],
        // Task modal — 혼자 여백이 8px 넓습니다 (시안 그대로)
        detail: [
          'inset-x-0 bottom-0 w-full rounded-t-4xl p-8',
          'md:top-1/2 md:right-auto md:bottom-auto md:left-1/2',
          'md:-translate-1/2',
          'md:w-114 md:rounded-[2.5rem] md:p-10',
          'shadow-[0_0_3.75rem_0_rgba(0,0,0,0.05)]',
        ],
      },
      /**
       * X 버튼을 그리는 스위치가 아니라 위쪽 여백만 정하는 값입니다.
       * X는 ModalHeader가 그립니다.
       *
       * 헤더가 없으면 위가 허전해져서 시안이 위 여백을 32px 더 줍니다.
       * 시안에서 헤더가 없는 모달은 popup(sm) 하나뿐입니다.
       */
      hasHeader: { true: '', false: '' },
    },
    compoundVariants: [
      { size: 'sm', hasHeader: false, class: 'pt-12 md:pt-16' },
      { size: 'md', hasHeader: false, class: 'pt-14 md:pt-16' },
      { size: 'lg', hasHeader: false, class: 'pt-14 md:pt-16' },
      { size: 'detail', hasHeader: false, class: 'pt-16 md:pt-18' },
    ],
    defaultVariants: { size: 'md', hasHeader: true },
  },
);

interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  /**
   * 스크린리더용 제목. hasHeader가 false일 때만 씁니다.
   * Radix는 Dialog.Title을 요구하는데 헤더가 없으면 보이는 제목이 없어서
   * 숨김 제목을 대신 넣습니다. 레이아웃에는 영향이 없습니다.
   */
  srTitle?: string;
}

const Modal = ({
  isOpen,
  onOpenChange,
  size,
  hasHeader = true,
  className,
  srTitle,
  children,
}: ModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(modalVariants({ size, hasHeader }), className)}
        >
          {!hasHeader && (
            <Dialog.Title className="sr-only">{srTitle}</Dialog.Title>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
