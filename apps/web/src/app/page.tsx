import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.logo}>Firstweeks</span>
        <div className={styles.navLinks}>
          <Link href="/blog" className={styles.navLink}>Blog</Link>
          <Link href="/quiz" className={styles.navLink}>Take the Quiz</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>New &mdash; Free Personalized Advice Quiz</span>
          <h1 className={styles.brand}>
            You shouldn&apos;t have to figure out postpartum alone.
          </h1>
          <p className={styles.tagline}>
            Firstweeks is your daily postpartum companion &mdash; tracking recovery, flagging concerns, and connecting you to a community that gets it.
          </p>
          <p className={styles.subtitle}>
            Clinically grounded. Empathy first. Built for the fourth trimester.
          </p>
          <div className={styles.actions}>
            <Link href="/quiz" className={styles.primaryLink}>
              Take the Free Quiz &rarr;
            </Link>
            <Link href="/onboarding" className={styles.secondaryLink}>
              Get Started with the App
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How Firstweeks works</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📋</div>
            <h3 className={styles.featureTitle}>Daily Check-Ins</h3>
            <p className={styles.featureText}>
              2-minute daily check-ins track your sleep, mood, and physical recovery. Trends emerge before problems escalate.
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🩺</div>
            <h3 className={styles.featureTitle}>Clinically Grounded</h3>
            <p className={styles.featureText}>
              Every screening threshold is backed by OB-GYN protocols. We flag early warning signs so you know when to seek help.
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>👶</div>
            <h3 className={styles.featureTitle}>Mom Community</h3>
            <p className={styles.featureText}>
              A private community of new mothers who get it. Share tips, ask questions, and find your village.
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/blog" className={styles.footerLink}>Blog</Link>
          <Link href="/quiz" className={styles.footerLink}>Quiz</Link>
          <a href="#" className={styles.footerLink}>Privacy</a>
          <a href="#" className={styles.footerLink}>Terms</a>
        </div>
        <p className={styles.footerCopy}>&copy; {new Date().getFullYear()} Firstweeks. All rights reserved.</p>
      </footer>
    </main>
  );
}
