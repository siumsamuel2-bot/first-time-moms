'use client';

import styles from './CrisisFooter.module.css';

export function CrisisFooter() {
  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Crisis resources" style={{ background: '#FFF1F2', borderTop: '1px solid #FFE4E6' }}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.title} style={{ color: '#1E293B' }}>Need immediate help?</p>
          <p className={styles.description} style={{ color: '#475569' }}>
            Support is available 24/7. You are not alone.
          </p>
          <div className={styles.actions}>
            <a href="tel:988" className={styles.warmLink} style={{ color: '#E11D48', fontWeight: 600 }}>
              Call or text 988 — Suicide &amp; Crisis Lifeline
            </a>
            <a href="tel:1-800-273-8255" className={styles.warmLink} style={{ color: '#E11D48', fontWeight: 600 }}>
              Postpartum Support International: 1-800-273-8255
            </a>
            <a href="tel:911" className={styles.warmLink} style={{ color: '#64748B' }}>
              Call 911 for emergencies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
