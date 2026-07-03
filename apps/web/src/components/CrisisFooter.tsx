'use client';

import styles from './CrisisFooter.module.css';

export function CrisisFooter() {
  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Crisis resources">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.title}>Need immediate help?</p>
          <p className={styles.description}>
            If you or your baby are in danger, call emergency services right away.
            You are not alone — support is available 24/7.
          </p>
          <div className={styles.actions}>
            <a href="tel:911" className={styles.emergencyLink}>
              Call 911
            </a>
            <a href="tel:988" className={styles.warmLink}>
              Call or text 988 Suicide &amp; Crisis Lifeline
            </a>
            <a href="tel:1-800-273-8255" className={styles.warmLink}>
              Postpartum Support International: 1-800-273-8255
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
