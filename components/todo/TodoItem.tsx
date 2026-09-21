'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  IconCheckboxActive,
  IconCheckboxActiveWhite,
  IconCheckboxInactive,
  IconCheckboxInactiveWhite,
  IconKebab,
  IconKebabWhite,
  IconLink,
  IconLinkWhite,
  IconNoteView,
  IconNoteViewWhite,
  IconNoteWrite,
  IconStarFilled,
  IconStarFilledWhite,
  IconStarOutline,
  IconStarOutlineWhite,
} from '@/components/icons';
import { stopPropagation } from '@/lib/utils';
import type { Todo } from '@/types/todo';

/** 아이템 렌더링에 실제로 쓰는 필드만 좁힙니다. 응답 스펙이 바뀌면 여기서 타입 에러로 드러납니다. */
export type TodoItemData = Pick<
  Todo,
  'id' | 'title' | 'done' | 'noteIds' | 'linkUrl' | 'isFavorite'
>;

/**
 * 피그마 todo_list 컴포넌트(node 4:9638)의 변형을 따릅니다.
 * size  - large: 1920 / 744 (높이 44px), small: 375 (높이 36px)
 * style - todo: 밝은 배경용, white: 어두운 배경용(대시보드 상단 카드)
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
        large: 'text-base',
        small: 'text-sm',
      },
      done: {
        true: 'text-[#737373]',
        false: 'text-[#262626]',
      },
      style: {
        todo: '',
        white: 'font-semibold',
      },
    },
    compoundVariants: [
      // white는 완료 여부와 무관하게 흰 글씨입니다.
      { style: 'white', done: true, class: 'text-white' },
      { style: 'white', done: false, class: 'text-white' },
    ],
    defaultVariants: { size: 'large', done: false, style: 'todo' },
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

export type TodoItemStyle = 'todo' | 'white';

export type TodoItemProps = VariantProps<typeof itemVariants> & {
  todo: TodoItemData;
  /** 배경 색 계열. white는 어두운 배경(대시보드 상단 카드)용입니다. */
  style?: TodoItemStyle;
  /** 완료 토글 (FN-TD-06). next는 토글 후의 값입니다. API 호출과 롤백은 페이지가 담당합니다. */
  onToggleDone: (id: number, next: boolean) => void;
  /** 찜 토글 (FN-TD-07). next는 토글 후의 값입니다. */
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
  style = 'todo',
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
  const isWhite = style === 'white';

  const CheckboxIcon = todo.done
    ? isWhite
      ? IconCheckboxActiveWhite
      : IconCheckboxActive
    : isWhite
      ? IconCheckboxInactiveWhite
      : IconCheckboxInactive;
  const NoteViewIcon = isWhite ? IconNoteViewWhite : IconNoteView;
  const LinkIcon = isWhite ? IconLinkWhite : IconLink;
  const KebabIcon = isWhite ? IconKebabWhite : IconKebab;
  const StarIcon = todo.isFavorite
    ? isWhite
      ? IconStarFilledWhite
      : IconStarFilled
    : isWhite
      ? IconStarOutlineWhite
      : IconStarOutline;

  return (
    <li className={twMerge(itemVariants({ size }), className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.done ? '완료 취소' : '완료로 표시'}
        onClick={stopPropagation(() => onToggleDone(todo.id, !todo.done))}
        className="shrink-0"
      >
        <CheckboxIcon className="size-[18px]" />
      </button>

      <button
        type="button"
        onClick={() => onOpenDetail(todo.id)}
        className={twMerge(
          titleVariants({ size, done: todo.done, style }),
          'cursor-pointer',
        )}
      >
        {todo.title}
      </button>

      <div className={iconGroupVariants({ size })}>
        {hasNote ? (
          <button
            type="button"
            aria-label="노트 보기"
            onClick={stopPropagation(() => onViewNote(todo.noteIds[0]))}
          >
            <NoteViewIcon className="size-6" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="노트 작성"
            onClick={stopPropagation(() => onCreateNote(todo.id))}
          >
            <IconNoteWrite className="size-6" />
          </button>
        )}

        {linkUrl ? (
          <button
            type="button"
            aria-label="링크 복사"
            onClick={stopPropagation(() => onCopyLink(linkUrl))}
          >
            <LinkIcon className="size-6" />
          </button>
        ) : null}

        <div className="flex" onClick={(event) => event.stopPropagation()}>
          {kebabSlot ?? (
            <button type="button" aria-label="더보기">
              <KebabIcon className="size-6" />
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label={todo.isFavorite ? '찜 해제' : '찜하기'}
          aria-pressed={todo.isFavorite}
          onClick={stopPropagation(() =>
            onToggleFavorite(todo.id, !todo.isFavorite),
          )}
        >
          <StarIcon className="size-6" />
        </button>
      </div>
    </li>
  );
}
