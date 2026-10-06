import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import IntlTestProvider from '@/test/IntlTestProvider';
import { request } from '@/lib/api/client-fetcher';
import { ApiError } from '@/lib/api/errors';
import { toast } from '@/components/ui/toast/Toaster';
import LandingStartButton from './LandingStartButton';

const push = vi.fn();
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/lib/api/client-fetcher', () => ({ request: vi.fn() }));
vi.mock('@/components/ui/toast/Toaster', () => ({ toast: { error: vi.fn() } }));
beforeEach(() => {
  vi.clearAllMocks();
});
const renderButton = () =>
  render(
    <IntlTestProvider>
      <LandingStartButton>시작하기</LandingStartButton>
    </IntlTestProvider>,
  );

describe('랜딩 시작하기', () => {
  it('유효한 사용자 응답을 받은 뒤 대시보드로 이동한다', async () => {
    vi.mocked(request).mockResolvedValue({ id: 1 });
    renderButton();
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }));
    expect(request).toHaveBeenCalledWith({ url: '/users/me' });
    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
  });
  it('토큰 갱신으로도 인증되지 않으면 로그인으로 이동한다', async () => {
    vi.mocked(request).mockRejectedValue(
      new ApiError('http', 'Unauthorized', { status: 401 }),
    );
    renderButton();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/login'));
  });
  it.each([
    new ApiError('network', 'Offline'),
    new ApiError('http', 'Server error', { status: 500 }),
  ])('통신·서버 오류에는 이동하지 않고 재시도를 허용한다', async (error) => {
    vi.mocked(request).mockRejectedValue(error);
    renderButton();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeEnabled();
  });
  it('확인 중에는 중복 요청을 보내지 않는다', async () => {
    vi.mocked(request).mockReturnValue(new Promise(() => {}));
    renderButton();
    const button = screen.getByRole('button');
    await userEvent.dblClick(button);
    expect(request).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
  });
});
