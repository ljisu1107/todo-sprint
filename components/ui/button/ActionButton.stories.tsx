import type { Meta, StoryObj } from '@storybook/nextjs';
import ActionButton from './ActionButton';

const meta = {
  title: 'UI/Button/ActionButton',
  component: ActionButton,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['goal', 'task'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Goal: Story = {
  name: '새 목표',
  args: { variant: 'goal', disabled: false },
};

export const Task: Story = {
  name: '새 할일',
  args: { variant: 'task', disabled: false },
};
