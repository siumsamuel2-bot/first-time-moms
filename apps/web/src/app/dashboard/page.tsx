'use client';

import { Card, CardBody, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { ProviderCard } from '../../components/ProviderCard';
import { EscalationBanner } from '../../components/EscalationBanner';

export default function DashboardPage() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--color-neutral-50)',
      padding: 'var(--spacing-6)',
    }}>
      <div style={{ maxWidth: 'var(--max-width-md)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <header>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-700)' }}>
            My recovery
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
            Day 12 postpartum
          </p>
        </header>

        <Card>
          <CardHeader>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Today&apos;s check-in</h2>
          </CardHeader>
          <CardBody>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--spacing-4)' }}>
              You have not completed today&apos;s check-in yet.
            </p>
            <Button onClick={() => window.location.href = '/check-in'}>
              Start check-in
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>This week</h2>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>Check-ins completed</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>4/7</span>
                </div>
                <ProgressBar value={57} showLabel={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>Mood trend</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Stable</span>
                </div>
                <ProgressBar value={65} variant="success" showLabel={false} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="warning">
          <CardBody>
            <EscalationBanner
              severity="medium"
              message="We noticed you have been feeling low for a few days. Here are some providers who can help."
              actionLabel="View providers"
              onAction={() => {}}
            />
            <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <ProviderCard
                name="Dr. Sarah Chen"
                specialty="Perinatal mental health"
                acceptingNewPatients
                onRequestContact={() => {}}
              />
              <ProviderCard
                name="Dr. Maria Rodriguez"
                specialty="Postpartum care"
                acceptingNewPatients
                onRequestContact={() => {}}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
