import type { Meta, StoryObj } from '@storybook/nextjs';
import Button from '@/components/ui/button/Button';
import Toast from './Toast';
import Toaster, { toast } from './Toaster';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: { layout: 'padded' },
  args: { children: '저장이 완료되었습니다', variant: 'success' },
  argTypes: {
    variant: { control: 'select', options: ['success', 'error'] },
    children: { control: 'text' },
    meta: { control: 'text' },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  name: 'success',
};

export const SuccessWithMeta: Story = {
  name: 'success / meta',
  args: { children: '임시 저장이 완료되었습니다', meta: '1초전' },
};

export const ErrorDefault: Story = {
  name: 'error',
  args: { variant: 'error', children: '저장에 실패했습니다' },
};

export const Closable: Story = {
  name: '닫기 버튼',
  args: {
    variant: 'error',
    children: '저장에 실패했습니다',
    onClose: () => {},
  },
};

export const LongText: Story = {
  name: '긴 텍스트',
  args: {
    variant: 'error',
    children:
      '네트워크 연결이 불안정하여 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.',
  },
};

export const Playground: Story = {
  name: 'Toaster 호출',
  render: () => (
    <div className="flex max-w-120 gap-2">
      <Toaster />
      <Button
        size="sm"
        onClick={() =>
          toast.success('임시 저장이 완료되었습니다', { meta: '1초전' })
        }
      >
        success
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toast.error('저장에 실패했습니다')}
      >
        error
      </Button>
      <Button
        size="sm"
        variant="neutral"
        onClick={() =>
          toast.error('저장에 실패했습니다', {
            closable: true,
            duration: Infinity,
          })
        }
      >
        closable
      </Button>
    </div>
  ),
};
