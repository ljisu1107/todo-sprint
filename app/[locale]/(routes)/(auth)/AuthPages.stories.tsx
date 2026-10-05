import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';

import TestProviders from '@/test/TestProviders';
import AuthLayout from './layout';
import LoginPage from './login/page';
import SignupPage from './signup/page';

/** 실제 라우트와 같이 인증 레이아웃 안에 페이지를 그립니다. */
const withAuthLayout: Decorator = (Story) => (
  <TestProviders>
    <AuthLayout>
      <Story />
    </AuthLayout>
  </TestProviders>
);

const meta = {
  title: 'Auth/Pages',
  parameters: {
    layout: 'fullscreen',
    // i18n Link가 next/navigation을 쓰므로 App Router 모드로 렌더링합니다.
    nextjs: { appDirectory: true },
  },
  decorators: [withAuthLayout],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  name: '로그인 화면',
  render: () => <LoginPage />,
};

export const Signup: Story = {
  name: '회원가입 화면',
  render: () => <SignupPage />,
};
