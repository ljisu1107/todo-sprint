import { useEffect, useRef, type FormEvent } from 'react';

const IDLE_VALIDATION_DELAY_MS = 1000;

/** 입력을 멈추고 1초가 지나면 그 필드를 검증합니다. 반환값은 form에 펼쳐 넣습니다. */
const useValidateOnIdle = <Name extends string>(
  validate: (name: Name) => unknown,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancel = () => clearTimeout(timerRef.current);

  const restart = (event: FormEvent<HTMLFormElement>) => {
    cancel();
    const { name } = event.target as HTMLInputElement;
    timerRef.current = setTimeout(
      () => validate(name as Name),
      IDLE_VALIDATION_DELAY_MS,
    );
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { onChange: restart, onBlur: cancel };
};

export default useValidateOnIdle;
