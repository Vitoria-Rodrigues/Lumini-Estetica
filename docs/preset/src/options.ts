import type { Options as DocsPluginOptions } from '@docusaurus/plugin-content-docs';
import type { Options as BlogPluginOptions } from '@docusaurus/plugin-content-blog';
import type { Options as PagesPluginOptions } from '@docusaurus/plugin-content-pages';
import type { Options as SitemapPluginOptions } from '@docusaurus/plugin-sitemap';
import type { Options as SVGRPluginOptions } from '@docusaurus/plugin-svgr';
import type { Options as GtagPluginOptions } from '@docusaurus/plugin-google-gtag';
import type { Options as GTMPluginOptions } from '@docusaurus/plugin-google-tag-manager';
import type { Options as ThemeOptions } from '@docusaurus/theme-classic';
import type { ThemeConfig as BaseThemeConfig } from '@docusaurus/types';
import type { UserThemeConfig as ClassicThemeConfig } from '@docusaurus/theme-common';
import type { UserThemeConfig as AlgoliaThemeConfig } from '@docusaurus/theme-search-algolia';

export type MonorepoContentOptions<T> = T & { collection?: string };

export type MonorepoPresetOptions = {
  debug?: boolean;
  docs?:
    | false
    | MonorepoContentOptions<DocsPluginOptions>
    | Array<MonorepoContentOptions<DocsPluginOptions>>;
  blog?:
    | false
    | MonorepoContentOptions<BlogPluginOptions>
    | Array<MonorepoContentOptions<BlogPluginOptions>>;
  pages?: false | PagesPluginOptions;
  sitemap?: false | SitemapPluginOptions;
  svgr?: false | SVGRPluginOptions;
  theme?: ThemeOptions;
  liveCodeblock?: Record<string, unknown>;
  gtag?: GtagPluginOptions;
  googleTagManager?: GTMPluginOptions;
};

export type ThemeConfig = BaseThemeConfig & ClassicThemeConfig & AlgoliaThemeConfig;
