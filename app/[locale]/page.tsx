import { useTranslations } from 'next-intl';

export default function Home() {
  // 번역 라이브러리 테스트 코드 입니다. 해당 작업하실 때 지워도 됩니다.
  const t = useTranslations('Todo');

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {t('dashboardTitle', { name: '체다치즈' })}
    </div>
  );
}
