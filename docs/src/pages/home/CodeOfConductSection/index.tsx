import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

import CodeOfConductContent from './Content';

export default function CodeOfConductSection(): ReactNode {
  return (
    <section className={styles.section}>
      <CodeOfConductContent />
    </section>
  );
}
