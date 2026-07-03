'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { CrisisFooter } from '@/components/CrisisFooter';
import styles from './page.module.css';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  distance: string;
  accepting: boolean;
}

export default function EscalationPage() {
  const [step, setStep] = useState<'intro' | 'details' | 'provider' | 'scheduled'>('intro');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step === 'provider') {
      setLoading(true);
      setError(null);
      fetch('/api/providers?acceptingOnly=true')
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load providers');
          return res.json();
        })
        .then((data: { providers: { id: string; name: string; specialty: string; distance: number | string; accepting: boolean }[] }) => {
          const mapped: Provider[] = data.providers.map((p) => ({
            id: p.id,
            name: p.name,
            specialty: p.specialty,
            distance: typeof p.distance === 'number' ? `${p.distance} mi` : p.distance,
            accepting: p.accepting,
          }));
          setProviders(mapped);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Could not load providers');
          setLoading(false);
        });
    }
  }, [step]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>We are here for you</h1>
        <p className={styles.subtitle}>
          Many mothers go through this. Reaching out is a strong step.
        </p>
      </header>

      <main className={styles.main}>
        {step === 'intro' && (
          <Card variant="info">
            <CardBody>
              <h2 className={styles.cardTitle}>What we noticed</h2>
              <p className={styles.cardText}>
                Based on your recent check-ins, you have reported low mood and disrupted
                sleep for several days in a row. This pattern is common, and support is
                available. You do not need to manage this alone.
              </p>
              <ul className={styles.list}>
                <li>You are not doing anything wrong.</li>
                <li>This is a medical situation, not a personal failure.</li>
                <li>Talking to someone can make a big difference.</li>
              </ul>
            </CardBody>
            <CardFooter className={styles.actions}>
              <Button variant="ghost" onClick={() => history.back()}>
                Not now
              </Button>
              <Button variant="primary" onClick={() => setStep('details')}>
                Explore support
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'details' && (
          <Card variant="info">
            <CardBody>
              <h2 className={styles.cardTitle}>Your options</h2>
              <div className={styles.options}>
                <div className={styles.option}>
                  <h3 className={styles.optionTitle}>Speak with a screened provider</h3>
                  <p className={styles.optionText}>
                    Connect with a perinatal mental health specialist who understands
                    postpartum recovery.
                  </p>
                  <Button variant="primary" onClick={() => setStep('provider')}>
                    See providers
                  </Button>
                </div>
                <div className={styles.option}>
                  <h3 className={styles.optionTitle}>Share with your current doctor</h3>
                  <p className={styles.optionText}>
                    We can prepare a summary of your check-ins to share with your OB-GYN
                    at your next visit.
                  </p>
                  <Button variant="secondary">
                    Prepare summary
                  </Button>
                </div>
                <div className={styles.option}>
                  <h3 className={styles.optionTitle}>Crisis support</h3>
                  <p className={styles.optionText}>
                    If you need to talk to someone right now, crisis lines are available
                    24/7.
                  </p>
                  <a href="tel:988" className={styles.phoneLink}>
                    Call or text 988
                  </a>
                </div>
              </div>
            </CardBody>
            <CardFooter className={styles.actions}>
              <Button variant="ghost" onClick={() => setStep('intro')}>
                Back
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'provider' && (
          <div className={styles.providerSection}>
            <h2 className={styles.sectionTitle}>Care providers near you</h2>
            <p className={styles.sectionSubtitle}>
              These providers specialize in maternal mental health and are accepting new patients.
            </p>
            {loading && (
              <Card variant="default" className={styles.providerCard}>
                <CardBody>
                  <p className={styles.cardText}>Loading providers...</p>
                </CardBody>
              </Card>
            )}
            {error && (
              <Card variant="warning" className={styles.providerCard}>
                <CardBody>
                  <p className={styles.cardText}>{error}</p>
                </CardBody>
              </Card>
            )}
            {!loading && !error && (
              <div className={styles.providerList}>
                {providers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProvider(p.id); }}
                  >
                    <Card
                      variant={selectedProvider === p.id ? 'info' : 'default'}
                      className={styles.providerCard}
                    >
                      <CardBody>
                        <h3 className={styles.providerName}>{p.name}</h3>
                        <p className={styles.providerMeta}>
                          {p.specialty} · {p.distance}
                        </p>
                        <span className={styles.badge}>Accepting new patients</span>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.actions}>
              <Button variant="ghost" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button
                variant="primary"
                disabled={!selectedProvider}
                onClick={() => setStep('scheduled')}
              >
                Request contact
              </Button>
            </div>
          </div>
        )}

        {step === 'scheduled' && (
          <Card variant="elevated">
            <CardBody className={styles.center}>
              <div className={styles.checkmark}>✓</div>
              <h2 className={styles.cardTitle}>Request sent</h2>
              <p className={styles.cardText}>
                We have shared your contact preference with the provider. They will reach
                out within 1 business day.
              </p>
              <p className={styles.cardText}>
                In the meantime, your daily check-ins will continue. We are here if you
                need anything.
              </p>
            </CardBody>
            <CardFooter className={styles.actions}>
              <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
                Back to dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      <CrisisFooter />
    </div>
  );
}
