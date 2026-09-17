import type { Meta, StoryObj } from '@storybook/nextjs';
import Button from './Button';

const meta = {
  title: 'UI/Button/Button',
  component: Button,
  parameters: { layout: 'padded' },
  args: { children: '버튼', variant: 'primary', size: 'md', disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'outline', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimarySmall: Story = {
  name: 'primary / Small',
  args: { variant: 'primary', size: 'sm' },
};

export const PrimaryDefault: Story = {
  name: 'primary / Default',
  args: { variant: 'primary', size: 'md' },
};

export const PrimaryLarge: Story = {
  name: 'primary / Large',
  args: { variant: 'primary', size: 'lg' },
};

export const PrimaryDisabled: Story = {
  name: 'primary / 비활성화',
  args: { variant: 'primary', disabled: true },
};

export const OutlineSmall: Story = {
  name: 'outline / Small',
  args: { variant: 'outline', size: 'sm' },
};

export const OutlineDefault: Story = {
  name: 'outline / Default',
  args: { variant: 'outline', size: 'md' },
};

export const OutlineLarge: Story = {
  name: 'outline / Large',
  args: { variant: 'outline', size: 'lg' },
};

export const OutlineDisabled: Story = {
  name: 'outline / 비활성화',
  args: { variant: 'outline', disabled: true },
};

export const NeutralSmall: Story = {
  name: 'neutral / Small',
  args: { variant: 'neutral', size: 'sm' },
};

export const NeutralDefault: Story = {
  name: 'neutral / Default',
  args: { variant: 'neutral', size: 'md' },
};

export const NeutralLarge: Story = {
  name: 'neutral / Large',
  args: { variant: 'neutral', size: 'lg' },
};

export const NeutralDisabled: Story = {
  name: 'neutral / 비활성화',
  args: { variant: 'neutral', disabled: true },
};
