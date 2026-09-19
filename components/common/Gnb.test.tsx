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

const route = vi.hoisted(() => ({ pathname: '/dashboard' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));
vi.mock('next/link', () => ({
  default: ({
    onNavigate,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { onNavigate?: () => void }) => (
    <a
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) onNavigate?.();
        // jsdom에서는 실제 페이지 이동을 실행하지 않습니다.
        event.preventDefault();
      }}
    />
  ),
}));

beforeEach(() => {
  route.pathname = '/dashboard';
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
  it('목표를 기본으로 펼치고 링크 이동 후 경로에 맞는 메뉴를 활성화한다', () => {
    route.pathname = '/dashboard/detail';
    render(<Gnb />);
    const goal = menu().getByRole('button', { name: '목표' });
    expect(goal).toHaveAttribute('data-active', 'true');
    expect(goal).toHaveAttribute('aria-expanded', 'true');
    const dashboard = menu().getByRole('link', { name: '대시보드' });
    expect(dashboard).not.toHaveAttribute('aria-current');
    fireEvent.click(dashboard);
    expect(dashboard).toHaveAttribute('aria-current', 'page');
    expect(dashboard.querySelector('[aria-hidden]')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(menu().getByRole('link', { name: '캘린더' })).toHaveAttribute(
      'data-active',
      'false',
    );
  });

  it('목표 제목을 선택해도 아코디언의 열기와 닫기가 유지된다', () => {
    render(<Gnb />);
    const goal = menu().getByRole('button', { name: '목표' });
    fireEvent.click(goal);
    expect(goal).toHaveAttribute('data-active', 'true');
    expect(goal).toHaveAttribute('aria-expanded', 'false');
    expect(menu().getByRole('link', { name: '대시보드' })).not.toHaveAttribute(
      'aria-current',
    );
    fireEvent.click(goal);
    expect(goal).toHaveAttribute('aria-expanded', 'true');
    expect(goal).toHaveAttribute('data-active', 'true');
  });

  it('링크 이동과 경로 변경 시 목표 선택을 초기화한다', () => {
    const view = render(<Gnb />);
    fireEvent.click(menu().getByRole('button', { name: '목표' }));
    fireEvent.click(menu().getByRole('link', { name: '대시보드' }));
    expect(menu().getByRole('link', { name: '대시보드' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    fireEvent.click(menu().getByRole('button', { name: '목표' }));
    route.pathname = '/dashboard/another';
    view.rerender(<Gnb />);
    expect(menu().getByRole('button', { name: '목표' })).toHaveAttribute(
      'data-active',
      'false',
    );
    expect(menu().getByRole('link', { name: '대시보드' })).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('비슷한 경로와 임시 링크를 활성화하지 않고 설정·로그아웃을 제외한다', () => {
    route.pathname = '/dashboard-other';
    const view = render(<Gnb />);
    expect(menu().getByRole('link', { name: '대시보드' })).toHaveAttribute(
      'data-active',
      'false',
    );
    route.pathname = '/';
    view.rerender(<Gnb />);
    for (const title of ['캘린더', '소통 게시판', '찜한 할 일']) {
      expect(menu().getByRole('link', { name: title })).toHaveAttribute(
        'href',
        '#',
      );
      expect(menu().getByRole('link', { name: title })).toHaveAttribute(
        'data-active',
        'false',
      );
    }
    for (const title of ['설정', '로그아웃']) {
      expect(screen.getByRole('link', { name: title })).not.toHaveAttribute(
        'aria-current',
      );
    }
  });
});
