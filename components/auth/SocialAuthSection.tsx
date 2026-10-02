import { useTranslations } from 'next-intl';

import SocialLoginButton from '@/components/ui/button/SocialLoginButton';
import { cn } from '@/lib/utils';

interface SocialAuthSectionProps {
  mode: 'login' | 'signup';
}

const COPY = {
  login: {
    title: 'socialLoginTitle',
    google: 'googleLogin',
    kakao: 'kakaoLogin',
  },
  signup: {
    title: 'socialSignupTitle',
    google: 'googleSignup',
    kakao: 'kakaoSignup',
  },
} as const;

/** 구분선 + 구글·카카오 버튼 (UI만, 소셜 로그인 연동 전) */
const SocialAuthSection = ({ mode }: SocialAuthSectionProps) => {
  const t = useTranslations('Auth');
  const copy = COPY[mode];

  return (
    <div
      className={cn(
        'flex flex-col md:gap-4',
        mode === 'login' ? 'gap-4' : 'gap-6',
      )}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-grayscale-200" />
        <p className="text-xs/4 text-grayscale-400 md:text-sm/5 md:tracking-[-0.03em]">
          {t(copy.title)}
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-grayscale-200" />
      </div>
      <div className="flex justify-center gap-4">
        <SocialLoginButton provider="google" aria-label={t(copy.google)} />
        <SocialLoginButton provider="kakao" aria-label={t(copy.kakao)} />
      </div>
    </div>
  );
};

export default SocialAuthSection;
