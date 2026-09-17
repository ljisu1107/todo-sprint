import type { ComponentPropsWithRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import ButtonIcon from './ButtonIcon';

const styles = cva(
  'inline-flex size-35 shrink-0 flex-col items-center justify-center gap-3 rounded-4xl border border-solid text-lg/normal font-semibold tracking-[-0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF6C00] disabled:cursor-not-allowed motion-reduce:transition-none',
  {
    variants: {
      variant: {
        goal: 'border-transparent bg-[#ff8442] text-white enabled:hover:bg-[#ef6c00]',
        task: 'border-[#ffd19b] bg-white text-[#ff8442] enabled:hover:border-[#ff8442] enabled:hover:text-[#ef6c00]',
      },
    },
  },
);

type ActionButtonProps = ComponentPropsWithRef<'button'> & {
  variant: 'goal' | 'task';
};

export default function ActionButton({
  variant,
  children,
  type = 'button',
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles({ variant }), className)}
      {...props}
    >
      <span
        className="flex size-10 items-center justify-center"
        aria-hidden="true"
      >
        <ButtonIcon
          name={variant === 'goal' ? 'flag' : 'task'}
          className={variant === 'goal' ? 'size-10' : 'size-8'}
        />
      </span>
      <span>{children ?? (variant === 'goal' ? '새 목표' : '새 할일')}</span>
    </button>
  );
}
