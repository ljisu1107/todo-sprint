import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/errors';
import { authMutations } from '@/queries/auth';
import type { SignupBodyDto } from '@/types/api/auth';

const CONFLICT = 409;

export type SignupFailure = 'emailTaken' | 'unknown';

interface SignupCallbacks {
  onSuccess: () => void;
  onFailure: (reason: SignupFailure) => void;
}

const useSignup = () => {
  const { mutate, isPending, isSuccess } = useMutation(authMutations.signup());

  const signup = (
    body: SignupBodyDto,
    { onSuccess, onFailure }: SignupCallbacks,
  ) =>
    mutate(body, {
      onSuccess,
      onError: (error) => {
        const isConflict =
          error instanceof ApiError && error.status === CONFLICT;
        onFailure(isConflict ? 'emailTaken' : 'unknown');
      },
    });

  // 성공 후 화면이 이동할 때까지 다시 제출하지 못하게 합니다.
  return { signup, isSigningUp: isPending || isSuccess };
};

export default useSignup;
