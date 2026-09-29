import type { Meta, StoryObj } from '@storybook/nextjs';

import SearchInput from './SearchInput';

const meta = {
  title: 'UI/SearchInput',
  component: SearchInput,
  parameters: { layout: 'padded' },
  args: {
    'aria-label': '검색',
    placeholder: '검색어를 입력해주세요',
    className: 'max-w-[17.5rem]',
    onSearch: () => undefined,
  },
  argTypes: {
    size: { control: 'select', options: ['default', 'sm'] },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'default / 48px · 16px',
};

export const Small: Story = {
  name: 'small / 40px · 14px',
  args: { size: 'sm' },
};
