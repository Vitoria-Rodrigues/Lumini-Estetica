/* eslint-disable @docusaurus/prefer-docusaurus-heading */
import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function CodeOfConductContent() {
  return (
    <>
      <div className={styles.mainContainer}>
        <h2 className={styles.sectionTitle}>
          <Translate id="homepage.conduct.title">Code of Conduct</Translate>
        </h2>

        <div className={styles.twoColumns}>
          {/* Left Column (Single White Card for both Pledge and Responsibilities) */}
          <div className={styles.leftColumn}>
            <h3 className={styles.cardTitle}>
              <Translate id="conduct.pledge.title">Our Pledge</Translate>
            </h3>
            <p>
              <Translate id="conduct.pledge.p1">
                I, as the creator and maintainer of tupynambalucas.dev, pledge to make participation
                in this project a harassment-free experience for everyone, regardless of age, body
                size, visible or invisible disability, ethnicity, sex characteristics, gender
                identity and expression, level of experience, education, socio-economic status,
                nationality, personal appearance, race, caste, color, religion, or sexual identity
                and orientation.
              </Translate>
            </p>
            <p>
              <Translate id="conduct.pledge.p2">
                I pledge to act and interact in ways that contribute to an open, welcoming, diverse,
                inclusive, and healthy community.
              </Translate>
            </p>

            <h3 className={styles.cardTitle} style={{ marginTop: '2rem' }}>
              <Translate id="conduct.responsibilities.title">
                Enforcement Responsibilities
              </Translate>
            </h3>
            <p>
              <Translate id="conduct.responsibilities.p1">
                As the maintainer of this project, I am responsible for clarifying and enforcing our
                standards of acceptable behavior and will take appropriate and fair corrective
                action in response to any behavior that I deem inappropriate, threatening,
                offensive, or harmful.
              </Translate>
            </p>
            <p style={{ marginBottom: 0 }}>
              <Translate id="conduct.responsibilities.p2">
                I have the right and responsibility to remove, edit, or reject comments, commits,
                code, wiki edits, issues, and other contributions that are not aligned to this Code
                of Conduct, and will communicate reasons for moderation decisions when appropriate.
              </Translate>
            </p>
          </div>

          {/* Right Column (Transparent Background, White Text) */}
          <div className={styles.rightColumn}>
            <div className={styles.cardTransparent}>
              <h3>
                <Translate id="conduct.standards.title">Our Standards</Translate>
              </h3>
              <p>
                <Translate id="conduct.standards.positive.intro">
                  Examples of behavior that contributes to a positive environment for this project
                  include:
                </Translate>
              </p>
              <ul>
                <li>
                  <Translate id="conduct.standards.positive.1">
                    Demonstrating empathy and kindness toward other people.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.positive.2">
                    Being respectful of differing opinions, viewpoints, and experiences.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.positive.3">
                    Giving and gracefully accepting constructive feedback.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.positive.4">
                    Accepting responsibility and apologizing to those affected by our mistakes, and
                    learning from the experience.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.positive.5">
                    Focusing on what is best for the overall community.
                  </Translate>
                </li>
              </ul>
              <p>
                <Translate id="conduct.standards.unacceptable.intro">
                  Examples of unacceptable behavior include:
                </Translate>
              </p>
              <ul>
                <li>
                  <Translate id="conduct.standards.unacceptable.1">
                    The use of sexualized language or imagery, and sexual attention or advances of
                    any kind.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.unacceptable.2">
                    Trolling, insulting or derogatory comments, and personal or political attacks.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.unacceptable.3">
                    Public or private harassment.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.unacceptable.4">
                    Publishing others' private information, such as a physical or email address,
                    without their explicit permission.
                  </Translate>
                </li>
                <li>
                  <Translate id="conduct.standards.unacceptable.5">
                    Other conduct which could reasonably be considered inappropriate in a
                    professional setting.
                  </Translate>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Band (White/Light Background, Black Text) */}
      <div className={styles.bottomBand}>
        <div className={styles.bandContainer}>
          <div className={styles.bandItem}>
            <h3>
              <Translate id="conduct.scope.title">Scope</Translate>
            </h3>
            <p>
              <Translate id="conduct.scope.p1">
                This Code of Conduct applies within all community spaces related to
                tupynambalucas.dev, and also applies when an individual is officially representing
                the project in public spaces.
              </Translate>
            </p>
          </div>

          <div className={styles.bandItem}>
            <h3>
              <Translate id="conduct.enforcement.title">Enforcement</Translate>
            </h3>
            <p>
              <Translate id="conduct.enforcement.p1">
                Instances of abusive, harassing, or otherwise unacceptable behavior may be reported
                directly to me at
              </Translate>{' '}
              <a href="mailto:contato@tupynambalucas.dev">contato@tupynambalucas.dev</a>.{' '}
              <Translate id="conduct.enforcement.p1.2">
                All complaints will be reviewed and investigated promptly and fairly.
              </Translate>
            </p>
            <p>
              <Translate id="conduct.enforcement.p2">
                I am obligated to respect the privacy and security of the reporter of any incident.
              </Translate>
            </p>

            <p className={styles.attribution}>
              <Translate id="conduct.attribution.p1">
                This Code of Conduct is adapted from the
              </Translate>{' '}
              <a href="http://contributor-covenant.org" target="_blank" rel="noopener noreferrer">
                Contributor Covenant
              </a>
              , <Translate id="conduct.attribution.p1.2">version 2.1, available at:</Translate>{' '}
              <a
                href="https://www.contributor-covenant.org/version/2/1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code of Conduct 2.1
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
