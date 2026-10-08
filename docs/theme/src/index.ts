import path from 'path';
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ThemeConfigValidationContext,
} from '@docusaurus/types';

import * as themeClassicModule from '@docusaurus/theme-classic';
import * as themeLiveCodeblockModule from '@docusaurus/theme-live-codeblock';
import * as themeMermaidModule from '@docusaurus/theme-mermaid';

export type PluginOptions = Record<string, unknown>;

/**
 * Custom Theme Plugin — Thin Orchestrator
 *
 * Registers docs/packages/theme/src/theme/ as the highest-priority component
 * override layer. Only components present in that directory shadow upstream.
 * All other components resolve through @docusaurus/theme-classic automatically.
 */
export default function customThemePlugin(
  _context: LoadContext,
  _options: PluginOptions,
): Plugin<undefined> {
  const srcTheme = path.resolve(__dirname, '..', 'src', 'theme');

  return {
    name: 'monorepo-custom-theme',

    getThemePath() {
      return srcTheme;
    },

    getTypeScriptThemePath() {
      return srcTheme;
    },

    getPathsToWatch() {
      return [`${srcTheme}/**/*.{ts,tsx,css}`];
    },
  };
}

export function validateThemeConfig(ctx: ThemeConfigValidationContext<Record<string, unknown>>) {
  let { themeConfig } = ctx;
  const { validate } = ctx;

  type ValidatorFn = (args: {
    validate: unknown;
    themeConfig: Record<string, unknown>;
  }) => Record<string, unknown>;

  if ('validateThemeConfig' in themeClassicModule && themeClassicModule.validateThemeConfig) {
    themeConfig = (themeClassicModule.validateThemeConfig as ValidatorFn)({
      validate,
      themeConfig,
    });
  }
  if (
    'validateThemeConfig' in themeLiveCodeblockModule &&
    themeLiveCodeblockModule.validateThemeConfig
  ) {
    themeConfig = (themeLiveCodeblockModule.validateThemeConfig as ValidatorFn)({
      validate,
      themeConfig,
    });
  }
  if ('validateThemeConfig' in themeMermaidModule && themeMermaidModule.validateThemeConfig) {
    themeConfig = (themeMermaidModule.validateThemeConfig as ValidatorFn)({
      validate,
      themeConfig,
    });
  }

  return themeConfig;
}

export function validateOptions({
  options,
}: OptionValidationContext<PluginOptions, PluginOptions>): PluginOptions {
  return options;
}
