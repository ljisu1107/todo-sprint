import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Toaster from '@/components/ui/toast/Toaster';
import { api } from '@/lib/api/client-fetcher';
import { replyToAuthRequest } from '@/test/authApiMocks';
import TestProviders from '@/test/TestProviders';
import LoginForm from './LoginForm';

const replace = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  useRouter: () => ({ replace }),
}));

const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
  replace.mockClear();
  vi.useRealTimers();
});

const renderForm = () => render(<LoginForm />, { wrapper: TestProviders });
const emailInput = () => screen.getByRole('textbox', { name: '이메일' });
const passwordInput = () => screen.getByLabelText('비밀번호');
const submit = () => screen.getByRole('button', { name: '로그인하기' });

describe('LoginForm', () => {
  it('email·password 입력과 submit 버튼을 가진다', () => {
    renderForm();

    expect(emailInput()).toHaveAttribute('name', 'email');
    expect(emailInput()).toHaveAttribute('type', 'email');
    expect(passwordInput()).toHaveAttribute('name', 'password');
    expect(passwordInput()).toHaveAttribute('type', 'password');
    expect(submit()).toHaveAttribute('type', 'submit');
  });

  it('빈 값으로 제출하면 안내 메시지를 표시하고 요청하지 않는다', async () => {
    const user = userEvent.setup();
    const sent = replyToAuthRequest(200);
    renderForm();

    await user.click(submit());

    expect(emailInput()).toHaveAccessibleDescription('이메일을 입력해 주세요.');
    expect(passwordInput()).toHaveAccessibleDescription(
      '비밀번호를 입력해 주세요.',
    );
    expect(sent).toHaveLength(0);
  });

  it('포커스가 이동하면 그 입력을 검사한다', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(emailInput(), 'not-an-email');
    await user.tab();

    expect(emailInput()).toHaveAccessibleDescription(
      '이메일 형식으로 입력해 주세요.',
    );
  });

  it('입력을 멈추고 1초가 지나면 그 입력을 검사한다', async () => {
    vi.useFakeTimers();
    renderForm();

    fireEvent.change(emailInput(), { target: { value: 'not-an-email' } });
    await act(() => vi.advanceTimersByTimeAsync(999));
    expect(emailInput()).not.toHaveAccessibleDescription();

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(emailInput()).toHaveAccessibleDescription(
      '이메일 형식으로 입력해 주세요.',
    );
  });

  it('포커스만 하고 입력하지 않으면 1초가 지나도 검사하지 않는다', async () => {
    vi.useFakeTimers();
    renderForm();

    fireEvent.focus(emailInput());
    await act(() => vi.advanceTimersByTimeAsync(1000));

    expect(emailInput()).not.toHaveAccessibleDescription();
  });

  it('로그인에 성공하면 대시보드로 이동한다', async () => {
    const user = userEvent.setup();
    const sent = replyToAuthRequest(200);
    renderForm();

    await user.type(emailInput(), 'user@example.com');
    await user.type(passwordInput(), 'password123');
    await user.click(submit());

    await vi.waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/ko/dashboard'),
    );
    expect(sent[0].url).toBe('/auth/login');
    expect(JSON.parse(sent[0].data)).toEqual({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('인증에 실패하면 원인을 구분하지 않는 안내를 폼 하단에 표시한다', async () => {
    const user = userEvent.setup();
    replyToAuthRequest(401);
    renderForm();

    await user.type(emailInput(), 'user@example.com');
    await user.type(passwordInput(), 'wrong-password');
    await user.click(submit());

    expect(
      await screen.findByText('이메일 또는 비밀번호가 올바르지 않습니다.'),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('입력을 고치면 인증 실패 안내를 지운다', async () => {
    const user = userEvent.setup();
    replyToAuthRequest(401);
    renderForm();

    await user.type(emailInput(), 'user@example.com');
    await user.type(passwordInput(), 'wrong-password');
    await user.click(submit());
    await screen.findByText('이메일 또는 비밀번호가 올바르지 않습니다.');

    await user.type(passwordInput(), '1');

    expect(
      screen.queryByText('이메일 또는 비밀번호가 올바르지 않습니다.'),
    ).not.toBeInTheDocument();
  });

  it('그 밖의 실패는 토스트로 알린다', async () => {
    const user = userEvent.setup();
    replyToAuthRequest(500);
    render(
      <>
        <LoginForm />
        <Toaster />
      </>,
      { wrapper: TestProviders },
    );

    await user.type(emailInput(), 'user@example.com');
    await user.type(passwordInput(), 'password123');
    await user.click(submit());

    expect(
      await screen.findByText(
        '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      ),
    ).toBeInTheDocument();
    expect(passwordInput()).not.toHaveAccessibleDescription();
  });
});
