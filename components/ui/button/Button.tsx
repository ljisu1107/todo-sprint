import type { ComponentPropsWithRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[999px] border border-solid leading-none font-semibold tracking-[-0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF6C00] disabled:cursor-not-allowed motion-reduce:transition-none',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-[#ff8442] text-white enabled:hover:bg-[#EF6C00] disabled:bg-[#bbb]',
        outline:
          'border-[#ff8442] bg-transparent text-[#EF6C00] enabled:hover:border-[#EF6C00] disabled:border-[#bbb] disabled:text-[#bbb]',
        neutral:
          'border-[#ccc] bg-transparent text-[#737373] enabled:hover:border-[#bbb] enabled:hover:text-[#535353] disabled:border-[#ccc] disabled:text-[#bbb]',
      },
      size: {
        // 아래 px 수치는 루트 글자 크기 16px 기준입니다.
        // PC / Mobile 동일
        sm: 'h-10 px-4 text-sm',

        // Mobile: 40px / 14px
        // PC: 48px / 16px
        md: 'h-10 px-6 text-sm md:h-12 md:text-base',

        // Mobile: 48px / 16px
        // PC: 56px / 18px
        lg: 'h-12 px-8 text-base md:h-14 md:text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonVariants>;

export default function Button({
  variant,
  size,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
