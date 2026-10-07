import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EditorTitleInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'maxLength'
> & {
  /** 현재 글자 수 (부모가 useWatch로 계산해서 넘김) */
  length: number;
  /** 최대 글자 수. 입력 제한과 카운터 표시에 같이 사용 */
  maxLength: number;
  /** 제목 앞 아이콘 (노트: 노트 아이콘 / 게시글: 없음) */
  icon?: ReactNode;
};

export default function EditorTitleInput({
  length,
  maxLength,
  icon,
  className,
  ...inputProps
}: EditorTitleInputProps) {
  return (
    <div className="mt-[1.4rem] flex flex-row flex-nowrap items-center">
      {icon}
      <input
        {...inputProps}
        maxLength={maxLength}
        className={cn(
          'w-full text-2xl font-semibold outline-none placeholder:text-[#BBBBBB]',
          icon && 'pl-3',
          className,
        )}
      />
      <span className="ml-auto shrink-0 text-xs">
        {length}/<span className="text-orange-600">{maxLength}</span>
      </span>
    </div>
  );
}
