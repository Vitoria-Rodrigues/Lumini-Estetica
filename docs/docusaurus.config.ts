import type { Config } from '@docusaurus/types';
import type { MonorepoPresetOptions } from './preset/src/options';
import { getBaseThemeConfig } from './preset/src/themeConfig';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const projectConfig = {
  PROJECT_NAME: 'Lumini Estética',
  PROJECT_DOMAIN: 'lumini-estetica.vercel.app',
  GITHUB_ORG: 'Vitoria-Rodrigues',
  REPOSITORY_NAME: 'Lumini-Estetica',
};

import dotenv from 'dotenv';
dotenv.config();

const require = createRequire(import.meta.url);

interface WebpackMock {
  NormalModuleReplacementPlugin: new (
    resourceRegExp: RegExp,
    newResourceCallback: (resource: { request: string }) => void,
  ) => { apply: (...args: unknown[]) => void };
}

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: projectConfig.PROJECT_NAME,
  tagline: `Documentation for ${projectConfig.PROJECT_DOMAIN} monorepo`,
  favicon: 'brand/logos/logo-mark-blue.svg',

  // Set the production url of your site here
  url: `https://${projectConfig.PROJECT_DOMAIN}`,
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',
  trailingSlash: false,

  organizationName: projectConfig.GITHUB_ORG, // Usually your GitHub org/user name.
  projectName: projectConfig.REPOSITORY_NAME, // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenAnchors: 'ignore',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownImages: 'ignore',
      onBrokenMarkdownLinks: 'ignore',
    },
  },

  staticDirectories: ['static'],

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    localeConfigs: {
      'pt-BR': {
        label: 'Português (Brasil)',
        htmlLang: 'pt-BR',
      },
    },
  },

  presets: [
    [
      require.resolve('./preset/src/index.ts'),
      {
        liveCodeblock: {
          playgroundPosition: 'bottom',
        },
        docs: [
          {
            id: 'default',
            path: 'content/docs',
            routeBasePath: 'docs',
            sidebarPath: require.resolve('./preset/src/sidebars/index.ts'),
          },
          {
            id: 'community',
            path: 'content/community',
            routeBasePath: 'community',
            sidebarPath: require.resolve('./preset/src/sidebars/index.ts'),
          },
        ],
        blog: {
          path: 'content/blog',
          routeBasePath: 'blog',
          showReadingTime: true,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
        },
      } satisfies MonorepoPresetOptions,
    ],
  ],

  plugins: [
    () => ({
      name: 'monorepo-webpack-alias-plugin',
      configureWebpack() {
        const docusaurusNodeModules = path.join(__dirname, 'node_modules', '@docusaurus');
        const alias: Record<string, string> = {};

        if (fs.existsSync(docusaurusNodeModules)) {
          const packages = fs.readdirSync(docusaurusNodeModules);
          for (const pkg of packages) {
            alias[`@docusaurus/${pkg}$`] = path.join(docusaurusNodeModules, pkg);
            alias[`@docusaurus/${pkg}/internal`] = path.join(
              docusaurusNodeModules,
              pkg,
              'lib/internal.js',
            );
            alias[`@docusaurus/${pkg}/Details`] = path.join(
              docusaurusNodeModules,
              pkg,
              'lib/components/Details/index.js',
            );
            // generic fallback for subpaths that don't need exact matching
            alias[`@docusaurus/${pkg}/client`] = path.join(
              docusaurusNodeModules,
              pkg,
              'lib/client',
            );
          }
        }

        return {
          resolve: {
            alias,
          },
        };
      },
    }),
  ],

  themeConfig: getBaseThemeConfig(projectConfig),
};

export default config;
