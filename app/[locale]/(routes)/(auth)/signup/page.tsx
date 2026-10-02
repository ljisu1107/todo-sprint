import { useTranslations } from 'next-intl';

import AuthLogo from '@/components/auth/AuthLogo';
import AuthSwitchLink from '@/components/auth/AuthSwitchLink';
import SignupForm from '@/components/auth/SignupForm';
import SocialAuthSection from '@/components/auth/SocialAuthSection';

export default function SignupPage() {
  const t = useTranslations('Auth');

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <h1 className="sr-only">{t('signupTitle')}</h1>
      <div className="flex flex-col gap-8 md:gap-12">
        <AuthLogo />
        <div className="flex flex-col gap-4 md:gap-6">
          <SignupForm />
          <AuthSwitchLink
            prompt={t('loginPrompt')}
            linkLabel={t('loginLink')}
            href="/login"
          />
        </div>
      </div>
      <SocialAuthSection mode="signup" />
    </div>
  );
}
