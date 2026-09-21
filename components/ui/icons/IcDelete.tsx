import type { SVGProps } from 'react';

interface IcDeleteProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * 닫기(X) 아이콘. Figma `ic_delete` (4:9408)
 *
 * stroke를 currentColor로 둬서 부모의 text 색을 따라갑니다.
 * 시안 기본값은 slate/400(#A4A4A4)이므로 `className="text-[#A4A4A4]"`로 사용하세요.
 *
 * 좌표가 6→18.5라 세로 중심이 12가 아니라 12.5입니다. 시안 그대로입니다.
 */
const IcDelete = ({ className, ...props }: IcDeleteProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path
        d="M6 6.5L18 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 6.5L6 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IcDelete;
