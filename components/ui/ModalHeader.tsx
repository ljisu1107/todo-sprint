'use client';

import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import IcDelete from '@/components/ui/icons/IcDelete';

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * 모달 상단의 제목 + 우상단 X 한 줄. Modal 안에서만 씁니다.
 *
 * children이 곧 제목이라 뱃지 같은 걸 같이 넣어도 됩니다.
 *   <ModalHeader>할 일 상세 <Chips>TO DO</Chips></ModalHeader>
 *
 * justify-between이라 제목이 길어지면 X를 밀어낼 뿐 겹치지 않습니다.
 */
const ModalHeader = ({ children, className }: ModalHeaderProps) => {
  return (
    <div className={cn('flex w-full items-center justify-between', className)}>
      <Dialog.Title className="flex items-center gap-2 text-xl/7.5 font-semibold tracking-[-0.03em] text-grayscale-800">
        {children}
      </Dialog.Title>
      <Dialog.Close
        aria-label="닫기"
        className="shrink-0 text-grayscale-400 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <IcDelete className="size-6" />
      </Dialog.Close>
    </div>
  );
};

export default ModalHeader;
