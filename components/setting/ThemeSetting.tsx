'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import SettingOptionGroup from '@/components/setting/SettingOptionGroup';

const THEMES = ['light', 'dark', 'system'] as const;
type Theme = (typeof THEMES)[number];

export default function ThemeSetting() {
  const t = useTranslations('Setting');
  const { theme, setTheme } = useTheme();

  return (
    <SettingOptionGroup
      label={t('theme')}
      options={THEMES.map((value) => ({ value, label: t(value) }))}
      value={theme as Theme | undefined}
      onValueChange={setTheme}
    />
  );
}
