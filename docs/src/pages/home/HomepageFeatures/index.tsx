import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Pertencimento',
    Svg: require('@site/src/logo.svg').default,
    description: <>Faça parte de uma rede que valoriza o produtor local.</>,
  },
  {
    title: 'Simplicidade',
    Svg: require('@site/src/logo.svg').default,
    description: <>Processos diretos e transparentes para todos.</>,
  },
  {
    title: 'Conexão Humana',
    Svg: require('@site/src/logo.svg').default,
    description: <>Relações baseadas na confiança e no respeito.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={styles.feature}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
