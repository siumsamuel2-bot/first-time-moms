'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EscalationBanner } from '@/components/EscalationBanner';
import { ProviderCard } from '@/components/ProviderCard';
import styles from './page.module.css';

export default function DashboardPage() {
  const [showProviders, setShowProviders] = useState(false);
  const hasActiveEscalation = true;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.brand}>Firstweeks</h1>
        <time className={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </time>
      </div>

      {hasActiveEscalation && !showProviders && (
        <EscalationBanner
          severity="medium"
          message="We noticed you've had a few tough days in a row. Your responses suggest it might help to connect with someone who specializes in maternal mental health."
          actionLabel="See your options"
          onAction={() => setShowProviders(true)}
        />
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
    </main>
  );
}
