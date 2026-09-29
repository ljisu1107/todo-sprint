'use client';

import KebabMenu, {
  type KebabMenuItem,
} from '@/components/ui/kebab-menu/KebabMenu';
import useIsMe from '@/hooks/users/useIsMe';
import { formatUtcDateToYmd } from '@/lib/formatter';
import type { CommentDto } from '@/types/api/comments';
import WriterAvatar from './WriterAvatar';

// 수정·삭제 동작은 댓글 수정/삭제 기능에서 연결합니다.
const COMMENT_MENU_ITEMS: KebabMenuItem[] = [
  { label: '수정하기', onSelect: () => {} },
  { label: '삭제하기', onSelect: () => {} },
];

interface CommentItemProps {
  comment: Pick<CommentDto, 'content' | 'createdAt' | 'writer'>;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { content, createdAt, writer } = comment;
  const isMine = useIsMe(writer.id);

  return (
    <article className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 items-center gap-1 text-xs text-muted md:text-sm">
            <WriterAvatar image={writer.image} className="md:size-5" />
            <span className="truncate">{writer.name}</span>
          </div>
          {isMine && (
            <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
              내 댓글
            </span>
          )}
        </div>
        {isMine && (
          <KebabMenu ariaLabel="댓글 메뉴" items={COMMENT_MENU_ITEMS} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm wrap-break-word whitespace-pre-wrap text-foreground md:text-base">
          {content}
        </p>
        <time dateTime={createdAt} className="text-xs text-subtle md:text-sm">
          {formatUtcDateToYmd(createdAt)}
        </time>
      </div>
    </article>
  );
};

export default CommentItem;
