import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import messages from '@/messages/ko.json';
import SignupForm from './SignupForm';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="ko" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

describe('SignupForm', () => {
  it.each([
    ['이름', 'name', 'text'],
    ['이메일', 'email', 'email'],
    ['비밀번호', 'password', 'password'],
    ['비밀번호 확인', 'passwordConfirm', 'password'],
  ])('"%s" 라벨의 input은 name=%s, type=%s다', (label, name, type) => {
    render(<SignupForm />, { wrapper });

    const input = screen.getByLabelText(label);
    expect(input).toHaveAttribute('name', name);
    expect(input).toHaveAttribute('type', type);
  });

  it('제출하면 onSubmit을 호출한다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(<SignupForm onSubmit={onSubmit} />, { wrapper });

    const button = screen.getByRole('button', { name: '회원가입 하기' });
    expect(button).toHaveAttribute('type', 'submit');
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('비밀번호와 비밀번호 확인 보기 버튼은 각자 자기 입력만 바꾼다', async () => {
    const user = userEvent.setup();
    render(<SignupForm />, { wrapper });

    await user.click(
      screen.getByRole('button', { name: '비밀번호 확인 보기' }),
    );

    expect(screen.getByLabelText('비밀번호 확인')).toHaveAttribute(
      'type',
      'text',
    );
    expect(screen.getByLabelText('비밀번호')).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('errors를 해당 필드 아래에 표시한다', () => {
    render(<SignupForm errors={{ email: '이메일 오류' }} />, { wrapper });

    expect(screen.getByLabelText('이메일')).toHaveAccessibleDescription(
      '이메일 오류',
    );
  });
});
