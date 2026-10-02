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
        // TODO: [2026.10.02] PR #27이 병합되면 status 비교 대신 error.httpCategory로 판별하도록 리팩터링
        // (#27의 HTTP_CATEGORY_BY_STATUS에는 403·404만 있어 409 범주를 추가해야 함)
        const isConflict =
          error instanceof ApiError && error.status === CONFLICT;
        onFailure(isConflict ? 'emailTaken' : 'unknown');
      },
    });

  // 성공 후 화면이 이동할 때까지 다시 제출하지 못하게 합니다.
  return { signup, isSigningUp: isPending || isSuccess };
};

export default useSignup;
