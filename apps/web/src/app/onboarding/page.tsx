'use client';

import { useState, useCallback } from 'react';
import { Button } from '../../components/Button';
import { Card, CardBody, CardFooter } from '../../components/Card';
import { StepIndicator } from '../../components/StepIndicator';
import { MoodSelector } from '../../components/MoodSelector';
import { QuestionCard } from '../../components/QuestionCard';
import { ProgressBar } from '../../components/ProgressBar';
import {
  createInitialState,
  advanceStep,
  getAvailableSteps,
  previousStep,
  getCompletionPercentage,
} from '@firstweeks/shared/onboarding';

const STEPS = [
  { label: 'Delivery' },
  { label: 'Feeding' },
  { label: 'Wellness' },
  { label: 'Schedule' },
  { label: 'Consent' },
];

const DELIVERY_OPTIONS = [
  { value: 'vaginal', label: 'Vaginal delivery', emoji: '👶' },
  { value: 'c_section', label: 'C-section', emoji: '🩺' },
  { value: 'emergency_c_section', label: 'Emergency C-section', emoji: '⚠️' },
];

const FEEDING_OPTIONS = [
  { value: 'breast', label: 'Breastfeeding', emoji: '🤱' },
  { value: 'bottle', label: 'Formula feeding', emoji: '🍼' },
  { value: 'both', label: 'Both', emoji: '✓' },
];

const COMPLICATION_OPTIONS = [
  'Preeclampsia',
  'Hemorrhage',
  'Infection',
  'Preterm birth',
  'None of the above',
];

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
    id: 'anxious',
    question: 'I have been anxious or worried for no good reason',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'scared',
    question: 'I have felt scared or panicky for no very good reason',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Very often' },
    ],
  },
  {
    id: 'overwhelmed',
    question: 'Things have been getting on top of me',
    options: [
      { value: 0, label: 'No, I have been coping as well as ever' },
      { value: 1, label: 'Sometimes I have not coped as well' },
      { value: 2, label: 'Most of the time I have not coped' },
      { value: 3, label: 'Yes, I cannot cope at all' },
    ],
  },
  {
    id: 'difficultySleeping',
    question: 'I have been so unhappy that I have had difficulty sleeping',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Sometimes' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    id: 'sad',
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
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Only occasionally' },
      { value: 2, label: 'Yes, quite often' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    id: 'selfHarm',
    question: 'The thought of harming myself has occurred to me',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Hardly ever' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Yes, quite often' },
    ],
  },
];

export default function OnboardingPage() {
  const [state, setState] = useState(() => createInitialState());
  const [data, setData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const stepIndex = getAvailableSteps().indexOf(state.step);

  const handleNext = useCallback(() => {
    const result = advanceStep(state, data);
    if (result.errors && result.errors.length > 0) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    const nextState = result as { step: string; profile?: Record<string, unknown> };
    setState(nextState as ReturnType<typeof createInitialState>);
    setData({});
  }, [state, data]);

  const handleBack = useCallback(() => {
    const prev = previousStep(state.step);
    if (!prev) return;
    setState({ step: prev, profile: state.profile });
    setErrors([]);
  }, [state]);

  const handleSelectEpds = useCallback((qId: string, value: number) => {
    const baseline = { ...(data.mentalHealthBaseline as Record<string, number> ?? {}) };
    baseline[qId] = value;
    setData({ ...data, mentalHealthBaseline: baseline });
  }, [data]);

  const getEpdsAnswer = (qId: string): number => {
    return (data.mentalHealthBaseline as Record<string, number>)?.[qId] ?? -1;
  };

  function renderStep() {
    switch (state.step) {
      case 'welcome':
        return (
          <>
            <CardBody>
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
                🌿
              </div>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-3)', color: 'var(--color-brand-700)', textAlign: 'center' }}>
                Welcome to Firstweeks
              </h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--spacing-4)' }}>
                Your postpartum recovery partner. We will help you track your recovery and connect you with support when you need it.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
                Your answers are private and secure. You can skip or change any response later.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="lg" onClick={handleNext} style={{ width: '100%' }}>
                Get started
              </Button>
            </CardFooter>
          </>
        );

      case 'delivery_details':
        return (
          <>
            <CardBody>
              <label style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-neutral-800)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                When did you give birth?
              </label>
              <input
                type="date"
                onChange={(e) => setData({ ...data, deliveryDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                }}
                aria-label="Delivery date"
              />
              <div style={{ marginTop: 'var(--spacing-6)' }}>
                <QuestionCard
                  question="What type of delivery did you have?"
                  options={DELIVERY_OPTIONS}
                  selected={data.deliveryType as string ?? ''}
                  onSelect={(val) => setData({ ...data, deliveryType: val })}
                  type="emoji"
                />
              </div>
              <div style={{ marginTop: 'var(--spacing-5)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-2)' }}>
                  Any complications? <span style={{ color: 'var(--color-neutral-400)' }}>(optional)</span>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {COMPLICATION_OPTIONS.map((opt) => {
                    const selected = (data.complications as string[] ?? []).includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const current = data.complications as string[] ?? [];
                          if (opt === 'None of the above') {
                            setData({ ...data, complications: ['None of the above'] });
                          } else {
                            const next = current.filter(c => c !== 'None of the above');
                            setData({ ...data, complications: selected ? next.filter(c => c !== opt) : [...next, opt] });
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          border: `1px solid ${selected ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                          borderRadius: 'var(--radius-md)',
                          background: selected ? 'var(--color-brand-50)' : 'white',
                          fontSize: 'var(--text-sm)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                          color: 'var(--color-neutral-700)',
                        }}
                      >
                        <span style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)', borderRadius: '50%', border: `2px solid ${selected ? 'var(--color-brand-500)' : 'var(--color-neutral-300)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selected && <span style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)', borderRadius: '50%', background: 'var(--color-brand-500)' }} />}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
              {errors.length > 0 && (
                <p style={{ color: 'var(--color-danger-500)', fontSize: 'var(--text-sm)', marginTop: 'var(--spacing-2)' }}>
                  {errors[0]}
                </p>
              )}
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue</Button>
            </CardFooter>
          </>
        );

      case 'feeding':
        return (
          <>
            <CardBody>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-3)' }}>
                We will tailor your feeding support based on how you are feeding your baby.
              </p>
              <QuestionCard
                question="How are you feeding your baby?"
                options={FEEDING_OPTIONS}
                selected={data.feedingMethod as string ?? ''}
                onSelect={(val) => setData({ ...data, feedingMethod: val })}
                type="emoji"
              />
              {(data.feedingMethod === 'breast' || data.feedingMethod === 'both') && (
                <div style={{ marginTop: 'var(--spacing-5)' }}>
                  <QuestionCard
                    question="How is breastfeeding going?"
                    options={[
                      { value: 'well', label: 'Going well!' },
                      { value: 'challenges', label: 'Some challenges' },
                    ]}
                    selected={data.feedingChallenges as string ?? ''}
                    onSelect={(val) => setData({ ...data, feedingChallenges: val })}
                  />
                  {data.feedingChallenges === 'challenges' && (
                    <div style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-3)', background: 'var(--color-brand-50)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-700)' }}>
                        Many new mothers experience breastfeeding challenges. We have resources to help.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {errors.length > 0 && (
                <p style={{ color: 'var(--color-danger-500)', fontSize: 'var(--text-sm)', marginTop: 'var(--spacing-2)' }}>
                  {errors[0]}
                </p>
              )}
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue</Button>
            </CardFooter>
          </>
        );

      case 'mental_health':
        return (
          <>
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-800)' }}>
                How are you feeling emotionally?
              </h3>
              <div style={{ padding: 'var(--spacing-3)', background: 'var(--color-brand-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-700)' }}>
                  These questions help us understand how you are doing emotionally. There are no wrong answers. If you are not ready to answer some questions, you can skip them.
                </p>
              </div>
              {EPDS_QUESTIONS.map((q) => (
                <div key={q.id} style={{ marginBottom: 'var(--spacing-5)', paddingBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-neutral-100)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-700)', marginBottom: 'var(--spacing-2)' }}>
                    {q.question}
                  </p>
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectEpds(q.id, opt.value)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        marginBottom: 'var(--spacing-1)',
                        border: `1px solid ${getEpdsAnswer(q.id) === opt.value ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: getEpdsAnswer(q.id) === opt.value ? 'var(--color-brand-50)' : 'white',
                        fontSize: 'var(--text-sm)',
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
                    onClick={() => { /* skip this question */ }}
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
              <div style={{ marginTop: 'var(--spacing-2)' }}>
                <button
                  type="button"
                  onClick={() => setData({ ...data, skippedMentalHealth: true })}
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-neutral-500)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  Skip all wellness questions
                </button>
              </div>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue</Button>
            </CardFooter>
          </>
        );

      case 'check_in_time':
        return (
          <>
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-2)', color: 'var(--color-neutral-800)' }}>
                When should we check in?
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-5)' }}>
                Pick a time that works for your daily check-in. We will send you a gentle reminder.
              </p>
              <label style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-neutral-700)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                Preferred time
              </label>
              <select
                value={data.checkInTime as string ?? '10:00'}
                onChange={(e) => setData({ ...data, checkInTime: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                  background: 'white',
                }}
              >
                {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00'].map((t) => (
                  <option key={t} value={t}>{t}:00 {(Number(t.split(':')[0]) >= 12 ? 'PM' : 'AM')}</option>
                ))}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-5)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={data.smsBackup !== false}
                  onChange={(e) => setData({ ...data, smsBackup: e.target.checked })}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-brand-500)' }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>
                  Send me an SMS reminder if I miss my check-in
                </span>
              </label>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue</Button>
            </CardFooter>
          </>
        );

      case 'data_consent':
        return (
          <>
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-4)', color: 'var(--color-neutral-800)' }}>
                Data Consent
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--spacing-4)' }}>
                We take your privacy seriously. Your health data is encrypted and stored securely. We only use your data to personalize your check-ins and connect you with providers. You can revoke consent at any time in settings.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-6)' }}>
                By continuing, you agree to our <a href="/privacy" style={{ color: 'var(--color-brand-600)', textDecoration: 'underline' }}>Privacy Policy</a> and <a href="/terms" style={{ color: 'var(--color-brand-600)', textDecoration: 'underline' }}>Terms of Service</a>.
              </p>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={data.dataConsent === true}
                  onChange={(e) => setData({ ...data, dataConsent: e.target.checked })}
                  style={{ marginTop: 'var(--spacing-1)', width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-brand-500)' }}
                />
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-700)', lineHeight: 'var(--leading-relaxed)' }}>
                  I consent to Firstweeks collecting and processing my health data for personalized postpartum support.
                </span>
              </label>
              {errors.length > 0 && (
                <p style={{ color: 'var(--color-danger-500)', fontSize: 'var(--text-sm)', marginTop: 'var(--spacing-2)' }}>
                  {errors[0]}
                </p>
              )}
            </CardBody>
            <CardFooter>
              <Button variant="ghost" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={data.dataConsent !== true}>Continue</Button>
            </CardFooter>
          </>
        );

      case 'complete':
        return (
          <>
            <CardBody>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8) 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }} aria-hidden="true">
                  🌿
                </div>
                <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-700)', marginBottom: 'var(--spacing-3)' }}>
                  You are all set!
                </h2>
                <p style={{ color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)' }}>
                  We have created your personalized recovery profile. Your first check-in is tomorrow at {data.checkInTime as string || '10:00 AM'}.
                </p>
              </div>
            </CardBody>
            <CardFooter style={{ justifyContent: 'center' }}>
              <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                Go to my dashboard
              </Button>
            </CardFooter>
          </>
        );
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'var(--spacing-6)',
      background: 'var(--color-neutral-50)',
    }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-width-sm)' }}>
        {state.step !== 'welcome' && state.step !== 'complete' && (
          <>
            <ProgressBar
              value={getCompletionPercentage(state.step)}
              label="Onboarding progress"
            />
            <div style={{ marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
              <StepIndicator steps={STEPS} currentStep={stepIndex} />
            </div>
          </>
        )}
        <Card variant="elevated">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
}
