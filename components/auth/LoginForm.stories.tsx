import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within } from 'storybook/test';

import TestProviders from '@/test/TestProviders';
import LoginForm from './LoginForm';

const withAuthWidth: Decorator = (Story) => (
  <TestProviders>
    <div className="mx-auto w-[clamp(12.5rem,88.27vw,25rem)]">
      <Story />
    </div>
  </TestProviders>
);

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'padded',
    // useRouter가 next/navigation을 쓰므로 App Router 모드로 렌더링합니다.
    nextjs: { appDirectory: true },
  },
  decorators: [withAuthWidth],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
};

export const FieldError: Story = {
  name: '필드 오류',
  play: async ({ canvasElement }) => {
    const submit = within(canvasElement).getByRole('button', {
      name: '로그인하기',
    });
    await userEvent.click(submit);
  },
};
