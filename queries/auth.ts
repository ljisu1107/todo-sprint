import { mutationOptions } from '@tanstack/react-query';
import { login, signup } from '@/lib/api/auth';

export const authMutations = {
  login: () => mutationOptions({ mutationFn: login }),
  signup: () => mutationOptions({ mutationFn: signup }),
};
