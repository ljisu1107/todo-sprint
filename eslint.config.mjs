import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import betterTailwind from 'eslint-plugin-better-tailwindcss';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    settings: {
      react: {
        version: '19.2.8', // package.json에 있는 react 버전 명시
      },
    },
  },
  {
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: {
      'better-tailwindcss': { entryPoint: 'app/globals.css' },
    },
    rules: {
      ...betterTailwind.configs.recommended.rules,
      // 줄바꿈은 prettier가 담당
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          ignore: ['material-symbols-outlined', 'material-symbols-*'],
        },
      ],
    },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
