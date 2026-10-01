import type { SVGProps } from 'react';

interface IcPlusProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * 더하기 아이콘. Figma `ic_plus` (I4:3994;4:9190)
 *
 * stroke를 currentColor로 둬서 부모의 text 색을 따라갑니다.
 * 시안 기본값은 grayscale-500(#737373)입니다.
 */
const IcPlus = ({ className, ...props }: IcPlusProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path
        d="M4.16667 10H15.4167"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.79167 15.625V4.375"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IcPlus;
