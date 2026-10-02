import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/lib/api/client-fetcher';
import { replyToAuthRequest } from '@/test/authApiMocks';
import TestProviders from '@/test/TestProviders';
import SignupForm from './SignupForm';

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

const renderForm = () => render(<SignupForm />, { wrapper: TestProviders });
const submit = () => screen.getByRole('button', { name: '회원가입 하기' });

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  values: Partial<
    Record<'이름' | '이메일' | '비밀번호' | '비밀번호 확인', string>
  >,
) => {
  for (const [label, value] of Object.entries(values)) {
    await user.type(screen.getByLabelText(label), value);
  }
};

const VALID = {
  이름: '홍길동',
  이메일: 'user@example.com',
  비밀번호: 'password123',
  '비밀번호 확인': 'password123',
};

describe('SignupForm', () => {
  it.each([
    ['이름', 'name', 'text'],
    ['이메일', 'email', 'email'],
    ['비밀번호', 'password', 'password'],
    ['비밀번호 확인', 'passwordConfirm', 'password'],
  ])('"%s" 라벨의 input은 name=%s, type=%s다', (label, name, type) => {
    renderForm();

    const input = screen.getByLabelText(label);
    expect(input).toHaveAttribute('name', name);
    expect(input).toHaveAttribute('type', type);
  });

  it('비밀번호와 비밀번호 확인 보기 버튼은 각자 자기 입력만 바꾼다', async () => {
    const user = userEvent.setup();
    renderForm();

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

  it('유효하지 않은 값으로 제출하면 필드마다 안내 메시지를 표시하고 요청하지 않는다', async () => {
    const user = userEvent.setup();
    const sent = replyToAuthRequest(201);
    renderForm();

    await fillForm(user, {
      이메일: 'not-an-email',
      비밀번호: 'short',
      '비밀번호 확인': 'different',
    });
    await user.click(submit());

    expect(screen.getByLabelText('이름')).toHaveAccessibleDescription(
      '이름을 입력해 주세요.',
    );
    expect(screen.getByLabelText('이메일')).toHaveAccessibleDescription(
      '이메일 형식으로 입력해 주세요.',
    );
    expect(screen.getByLabelText('비밀번호')).toHaveAccessibleDescription(
      '비밀번호가 8자 이상이 되도록 해 주세요.',
    );
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAccessibleDescription(
      '비밀번호가 일치하지 않습니다.',
    );
    expect(sent).toHaveLength(0);
  });

  it('가입에 성공하면 passwordConfirm 없이 요청하고 대시보드로 이동한다', async () => {
    const user = userEvent.setup();
    const sent = replyToAuthRequest(201);
    renderForm();

    await fillForm(user, VALID);
    await user.click(submit());

    await vi.waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/ko/dashboard'),
    );
    expect(sent[0].url).toBe('/auth/signup');
    expect(JSON.parse(sent[0].data)).toEqual({
      name: '홍길동',
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('이미 등록된 이메일이면 이메일 입력 아래에 안내를 표시한다', async () => {
    const user = userEvent.setup();
    replyToAuthRequest(409);
    renderForm();

    await fillForm(user, VALID);
    await user.click(submit());

    await vi.waitFor(() =>
      expect(screen.getByLabelText('이메일')).toHaveAccessibleDescription(
        '이미 사용 중인 이메일입니다.',
      ),
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it('비밀번호를 고치면 입력해 둔 비밀번호 확인도 다시 검사한다', async () => {
    const user = userEvent.setup();
    renderForm();

    await fillForm(user, { '비밀번호 확인': 'password123' });
    await user.type(screen.getByLabelText('비밀번호'), 'password124');
    await user.tab();
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAccessibleDescription(
      '비밀번호가 일치하지 않습니다.',
    );

    await user.type(screen.getByLabelText('비밀번호'), '{Backspace}3');
    await user.tab();
    expect(
      screen.getByLabelText('비밀번호 확인'),
    ).not.toHaveAccessibleDescription();
  });

  it('입력 직후 제출해도 이메일 중복 안내가 1초 뒤에 사라지지 않는다', async () => {
    vi.useFakeTimers();
    replyToAuthRequest(409);
    renderForm();

    for (const [label, value] of Object.entries(VALID)) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    // 마지막으로 입력한 필드의 검사가 1초 뒤로 예약됩니다.
    fireEvent.change(screen.getByLabelText('이메일'), {
      target: { value: 'taken@example.com' },
    });
    fireEvent.submit(submit().closest('form')!);
    await act(() => vi.advanceTimersByTimeAsync(1000));

    expect(screen.getByLabelText('이메일')).toHaveAccessibleDescription(
      '이미 사용 중인 이메일입니다.',
    );
  });
});
