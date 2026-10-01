import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';
import LoginPage from './login/page';
import SignupPage from './signup/page';

vi.mock('next/link', () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

const renderPage = (page: ReactNode, locale: 'ko' | 'en' = 'ko') =>
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'ko' ? koMessages : enMessages}
    >
      {page}
    </NextIntlClientProvider>,
  );

describe('인증 화면', () => {
  it('로그인 화면은 폼·소셜 버튼과 회원가입 링크를 가진다', () => {
    renderPage(<LoginPage />);

    expect(
      screen.getByRole('button', { name: '로그인하기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '구글로 로그인' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '카카오로 로그인' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute(
      'href',
      '/ko/signup',
    );
  });

  it('회원가입 화면은 폼·소셜 버튼과 로그인 링크를 가진다', () => {
    renderPage(<SignupPage />);

    expect(
      screen.getByRole('button', { name: '회원가입 하기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '구글로 회원가입' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute(
      'href',
      '/ko/login',
    );
  });

  it('영문 화면에는 한국어가 나오지 않는다', () => {
    renderPage(<SignupPage />, 'en');

    expect(
      screen.getByRole('button', { name: 'Show password' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
      'href',
      '/en/login',
    );
    expect(document.body).not.toHaveTextContent(/[가-힣]/);
  });
});
