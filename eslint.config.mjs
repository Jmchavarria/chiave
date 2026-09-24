// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      '@typescript-eslint/no-unnecessary-type-assertion': 'warn', // evita casteos innecesarios (value as string)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false, // 👈 Añade esto
        },
      ], // fuerza: import type { X } cuando solo es un tipo
      '@typescript-eslint/no-inferrable-types': 'warn', // evita: const x: number = 5 (TypeScript ya lo infiere)
      '@typescript-eslint/prefer-nullish-coalescing': 'warn', // prefiere ?? sobre ||
      '@typescript-eslint/prefer-optional-chain': 'warn', // prefiere a?.b?.c sobre a && a.b && a.b.c

      // ─── Seguridad y bugs ──────────────────────────────
      '@typescript-eslint/no-unused-vars': 'error', // variables declaradas pero no usadas
      '@typescript-eslint/no-shadow': 'warn', // evita re-declarar variables del scope padre
      'no-console': 'warn', // avisa si dejas console.log olvidados

      // ─── Buenas prácticas generales ────────────────────
      eqeqeq: ['error', 'always'], // fuerza === en vez de ==
      'no-return-await': 'warn', // evita return await innecesario
      'prefer-const': 'error', // fuerza const cuando la variable no cambia
    },
  },
);
