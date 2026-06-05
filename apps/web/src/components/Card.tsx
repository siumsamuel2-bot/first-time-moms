import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'warning' | 'info';
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, variant = 'default', className, style }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className={styles.header} style={style}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.body} ${className ?? ''}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardFooter({ children, className, style }: CardFooterProps) {
  return <div className={`${styles.footer} ${className ?? ''}`} style={style}>{children}</div>;
}
