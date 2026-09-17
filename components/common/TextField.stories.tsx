import { useForm } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { TextField, type TextFieldProps } from './TextField';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type StoryArgs = Omit<TextFieldProps<FormValues>, 'register' | 'name'> & {
  name: keyof FormValues;
};

function TextFieldWithForm(args: StoryArgs & { name: keyof FormValues }) {
  const { register } = useForm<FormValues>();

  return <TextField {...args} register={register} name={args.name} />;
}

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: {
    label: '이름',
    placeholder: '이름을 입력하세요',
    name: 'name',
  },
  render: (args) => <TextFieldWithForm {...args} name="name" />,
};

export const isRequiredIcon: Story = {
  args: {
    label: '이메일',
    value: 'abc@defgh.com',
    placeholder: '입력할 수 없습니다.',
    isRequiredIcon: true,
  },
  render: (args) => <TextFieldWithForm {...args} name="email" />,
};

export const NonLabel: Story = {
  args: {
    placeholder: '이메일을 입력해주세요',
    name: 'email',
    type: 'email',
  },

  render: (args) => <TextFieldWithForm {...args} name="email" />,
};

export const Email: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
    type: 'email',
    name: 'email',
  },

  render: (args) => <TextFieldWithForm {...args} name="email" />,
};

export const Password: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
    name: 'password',
  },

  render: (args) => <TextFieldWithForm {...args} name="password" />,
};

export const Error: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    name: 'email',
    error: {
      type: 'required',
      message: '이메일을 입력해주세요.',
    } as FieldError,
  },

  render: (args) => <TextFieldWithForm {...args} name="email" />,
};

export const PasswordError: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
    error: {
      type: 'validate',
      message: '비밀번호가 올바르지 않습니다.',
    } as FieldError,
  },

  render: (args) => <TextFieldWithForm {...args} name="password" />,
};

export const Disabled: Story = {
  args: {
    label: '이메일',
    value: 'abc@defgh.com',
    placeholder: '입력할 수 없습니다.',
    disabled: true,
  },

  render: (args) => <TextFieldWithForm {...args} name="email" />,
};
