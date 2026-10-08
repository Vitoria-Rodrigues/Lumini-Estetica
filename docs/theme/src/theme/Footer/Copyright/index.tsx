import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/Footer/Copyright';
import styles from './styles.module.css';

export default function FooterCopyright({ copyright }: Props): ReactNode {
  return (
    <div
      className={clsx('footer__copyright', styles.__prevent_tree_shake)}
      // Developer provided the HTML, so assume it's safe.

      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  );
}
