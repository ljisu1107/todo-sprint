import type { SVGProps } from 'react';

/**
 * 피그마 icons 섹션(node 4:9333)에서 SVG를 export해 각 컴포넌트 내부를 채워야 합니다.
 * 현재는 크기와 뷰박스만 맞춘 빈 껍데기입니다.
 */
type IconProps = SVGProps<SVGSVGElement>;

export function IconCheckboxInactive(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 18 18" {...props} />;
}

export function IconCheckboxActive(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 18 18" {...props} />;
}

export function IconNoteView(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 24 24" {...props} />;
}

export function IconNoteWrite(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 24 24" {...props} />;
}

export function IconLink(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 24 24" {...props} />;
}

export function IconKebab(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 24 24" {...props} />;
}

export function IconStarFilled(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 24 24" {...props} />;
}

export function IconStarOutline(props: IconProps) {
  return <svg aria-hidden viewBox="0 0 24 24" {...props} />;
}
