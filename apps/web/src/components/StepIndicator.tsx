import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  steps: { label: string }[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav className={styles.wrapper} aria-label="Progress">
      <ol className={styles.list}>
        {steps.map((step, i) => {
          const state = i < currentStep ? 'complete' : i === currentStep ? 'active' : 'upcoming';
          return (
            <li key={i} className={`${styles.step} ${styles[state]}`}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.label}>{step.label}</span>
              {i < steps.length - 1 && <span className={styles.connector} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
