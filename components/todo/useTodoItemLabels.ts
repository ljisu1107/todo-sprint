import { useTranslations } from 'next-intl';

import type { TodoItemLabels } from './TodoItem';

/** 현재 언어로 TodoItem 접근성 이름을 만듭니다. TodoItem을 쓰는 화면에서 한 줄로 넘깁니다. */
const useTodoItemLabels = (): TodoItemLabels => {
  const t = useTranslations('Todo');

  return {
    done: t('completed'),
    favorite: t('favorite'),
    viewNote: t('viewNote'),
    writeNote: t('writeNote'),
    copyLink: t('copyLink'),
    moreActions: t('moreActions'),
  };
};

export default useTodoItemLabels;
