import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import styles from './home/styles.module.css';
import LandingSection from './home/HeroSection';
import CodeOfConductSection from './home/CodeOfConductSection';
import MonorepoSection from './home/MonorepoMap';
import FromSoilSection from './home/TechnicalFoundation';
import projectConfig from '@site/src/project.config';

export default function HomePage(): ReactNode {
  return (
    <Layout
      title={`${projectConfig.PROJECT_NAME} Documentation`}
      description={`Technical documentation for the high-performance, strictly-typed ${projectConfig.PROJECT_DOMAIN} monorepo.`}
    >
      <main className={styles.homeMain}>
        <LandingSection />
        <CodeOfConductSection />
        <MonorepoSection />
        <FromSoilSection />
      </main>
    </Layout>
  );
}
