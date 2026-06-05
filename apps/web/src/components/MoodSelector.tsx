import styles from './MoodSelector.module.css';

interface MoodSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const moods = [
  { value: 1, label: 'Very low', emoji: '😢' },
  { value: 2, label: 'Low', emoji: '😟' },
  { value: 3, label: 'Okay', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Great', emoji: '😊' },
];

export function MoodSelector({ label, value, onChange }: MoodSelectorProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.moods}>
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            className={`${styles.mood} ${value === mood.value ? styles.selected : ''} ${value >= mood.value && value > 0 ? styles.active : ''}`}
            onClick={() => onChange(mood.value)}
            aria-label={`${mood.label} - ${mood.emoji}`}
            aria-pressed={value === mood.value}
          >
            <span className={styles.emoji} aria-hidden="true">{mood.emoji}</span>
            <span className={styles.moodLabel}>{mood.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
