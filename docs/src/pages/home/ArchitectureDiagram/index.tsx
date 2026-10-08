import React from 'react';
import styles from './styles.module.css';
import projectConfig from '@site/src/project.config';

interface ArchitectureDiagramProps {
  onSelect?: (id: string) => void;
  activeId?: string | null;
}

export default function ArchitectureDiagram({ onSelect, activeId }: ArchitectureDiagramProps) {
  const contexts = [
    {
      id: 'hub',
      label: '/hub',
      color: styles.hubColor,
      items: ['web', 'api', 'core'],
    },
    { id: 'renderer', label: '/renderer', color: styles.rendererColor, items: ['zig', 'stats'] },
    { id: 'studio', label: '/studio', color: styles.studioColor, items: ['tokens', 'assets'] },
    { id: 'tools', label: '/tools', color: styles.toolsColor, items: ['mcp', 'scripts'] },
    { id: 'knowledge', label: '/docs', color: styles.docsColor, items: ['docusaurus'] },
  ];

  return (
    <div className={styles.diagramContainer}>
      <div className={styles.diagramGrid}>
        {/* Monorepo Root */}
        <div className={styles.rootNode}>
          <span
            className={styles.rootLabel}
          >{`${projectConfig.PROJECT_DOMAIN.toUpperCase()} MONOREPO`}</span>
          {/* Visual link to the trunk */}
          <div className={styles.trunkLink} />
        </div>

        <div className={styles.contextGrid}>
          {contexts.map((ctx) => (
            <button
              key={ctx.id}
              onClick={() => onSelect?.(ctx.id)}
              className={`${styles.contextNode} ${ctx.color} ${activeId === ctx.id ? styles.activeNode : ''}`}
            >
              <span className={styles.contextLabel}>{ctx.label}</span>
              <div className={styles.subItems}>
                {ctx.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
