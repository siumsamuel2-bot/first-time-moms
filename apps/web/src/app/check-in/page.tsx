'use client';

import { useState } from 'react';
import { Card, CardBody, CardFooter } from '../../components/Card';
import { Button } from '../../components/Button';
import { MoodSelector } from '../../components/MoodSelector';
import { QuestionCard } from '../../components/QuestionCard';
import { ProgressBar } from '../../components/ProgressBar';
import { EscalationBanner } from '../../components/EscalationBanner';

const SYMPTOM_OPTIONS = [
  { value: 'headache', label: 'Headache' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'back_pain', label: 'Back pain' },
  { value: 'incision_pain', label: 'Incision pain' },
  { value: 'breast_pain', label: 'Breast pain' },
  { value: 'contractions', label: 'Afterpains' },
  { value: 'none', label: 'None of the above' },
];

export default function CheckInPage() {
  const [step, setStep] = useState<'mood' | 'symptoms' | 'sleep' | 'bleeding' | 'review'>('mood');
  const [mood, setMood] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [bleeding, setBleeding] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const steps = ['mood', 'symptoms', 'sleep', 'bleeding', 'review'];
  const currentIdx = steps.indexOf(step);

  if (submitted) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-6)', background: 'var(--color-neutral-50)' }}>
        <Card variant="elevated" style={{ maxWidth: 'var(--max-width-sm)', width: '100%', textAlign: 'center' }}>
          <CardBody>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>✓</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-700)', marginBottom: 'var(--spacing-3)' }}>
              Check-in complete
            </h2>
            <p style={{ color: 'var(--color-neutral-500)' }}>
              We have recorded your responses. See you tomorrow!
            </p>
          </CardBody>
          <CardFooter style={{ justifyContent: 'center' }}>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-6)', background: 'var(--color-neutral-50)' }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-width-sm)' }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <ProgressBar value={Math.round(((currentIdx + 1) / steps.length) * 100)} label="Daily check-in" />
        </div>

        <Card variant="elevated">
          {step === 'mood' && (
            <>
              <CardBody>
                <MoodSelector
                  label="How are you feeling today?"
                  value={mood}
                  onChange={setMood}
                />
              </CardBody>
              <CardFooter>
                <Button onClick={() => setStep('symptoms')}>Next</Button>
              </CardFooter>
            </>
          )}

          {step === 'symptoms' && (
            <>
              <CardBody>
                <QuestionCard
                  question="Any symptoms today?"
                  options={SYMPTOM_OPTIONS}
                  selected={symptoms.join(',')}
                  onSelect={(val) => {
                    if (val === 'none') { setSymptoms(['none']); return; }
                    setSymptoms((prev) =>
                      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev.filter((s) => s !== 'none'), val],
                    );
                  }}
                  multiSelect
                />
              </CardBody>
              <CardFooter>
                <Button variant="ghost" onClick={() => setStep('mood')}>Back</Button>
                <Button onClick={() => setStep('sleep')}>Next</Button>
              </CardFooter>
            </>
          )}

          {step === 'sleep' && (
            <>
              <CardBody>
                <MoodSelector
                  label="How was your sleep last night?"
                  value={sleepQuality}
                  onChange={setSleepQuality}
                />
              </CardBody>
              <CardFooter>
                <Button variant="ghost" onClick={() => setStep('symptoms')}>Back</Button>
                <Button onClick={() => setStep('bleeding')}>Next</Button>
              </CardFooter>
            </>
          )}

          {step === 'bleeding' && (
            <>
              <CardBody>
                <QuestionCard
                  question="How would you describe your bleeding?"
                  options={[
                    { value: 'normal', label: 'Normal (like a period)' },
                    { value: 'heavy', label: 'Heavy (soaking a pad in 2-3 hours)' },
                    { value: 'severe', label: 'Severe (soaking a pad in 1 hour or less)' },
                  ]}
                  selected={bleeding}
                  onSelect={setBleeding}
                />
              </CardBody>
              <CardFooter>
                <Button variant="ghost" onClick={() => setStep('sleep')}>Back</Button>
                <Button onClick={() => setStep('review')}>Review</Button>
              </CardFooter>
            </>
          )}

          {step === 'review' && (
            <>
              <CardBody>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>
                  Review your check-in
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <div><strong>Mood:</strong> {mood}/5</div>
                  <div><strong>Sleep:</strong> {sleepQuality}/5</div>
                  <div><strong>Symptoms:</strong> {symptoms.filter(s => s !== 'none').join(', ') || 'None'}</div>
                  <div><strong>Bleeding:</strong> {bleeding || 'Not specified'}</div>
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="ghost" onClick={() => setStep('bleeding')}>Back</Button>
                <Button onClick={() => setSubmitted(true)}>Submit check-in</Button>
              </CardFooter>
            </>
          )}
        </Card>

        {step === 'review' && mood <= 2 && sleepQuality <= 2 && (
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <EscalationBanner
              severity="medium"
              message="It looks like you have been having a rough time. Would you like to speak with someone?"
              actionLabel="Connect with a provider"
              onAction={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
