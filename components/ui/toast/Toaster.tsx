'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ExternalToast,
} from 'sonner';
import Toast, { type ToastProps, type ToastVariant } from './Toast';

// sonner는 --width를 inline style로 고정하므로, 반응형 값은 --toast-width로 넘깁니다.
// 600px 이하에서는 sonner가 좌우 mobileOffset만 남기고 꽉 채웁니다.
export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={{ bottom: '1.875rem' }}
      mobileOffset="1rem"
      className="[--toast-width:36rem] lg:[--toast-width:43rem]"
      style={{ '--width': 'var(--toast-width)' } as CSSProperties}
      toastOptions={{ unstyled: true, className: 'w-(--width)' }}
    />
  );
}

export type ToastOptions = Omit<ExternalToast, 'icon'> &
  Pick<ToastProps, 'icon' | 'meta'> & {
    /** 닫기 버튼을 표시합니다. duration: Infinity인 토스트에는 켜 주세요. */
    closable?: boolean;
  };

function show(
  variant: ToastVariant,
  content: ReactNode,
  { icon, meta, closable, ...options }: ToastOptions = {},
) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        variant={variant}
        icon={icon}
        meta={meta}
        onClose={closable ? () => sonnerToast.dismiss(id) : undefined}
      >
        {content}
      </Toast>
    ),
    options,
  );
}

/**
 * 앱 전역 토스트 API. 내용은 ReactNode로 자유롭게 구성합니다.
 * 같은 id를 넘기면 기존 토스트를 교체합니다.
 */
export const toast = {
  success: (content: ReactNode, options?: ToastOptions) =>
    show('success', content, options),
  error: (content: ReactNode, options?: ToastOptions) =>
    show('error', content, options),
  dismiss: sonnerToast.dismiss,
};
