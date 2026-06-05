import styles from './EscalationBanner.module.css';

interface EscalationBannerProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const severityConfig = {
  low: { variant: 'info', icon: 'ℹ' },
  medium: { variant: 'warning', icon: '⚕' },
  high: { variant: 'warning', icon: '⚠' },
  critical: { variant: 'danger', icon: '!' },
} as const;

export function EscalationBanner({
  severity,
  message,
  actionLabel,
  onAction,
}: EscalationBannerProps) {
  const config = severityConfig[severity];

  return (
    <div className={`${styles.banner} ${styles[config.variant]}`} role="alert">
      <span className={styles.icon} aria-hidden="true">{config.icon}</span>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {actionLabel && onAction && (
          <button type="button" className={styles.action} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
