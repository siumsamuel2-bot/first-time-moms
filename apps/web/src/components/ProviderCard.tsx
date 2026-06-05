import styles from './ProviderCard.module.css';
import { Button } from './Button';

interface ProviderCardProps {
  name: string;
  specialty: string;
  acceptingNewPatients: boolean;
  onRequestContact?: () => void;
}

export function ProviderCard({
  name,
  specialty,
  acceptingNewPatients,
  onRequestContact,
}: ProviderCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.specialty}>{specialty}</p>
        <span className={`${styles.badge} ${acceptingNewPatients ? styles.accepting : styles.closed}`}>
          {acceptingNewPatients ? 'Accepting new patients' : 'Limited availability'}
        </span>
      </div>
      {onRequestContact && (
        <Button variant="secondary" size="sm" onClick={onRequestContact}>
          Request contact
        </Button>
      )}
    </div>
  );
}
