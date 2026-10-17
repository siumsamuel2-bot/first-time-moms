'use client';

import { useState } from 'react';
import styles from './EscalationBanner.module.css';

interface EscalationBannerProps {
  severity: 'mild' | 'moderate' | 'significant';
  headline: string;
  body?: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onDismiss?: () => void;
}

const severityStyles = {
  mild: {
    bg: '#FFFBEB',
    border: '#FEF3C7',
    accent: '#F59E0B',
    icon: '☀️',
  },
  moderate: {
    bg: '#FEF2F0',
    border: '#FEE2DE',
    accent: '#E07A5F',
    icon: '💛',
  },
  significant: {
    bg: '#FDF2F8',
    border: '#FCE7F3',
    accent: '#EC4899',
    icon: '💜',
  },
} as const;

export function EscalationBanner({
  severity,
  headline,
  body,
  primaryCta,
  secondaryCta,
  onPrimaryAction,
  onSecondaryAction,
  onDismiss,
}: EscalationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const config = severityStyles[severity];
  const [showConfirm, setShowConfirm] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    if (severity === 'significant') {
      setShowConfirm(true);
    } else {
      setDismissed(true);
      onDismiss?.();
    }
  };

  if (showConfirm) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
        }}
        onClick={() => setShowConfirm(false)}
      >
        <div
          style={{
            background: 'white', borderRadius: '16px 16px 0 0',
            padding: '24px', maxWidth: '640px', width: '100%',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>
            Support is here when you need it
          </h3>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
            These options will remain available from your dashboard.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => { setShowConfirm(false); onPrimaryAction?.(); }}
              style={{
                flex: 1, padding: '12px', background: '#FDF2F8',
                border: '1px solid #FCE7F3', borderRadius: '8px',
                color: '#EC4899', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Keep support visible
            </button>
            <button
              type="button"
              onClick={() => { setDismissed(true); setShowConfirm(false); onDismiss?.(); }}
              style={{
                flex: 1, padding: '12px', background: 'white',
                border: '1px solid #E2E8F0', borderRadius: '8px',
                color: '#64748B', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Dismiss for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.banner}
      role="alert"
      aria-live="polite"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '8px',
        padding: '16px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }} aria-hidden="true">{config.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
            {headline}
          </p>
          {body && (
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '12px' }}>
              {body}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {primaryCta && onPrimaryAction && (
              <button
                type="button"
                onClick={onPrimaryAction}
                style={{
                  padding: '8px 16px', background: config.accent, color: 'white',
                  border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {primaryCta}
              </button>
            )}
            {secondaryCta && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                style={{
                  padding: '8px 16px', background: 'transparent', color: '#64748B',
                  border: 'none', fontWeight: 500, fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {secondaryCta}
              </button>
            )}
          </div>
        </div>
        {severity !== 'significant' && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            style={{
              width: '32px', height: '32px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#CBD5E1', fontSize: '18px', flexShrink: 0,
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
