import type { Meta, StoryObj } from '@storybook/nextjs';
import TodoStatusChip from './TodoStatusChip';

const meta = {
  title: 'Todo/TodoStatusChip',
  component: TodoStatusChip,
  parameters: { layout: 'centered' },
  argTypes: {
    isTodo: {
      control: 'select',
      options: [true, false],
    },
  },
} satisfies Meta<typeof TodoStatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToDo: Story = {
  name: 'TO DO',
  args: {
    isTodo: false,
  },
};

export const Done: Story = {
  name: 'DONE',
  args: {
    isTodo: true,
  },
};
