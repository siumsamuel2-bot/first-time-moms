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
  { label: 'Welcome' },
  { label: 'Delivery' },
  { label: 'Wellness' },
  { label: 'Feeding' },
  { label: 'Consent' },
  { label: 'Ready' },
];

const DELIVERY_OPTIONS = [
  { value: 'vaginal', label: 'Vaginal', emoji: '👶' },
  { value: 'c_section', label: 'C-section', emoji: '🩺' },
  { value: 'emergency_c_section', label: 'Emergency C-section', emoji: '⚠️' },
];

const FEEDING_OPTIONS = [
  { value: 'breast', label: 'Breastfeeding', emoji: '🤱' },
  { value: 'bottle', label: 'Bottle feeding', emoji: '🍼' },
  { value: 'both', label: 'Both', emoji: '✓' },
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
    const nextState = advanceStep(state, data) as { step: string; profile?: Record<string, unknown> };
    setState(nextState as ReturnType<typeof createInitialState>);
    setData({});
  }, [state, data]);

  const handleBack = useCallback(() => {
    const prev = previousStep(state.step);
    if (!prev) return;
    setState({ step: prev, profile: state.profile });
    setErrors([]);
  }, [state]);

  function renderStep() {
    switch (state.step) {
      case 'welcome':
        return (
          <>
            <CardBody>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-3)', color: 'var(--color-brand-700)' }}>
                Welcome to Firstweeks
              </h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--spacing-4)' }}>
                We are here to support you through your postpartum journey.
                This short questionnaire helps us personalize your daily check-ins
                so we can track what matters most to you.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
                Your answers are private and secure. You can skip or change any
                response later.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="lg" onClick={handleNext}>
                Get started
              </Button>
            </CardFooter>
          </>
        );

      case 'delivery_details':
        return (
          <>
            <CardBody>
              <QuestionCard
                question="When did you give birth?"
                options={[]}
                onSelect={() => {}}
                selected=""
              />
              <div style={{ marginTop: 'var(--spacing-3)' }}>
                <input
                  type="date"
                  className="input"
                  onChange={(e) => setData({ ...data, deliveryDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    border: '1px solid var(--color-neutral-300)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                  }}
                  aria-label="Delivery date"
                />
              </div>
              <div style={{ marginTop: 'var(--spacing-6)' }}>
                <QuestionCard
                  question="What type of delivery did you have?"
                  options={DELIVERY_OPTIONS}
                  selected={data.deliveryType as string ?? ''}
                  onSelect={(val) => setData({ ...data, deliveryType: val })}
                  type="emoji"
                />
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

      case 'mental_health':
        return (
          <>
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-4)', color: 'var(--color-neutral-800)' }}>
                How are you feeling?
              </h3>
              <MoodSelector
                label="Overall mood"
                value={(data.moodScore as number) ?? 0}
                onChange={(val) => setData({ ...data, moodScore: val, mentalHealthBaseline: { ...(data.mentalHealthBaseline as Record<string, unknown> ?? {}), moodScore: val } })}
              />
              <div style={{ marginTop: 'var(--spacing-6)' }}>
                <MoodSelector
                  label="Sleep quality"
                  value={(data.sleepQuality as number) ?? 0}
                  onChange={(val) => setData({ ...data, sleepQuality: val, mentalHealthBaseline: { ...(data.mentalHealthBaseline as Record<string, unknown> ?? {}), sleepQuality: val } })}
                />
              </div>
              <div style={{ marginTop: 'var(--spacing-6)' }}>
                <QuestionCard
                  question="How is your anxiety level?"
                  options={[
                    { value: '1', label: 'Very calm' },
                    { value: '2', label: 'Mostly calm' },
                    { value: '3', label: 'Sometimes anxious' },
                    { value: '4', label: 'Often anxious' },
                    { value: '5', label: 'Very anxious' },
                  ]}
                  selected={String((data.mentalHealthBaseline as Record<string, unknown>)?.anxietyLevel ?? '')}
                  onSelect={(val) => setData({ ...data, mentalHealthBaseline: { ...(data.mentalHealthBaseline as Record<string, unknown> ?? {}), anxietyLevel: Number(val) } })}
                  type="scale"
                />
              </div>
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
              <QuestionCard
                question="How are you feeding your baby?"
                description="We will tailor your feeding support accordingly."
                options={FEEDING_OPTIONS}
                selected={data.feedingMethod as string ?? ''}
                onSelect={(val) => setData({ ...data, feedingMethod: val })}
                type="emoji"
              />
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

      case 'data_consent':
        return (
          <>
            <CardBody>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-4)', color: 'var(--color-neutral-800)' }}>
                Data Consent
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--spacing-4)' }}>
                We take your privacy seriously. Your health data is encrypted and stored securely.
                We only use your data to personalize your check-ins and connect you with providers.
                You can revoke consent at any time in settings.
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
                  required
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
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  🌿
                </div>
                <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-700)', marginBottom: 'var(--spacing-3)' }}>
                  You are all set!
                </h2>
                <p style={{ color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)' }}>
                  We have created your personalized recovery profile. You will
                  receive your first check-in tomorrow.
                </p>
              </div>
            </CardBody>
            <CardFooter style={{ justifyContent: 'center' }}>
              <Button size="lg" onClick={() => window.location.href = '/check-in'}>
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
