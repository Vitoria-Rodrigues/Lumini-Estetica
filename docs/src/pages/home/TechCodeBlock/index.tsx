import React from 'react';
import styles from './styles.module.css';

export default function TechCodeBlock() {
  return (
    <div className={styles.codeContainer}>
      <div className={styles.codeHeader}>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ background: '#ff5f56' }} />
          <span className={styles.dot} style={{ background: '#ffbd2e' }} />
          <span className={styles.dot} style={{ background: '#27c93f' }} />
        </div>
        <div className={styles.tab}>domain-core.ts</div>
      </div>
      <div className={styles.codeContent}>
        <pre>
          <code>{`export interface Product {
  id: UUID;
  name: string;
  origin: ContextID;
  status: 'active' | 'archived';
}

/**
 * Strictly-typed domain logic 
 * shared across the monorepo.
 */
export const validateCycle = (
  cycle: SharingCycle
): Result<boolean> => {
  return cycle.isValid ? 
    Ok(true) : 
    Err('Invalid domain state');
};`}</code>
        </pre>
      </div>
      <div className={styles.terminalOverlay}>
        <span className={styles.prompt}>$</span> pnpm typecheck
        <br />
        <span className={styles.success}>✓ All packages validated.</span>
      </div>
    </div>
  );
}
