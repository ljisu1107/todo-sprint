import type { Meta, StoryObj } from '@storybook/nextjs';
import SocialLoginButton from './SocialLoginButton';

const meta = {
  title: 'UI/Button/SocialLoginButton',
  component: SocialLoginButton,
  parameters: { layout: 'centered' },
  argTypes: {
    provider: { control: 'select', options: ['google', 'kakao'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SocialLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = {
  name: '구글',
  args: { provider: 'google', disabled: false },
};

export const Kakao: Story = {
  name: '카카오',
  args: { provider: 'kakao', disabled: false },
};
