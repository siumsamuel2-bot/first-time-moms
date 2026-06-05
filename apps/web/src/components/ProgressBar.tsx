import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = true,
  variant = 'default',
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={styles.wrapper}>
      {showLabel && (
        <div className={styles.labels}>
          <span className={styles.label}>{label ?? `${value}/${max}`}</span>
          <span className={styles.pct}>{pct}%</span>
        </div>
      )}
      <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className={`${styles.fill} ${styles[variant]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
