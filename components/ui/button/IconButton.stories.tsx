import type { Meta, StoryObj } from '@storybook/nextjs';
import IconButton from './IconButton';

const meta = {
  title: 'UI/Button/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  argTypes: {
    icon: { control: false },
    size: { control: false },
    hasNotification: { control: false },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChevronUp: Story = {
  name: '위 화살표',
  args: { icon: 'chevron-up', 'aria-label': '접기' },
};

export const ChevronDown: Story = {
  name: '아래 화살표',
  args: { icon: 'chevron-down', 'aria-label': '펼치기' },
};

export const Bell: Story = {
  name: '알림',
  args: { icon: 'bell', 'aria-label': '알림' },
};

export const BellWithNotification: Story = {
  name: '새 알림 있음',
  args: { icon: 'bell', 'aria-label': '알림', hasNotification: true },
};

export const CloseSmall: Story = {
  name: '닫기 / Small',
  args: { icon: 'close', size: 'sm', 'aria-label': '닫기' },
};

export const CloseDefault: Story = {
  name: '닫기 / Default',
  args: { icon: 'close', size: 'md', 'aria-label': '닫기' },
};
