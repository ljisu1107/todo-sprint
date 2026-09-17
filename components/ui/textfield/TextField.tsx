import { InputHTMLAttributes, useState } from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import clsx from 'clsx';

export interface TextFieldProps<T extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name'
> {
  /** react-hook-form의 register 함수 */
  register: UseFormRegister<T>;
  /** zod 스키마의 필드 이름 (예: "name", "email", "age") */
  name: Path<T>;
  /** 필드 라벨 */
  label?: string;
  /** zod resolver가 만들어주는 에러 객체 (formState.errors[name]) */
  error?: FieldError;
  /** 숫자 입력일 때 true로 주면 값이 숫자로 변환됩니다 */
  valueAsNumber?: boolean;
  /** required 아이콘을 제목 옆에 추가 여부 */
  isRequiredIcon?: boolean;
}

/**
 * react-hook-form + zod와 함께 쓰는 공용 텍스트 입력 컴포넌트.
 * 이름, 이메일, 숫자 등 대부분의 텍스트성 입력에 재사용할 수 있습니다.
 *
 * 사용 예시:
 * <TextField label="이름" name="name" type="text" register={register} error={errors.name} />
 * <TextField label="이메일" name="email" type="email" register={register} error={errors.email} />
 * <TextField label="나이" name="age" type="number" valueAsNumber register={register} error={errors.age} />
 */
export function TextField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  valueAsNumber,
  isRequiredIcon = false,
  type = 'text',
  className,
  ...rest
}: TextFieldProps<T>) {
  const inputId = `field-${name}`;
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[1rem] font-semibold text-gray-700"
        >
          {label}
          {isRequiredIcon && (
            <span className="ml-0.5 align-middle text-lg text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...register(
            name,
            valueAsNumber ? { valueAsNumber: true } : undefined,
          )}
          {...rest}
          className={clsx(
            'w-full rounded-2xl border border-[#CCCCCC] p-4 text-[1rem] text-gray-900 transition-colors outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            isPassword && 'pr-10',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
            className,
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
          {error.message}
        </p>
      )}
    </div>
  );
}
