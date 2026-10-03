import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import messages from '@/messages/ko.json';
import LoginForm from './LoginForm';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="ko" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

describe('LoginForm', () => {
  it('email·password 입력과 submit 버튼을 가진다', () => {
    render(<LoginForm />, { wrapper });

    const email = screen.getByRole('textbox', { name: '이메일' });
    expect(email).toHaveAttribute('name', 'email');
    expect(email).toHaveAttribute('type', 'email');

    const password = screen.getByLabelText('비밀번호');
    expect(password).toHaveAttribute('name', 'password');
    expect(password).toHaveAttribute('type', 'password');

    expect(screen.getByRole('button', { name: '로그인하기' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('제출하면 onSubmit을 호출한다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(<LoginForm onSubmit={onSubmit} />, { wrapper });

    await user.click(screen.getByRole('button', { name: '로그인하기' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('errors를 해당 필드 아래에 표시한다', () => {
    render(<LoginForm errors={{ password: '비밀번호 오류' }} />, { wrapper });

    expect(screen.getByLabelText('비밀번호')).toHaveAccessibleDescription(
      '비밀번호 오류',
    );
  });
});
