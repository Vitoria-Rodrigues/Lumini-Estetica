/* eslint-disable @docusaurus/prefer-docusaurus-heading */
import React, { useState, useRef, useLayoutEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import gsap from 'gsap';
import { WORKSPACES, type WorkspaceInfo } from './data';
import styles from './styles.module.css';
import projectConfig from '@site/src/project.config';

export default function MonorepoMap() {
  const { i18n } = useDocusaurusContext();
  const isPtBR = i18n.currentLocale === 'pt-BR';

  const workspaceKeys = Object.keys(WORKSPACES);
  const [selectedId, setSelectedId] = useState<string>(workspaceKeys[0] || 'cortex');

  const panelRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const getLocalizedWorkspace = (ws: WorkspaceInfo): WorkspaceInfo => {
    if (!isPtBR || !ws.ptBR) return ws;
    return { ...ws, ...ws.ptBR };
  };

  const selectedWorkspace = getLocalizedWorkspace(
    WORKSPACES[selectedId] || WORKSPACES[workspaceKeys[0]],
  );

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!panelRef.current) return;

    const panelEl = panelRef.current;
    const leftEl = leftColRef.current;
    const rightEl = rightColRef.current;

    // Get current height before update (or auto height)
    const startHeight = panelEl.offsetHeight;

    const ctx = gsap.context(() => {
      // Temporarily set height to auto to measure new height
      gsap.set(panelEl, { height: 'auto' });
      const targetHeight = panelEl.offsetHeight;

      // Animate container height smoothly
      if (startHeight !== targetHeight) {
        gsap.fromTo(
          panelEl,
          { height: startHeight },
          {
            height: targetHeight,
            duration: 0.35,
            ease: 'power2.out',
            clearProps: 'height',
          },
        );
      }

      // Smooth fade out and subtle slide down of content
      gsap.fromTo(
        [leftEl, rightEl],
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.04,
          clearProps: 'opacity,transform',
        },
      );
    }, panelRef);

    return () => ctx.revert();
  }, [selectedId]);

  return (
    <section className={styles.monorepoSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            <Translate id="homepage.monorepo.title">Monorepo Map</Translate>
          </h2>
          <p>
            <Translate
              id="homepage.monorepo.subtitle"
              values={{ domain: projectConfig.PROJECT_DOMAIN }}
            >
              {
                'Interactive visualization of the {domain} bounded contexts. Select a workspace to explore.'
              }
            </Translate>
          </p>
        </div>

        {/* Workspace Selector Buttons */}
        <div className={styles.workspaceSelector}>
          {workspaceKeys.map((key) => {
            const ws = WORKSPACES[key];
            const localized = getLocalizedWorkspace(ws);
            const isActive = selectedId === key;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.selectorButton} ${isActive ? styles.activeButton : ''}`}
                onClick={() => setSelectedId(key)}
              >
                {localized.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic Summary Panel (2-Column Split) */}
        <div ref={panelRef} className={styles.detailsPanel}>
          <div ref={leftColRef} className={styles.leftCol}>
            <div className={styles.panelHeader}>
              <span className={styles.pathTag}>{selectedWorkspace.path}</span>
              <h3>{selectedWorkspace.name}</h3>
            </div>

            <p className={styles.description}>{selectedWorkspace.description}</p>

            <div className={styles.actionSection}>
              <Link to={selectedWorkspace.path} className={styles.docButton}>
                <Translate id="homepage.monorepo.viewDocs">View Workspace Documentation</Translate>
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>

          <div ref={rightColRef} className={styles.rightCol}>
            <div className={styles.metadataSection}>
              <h4>
                <Translate id="homepage.monorepo.techstack">Tech Stack</Translate>
              </h4>
              <div className={styles.tagGrid}>
                {selectedWorkspace.stack.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.metadataSection}>
              <h4>
                <Translate id="homepage.monorepo.responsibilities">Core Responsibilities</Translate>
              </h4>
              <ul className={styles.responsibilityList}>
                {selectedWorkspace.responsibilities.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
