import styles from './QuestionCard.module.css';

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface QuestionCardProps {
  question: string;
  description?: string;
  options: Option[];
  selected?: string;
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  type?: 'emoji' | 'radio' | 'scale';
}

export function QuestionCard({
  question,
  description,
  options,
  selected,
  onSelect,
  multiSelect,
  type = 'radio',
}: QuestionCardProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.question}>{question}</legend>
      {description && <p className={styles.description}>{description}</p>}
      <div className={`${styles.options} ${styles[type]}`}>
        {options.map((opt) => {
          const isSelected = multiSelect
            ? (selected ?? '').split(',').includes(opt.value)
            : selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(opt.value)}
              aria-pressed={isSelected}
            >
              {opt.emoji && <span className={styles.emoji}>{opt.emoji}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
