import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { toast } from '@/components/ui/toast/Toaster';
import { useRouter } from '@/i18n/navigation';
import {
  signupFormSchema,
  type SignupFormValues,
} from '@/lib/auth/authFormSchema';
import useSignup from './useSignup';
import useValidateOnIdle from './useValidateOnIdle';

const useSignupForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { signup, isSigningUp } = useSignup();
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { name: '', email: '', password: '', passwordConfirm: '' },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // 비밀번호를 고치면 이미 입력해 둔 비밀번호 확인의 일치 여부도 다시 검사합니다.
  const validateField = (name: keyof SignupFormValues) =>
    trigger(
      name === 'password' && getValues('passwordConfirm')
        ? ['password', 'passwordConfirm']
        : name,
    );
  const idleValidation = useValidateOnIdle(validateField);

  const submit = ({ name, email, password }: SignupFormValues) => {
    // 대기 중인 검사가 응답 뒤에 실행되면 서버가 알려준 이메일 중복 안내를 지웁니다.
    idleValidation.cancel();
    signup(
      { name, email, password },
      {
        onSuccess: () => router.replace('/dashboard'),
        onFailure: (reason) => {
          if (reason === 'emailTaken') {
            setError('email', { message: 'emailTaken' });
            return;
          }
          toast.error(t('signupFailed'));
        },
      },
    );
  };

  const errorText = (key?: string) => (key ? t(`errors.${key}`) : undefined);

  return {
    formProps: { onSubmit: handleSubmit(submit), ...idleValidation.handlers },
    fields: {
      name: register('name'),
      email: register('email'),
      password: register('password', {
        onBlur: () => validateField('password'),
      }),
      passwordConfirm: register('passwordConfirm'),
    },
    errors: {
      name: errorText(errors.name?.message),
      email: errorText(errors.email?.message),
      password: errorText(errors.password?.message),
      passwordConfirm: errorText(errors.passwordConfirm?.message),
    },
    isSigningUp,
  };
};

export default useSignupForm;
