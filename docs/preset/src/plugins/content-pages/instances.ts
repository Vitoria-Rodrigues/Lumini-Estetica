import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

export function createPagesInstance(opts: Pick<MonorepoPresetOptions, 'pages'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];

  const pages = opts.pages ?? {
    exclude: [
      '**/_*/**',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**',
      '**/components/**',
      '**/data.ts',
      '**/*.material.ts',
    ],
  };

  if (pages !== false) {
    plugins.push(['@docusaurus/plugin-content-pages', pages]);
  }

  return plugins;
}
