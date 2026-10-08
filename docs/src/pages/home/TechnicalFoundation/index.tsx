/* eslint-disable @docusaurus/prefer-docusaurus-heading */
import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';
import TechCodeBlock from '../TechCodeBlock';
import styles from './styles.module.css';

interface TimelineItemProps {
  title: ReactNode;
  description: ReactNode;
}

function TimelineItem({ title, description }: TimelineItemProps) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineMarker}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>
      <div className={styles.timelineContent}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function TechnicalFoundation(): ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <TechCodeBlock />
        </div>

        <div className={styles.content}>
          <h1>
            <Translate id="homepage.dosolo.title">Technical Foundation</Translate>
          </h1>
          <p className={styles.subtitle}>
            <Translate id="homepage.dosolo.subtitle">
              // Scalable architecture for high-fidelity engineering.
            </Translate>
          </p>

          <div className={styles.timeline}>
            <TimelineItem
              title={<Translate id="homepage.dosolo.item1.title">Monorepo Excellence</Translate>}
              description={
                <Translate id="homepage.dosolo.item1.description">
                  Context-driven root layout using PNPM Workspaces and Turborepo for optimized task
                  orchestration.
                </Translate>
              }
            />
            <TimelineItem
              title={<Translate id="homepage.dosolo.item2.title">Type-Safe Domain Core</Translate>}
              description={
                <Translate id="homepage.dosolo.item2.description">
                  Strictly-typed business logic and schemas defined as single source of truth for
                  all applications.
                </Translate>
              }
            />
            <TimelineItem
              title={<Translate id="homepage.dosolo.item3.title">AI-Native DevOps</Translate>}
              description={
                <Translate id="homepage.dosolo.item3.description">
                  Deep integration with Model Context Protocol (MCP) and design-to-code bridges for
                  high-context automation.
                </Translate>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
