import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

export function createBlogInstance(opts: Pick<MonorepoPresetOptions, 'blog'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];
  const { blog } = opts;

  if (Array.isArray(blog)) {
    blog.forEach((blogOpt) => {
      plugins.push(['@docusaurus/plugin-content-blog', blogOpt]);
    });
  } else if (blog !== false && blog !== undefined) {
    plugins.push(['@docusaurus/plugin-content-blog', blog]);
  }

  return plugins;
}
