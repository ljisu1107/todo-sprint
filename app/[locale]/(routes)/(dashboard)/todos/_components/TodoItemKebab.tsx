'use client';

import { useTranslations } from 'next-intl';

import KebabMenu from '@/components/ui/kebab-menu/KebabMenu';

interface TodoItemKebabProps {
  /** 수정하기 (FN-TD-09). 할 일 수정 모달이 생기면 연결합니다. */
  onEdit?: () => void;
  onDelete: () => void;
}

const notConnected = () => {};

/** 할 일 아이템의 케밥 메뉴: 수정하기 / 삭제하기 */
const TodoItemKebab = ({
  onEdit = notConnected,
  onDelete,
}: TodoItemKebabProps) => {
  const t = useTranslations('Todo');

  return (
    <KebabMenu
      ariaLabel={t('moreActions')}
      items={[
        { label: t('edit'), onSelect: onEdit },
        { label: t('delete'), onSelect: onDelete },
      ]}
    />
  );
};

export default TodoItemKebab;
