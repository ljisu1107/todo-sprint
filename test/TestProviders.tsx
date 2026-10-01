'use client';

import type { ReactNode } from 'react';

import IntlTestProvider, { type TestLocale } from './IntlTestProvider';
import QueryTestProvider from './QueryTestProvider';

/** 테스트·Storybook에서 쓰는 Provider 조합. 번역(기본 ko)과 React Query를 함께 감쌉니다. */
const TestProviders = ({
  locale,
  children,
}: {
  locale?: TestLocale;
  children: ReactNode;
}) => (
  <IntlTestProvider locale={locale}>
    <QueryTestProvider>{children}</QueryTestProvider>
  </IntlTestProvider>
);

export default TestProviders;
