import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import type { FormEvent } from 'react';
import { fn } from 'storybook/test';

import messages from '@/messages/ko.json';
import LoginForm from './LoginForm';

const withAuthWidth: Decorator = (Story) => (
  <NextIntlClientProvider locale="ko" messages={messages}>
    <div className="mx-auto w-[clamp(12.5rem,88.27vw,25rem)]">
      <Story />
    </div>
  </NextIntlClientProvider>
);

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: { layout: 'padded' },
  decorators: [withAuthWidth],
  args: {
    onSubmit: fn((event: FormEvent<HTMLFormElement>) => event.preventDefault()),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
};

// Figma 오류 시안의 예시 문구
export const FieldError: Story = {
  name: '필드 오류',
  args: { errors: { password: '비밀번호가 일치하지 않습니다.' } },
};
