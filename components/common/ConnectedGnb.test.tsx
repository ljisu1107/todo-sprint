import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { beforeEach, expect, it, vi } from 'vitest';
import type { AnchorHTMLAttributes } from 'react';
import TestProviders from '@/test/TestProviders';
import { getMe } from '@/lib/api/user';
import { userQueries } from '@/queries/user';
import { logout } from '@/lib/api/auth';
import ConnectedGnb from './ConnectedGnb';

const { replace, refresh, toastError } = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  toastError: vi.fn(),
}));
let pathname = '/dashboard';
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ replace, refresh }),
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));
vi.mock('@/lib/api/auth', () => ({ logout: vi.fn() }));
vi.mock('@/components/ui/toast/Toaster', () => ({
  toast: { error: toastError },
}));
vi.mock('@/lib/api/user', () => ({ getMe: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  pathname = '/dashboard';
  vi.clearAllMocks();
  vi.mocked(logout).mockResolvedValue(undefined);
  vi.mocked(getMe).mockResolvedValue({
    id: 1,
    name: '상환',
    email: 'test@example.com',
    image: null,
    teamId: 'team',
    createdAt: '',
    updatedAt: '',
  });
});

it('실제 사용자명을 모바일 제목과 프로필에 표시한다', async () => {
  render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  expect(await screen.findByText('상환님의 대시보드')).toBeInTheDocument();
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
  expect(screen.queryByText('체다치즈')).not.toBeInTheDocument();
});
it('현재 페이지가 바뀌면 제목도 바뀐다', async () => {
  const view = render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  await screen.findByText('상환님의 대시보드');
  pathname = '/todos';
  view.rerender(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  expect(screen.getByText('모든 할 일')).toBeInTheDocument();
  expect(screen.queryByText('상환님의 대시보드')).not.toBeInTheDocument();
});
it('대시보드에서는 해당 메뉴만 활성화하고 경로가 바뀌면 선택도 갱신한다', async () => {
  const view = render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  await screen.findByText('상환님의 대시보드');
  const nav = screen.getByRole('navigation', { name: '주 메뉴' });
  const dashboard = within(nav).getByRole('link', { name: '대시보드' });
  const goal = within(nav).getByRole('link', { name: '노트 모아보기' });
  expect(nav.querySelectorAll('a[data-active="true"]')).toHaveLength(1);
  expect(dashboard).toHaveAttribute('aria-current', 'page');
  expect(dashboard).toHaveAttribute('aria-current', 'page');
  expect(goal).not.toHaveAttribute('aria-current');
  pathname = '/notes';
  view.rerender(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  expect(goal).toHaveAttribute('aria-current', 'page');
  expect(dashboard).not.toHaveAttribute('aria-current');
  pathname = '/dashboard';
  view.rerender(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  expect(dashboard).toHaveAttribute('aria-current', 'page');
  expect(goal).not.toHaveAttribute('aria-current');
});
it('사용자 조회 실패 시 임시 이름 대신 기본 제목을 표시한다', async () => {
  vi.mocked(getMe).mockRejectedValue(new Error('Offline'));
  render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  await waitFor(() => expect(getMe).toHaveBeenCalled());
  expect(screen.queryByText(/님의 대시보드/)).not.toBeInTheDocument();
  expect(screen.queryByText('chedacheese@slid.kr')).not.toBeInTheDocument();
});
it('헤더와 페이지가 동시에 조회해도 요청을 공유한다', async () => {
  function PageUser() {
    const { data } = useQuery(userQueries.me());
    return <p>{data ? `페이지 사용자: ${data.name}` : '조회 중'}</p>;
  }
  render(
    <TestProviders>
      <ConnectedGnb />
      <PageUser />
    </TestProviders>,
  );
  await screen.findByText('페이지 사용자: 상환');
  await screen.findByText('상환님의 대시보드');
  expect(getMe).toHaveBeenCalledTimes(1);
});

it('시연 메뉴를 숨기고 실제 경로를 연결한다', async () => {
  render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  await screen.findByText('상환님의 대시보드');
  const nav = within(screen.getByRole('navigation'));
  expect(nav.queryByRole('link', { name: '목표' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '설정' })).not.toBeInTheDocument();
  expect(
    nav.queryByRole('link', { name: '찜한 할 일' }),
  ).not.toBeInTheDocument();
  for (const [name, href] of [
    ['대시보드', '/dashboard'],
    ['캘린더', '/calendar'],
    ['소통 게시판', '/posts'],
    ['노트 모아보기', '/notes'],
  ]) {
    expect(nav.getByRole('link', { name })).toHaveAttribute('href', href);
  }
});
it('로그아웃 성공 시 로그인으로 이동하고 중복 클릭을 막는다', async () => {
  let finish!: () => void;
  vi.mocked(logout).mockReturnValue(
    new Promise<void>((resolve) => {
      finish = resolve;
    }),
  );
  render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  await screen.findByText('상환님의 대시보드');
  const button = screen.getByRole('button', { name: '로그아웃' });
  fireEvent.click(button);
  fireEvent.click(button);
  await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
  expect(button).toBeDisabled();
  expect(replace).not.toHaveBeenCalled();
  finish();
  await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
  expect(refresh).toHaveBeenCalled();
});
it('로그아웃 실패 시 이동하지 않고 재시도할 수 있다', async () => {
  vi.mocked(logout).mockRejectedValue(new Error('Offline'));
  render(
    <TestProviders>
      <ConnectedGnb />
    </TestProviders>,
  );
  await screen.findByText('상환님의 대시보드');
  fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));
  await waitFor(() => expect(toastError).toHaveBeenCalled());
  expect(replace).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '로그아웃' })).toBeEnabled();
});
