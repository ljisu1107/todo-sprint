import Image from 'next/image';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

type SocialLoginButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children'
> & {
  provider: 'google' | 'kakao';
};

export default function SocialLoginButton({
  provider,
  type = 'button',
  className,
  ...props
}: SocialLoginButtonProps) {
  return (
    <button
      type={type}
      aria-label={provider === 'google' ? '구글로 로그인' : '카카오로 로그인'}
      className={cn(
        'inline-flex size-14 shrink-0 items-center justify-center rounded-[999px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF6C00] disabled:cursor-not-allowed',
        provider === 'google'
          ? 'border border-[#ddd] bg-white'
          : 'bg-[#ffee01]',
        className,
      )}
      {...props}
    >
      <Image src={`/icons/${provider}.svg`} alt="" width={24} height={24} />
    </button>
  );
}
