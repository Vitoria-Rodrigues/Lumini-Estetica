/* eslint-disable @docusaurus/prefer-docusaurus-heading */
import React from 'react';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function ArchitectProfile() {
  const logoPath = useBaseUrl('/brand/logos/logo-mark-negative.svg');
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img src={logoPath} alt="Tupynambá Logo" className={styles.mainLogo} />
        </div>

        <div className={styles.content}>
          <div className={styles.badge}>
            <Translate id="homepage.about.badge">The Architect</Translate>
          </div>

          <h2>
            <Translate id="homepage.about.title">Tupynambá Lucas</Translate>
          </h2>

          <p className={styles.bio}>
            <Translate id="homepage.about.description">
              Fullstack Developer with a rare profile that combines over 10 years of programming
              study with a deep sensitivity for design and UX/UI. I have expertise in the
              architecture of complete digital solutions, developing performant applications with
              TypeScript and strategically choosing database technology — PostgreSQL for relational
              structures or MongoDB for high-flexibility scenarios — to ensure the scalability and
              efficiency of the final product.
            </Translate>
          </p>

          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <span className={styles.techLabel}>
                <Translate id="homepage.about.tech.code">Code</Translate>
              </span>
              <span className={styles.techValue}>TypeScript, Node.js, Go</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techLabel}>
                <Translate id="homepage.about.tech.design">Design</Translate>
              </span>
              <span className={styles.techValue}>UX/UI, Penpot, Blender</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techLabel}>
                <Translate id="homepage.about.tech.data">Data</Translate>
              </span>
              <span className={styles.techValue}>PostgreSQL, MongoDB, Redis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
