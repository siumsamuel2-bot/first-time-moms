'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { CrisisFooter } from '@/components/CrisisFooter';
import styles from './page.module.css';

interface Provider {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  specialties: string[];
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  insurance: string[];
  accepting: boolean;
  phone: string;
}

const EPDS_QUESTIONS = [
  {
    id: 'ableToLaugh',
    question: 'I have been able to laugh and see the funny side of things',
    options: [
      { value: 0, label: 'As much as ever' },
      { value: 1, label: 'Less than before' },
      { value: 2, label: 'Much less than before' },
      { value: 3, label: 'Not at all' },
    ],
  },
  {
    id: 'lookedForward',
    question: 'I have looked forward with enjoyment to things',
    options: [
      { value: 0, label: 'As much as ever' },
      { value: 1, label: 'Less than before' },
      { value: 2, label: 'Much less than before' },
      { value: 3, label: 'Not at all' },
    ],
  },
  {
    id: 'blamedSelf',
    question: 'I have blamed myself unnecessarily when things went wrong',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    id: 'anxiousOrWorried',
    question: 'I have been anxious or worried for no good reason',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'scaredOrPanicky',
    question: 'I have felt scared or panicky for no very good reason',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'thingsOnTopOfMe',
    question: 'Things have been getting on top of me',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    id: 'difficultySleeping',
    question: 'I have been so unhappy that I have had difficulty sleeping',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'sadOrMiserable',
    question: 'I have felt sad or miserable',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'crying',
    question: 'I have been so unhappy that I have been crying',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'selfHarm',
    question: 'The thought of harming myself has occurred to me',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Yes, quite often' },
    ],
  },
];

export default function EscalationPage() {
  const [step, setStep] = useState<
    'warm_checkin' | 'assessment' | 'connection_offer' | 'provider' | 'scheduled' | 'declined' | 'crisis'
  >('warm_checkin');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [epdsAnswers, setEpdsAnswers] = useState<Record<string, number>>({});
  const [epdsStep, setEpdsStep] = useState(0);
  const [showAboutSheet, setShowAboutSheet] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  useEffect(() => {
    if (step === 'provider') {
      setLoading(true);
      setError(null);
      fetch('/api/providers?acceptingOnly=true')
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load providers');
          return res.json();
        })
        .then((data: { providers: { id: string; name: string; credentials?: string; specialty: string; specialties?: string[]; location: string; distance?: string; rating?: number; reviewCount?: number; insurance?: string[]; acceptingNewPatients: string; phone?: string }[] }) => {
          const mapped: Provider[] = data.providers.map((p) => ({
            id: p.id,
            name: p.name,
            credentials: p.credentials || '',
            specialty: p.specialty,
            specialties: p.specialties || [p.specialty],
            location: p.location || 'Available online',
            distance: p.distance || '',
            rating: p.rating || 0,
            reviewCount: p.reviewCount || 0,
            insurance: p.insurance || [],
            accepting: p.acceptingNewPatients === 'true',
            phone: p.phone || '',
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

  const isSelfHarmFlagged = epdsAnswers.selfHarm !== undefined && epdsAnswers.selfHarm >= 2;

  const handleAssessmentAnswer = (qId: string, value: number) => {
    const updated = { ...epdsAnswers, [qId]: value };
    setEpdsAnswers(updated);

    if (qId === 'selfHarm' && value >= 2) {
      setStep('crisis');
      return;
    }

    if (epdsStep < EPDS_QUESTIONS.length - 1) {
      setEpdsStep(epdsStep + 1);
    } else {
      const totalScore = Object.values(updated).reduce((sum, v) => sum + v, 0);
      setStep(totalScore >= 6 ? 'connection_offer' : 'declined');
    }
  };

  const handleEpdsSkip = () => {
    if (epdsStep < EPDS_QUESTIONS.length - 1) {
      setEpdsStep(epdsStep + 1);
    } else {
      setStep('connection_offer');
    }
  };

  return (
    <div className={styles.page}>
      {step === 'warm_checkin' && (
        <main className={styles.main}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
              🤝
            </div>
            <h1 className={styles.title} style={{ marginBottom: 'var(--spacing-3)' }}>
              Hi there
            </h1>
            <p className={styles.subtitle} style={{ lineHeight: '1.6' }}>
              We have noticed your recovery has been a bit tougher this week. You are not alone — many new mothers go through this.
            </p>
          </div>
          <Card variant="elevated">
            <CardBody>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: '1.5', marginBottom: 'var(--spacing-4)' }}>
                Would you be open to answering a few more questions so we can understand better?
              </p>
            </CardBody>
            <CardFooter className={styles.actions}>
              <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                Not right now
              </Button>
              <Button variant="primary" onClick={() => setStep('assessment')}>
                Yes, I am open to it
              </Button>
            </CardFooter>
          </Card>
        </main>
      )}

      {step === 'assessment' && !assessmentStarted && (
        <main className={styles.main}>
          <Card variant="elevated">
            <CardBody>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-3)' }}>
                Let's check in together
              </h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: '1.5', marginBottom: 'var(--spacing-4)' }}>
                There are no wrong answers. If you are not ready, you can skip any question.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: '1.5', marginBottom: 'var(--spacing-4)' }}>
                Your answers stay between us — nothing is shared without your permission.
              </p>
            </CardBody>
            <CardFooter className={styles.actions}>
              <Button variant="ghost" onClick={handleEpdsSkip}>
                Skip for now
              </Button>
              <Button variant="primary" onClick={() => setAssessmentStarted(true)}>
                I'm ready
              </Button>
            </CardFooter>
          </Card>
        </main>
      )}

      {step === 'assessment' && assessmentStarted && (() => {
        const currentQuestion = EPDS_QUESTIONS[epdsStep];
        if (!currentQuestion) return null;
        return (
          <main className={styles.main}>
            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-3)' }}>
              Question {epdsStep + 1} of {EPDS_QUESTIONS.length}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-6)' }}>
              {EPDS_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 'var(--spacing-3)',
                    height: 'var(--spacing-3)',
                    borderRadius: '50%',
                    background: i <= epdsStep ? 'var(--color-brand-500)' : 'var(--color-neutral-200)',
                  }}
                />
              ))}
            </div>
            <Card variant="elevated">
              <CardBody>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-4)' }}>
                  In the past 7 days...
                </h2>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-700)', marginBottom: 'var(--spacing-4)' }}>
                  {currentQuestion.question}
                </p>
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAssessmentAnswer(currentQuestion.id, opt.value)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      marginBottom: 'var(--spacing-2)',
                      border: `1px solid ${epdsAnswers[currentQuestion.id] === opt.value ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: epdsAnswers[currentQuestion.id] === opt.value ? 'var(--color-brand-50)' : 'white',
                      fontSize: 'var(--text-base)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      color: 'var(--color-neutral-700)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleEpdsSkip}
                  style={{
                    display: 'block',
                    marginTop: 'var(--spacing-2)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-neutral-400)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  Prefer not to say
                </button>
              </CardBody>
            </Card>
          </main>
        );
      })()}

      {step === 'connection_offer' && (
        <main className={styles.main}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
              💛
            </div>
            <h1 className={styles.title} style={{ marginBottom: 'var(--spacing-3)' }}>
              Thank you for sharing
            </h1>
            <p className={styles.subtitle} style={{ lineHeight: '1.6' }}>
              Based on what you have told us, we think you might benefit from talking with someone who specializes in postpartum support.
            </p>
          </div>
          <Card variant="elevated">
            <CardBody>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', marginBottom: 'var(--spacing-4)' }}>
                Would you like us to help connect you?
              </p>
            </CardBody>
            <CardFooter className={styles.actions}>
              <Button variant="ghost" onClick={() => setStep('declined')}>
                Not right now
              </Button>
              <Button variant="primary" onClick={() => setStep('provider')}>
                Yes, please connect me
              </Button>
            </CardFooter>
          </Card>
          <button
            type="button"
            onClick={() => setShowAboutSheet(true)}
            style={{
              display: 'block',
              margin: 'var(--spacing-4) auto 0',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-neutral-400)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'underline',
            }}
          >
            About this recommendation
          </button>
        </main>
      )}

      {step === 'declined' && (
        <main className={styles.main}>
          <Card variant="elevated" style={{ textAlign: 'center' }}>
            <CardBody>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
                🌿
              </div>
              <h2 className={styles.title} style={{ marginBottom: 'var(--spacing-3)' }}>
                That is completely okay
              </h2>
              <p className={styles.subtitle} style={{ lineHeight: '1.6', marginBottom: 'var(--spacing-4)' }}>
                We will check in with you again in a few days. If you change your mind, you can always tap &quot;Get Support&quot; from your dashboard.
              </p>
              <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
                Back to dashboard
              </Button>
            </CardBody>
          </Card>
        </main>
      )}

      {step === 'provider' && (
        <main className={styles.main}>
          <h2 className={styles.title} style={{ marginBottom: 'var(--spacing-2)' }}>
            Care providers near you
          </h2>
          <p className={styles.subtitle} style={{ marginBottom: 'var(--spacing-5)' }}>
            We found 3 providers near you who specialize in postpartum support.
          </p>
          {loading && (
            <Card variant="default" style={{ padding: 'var(--spacing-4)' }}>
              <p className={styles.cardText}>Loading providers...</p>
            </Card>
          )}
          {error && (
            <Card variant="default" style={{ padding: 'var(--spacing-4)' }}>
              <p className={styles.cardText}>{error}</p>
            </Card>
          )}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProvider(p.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--spacing-4)',
                    border: `1.5px solid ${selectedProvider === p.id ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: selectedProvider === p.id ? 'var(--color-brand-50)' : 'white',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'box-shadow 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-1)' }}>
                        {p.name}
                      </h3>
                      {p.credentials && (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-1)' }}>
                          {p.credentials}
                        </p>
                      )}
                      {p.rating > 0 && (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-1)' }}>
                          {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))} ({p.reviewCount} reviews)
                        </p>
                      )}
                    </div>
                    {p.distance && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', whiteSpace: 'nowrap' }}>
                        {p.distance}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-1)' }}>
                    {p.specialties.join(', ')} — {p.location}
                  </p>
                  {p.insurance.length > 0 && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 'var(--spacing-2)' }}>
                      Accepts: {p.insurance.join(', ')}
                    </p>
                  )}
                  {p.accepting && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-600)', background: 'var(--color-brand-50)', padding: 'var(--spacing-1) var(--spacing-2)', borderRadius: 'var(--radius-sm)' }}>
                      Accepting new patients
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className={styles.actions} style={{ marginTop: 'var(--spacing-5)' }}>
            <Button variant="ghost" onClick={() => setStep('connection_offer')}>
              No thanks, not now
            </Button>
            <Button
              variant="primary"
              disabled={!selectedProvider}
              onClick={() => setStep('scheduled')}
            >
              Request contact
            </Button>
          </div>
        </main>
      )}

      {step === 'scheduled' && (() => {
        const selected = providers.find(p => p.id === selectedProvider);
        return (
          <main className={styles.main}>
            <Card variant="elevated" style={{ textAlign: 'center' }}>
              <CardBody>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
                  ✉️
                </div>
                <h2 className={styles.title} style={{ marginBottom: 'var(--spacing-3)' }}>
                  Referral sent!
                </h2>
                <p className={styles.subtitle} style={{ lineHeight: '1.6', marginBottom: 'var(--spacing-4)' }}>
                  {selected
                    ? `We have sent your information to ${selected.name}. They will reach out within 24 hours to schedule an appointment.`
                    : 'We have sent your information to your selected provider. They will reach out within 24 hours to schedule an appointment.'
                  }
                </p>
                {selected?.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      borderRadius: 'var(--radius-md)', background: 'var(--color-neutral-50)',
                      border: '1px solid var(--color-neutral-200)',
                      fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)',
                      textDecoration: 'none', fontFamily: 'inherit',
                      marginBottom: 'var(--spacing-4)',
                    }}
                  >
                    Call {selected.name}: {selected.phone}
                  </a>
                )}
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-4)' }}>
                  In the meantime, your daily check-ins will continue. We are here if you need anything.
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
                  Back to dashboard
                </Button>
              </CardBody>
            </Card>
          </main>
        );
      })()}

      {step === 'crisis' && (
        <main className={styles.main} style={{ background: '#FFF1F2', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-8) var(--spacing-4)' }}
          role="alertdialog" aria-describedby="crisis-resources">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
              ❤️
            </div>
            <h1 className={styles.title} style={{ marginBottom: 'var(--spacing-3)', color: '#1E293B' }}>
              You matter.
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: 'var(--spacing-6)', lineHeight: '1.6', color: '#475569', fontSize: '18px', fontWeight: 500 }}>
              Help is available right now. Please reach out.
            </p>
            <div id="crisis-resources" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', maxWidth: 'var(--max-width-sm)', margin: '0 auto' }}>
              <a
                href="tel:988"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-4) var(--spacing-6)',
                  background: 'white',
                  color: '#E11D48',
                  borderRadius: '999px',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                  border: '1.5px solid #FFE4E6',
                }}
              >
                Call 988 — Suicide & Crisis Lifeline
              </a>
              <a
                href="sms:741741?body=HOME"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-4) var(--spacing-6)',
                  background: 'white',
                  color: '#E11D48',
                  borderRadius: '999px',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  border: '1.5px solid #FFE4E6',
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                }}
              >
                Text HOME to 741741
              </a>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#CBD5E1', marginTop: 'var(--spacing-5)' }}>
              A clinician has also been notified and will reach out within 30 minutes.
            </p>
            <button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              style={{
                marginTop: 'var(--spacing-4)',
                fontSize: 'var(--text-sm)',
                color: '#64748B',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textDecoration: 'underline',
              }}
            >
              I understand, return to dashboard
            </button>
          </div>
        </main>
      )}

      {showAboutSheet && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
          }}
          onClick={() => setShowAboutSheet(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              padding: 'var(--spacing-6)', maxWidth: '640px', width: '100%',
              maxHeight: '70vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-label="About this recommendation"
          >
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-3)' }}>
              How this works
            </h2>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>
              <p style={{ marginBottom: 'var(--spacing-3)' }}>
                Based on what you have shared during your daily check-ins and the questions you just answered, we look for patterns that might suggest you could use some extra support.
              </p>
              <p style={{ marginBottom: 'var(--spacing-3)' }}>
                This is not a diagnosis — it is simply a way to notice when things feel harder than usual. Many new mothers experience ups and downs, and sometimes talking to someone can make a real difference.
              </p>
              <p style={{ marginBottom: 'var(--spacing-3)' }}>
                All providers in our network have been screened and specialize in postpartum care. Your information is shared only with your permission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAboutSheet(false)}
              style={{
                width: '100%', padding: 'var(--spacing-3)',
                marginTop: 'var(--spacing-4)',
                background: 'var(--color-brand-500)', color: 'white',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <CrisisFooter />
    </div>
  );
}
