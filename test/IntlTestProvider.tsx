'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';

export type TestLocale = 'ko' | 'en';

const MESSAGES = { ko: koMessages, en: enMessages };

/**
 * 테스트·Storybook 전용 번역 Provider. 앱에서는 app/[locale]/layout.tsx가
 * 요청 locale의 messages를 주입하지만, 여기서는 locale을 직접 받습니다 (기본 ko).
 */
const IntlTestProvider = ({
  locale = 'ko',
  children,
}: {
  locale?: TestLocale;
  children: ReactNode;
}) => (
  <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
    {children}
  </NextIntlClientProvider>
);

export default IntlTestProvider;
