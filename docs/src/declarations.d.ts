declare module '@site/src/project.config' {
  const config: Record<string, string>;
  export default config;
}
declare module '@site/src/icons' {
  export const Icons: Record<string, unknown>;
  export const MonorepoIcon: import('react').FC<Record<string, unknown>>;
  export const Icon: import('react').FC<Record<string, unknown>>;
  export const faGithub: unknown;
}
declare module './preset/src/index.ts/options' {
  export type MonorepoPresetOptions = Record<string, unknown>;
}
declare module './preset/src/index.ts/themeConfig' {
  export type ThemeConfig = Record<string, unknown>;
}
