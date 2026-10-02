'use client';

import { useTranslations } from 'next-intl';
import type { FormEventHandler } from 'react';

import Button from '@/components/ui/button/Button';
import AuthTextField from './AuthTextField';
import { preventSubmit } from './authForm';

export interface LoginFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  errors?: Partial<Record<'email' | 'password', string>>;
}

/** 로그인 폼 UI. 시안에 보이는 라벨이 없어 aria-label로 이름을 줍니다. */
const LoginForm = ({
  onSubmit = preventSubmit,
  errors = {},
}: LoginFormProps) => {
  const t = useTranslations('Auth');

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-6 md:gap-8"
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <AuthTextField
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          aria-label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          error={errors.email}
        />
        <AuthTextField
          name="password"
          type="password"
          autoComplete="current-password"
          aria-label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          error={errors.password}
        />
      </div>
      <Button type="submit" size="lg">
        {t('loginSubmit')}
      </Button>
    </form>
  );
};

export default LoginForm;
