import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { toast } from '@/components/ui/toast/Toaster';
import { useRouter } from '@/i18n/navigation';
import {
  loginFormSchema,
  type LoginFormValues,
} from '@/lib/auth/authFormSchema';
import useLogin from './useLogin';
import useValidateOnIdle from './useValidateOnIdle';

const useLoginForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { login, isLoggingIn } = useLogin();
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const idleValidation = useValidateOnIdle((name: keyof LoginFormValues) =>
    trigger(name),
  );

  const submit = (values: LoginFormValues) => {
    idleValidation.cancel();
    login(values, {
      onSuccess: () => router.replace('/dashboard'),
      onFailure: (reason) => {
        if (reason === 'invalidCredentials') {
          setError('root', { message: 'invalidCredentials' });
          return;
        }
        toast.error(t('loginFailed'));
      },
    });
  };

  const errorText = (key?: string) => (key ? t(`errors.${key}`) : undefined);

  return {
    formProps: { onSubmit: handleSubmit(submit), ...idleValidation.handlers },
    fields: { email: register('email'), password: register('password') },
    errors: {
      email: errorText(errors.email?.message),
      password: errorText(errors.password?.message),
      credentials: errorText(errors.root?.message),
    },
    isLoggingIn,
  };
};

export default useLoginForm;
