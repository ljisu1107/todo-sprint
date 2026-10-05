import type {
  AuthResponseDto,
  LoginBodyDto,
  SignupBodyDto,
} from '@/types/api/auth';
import { request } from './client-fetcher';

export const login = (body: LoginBodyDto) =>
  request<AuthResponseDto>({ url: '/auth/login', method: 'POST', data: body });

export const signup = (body: SignupBodyDto) =>
  request<AuthResponseDto>({
    url: '/auth/signup',
    method: 'POST',
    data: body,
  });
