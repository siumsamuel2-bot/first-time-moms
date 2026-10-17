'use client';

import { useState } from 'react';
import { Card, CardBody, CardFooter } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { CrisisFooter } from '../../components/CrisisFooter';

const STEP_LABELS = ['Start', 'Physical', 'Sleep', 'Mood', 'Notes', 'Done'];

const EPDS_SHORT = [
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
    id: 'anxious',
    question: 'I have felt anxious or worried for no good reason',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
];

const SLEEP_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function mapToTriageInput({
  physicalComfort,
  sleepHours,
  troubleSleeping,
  moodAnswers,
}: {
  physicalComfort: number;
  sleepHours: number;
  troubleSleeping: string;
  moodAnswers: Record<string, number>;
}) {
  const mapSleepDisruption = (val: string): 'none' | 'mild' | 'moderate' | 'severe' => {
    if (val === 'No') return 'none';
    if (val === 'Yes') return 'moderate';
    return 'none';
  };

  const mapMoodAnswersToScore = (answers: Record<string, number>): number => {
    const values = Object.values(answers).filter(
      (v) => typeof v === 'number' && v >= 0 && v <= 3,
    );
    if (values.length === 0) return 0;
    const total = values.reduce((sum, v) => sum + v, 0);
    return Math.round((total / 6) * 10);
  };

  return {
    symptoms: [] as string[],
    durationDays: sleepHours,
    sleepDisruption: mapSleepDisruption(troubleSleeping),
    moodScore: mapMoodAnswersToScore(moodAnswers),
    physicalPain: physicalComfort,
    bleedingSeverity: 'normal' as const,
    consecutiveDays: 0,
  };
}

export default function CheckInPage() {
  const [step, setStep] = useState<'welcome' | 'physical' | 'sleep' | 'mood' | 'comment' | 'complete'>('welcome');
  const [physicalComfort, setPhysicalComfort] = useState(-1);
  const [sleepHours, setSleepHours] = useState(-1);
  const [troubleSleeping, setTroubleSleeping] = useState<string>('');
  const [moodAnswers, setMoodAnswers] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  const steps = ['welcome', 'physical', 'sleep', 'mood', 'comment', 'complete'];
  const currentIdx = steps.indexOf(step);

  const handleSelectMood = (qId: string, value: number) => {
    setMoodAnswers({ ...moodAnswers, [qId]: value });
  };

  const getMoodAnswer = (qId: string): number => {
    return moodAnswers[qId] ?? -1;
  };

  const handleSubmit = async () => {
    const triageInput = mapToTriageInput({
      physicalComfort,
      sleepHours,
      troubleSleeping,
      moodAnswers,
    });

    const res = await fetch('/api/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: 'placeholder-profile',
        physicalComfort,
        sleepHours,
        troubleSleeping,
        moodAnswers,
        comment,
      }),
    });

    if (!res.ok) {
      alert('Failed to submit check-in');
      return;
    }

    const result = await res.json();
    setStep('complete');
  };

  if (step === 'complete') {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-6)', background: 'var(--color-neutral-50)' }}>
        <Card variant="elevated" style={{ maxWidth: 'var(--max-width-sm)', width: '100%', textAlign: 'center' }}>
          <CardBody>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
              ✓
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-700)', marginBottom: 'var(--spacing-3)' }}>
              Check-in complete
            </h2>
            <p style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-4)' }}>
              See you tomorrow at 10:00 AM.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-6)', background: 'var(--color-neutral-50)' }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-width-sm)' }}>
        {step !== 'welcome' && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <ProgressBar value={Math.round(((currentIdx) / (steps.length - 1)) * 100)} label="Daily check-in" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', textAlign: 'center', marginTop: 'var(--spacing-2)' }}>
              {currentIdx + 1} of {steps.length - 1}
            </p>
          </div>
        )}

        {step === 'welcome' && (
          <Card variant="elevated" style={{ textAlign: 'center' }}>
            <CardBody>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
                ☀️
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-2)' }}>
                Good morning
              </h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-1)' }}>
                Let&apos;s see how you are doing today.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-400)', marginBottom: 'var(--spacing-6)' }}>
                2 minutes · 5 questions
              </p>
              <Button size="lg" onClick={() => setStep('physical')} style={{ width: '100%' }}>
                Start check-in
              </Button>
            </CardBody>
          </Card>
        )}

        {step === 'physical' && (
          <Card variant="elevated">
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-4)' }}>
                How would you rate your overall physical comfort today?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPhysicalComfort(val)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      border: `1px solid ${physicalComfort === val ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: physicalComfort === val ? 'var(--color-brand-50)' : 'white',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ width: '2rem', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', textAlign: 'right' }}>{val}</span>
                    <span style={{ flex: 1, height: 'var(--spacing-2)', background: physicalComfort === val ? 'var(--color-brand-200)' : 'var(--color-neutral-100)', borderRadius: 'var(--radius-full)' }}>
                      <span style={{ display: 'block', width: `${(val / 10) * 100}%`, height: '100%', background: physicalComfort >= 7 ? 'var(--color-sage-400)' : physicalComfort >= 4 ? 'var(--color-amber-400)' : 'var(--color-rose-400)', borderRadius: 'var(--radius-full)' }} />
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>Very uncomfortable</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>Very comfortable</span>
              </div>
              <button
                type="button"
                onClick={() => setStep('sleep')}
                style={{
                  display: 'block',
                  marginTop: 'var(--spacing-3)',
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
            <CardFooter>
              <Button onClick={() => setStep('sleep')} disabled={physicalComfort < 0}>Next</Button>
            </CardFooter>
          </Card>
        )}

        {step === 'sleep' && (
          <Card variant="elevated">
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-2)' }}>
                How was your sleep last night?
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-4)' }}>
                Hours of uninterrupted sleep:
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                {SLEEP_HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setSleepHours(h)}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      border: `2px solid ${sleepHours === h ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                      background: sleepHours === h ? 'var(--color-brand-50)' : 'white',
                      fontSize: 'var(--text-sm)',
                      fontWeight: sleepHours === h ? 600 : 400,
                      color: sleepHours === h ? 'var(--color-brand-600)' : 'var(--color-neutral-500)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>None</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>8+ hours</span>
              </div>
              {sleepHours >= 0 && (
                <div style={{ marginTop: 'var(--spacing-3)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-700)', marginBottom: 'var(--spacing-2)' }}>
                    Did you have trouble falling asleep?
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    {['No', 'Yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTroubleSleeping(opt)}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          border: `1px solid ${troubleSleeping === opt ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                          borderRadius: 'var(--radius-md)',
                          background: troubleSleeping === opt ? 'var(--color-brand-50)' : 'white',
                          fontSize: 'var(--text-sm)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setStep('mood')}
                style={{
                  display: 'block',
                  marginTop: 'var(--spacing-3)',
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
            <CardFooter>
              <Button variant="ghost" onClick={() => setStep('physical')}>Back</Button>
              <Button onClick={() => setStep('mood')} disabled={sleepHours < 0}>Next</Button>
            </CardFooter>
          </Card>
        )}

        {step === 'mood' && (
          <Card variant="elevated">
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-4)' }}>
                How have you been feeling emotionally today?
              </h3>
              {EPDS_SHORT.map((q) => (
                <div key={q.id} style={{ marginBottom: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-neutral-100)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-700)', marginBottom: 'var(--spacing-2)' }}>
                    {q.question}
                  </p>
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectMood(q.id, opt.value)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        marginBottom: 'var(--spacing-1)',
                        border: `1px solid ${getMoodAnswer(q.id) === opt.value ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: getMoodAnswer(q.id) === opt.value ? 'var(--color-brand-50)' : 'white',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSelectMood(q.id, -1)}
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-neutral-400)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textDecoration: 'underline',
                      marginTop: 'var(--spacing-1)',
                    }}
                  >
                    Prefer not to say
                  </button>
                </div>
              ))}
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={() => setStep('sleep')}>Back</Button>
              <Button onClick={() => setStep('comment')}>Next</Button>
            </CardFooter>
          </Card>
        )}

        {step === 'comment' && (
          <Card variant="elevated">
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--spacing-4)' }}>
                Anything else you would like to share?
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-3)' }}>
                This helps us understand what you are going through.
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="Share anything on your mind..."
                rows={4}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                  resize: 'none',
                  lineHeight: '1.5',
                }}
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', textAlign: 'right', marginTop: 'var(--spacing-1)' }}>
                {comment.length}/500
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={() => setStep('mood')}>Back</Button>
              <Button onClick={handleSubmit}>Complete check-in</Button>
            </CardFooter>
          </Card>
        )}
      </div>
      <CrisisFooter />
    </div>
  );
}