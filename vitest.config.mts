import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      'server-only': new URL('./vitest.server-only.ts', import.meta.url)
        .pathname,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    env: { BACKEND_API_URL: 'http://backend.test' },
    // next-intl ESM이 확장자 없이 'next/navigation'을 import해서 Node가 해석하지 못하므로
    // Vite가 직접 변환(inline)해 경로를 해석하도록 합니다.
    server: { deps: { inline: ['next-intl'] } },
  },
});
