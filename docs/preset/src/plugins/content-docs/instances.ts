import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

export function createDocsInstances(opts: Pick<MonorepoPresetOptions, 'docs'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];
  const { docs } = opts;

  if (Array.isArray(docs)) {
    docs.forEach((docOpt) => {
      plugins.push(['@docusaurus/plugin-content-docs', docOpt]);
    });
  } else if (docs !== false && docs !== undefined) {
    plugins.push(['@docusaurus/plugin-content-docs', docs]);
  }

  return plugins;
}
