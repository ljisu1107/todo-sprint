'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import SettingOptionGroup from '@/components/setting/SettingOptionGroup';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type AppLocale = (typeof routing.locales)[number];

/** 언어 이름은 번역하지 않습니다. 영어 화면에서도 "한국어"를 찾을 수 있어야 합니다. */
const LANGUAGE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
];

export default function LanguageSetting() {
  const t = useTranslations('Setting');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: AppLocale) => {
    const query = searchParams.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        locale: nextLocale,
      });
    });
  };

  return (
    <SettingOptionGroup
      label={t('language')}
      options={LANGUAGE_OPTIONS}
      value={locale}
      onValueChange={changeLocale}
      disabled={isPending}
    />
  );
}
