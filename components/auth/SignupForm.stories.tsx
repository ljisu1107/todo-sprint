import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import type { FormEvent } from 'react';
import { fn } from 'storybook/test';

import messages from '@/messages/ko.json';
import SignupForm from './SignupForm';

const withAuthWidth: Decorator = (Story) => (
  <NextIntlClientProvider locale="ko" messages={messages}>
    <div className="mx-auto w-[clamp(12.5rem,88.27vw,25rem)]">
      <Story />
    </div>
  </NextIntlClientProvider>
);

const meta = {
  title: 'Auth/SignupForm',
  component: SignupForm,
  parameters: { layout: 'padded' },
  decorators: [withAuthWidth],
  args: {
    onSubmit: fn((event: FormEvent<HTMLFormElement>) => event.preventDefault()),
  },
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
};

// Figma 오류 시안의 예시 문구
export const FieldError: Story = {
  name: '필드 오류',
  args: { errors: { email: '잘못된 이메일입니다.' } },
};
