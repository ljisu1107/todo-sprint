import { useTranslations } from 'next-intl';

import AuthLogo from '@/components/auth/AuthLogo';
import AuthSwitchLink from '@/components/auth/AuthSwitchLink';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <div className="flex flex-col gap-10">
      <h1 className="sr-only">{t('loginTitle')}</h1>
      <AuthLogo />
      <div className="flex flex-col gap-4 md:gap-6">
        <LoginForm />
        <AuthSwitchLink
          prompt={t('signupPrompt')}
          linkLabel={t('signupLink')}
          href="/signup"
        />
      </div>
    </div>
  );
}
