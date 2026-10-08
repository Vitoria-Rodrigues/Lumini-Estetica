import path from 'node:path';
import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintPluginImportX from 'eslint-plugin-import-x';
// import eslintReact from '@eslint-react/eslint-plugin';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import * as mdx from 'eslint-plugin-mdx';
import eslintPluginDocusaurus from '@docusaurus/eslint-plugin';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // ...tseslint.configs.recommendedTypeChecked,
  // ...tseslint.configs.stylisticTypeChecked,

  {
    name: 'monorepo/global-typescript-config',
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: ['**/*.md/**', '**/*.mdx/**'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.{js,mjs,cjs,ts}'],
          noWarnOnMultipleProjects: true,
        },
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'import-x': eslintPluginImportX,
    },
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json', 'app/tsconfig.json', 'docs/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import-x/ignore': [
        '.css$',
        '.scss$',
        '.sass$',
        '.less$',
        '.styl$',
        '.module.(css|scss|sass|less|styl)$',
      ],
    },
    // ============================================================================
    // REGRAS GLOBAIS EMPRESARIAIS (SUGESTÃO FUTURA)
    // ============================================================================
    // Aqui listamos algumas regras rígidas que são excelentes para projetos em escala.
    // Elas forçam tratamentos de erros mais restritos (como em Promessas flutuantes)
    // e banem o uso inseguro de retornos não tipados.
    // Para adotar, basta descomentar as regras quando a equipe se sentir confortável.
    /*
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/naming-convention': 'off',
      'import-x/no-duplicates': 'warn',
      'import-x/no-unresolved': [
        'error',
        {
          ignore: [
            '\\.css$',
            '\\.scss$',
            '\\.sass$',
            '\\.less$',
            '\\.styl$',
            '\\.module\\.(css|scss|sass|less|styl)$'
          ],
        },
      ],
      'import-x/order': 'off',
      'import-x/newline-after-import': 'off',
      'import-x/first': 'off',
      'import-x/no-default-export': 'off',
    }
    */
  },

  {
    name: 'monorepo/root-config-files',
    files: [
      '*.{js,mjs,ts}',
      '*.config.{js,mjs,ts}',
      '**/*.config.{js,mjs,cjs,ts}',
      '**/postcss.config.{js,mjs,cjs,ts}',
      'docs/src/mock-asset.js',
    ],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        exports: 'writable',
        URLSearchParams: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // CONFIGURAÇÃO ATIVA DO APP (Vinda de app/eslint.config.js)
  {
    name: 'monorepo/app-active',
    files: ['app/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin as Record<string, unknown>,
      'react-refresh': reactRefreshPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Regras que estariam no extends
      ...(reactHooksPlugin.configs.recommended.rules as Record<string, unknown>),
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ============================================================================
  // REGRAS EMPRESARIAIS PARA O APP (SUGESTÃO FUTURA PARA PRODUÇÃO)
  // ============================================================================
  // Quando o projeto começar a crescer e receber muitos usuários em produção,
  // habilitar este bloco garantirá uma maior estabilidade.
  //
  // Por que essas regras são importantes em produção?
  // 1. @eslint-react/strict-type-checked: Impede falhas silenciosas de renderização do React
  //    garantindo que os componentes recebam exatamente os tipos que esperam.
  // 2. strict-boolean-expressions: Evita bugs difíceis de achar com valores "falsy" (ex: renderizar um 0 acidental na tela).
  // 3. no-console: Garante que não vazem logs de debug para o navegador do usuário, protegendo a segurança e performance.
  //
  // Como usar: Quando sentir que o código está maduro, basta descomentar o bloco abaixo.
  //
  // {
  //   name: 'monorepo/app',
  //   files: ['app/**/*.{ts,tsx}'],
  //   ignores: ['**/*.md/**', '**/*.mdx/**'],
  //   plugins: {
  //     '@eslint-react': eslintReact,
  //     'react-refresh': reactRefreshPlugin,
  //   },
  //   rules: {
  //     ...eslintReact.configs['strict-type-checked'].rules,
  //     'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  //     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  //     '@typescript-eslint/strict-boolean-expressions': 'error',
  //   },
  // },

  {
    name: 'monorepo/docs-workspace',
    files: ['docs/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@docusaurus': eslintPluginDocusaurus as Record<string, unknown>,
    },
    rules: {
      ...(eslintPluginDocusaurus.configs.recommended.rules as Record<string, unknown>),
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['^@docusaurus/', '^@theme/', '^@site/'],
        },
      ],
    },
  },

  {
    ...mdx.flat,
    name: 'monorepo/mdx-files',
    files: ['**/*.mdx'],
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
  },
  {
    name: 'monorepo/disable-typecheck-for-non-project-files',
    files: ['**/*.{js,cjs,mjs,jsx,mdx}', '.agents/**/*.ts', '**/.agents/**/*.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    name: 'monorepo/mdx-prettier',
    files: ['**/*.mdx'],
    rules: {
      'prettier/prettier': ['error', { parser: 'mdx' }],
    },
  },

  {
    name: 'monorepo/test-files',
    files: ['**/*.{test,spec}.{js,mjs,ts,tsx}', '**/__tests__/**/*.{js,mjs,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'no-console': 'off',
    },
  },

  {
    name: 'monorepo/ignores',
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.eslintcache',
      '**/*.json',
      '**/*.css',
      '**/*.scss',
      '**/*.sass',
      '**/*.less',
      '**/*.styl',
      'supabase/**',
      'app/src/**',
      'docker-compose*.yaml',
      '**/types/**/*.d.ts',
      '**/*.d.ts',
      '**/vite-env.d.ts',
      '**/.docusaurus/**',
      '**/static/**',
      '**/i18n/**',
      '**/translations/**',
    ],
  },

  {
    name: 'monorepo/prettier',
    ignores: ['app/**'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  eslintConfigPrettier,
]);
