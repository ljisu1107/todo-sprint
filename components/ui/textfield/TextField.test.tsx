// TextField.test.tsx
import { createRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextField } from './TextField';

describe('TextField', () => {
  describe('기본 렌더링', () => {
    it('label이 있으면 label과 input이 연결된다', () => {
      render(<TextField label="이름" />);

      const input = screen.getByLabelText('이름');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('label이 없으면 label 요소를 렌더링하지 않는다', () => {
      render(<TextField placeholder="이름 입력" />);

      expect(screen.queryByText('이름')).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText('이름 입력')).toBeInTheDocument();
    });

    it('id를 넘기면 해당 id를 사용하고, 없으면 자동 생성한다', () => {
      const { rerender } = render(<TextField label="이름" id="custom-id" />);
      expect(screen.getByLabelText('이름')).toHaveAttribute('id', 'custom-id');

      rerender(<TextField label="이름" />);
      expect(screen.getByLabelText('이름').id).not.toBe('');
    });

    it('type prop이 input에 전달된다', () => {
      render(<TextField label="이메일" type="email" />);

      expect(screen.getByLabelText('이메일')).toHaveAttribute('type', 'email');
    });

    it('나머지 props(placeholder, name, disabled 등)가 input에 전달된다', () => {
      render(
        <TextField label="이름" name="username" placeholder="입력" disabled />,
      );

      const input = screen.getByLabelText('이름');
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveAttribute('placeholder', '입력');
      expect(input).toBeDisabled();
    });

    it('className이 input에 병합된다', () => {
      render(<TextField label="이름" className="bg-yellow-100" />);

      expect(screen.getByLabelText('이름')).toHaveClass('bg-yellow-100');
    });
  });

  describe('필수 표시(isRequiredIcon)', () => {
    it('isRequiredIcon이 true면 * 표시가 나타난다', () => {
      render(<TextField label="이메일" isRequiredIcon />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('기본값(false)에서는 * 표시가 없다', () => {
      render(<TextField label="이메일" />);

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('에러 처리', () => {
    it('error가 없으면 에러 메시지와 aria 속성이 없다', () => {
      render(<TextField label="이메일" />);

      const input = screen.getByLabelText('이메일');
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).not.toHaveAttribute('aria-describedby');
      expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    });

    it('error가 있으면 메시지를 보여주고 aria 속성이 설정된다', () => {
      render(<TextField label="이메일" error="이메일을 입력해주세요." />);

      const input = screen.getByLabelText('이메일');
      const message = screen.getByText('이메일을 입력해주세요.');

      expect(message).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', message.id);
      expect(input).toHaveAccessibleDescription('이메일을 입력해주세요.');
    });

    it('error가 있으면 에러 스타일이 적용된다', () => {
      render(<TextField label="이메일" error="오류" />);

      expect(screen.getByLabelText('이메일')).toHaveClass('border-red-400');
    });

    it('error가 없으면 기본 테두리 스타일이 적용된다', () => {
      render(<TextField label="이메일" />);

      expect(screen.getByLabelText('이메일')).not.toHaveClass('border-red-400');
    });
  });

  describe('비밀번호 토글', () => {
    it('type="password"면 기본은 숨김 상태이고 토글 버튼이 보인다', () => {
      render(<TextField label="비밀번호" type="password" />);

      expect(screen.getByLabelText('비밀번호')).toHaveAttribute(
        'type',
        'password',
      );
      expect(
        screen.getByRole('button', { name: '비밀번호 보기' }),
      ).toBeInTheDocument();
    });

    it('토글 버튼을 누르면 비밀번호가 보이고 버튼 라벨이 바뀐다', async () => {
      const user = userEvent.setup();
      render(<TextField label="비밀번호" type="password" />);

      await user.click(screen.getByRole('button', { name: '비밀번호 보기' }));

      expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'text');
      expect(
        screen.getByRole('button', { name: '비밀번호 숨기기' }),
      ).toBeInTheDocument();
    });

    it('다시 누르면 비밀번호가 숨겨진다', async () => {
      const user = userEvent.setup();
      render(<TextField label="비밀번호" type="password" />);

      await user.click(screen.getByRole('button', { name: '비밀번호 보기' }));
      await user.click(screen.getByRole('button', { name: '비밀번호 숨기기' }));

      expect(screen.getByLabelText('비밀번호')).toHaveAttribute(
        'type',
        'password',
      );
    });

    it('password 타입이 아니면 토글 버튼이 없다', () => {
      render(<TextField label="이름" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('토글 버튼은 form 제출을 유발하지 않는다 (type="button")', () => {
      render(<TextField label="비밀번호" type="password" />);

      expect(
        screen.getByRole('button', { name: '비밀번호 보기' }),
      ).toHaveAttribute('type', 'button');
    });

    it('비밀번호 입력창에는 아이콘 자리를 위한 pr-10이 적용된다', () => {
      render(<TextField label="비밀번호" type="password" />);

      expect(screen.getByLabelText('비밀번호')).toHaveClass('pr-10');
    });
  });

  describe('제어 / 비제어 사용', () => {
    it('제어 컴포넌트: value와 onChange로 동작한다', async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState('');
        return (
          <TextField
            label="이름"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      }

      render(<Controlled />);
      const input = screen.getByLabelText('이름');

      await user.type(input, '홍길동');

      expect(input).toHaveValue('홍길동');
    });

    it('비제어 컴포넌트: defaultValue로 초기값을 주고 입력할 수 있다', async () => {
      const user = userEvent.setup();
      render(<TextField label="이름" defaultValue="홍" />);

      const input = screen.getByLabelText('이름');
      expect(input).toHaveValue('홍');

      await user.type(input, '길동');
      expect(input).toHaveValue('홍길동');
    });

    it('onChange 핸들러가 입력할 때마다 호출된다', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextField label="이름" onChange={handleChange} />);

      await user.type(screen.getByLabelText('이름'), 'abc');

      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('ref 전달', () => {
    it('ref가 input 요소를 가리킨다', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextField label="이름" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toBe(screen.getByLabelText('이름'));
    });

    it('ref로 focus를 제어할 수 있다', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextField label="이름" ref={ref} />);

      ref.current?.focus();

      expect(screen.getByLabelText('이름')).toHaveFocus();
    });
  });
});
