/* eslint-disable @docusaurus/prefer-docusaurus-heading */
import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { Icon, faGithub } from '@site/src/icons';
import styles from './styles.module.css';
import projectConfig from '@site/src/project.config';

export default function HeroSection(): ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Column: Documentation Hub Intro */}
        <div className={styles.leftColumn}>
          <div className={styles.badge}>
            <Translate id="homepage.hero.badge" values={{ domain: projectConfig.PROJECT_DOMAIN }}>
              {'{domain} Ecosystem'}
            </Translate>
          </div>

          <h1 className={styles.title}>
            <Translate id="homepage.hero.title">Centralized Engineering Documentation</Translate>
          </h1>

          <p className={styles.description}>
            <Translate
              id="homepage.hero.text.primary"
              values={{ domain: projectConfig.PROJECT_DOMAIN }}
            >
              {
                'Welcome to the central documentation hub for the {domain} monorepo. This platform serves as the single source of truth for my personal website, engineering services, dynamic asset engines, and production-grade developer workspaces.'
              }
            </Translate>
          </p>

          <div className={styles.actions}>
            <Link to="/docs/intro" className={styles.primaryBtn}>
              <Translate id="homepage.button.docs">See Documentation</Translate>
            </Link>
            <Link to="/workspaces" className={styles.secondaryBtn}>
              <Translate id="homepage.button.workspaces">Workspaces</Translate>
            </Link>
            <Link
              to={`https://github.com/${projectConfig.GITHUB_ORG}/${projectConfig.REPOSITORY_NAME}`}
              className={styles.tertiaryBtn}
            >
              <Icon icon={faGithub} size="1.2em" style={{ marginRight: '0.5rem' }} />
              <Translate id="homepage.button.github">GitHub Monorepo</Translate>
            </Link>
          </div>
        </div>

        {/* Right Column: Architect Profile Card */}
        <div className={styles.rightColumn}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileBadge}>
                <Translate id="homepage.profile.badge">The Architect</Translate>
              </div>
              <h2 className={styles.profileTitle}>Tupynambá Lucas</h2>
              <span className={styles.profileSubtitle}>Full-Stack Engineer</span>
            </div>

            <p className={styles.profileText}>
              <Translate id="homepage.profile.bio">
                Full-Stack Engineer with over 10 years of experience and studies in software
                development, building production systems in TypeScript from end to end. I make
                architectural decisions driven by requirements, not by trends — selecting the right
                database, framework, or protocol for each problem. My current expertise runs deep in
                MongoDB replica sets with ACID transactions, but I reach for PostgreSQL or Redis
                when the domain calls for it. I design domain-driven monorepos orchestrated by
                Turborepo with strict catalog-managed dependencies, ship high-performance APIs on
                Fastify with Redis-backed job queues, and craft interactive frontends with React 19,
                Three.js, and GSAP. My infrastructure runs on Docker and Kubernetes with Traefik
                ingress, OpenTelemetry-instrumented observability pipelines exporting to Grafana
                Cloud, and multi-environment promotion from dev to production. I architect AI-native
                toolchains — self-hosted MCP gateway federations, containerized agent runtimes, and
                vector memory layers — turning autonomous workflows into first-class infrastructure.
                Every repository I own ships with automated CI/CD, Conventional Commits, and
                security hardened by design.
              </Translate>
            </p>

            <div className={styles.techGrid}>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Code</span>
                <span className={styles.techValue}>TypeScript, Node.js, Go</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Data</span>
                <span className={styles.techValue}>MongoDB, PostgreSQL, Redis</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>AI & Infra</span>
                <span className={styles.techValue}>MCP, Docker, Kubernetes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.circleObject}></div>
    </section>
  );
}
