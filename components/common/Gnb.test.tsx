import '@testing-library/jest-dom/vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import type { AnchorHTMLAttributes } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Gnb from './Gnb';

vi.mock('next/link', () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const menu = () => within(screen.getByRole('navigation', { name: '주 메뉴' }));

describe('주 메뉴 활성 상태', () => {
  it('목표를 기본 선택하고 목록을 펼친다', () => {
    render(<Gnb />);
    expect(menu().getByRole('link', { name: '목표' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      menu().getByRole('button', { name: '목표 목록 접기' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('이동을 차단하고 클릭한 주 메뉴 하나와 아이콘만 활성화한다', () => {
    render(<Gnb />);
    const titles = ['대시보드', '캘린더', '소통 게시판', '찜한 할 일', '목표'];
    for (const title of titles) {
      const link = menu().getByRole('link', { name: title });
      expect(fireEvent.click(link)).toBe(false);
      for (const candidate of titles) {
        const item = menu().getByRole('link', { name: candidate });
        expect(item).toHaveAttribute(
          'data-active',
          String(candidate === title),
        );
        expect(item.querySelector('[data-active]')).toHaveAttribute(
          'data-active',
          String(candidate === title),
        );
        if (candidate === title)
          expect(item).toHaveAttribute('aria-current', 'page');
        else expect(item).not.toHaveAttribute('aria-current');
      }
    }
  });

  it('제목 링크 선택과 화살표 펼침 동작이 서로 영향을 주지 않는다', () => {
    render(<Gnb />);
    const calendar = menu().getByRole('link', { name: '캘린더' });
    fireEvent.click(calendar);
    fireEvent.click(menu().getByRole('button', { name: '목표 목록 접기' }));
    expect(calendar).toHaveAttribute('data-active', 'true');
    const toggle = menu().getByRole('button', { name: '목표 목록 펼치기' });
    const panel = document.getElementById(
      toggle.getAttribute('aria-controls')!,
    );
    expect(panel).toHaveAttribute('inert');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(menu().getByRole('link', { name: '목표' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('inert');
    expect(menu().getByRole('link', { name: '목표' })).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(menu().getByRole('link', { name: '목표' }).contains(toggle)).toBe(
      false,
    );
  });
});

it('배치 위치가 달라도 같은 알림 상태와 열기 함수를 사용한다', () => {
  const onOpenNotifications = vi.fn();
  const view = render(
    <Gnb
      pageTitle="내 정보 관리"
      hasNotification
      onOpenNotifications={onOpenNotifications}
    />,
  );
  expect(screen.getByText('내 정보 관리')).toBeInTheDocument();
  // jsdom은 반응형 CSS를 계산하지 않으므로 세 배치의 공통 연결을 검증합니다.
  const buttons = screen.getAllByRole('button', {
    name: '알림 열기 (새 알림 있음)',
  });
  expect(buttons).toHaveLength(3);
  buttons.forEach((button) => fireEvent.click(button));
  expect(onOpenNotifications).toHaveBeenCalledTimes(3);
  view.rerender(
    <Gnb hasNotification={false} onOpenNotifications={onOpenNotifications} />,
  );
  expect(
    screen.queryByRole('button', { name: '알림 열기 (새 알림 있음)' }),
  ).not.toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: '알림 열기' })).toHaveLength(3);
});
