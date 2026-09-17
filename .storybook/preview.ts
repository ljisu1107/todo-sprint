import type { Preview } from '@storybook/nextjs';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['UI', ['Button', ['Button', '*']]],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
