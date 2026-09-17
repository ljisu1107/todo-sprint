'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { MouseEvent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  IconCheckboxActive,
  IconCheckboxInactive,
  IconKebab,
  IconLink,
  IconNoteView,
  IconNoteWrite,
  IconStarFilled,
  IconStarOutline,
} from '@/components/icons';
import type { Todo } from '@/types/todo';

/**
 * 피그마 todo_list 컴포넌트(node 4:9638)의 size 변형을 따릅니다.
 * large: 1920 / 744 (높이 44px), small: 375 (높이 36px)
 * 색상 hex는 globals.css의 @theme 토큰이 정의되면 토큰 클래스로 교체합니다.
 */
const itemVariants = cva('flex w-full items-center', {
  variants: {
    size: {
      large: 'gap-2 px-2 py-2.5',
      small: 'gap-1.5 px-1 py-1.5',
    },
  },
  defaultVariants: { size: 'large' },
});

const titleVariants = cva(
  'min-w-0 flex-1 truncate text-left tracking-[-0.03em]',
  {
    variants: {
      size: {
        large: 'text-[16px] leading-[24px]',
        small: 'text-[14px] leading-[20px]',
      },
      done: {
        true: 'text-[#737373]',
        false: 'text-[#262626]',
      },
    },
    defaultVariants: { size: 'large', done: false },
  },
);

const iconGroupVariants = cva('flex h-6 shrink-0 items-center', {
  variants: {
    size: {
      large: 'gap-2',
      small: 'gap-1.5',
    },
  },
  defaultVariants: { size: 'large' },
});

export type TodoItemProps = VariantProps<typeof itemVariants> & {
  todo: Todo;
  /** 완료 토글 (FN-TD-06). API 호출과 롤백은 페이지가 담당합니다. */
  onToggleDone: (id: number, next: boolean) => void;
  /** 찜 토글 (FN-TD-07) */
  onToggleFavorite: (id: number, next: boolean) => void;
  /** 아이템 클릭 시 상세 열기 (FN-TD-13) */
  onOpenDetail: (id: number) => void;
  /** 링크 복사 (FN-TD-14) */
  onCopyLink: (linkUrl: string) => void;
  /** 노트 보기 (FN-TD-11) */
  onViewNote: (noteId: number) => void;
  /** 노트 작성 진입 (FN-TD-12) */
  onCreateNote: (id: number) => void;
  /** 케밥 드롭다운 (FN-TD-09). 메뉴 항목이 페이지마다 달라 주입받습니다. */
  kebabSlot?: ReactNode;
  className?: string;
};

export default function TodoItem({
  todo,
  size = 'large',
  onToggleDone,
  onToggleFavorite,
  onOpenDetail,
  onCopyLink,
  onViewNote,
  onCreateNote,
  kebabSlot,
  className,
}: TodoItemProps) {
  const hasNote = todo.noteIds.length > 0;
  const { linkUrl } = todo;

  /** 아이콘 클릭이 상세 열기로 전파되지 않도록 막습니다 (FN-TD-13). */
  const stop = (fn: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    fn();
  };

  return (
    <li
      onClick={() => onOpenDetail(todo.id)}
      className={twMerge(itemVariants({ size }), 'cursor-pointer', className)}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.done ? '완료 취소' : '완료로 표시'}
        onClick={stop(() => onToggleDone(todo.id, !todo.done))}
        className="shrink-0"
      >
        {todo.done ? (
          <IconCheckboxActive className="size-[18px]" />
        ) : (
          <IconCheckboxInactive className="size-[18px]" />
        )}
      </button>

      <p className={titleVariants({ size, done: todo.done })}>{todo.title}</p>

      <div className={iconGroupVariants({ size })}>
        {hasNote ? (
          <button
            type="button"
            aria-label="노트 보기"
            onClick={stop(() => onViewNote(todo.noteIds[0]))}
          >
            <IconNoteView className="size-6" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="노트 작성"
            onClick={stop(() => onCreateNote(todo.id))}
          >
            <IconNoteWrite className="size-6" />
          </button>
        )}

        {linkUrl ? (
          <button
            type="button"
            aria-label="링크 복사"
            onClick={stop(() => onCopyLink(linkUrl))}
          >
            <IconLink className="size-6" />
          </button>
        ) : null}

        <div className="flex" onClick={(event) => event.stopPropagation()}>
          {kebabSlot ?? (
            <button type="button" aria-label="더보기">
              <IconKebab className="size-6" />
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label={todo.isFavorite ? '찜 해제' : '찜하기'}
          aria-pressed={todo.isFavorite}
          onClick={stop(() => onToggleFavorite(todo.id, !todo.isFavorite))}
        >
          {todo.isFavorite ? (
            <IconStarFilled className="size-6" />
          ) : (
            <IconStarOutline className="size-6" />
          )}
        </button>
      </div>
    </li>
  );
}
