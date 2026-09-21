import { forwardRef, InputHTMLAttributes, useId, useState } from 'react';
import clsx from 'clsx';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** 에러 메시지 문자열 (예: errors.name?.message) */
  error?: string;
  isRequiredIcon?: boolean;
}

/**
 * react-hook-form + zod와 함께 쓰는 공용 텍스트 입력 컴포넌트였지만,
 * 멘토님의 피드백으로 제어, 비제어 컴포넌트도 사용할 수 있게 바꿨습니다.
 * react-hook-form의 의존성이 사라지며, 주입 받는 쪽으로 바뀌었습니다.
 * 이름, 이메일, 숫자 등 대부분의 텍스트성 입력에 재사용할 수 있습니다.
 *
 * 사용 예시:

 */

const textfieldVariants = cva(
  `w-full rounded-2xl border p-4 text-[1rem] text-gray-900 transition-colors outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`,
  {
    variants: {
      isError: {
        true: 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100',
        false:
          'border-[#CCCCCC] focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
      },
      isPassword: {
        true: 'pr-10',
        false: 'pr-0',
      },
    },
    defaultVariants: {
      isError: false,
    },
  },
);

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      error,
      isRequiredIcon = false,
      type = 'text',
      className,
      id,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword
      ? showPassword
        ? 'text'
        : 'password'
      : type;
    const isError = !!error;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[1rem] font-semibold text-gray-700"
          >
            {label}
            {isRequiredIcon && (
              <span className="ml-0.5 align-middle text-lg text-red-500">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
            className={twMerge(
              clsx(textfieldVariants({ isError, isPassword }), className),
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
              className="absolute top-1/2 right-4 flex -translate-y-1/2 cursor-pointer items-center text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);
