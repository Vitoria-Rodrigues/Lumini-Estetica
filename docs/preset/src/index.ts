import { createRequire } from 'node:module';
import type { Preset, LoadContext, PluginConfig, PluginOptions } from '@docusaurus/types';
import type { MonorepoPresetOptions, ThemeConfig } from './options';

import { createDocsInstances } from './plugins/content-docs/instances';
import { createBlogInstance } from './plugins/content-blog/instances';
import { createPagesInstance } from './plugins/content-pages/instances';
import path from 'node:path';

const require = createRequire(import.meta.url);

function makePluginConfig(
  source: string,
  options?: PluginOptions,
): string | [string, PluginOptions] {
  if (options !== undefined) {
    return [require.resolve(source), options];
  }
  return require.resolve(source);
}

export default function monorepoPreset(
  context: LoadContext,
  opts: MonorepoPresetOptions = {},
): Preset {
  const { siteConfig } = context;
  const { themeConfig } = siteConfig;
  const { algolia } = themeConfig as Partial<ThemeConfig>;
  const isProd = process.env.NODE_ENV === 'production';
  const {
    debug,
    docs,
    blog,
    sitemap,
    svgr,
    theme = {
      customCss: [require.resolve('../../theme/src/css/custom.css')],
    },
    liveCodeblock,
    gtag,
    googleTagManager,
    ...rest
  } = opts;

  const themes: PluginConfig[] = [];

  // BASE THEME
  themes.push(makePluginConfig('@docusaurus/theme-classic', theme));

  // ADD-ON THEMES
  themes.push(makePluginConfig('@docusaurus/theme-live-codeblock', liveCodeblock ?? {}));
  themes.push(require.resolve('@docusaurus/theme-mermaid'));

  // ALGOLIA SEARCH
  if (algolia !== undefined) {
    themes.push(require.resolve('@docusaurus/theme-search-algolia'));
  }

  // LOCAL OVERRIDE LAYER
  themes.push(makePluginConfig(require.resolve('../../theme/src/index.ts'), {}));

  if ('gtag' in themeConfig) {
    throw new Error(
      'The "gtag" field in themeConfig should now be specified as option for plugin-google-gtag.',
    );
  }

  const plugins: PluginConfig[] = [];

  // Enable CSS cascade layers if opt-in flag is enabled in siteConfig
  if (siteConfig.future.v4.useCssCascadeLayers === true) {
    plugins.push(makePluginConfig('@docusaurus/plugin-css-cascade-layers'));
  }

  // Inject Domain Wrapper Instances
  plugins.push(...createDocsInstances(opts));
  plugins.push(...createBlogInstance(opts));
  plugins.push(...createPagesInstance(opts));

  if (debug === true || (debug === undefined && isProd === false)) {
    plugins.push(require.resolve('@docusaurus/plugin-debug'));
  }
  if (gtag !== undefined) {
    plugins.push(makePluginConfig('@docusaurus/plugin-google-gtag', gtag));
  }
  if (googleTagManager !== undefined) {
    plugins.push(makePluginConfig('@docusaurus/plugin-google-tag-manager', googleTagManager));
  }
  if (sitemap !== false && (isProd === true || debug === true)) {
    plugins.push(makePluginConfig('@docusaurus/plugin-sitemap', sitemap));
  }
  if (svgr !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-svgr', svgr));
  }

  // Push local plugins directly instead of relying on docusaurus.config.ts

  if (Object.keys(rest).length > 0) {
    throw new Error(
      `Unrecognized keys ${Object.keys(rest).join(', ')} found in preset configuration.`,
    );
  }

  return { themes, plugins };
}

export type { MonorepoPresetOptions, ThemeConfig };
