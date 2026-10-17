'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EscalationBanner } from '@/components/EscalationBanner';
import { ProviderCard } from '@/components/ProviderCard';
import { CrisisFooter } from '@/components/CrisisFooter';
import styles from './page.module.css';

export default function DashboardPage() {
  const [showProviders, setShowProviders] = useState(false);
  const [hasActiveEscalation] = useState(true);
  const [dismissedEscalation, setDismissedEscalation] = useState(false);

  const displayEscalation = hasActiveEscalation && !showProviders && !dismissedEscalation;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.brand}>Firstweeks</h1>
        <time className={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </time>
      </div>

      {displayEscalation && (
        <EscalationBanner
          severity="moderate"
          headline="We noticed things have been a bit tougher this week"
          body="You are not alone — many new mothers go through this."
          primaryCta="See your options"
          onPrimaryAction={() => setShowProviders(true)}
        />
      )}

      {dismissedEscalation && hasActiveEscalation && !showProviders && (
        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.cardTitle}>Support available</h2>
          </CardHeader>
          <CardBody>
            <p className={styles.cardText}>If you change your mind, support is always available from your dashboard.</p>
            <Button variant="ghost" size="sm" onClick={() => setShowProviders(true)}>
              Get Support
            </Button>
          </CardBody>
        </Card>
      )}

      <div className={styles.grid}>
        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.cardTitle}>Today&apos;s Check-in</h2>
          </CardHeader>
          <CardBody>
            <p className={styles.cardText}>Complete your daily check-in to track your recovery.</p>
            <Button variant="primary" size="md">
              Start check-in
            </Button>
          </CardBody>
        </Card>

        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.cardTitle}>Your Recovery</h2>
          </CardHeader>
          <CardBody>
            <p className={styles.cardText}>Day 12 of postpartum recovery. You&apos;re doing great.</p>
            <div className={styles.stat}>
              <span className={styles.statValue}>7</span>
              <span className={styles.statLabel}>check-ins completed</span>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.cardTitle}>Resources</h2>
          </CardHeader>
          <CardBody>
            <p className={styles.cardText}>Articles and tips tailored to your recovery stage.</p>
            <Button variant="ghost" size="sm">View resources →</Button>
          </CardBody>
        </Card>

        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.cardTitle}>Referrals</h2>
          </CardHeader>
          <CardBody>
            <p className={styles.cardText}>Know a new mom? Give her a week of support — and get one for yourself.</p>
            <Button variant="primary" size="md">
              Share Firstweeks
            </Button>
          </CardBody>
        </Card>
      </div>

      {showProviders && (
        <section className={styles.providers}>
          <h2 className={styles.sectionTitle}>Care providers near you</h2>
          <p className={styles.sectionSubtitle}>
            These providers specialize in maternal mental health and are accepting new patients.
          </p>
          <div className={styles.providerList}>
            <ProviderCard
              name="Dr. Sarah Mitchell"
              specialty="Maternal-Fetal Medicine, 3.2 mi"
              acceptingNewPatients
              onRequestContact={() => {}}
            />
            <ProviderCard
              name="Dr. Emily Carson"
              specialty="Perinatal Psychiatry, 5.1 mi"
              acceptingNewPatients
              onRequestContact={() => {}}
            />
            <ProviderCard
              name="Riverside Wellness Center"
              specialty="Postpartum Support Group, 2.8 mi"
              acceptingNewPatients
              onRequestContact={() => {}}
            />
            <ProviderCard
              name="Dr. Lisa Park"
              specialty="Lactation Consulting, 4.0 mi"
              acceptingNewPatients={false}
            />
          </div>
          <Button variant="secondary" size="md">
            Search all providers
          </Button>
        </section>
      )}
      <CrisisFooter />
    </main>
  );
}
