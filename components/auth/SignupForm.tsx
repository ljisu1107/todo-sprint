'use client';

import { useTranslations } from 'next-intl';
import type { FormEventHandler } from 'react';

import Button from '@/components/ui/button/Button';
import AuthTextField from './AuthTextField';
import { preventSubmit } from './authForm';

type SignupField = 'name' | 'email' | 'password' | 'passwordConfirm';

export interface SignupFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  errors?: Partial<Record<SignupField, string>>;
}

/** 회원가입 폼 UI. passwordConfirm은 화면에서만 씁니다. */
const SignupForm = ({
  onSubmit = preventSubmit,
  errors = {},
}: SignupFormProps) => {
  const t = useTranslations('Auth');

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 md:gap-4">
        <AuthTextField
          name="name"
          type="text"
          autoComplete="name"
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          error={errors.name}
        />
        <AuthTextField
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          error={errors.email}
        />
        <AuthTextField
          name="password"
          type="password"
          autoComplete="new-password"
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          error={errors.password}
        />
        <AuthTextField
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          label={t('passwordConfirmLabel')}
          placeholder={t('passwordConfirmPlaceholder')}
          error={errors.passwordConfirm}
          showPasswordLabel={t('showPasswordConfirm')}
          hidePasswordLabel={t('hidePasswordConfirm')}
        />
      </div>
      <Button type="submit" size="lg">
        {t('signupSubmit')}
      </Button>
    </form>
  );
};

export default SignupForm;
