import Image from 'next/image';
import { useTranslations } from 'next-intl';

/** 빈 상태 (FN-TD-03). Figma `empty` (4:4149), 모바일 (4:4177) */
const TodoListEmpty = () => {
  const t = useTranslations('Todo');

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2.5 py-10 md:gap-4.5">
      <Image
        src="/images/todo/empty.svg"
        alt=""
        width={130}
        height={140}
        unoptimized
        className="h-21.25 w-auto md:h-35"
      />
      <p className="text-sm/5 font-medium tracking-[-0.03em] text-grayscale-500 md:text-base/6">
        {t('noAllTodos')}
      </p>
    </div>
  );
};

export default TodoListEmpty;
