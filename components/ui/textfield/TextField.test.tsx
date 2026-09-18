import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField } from './TextField';

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

type FormValues = z.infer<typeof schema>;

function TestForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="이름"
        name="name"
        register={register}
        error={errors.name}
      />
      <TextField
        label="이메일"
        name="email"
        type="email"
        register={register}
        error={errors.email}
      />
      <TextField
        label="비밀번호"
        name="password"
        type="password"
        register={register}
        error={errors.password}
      />
      <button type="submit">제출</button>
    </form>
  );
}

describe('TextField', () => {
  it('라벨과 입력창을 렌더링한다', () => {
    render(<TestForm onSubmit={() => {}} />);

    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
  });

  it('유효하지 않은 값을 제출하면 zod 에러 메시지를 보여준다', async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText('이메일'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: '제출' }));

    expect(await screen.findByText('이름을 입력해주세요')).toBeInTheDocument();
    expect(
      await screen.findByText('올바른 이메일 형식이 아닙니다'),
    ).toBeInTheDocument();
  });

  it('에러가 있으면 input에 aria-invalid=true가 설정된다', async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={() => {}} />);

    await user.click(screen.getByRole('button', { name: '제출' }));

    expect(await screen.findByLabelText('이름')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('유효한 값을 제출하면 onSubmit이 올바른 데이터로 호출된다', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('이름'), '홍길동');
    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.click(screen.getByRole('button', { name: '제출' }));

    expect(handleSubmit).toHaveBeenCalledWith(
      { name: '홍길동', email: 'test@example.com', password: 'password123' },
      expect.anything(),
    );
  });
});

describe('TextField - 비밀번호 보기/숨기기', () => {
  it('기본적으로 type=password로 렌더링되고, 값을 가릴 수 있다', () => {
    render(<TestForm onSubmit={() => {}} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('이름/이메일 필드에는 토글 버튼이 없다', () => {
    render(<TestForm onSubmit={() => {}} />);

    expect(
      screen.queryByRole('button', { name: '비밀번호 보기' }),
    ).not.toBeNull();

    // 이름/이메일 input 옆에는 토글 버튼이 하나도 없어야 한다 (전체에서 1개만 존재)
    const toggleButtons = screen.getAllByRole('button', {
      name: /비밀번호 (보기|숨기기)/,
    });
    expect(toggleButtons).toHaveLength(1);
  });

  it('토글 버튼을 누르면 type이 text로 바뀌고 라벨도 바뀐다', async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={() => {}} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    const toggleButton = screen.getByRole('button', { name: '비밀번호 보기' });

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: '비밀번호 숨기기' }),
    ).toBeInTheDocument();
  });

  it('토글 버튼을 두 번 누르면 다시 type=password로 돌아온다', async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={() => {}} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    const toggleButton = screen.getByRole('button', { name: '비밀번호 보기' });

    await user.click(toggleButton);
    await user.click(screen.getByRole('button', { name: '비밀번호 숨기기' }));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('입력한 값은 보기/숨기기와 상관없이 유지된다', async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={() => {}} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    await user.type(passwordInput, 'secret1234');

    await user.click(screen.getByRole('button', { name: '비밀번호 보기' }));

    expect(passwordInput).toHaveValue('secret1234');
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('토글 버튼은 tabIndex=-1이라 탭 순서에 끼어들지 않는다', () => {
    render(<TestForm onSubmit={() => {}} />);

    const toggleButton = screen.getByRole('button', { name: '비밀번호 보기' });
    expect(toggleButton).toHaveAttribute('tabIndex', '-1');
  });
});
