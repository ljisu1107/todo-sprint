import type { ComponentPropsWithRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import ButtonIcon from './ButtonIcon';

const styles = cva(
  'relative inline-flex shrink-0 items-center justify-center rounded-[999px] border border-solid bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF6C00] disabled:cursor-not-allowed',
  {
    variants: {
      icon: {
        'chevron-up': 'size-6 border-[#dadada] text-[#a4a4a4]',
        'chevron-down': 'size-6 border-[#dadada] text-[#a4a4a4]',
        bell: 'size-16 border-[#ccc] text-[#737373]',
        close: 'size-6 border-[#ccc] text-[#a4a4a4]',
      },
    },
  },
);

type IconButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  'aria-label': string;
} & (
    | { icon: 'bell'; hasNotification?: boolean; size?: never }
    | { icon: 'close'; size?: 'sm' | 'md'; hasNotification?: never }
    | {
        icon: 'chevron-up' | 'chevron-down';
        size?: never;
        hasNotification?: never;
      }
  );

export default function IconButton({
  icon,
  size = 'md',
  hasNotification = false,
  type = 'button',
  className,
  'aria-label': label,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={hasNotification ? `${label} (새 알림 있음)` : label}
      className={cn(
        styles({ icon }),
        icon === 'close' && size === 'sm' && 'size-[13px]',
        className,
      )}
      {...props}
    >
      <ButtonIcon
        name={icon}
        className={
          icon === 'bell'
            ? 'h-[22px] w-5'
            : icon === 'close'
              ? size === 'sm'
                ? 'size-[11px]'
                : 'size-[18px]'
              : 'h-2 w-[14px]'
        }
      />
      {hasNotification && (
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 size-3 rounded-full bg-[#ff8442]"
        />
      )}
    </button>
  );
}
