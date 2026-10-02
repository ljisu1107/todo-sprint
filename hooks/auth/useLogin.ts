import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/errors';
import { authMutations } from '@/queries/auth';
import type { LoginBodyDto } from '@/types/api/auth';

const UNAUTHORIZED = 401;

export type LoginFailure = 'invalidCredentials' | 'unknown';

interface LoginCallbacks {
  onSuccess: () => void;
  onFailure: (reason: LoginFailure) => void;
}

const useLogin = () => {
  const { mutate, isPending, isSuccess } = useMutation(authMutations.login());

  const login = (
    body: LoginBodyDto,
    { onSuccess, onFailure }: LoginCallbacks,
  ) =>
    mutate(body, {
      onSuccess,
      onError: (error) => {
        const isUnauthorized =
          error instanceof ApiError && error.status === UNAUTHORIZED;
        onFailure(isUnauthorized ? 'invalidCredentials' : 'unknown');
      },
    });

  // 성공 후 화면이 이동할 때까지 다시 제출하지 못하게 합니다.
  return { login, isLoggingIn: isPending || isSuccess };
};

export default useLogin;
