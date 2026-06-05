import Link from 'next/link';
import styles from './page.module.css';

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-6)',
      background: 'linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-neutral-50) 100%)',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 'var(--max-width-sm)' }}>
        <div style={{
          fontSize: '3.5rem',
          marginBottom: 'var(--spacing-6)',
          lineHeight: 1,
        }}>
          🌿
        </div>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          color: 'var(--color-brand-700)',
          marginBottom: 'var(--spacing-4)',
          letterSpacing: '-0.02em',
        }}>
          Firstweeks
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-neutral-600)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--spacing-8)',
        }}>
          Personalized postpartum recovery support for first-time mothers.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-3) var(--spacing-8)',
              background: 'var(--color-brand-500)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              fontSize: 'var(--text-base)',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
              minWidth: 200,
            }}
          >
            Get started
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-brand-600)',
              textDecoration: 'none',
            }}
          >
            I already have a profile
          </Link>
        </div>
      </div>
    </main>
  );
}
