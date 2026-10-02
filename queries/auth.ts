import { mutationOptions } from '@tanstack/react-query';
import { login, signup } from '@/lib/api/auth';

// 기본값('online')은 오프라인일 때 요청을 보류해 버튼이 비활성인 채 멈춥니다.
// 로그인·회원가입은 나중에 몰래 실행되면 안 되므로 바로 보내고 실패를 알립니다.
const NETWORK_MODE = 'always';

export const authMutations = {
  login: () =>
    mutationOptions({ mutationFn: login, networkMode: NETWORK_MODE }),
  signup: () =>
    mutationOptions({ mutationFn: signup, networkMode: NETWORK_MODE }),
};
