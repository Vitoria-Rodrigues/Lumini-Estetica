import { themes as prismThemes } from 'prism-react-renderer';
import type { ThemeConfig } from './options';

export function getBaseThemeConfig(projectConfig: Record<string, string>): ThemeConfig {
  return {
    image: 'brand/logos/logo-mark-negative.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: `${projectConfig.PROJECT_NAME} Docs`,
      logo: {
        alt: `${projectConfig.PROJECT_NAME} Logo`,
        src: 'brand/logos/logo-mark-positive.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'defaultSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/community/support',
          label: 'Community',
          position: 'left',
          activeBaseRegex: '/community/',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },

        {
          href: `https://github.com/${projectConfig.GITHUB_ORG}/${projectConfig.REPOSITORY_NAME}`,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Architecture',
              to: '/docs/explanation/architecture-overview',
            },
            {
              label: 'Style Guide',
              to: '/docs/reference/styleguide',
            },
            {
              label: 'Command Reference',
              to: '/docs/reference/commands',
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'Hub Workspace',
              to: '/workspaces/hub',
            },
            {
              label: 'Renderer Workspace',
              to: '/workspaces/renderer',
            },
            {
              label: 'Studio Workspace',
              to: '/workspaces/studio',
            },
            {
              label: 'Tools Workspace',
              to: '/workspaces/tools',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Master Plan & Vision',
              to: '/docs/intro',
            },
            {
              label: 'Roadmap',
              to: '/community/roadmap',
            },
          ],
        },
      ],
      copyright: `
        <div class="footer__banner-container">
          <img src="/brand/logos/logo-horizontal-positive.svg" alt="${projectConfig.PROJECT_DOMAIN}" class="footer__banner" />
        </div>
        <p>Copyright © ${new Date().getFullYear()} ${projectConfig.PROJECT_DOMAIN}. High-end, production-grade software engineering. Built with Docusaurus.</p>
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'forest' },
    },
  };
}
