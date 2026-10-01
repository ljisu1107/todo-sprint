import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast/Toaster';
import { deleteTodo } from '@/lib/api/todos';
import TestProviders from '@/test/TestProviders';
import DeleteTodoModal from './DeleteTodoModal';

vi.mock('@/lib/api/todos', () => ({ deleteTodo: vi.fn() }));
vi.mock('@/components/ui/toast/Toaster', () => ({
  toast: { error: vi.fn() },
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

const confirmDelete = async (onDeleted?: (todoId: number) => void) => {
  // 모달이 열려 있는 동안 Radix가 body에 pointer-events: none을 겁니다.
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  const onClose = vi.fn();
  render(
    <TestProviders>
      <DeleteTodoModal
        todo={{ id: 7, title: '할 일 7' }}
        onClose={onClose}
        onDeleted={onDeleted}
      />
    </TestProviders>,
  );
  await user.click(screen.getByRole('button', { name: '확인' }));
  return { onClose };
};

describe('DeleteTodoModal', () => {
  it('할 일 제목이 들어간 확인 문구를 보여준다', () => {
    render(
      <TestProviders>
        <DeleteTodoModal todo={{ id: 7, title: '할 일 7' }} onClose={vi.fn()} />
      </TestProviders>,
    );

    expect(
      screen.getByRole('dialog', { name: '할 일 7 할 일을 삭제하시겠습니까?' }),
    ).toBeInTheDocument();
  });

  it('삭제가 성공하면 onDeleted에 id를 넘기고 닫는다', async () => {
    vi.mocked(deleteTodo).mockResolvedValue();
    const onDeleted = vi.fn();

    const { onClose } = await confirmDelete(onDeleted);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(deleteTodo).toHaveBeenCalledWith(7);
    expect(onDeleted).toHaveBeenCalledWith(7);
  });

  it('onDeleted에서 예외가 나도 닫고, 삭제 실패로 다루지 않는다', async () => {
    vi.mocked(deleteTodo).mockResolvedValue();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const onDeleted = vi.fn(() => {
      throw new Error('화면 갱신 실패');
    });

    const { onClose } = await confirmDelete(onDeleted);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(toast.error).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
  });

  it('삭제가 실패하면 토스트를 띄우고 onDeleted·닫기를 실행하지 않는다', async () => {
    vi.mocked(deleteTodo).mockRejectedValue(new Error('network'));
    const onDeleted = vi.fn();

    const { onClose } = await confirmDelete(onDeleted);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('할 일을 삭제하지 못했어요'),
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
