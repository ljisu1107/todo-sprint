import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within } from 'storybook/test';

import TestProviders from '@/test/TestProviders';
import SignupForm from './SignupForm';

const withAuthWidth: Decorator = (Story) => (
  <TestProviders>
    <div className="mx-auto w-[clamp(12.5rem,88.27vw,25rem)]">
      <Story />
    </div>
  </TestProviders>
);

const meta = {
  title: 'Auth/SignupForm',
  component: SignupForm,
  parameters: {
    layout: 'padded',
    // useRouter가 next/navigation을 쓰므로 App Router 모드로 렌더링합니다.
    nextjs: { appDirectory: true },
  },
  decorators: [withAuthWidth],
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
};

export const FieldError: Story = {
  name: '필드 오류',
  play: async ({ canvasElement }) => {
    const submit = within(canvasElement).getByRole('button', {
      name: '회원가입 하기',
    });
    await userEvent.click(submit);
  },
};
