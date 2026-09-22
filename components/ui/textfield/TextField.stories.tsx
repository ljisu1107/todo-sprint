import type { Meta, StoryObj } from '@storybook/nextjs';

import TextField from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '이름',
    placeholder: '이름을 입력하세요',
    name: 'name',
  },
};

export const RequiredIcon: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    isRequiredIcon: true,
  },
};

export const NonLabel: Story = {
  args: {
    placeholder: '이메일을 입력해주세요',
    type: 'email',
  },
};

export const Email: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
    type: 'email',
  },
};

export const Password: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
  },
};

export const Error: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    error: '이메일을 입력해주세요.',
  },
};

export const PasswordError: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
    error: '비밀번호가 올바르지 않습니다.',
  },
};

export const Disabled: Story = {
  args: {
    label: '이메일',
    value: 'abc@defgh.com',
    disabled: true,
  },
};
