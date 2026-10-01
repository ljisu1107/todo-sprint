import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import messages from '@/messages/ko.json';
import AuthTextField from './AuthTextField';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="ko" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

describe('AuthTextField', () => {
  it('label이 input과 연결된다', () => {
    render(<AuthTextField label="이메일" name="email" />, { wrapper });

    expect(screen.getByLabelText('이메일')).toHaveAttribute('name', 'email');
  });

  it('error를 입력 아래에 표시하고 input과 연결한다', () => {
    render(<AuthTextField label="이메일" error="잘못된 이메일입니다." />, {
      wrapper,
    });

    const input = screen.getByLabelText('이메일');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('잘못된 이메일입니다.');
  });

  it('비밀번호 보기 버튼은 클릭과 Enter로 보기·숨기기를 바꾼다', async () => {
    const user = userEvent.setup();
    render(<AuthTextField label="비밀번호" type="password" />, { wrapper });
    const input = screen.getByLabelText('비밀번호');

    await user.click(screen.getByRole('button', { name: '비밀번호 보기' }));
    expect(input).toHaveAttribute('type', 'text');

    screen.getByRole('button', { name: '비밀번호 숨기기' }).focus();
    await user.keyboard('{Enter}');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('비밀번호가 아니면 보기 버튼이 없다', () => {
    render(<AuthTextField label="이메일" type="email" />, { wrapper });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
