'use client';

import { RadioGroup } from 'radix-ui';

import { cn } from '@/lib/utils';

interface SettingOption<T extends string> {
  value: T;
  label: string;
}

interface SettingOptionGroupProps<T extends string> {
  /** 스크린리더가 읽을 묶음 이름 (예: "언어") */
  label: string;
  options: SettingOption<T>[];
  value: T | undefined;
  onValueChange: (value: T) => void;
  disabled?: boolean;
}

/** 설정 팝업에서 여러 옵션 중 하나를 고르는 버튼 묶음 */
export default function SettingOptionGroup<T extends string>({
  label,
  options,
  value,
  onValueChange,
  disabled,
}: SettingOptionGroupProps<T>) {
  return (
    <RadioGroup.Root
      aria-label={label}
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      disabled={disabled}
      className="flex gap-2"
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'h-11 flex-1 cursor-pointer rounded-xl border border-subtle text-sm font-medium text-foreground',
            'data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-menu-background data-[state=checked]:text-orange-menu-active',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {option.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
