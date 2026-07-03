'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { questions, calculateResult } from './quizData';
import type { QuizQuestion } from './quizData';

export default function Quiz() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentQuestion ? ((currentQuestionIndex) / questions.length) * 100 : 100;

  const handleAnswer = useCallback((answer: string) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question - show results
      setShowResults(true);
      // Send results to server
      fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers }),
      }).catch(() => {/* analytics only */});
    }
  }, [answers, currentQuestion, currentQuestionIndex]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        email,
        name,
        referralCode: generateReferralCode(),
      }),
    }).catch(() => {/* analytics only */});

    setSubmitted(true);

    // Generate referral link
    const referralLink = `${window.location.origin}/quiz?ref=${generateReferralCode()}`;
    sessionStorage.setItem('referralLink', referralLink);
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  if (showResults) {
    const result = calculateResult(answers);

    return (
      <div style={containerStyle}>
        <div style={resultsContainerStyle}>
          <div style={riskBadgeStyle(result.riskLevel)}>
            {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)} Risk
          </div>

          <h1 style={resultsTitleStyle}>Your Personalized Recovery Report</h1>

          <p style={summaryStyle}>{result.summary}</p>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Recommendations</h2>
            <ul style={listStyle}>
              {result.recommendations.map((rec, i) => (
                <li key={i} style={listItemStyle}>{rec}</li>
              ))}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Next Steps</h2>
            <ul style={listStyle}>
              {result.nextSteps.map((step, i) => (
                <li key={i} style={listItemStyle}>{step}</li>
              ))}
            </ul>
          </div>

          {!submitted ? (
            <div style={emailCaptureStyle}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--color-neutral-900)' }}>
                Get your full report
              </h3>
              <p style={{ color: 'var(--color-neutral-600)', marginBottom: '24px' }}>
                Enter your email to receive your personalized recovery report and access to the Firstweeks app.
              </p>
              <form onSubmit={handleEmailSubmit} style={formStyle}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
                <button type="submit" style={submitButtonStyle}>
                  Send me my report
                </button>
              </form>
            </div>
          ) : (
            <div style={successStyle}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-success-600)' }}>
                Thanks! Your report is on its way.
              </h3>
              <p style={{ color: 'var(--color-neutral-600)', marginTop: '12px' }}>
                Check your inbox for your personalized recovery report.
              </p>
              <ReferralShare />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div style={containerStyle}>
      <div style={quizContainerStyle}>
        <div style={progressBarStyle}>
          <div style={{ ...progressFillStyle, width: `${progress}%` }} />
        </div>

        <div style={questionCountStyle}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>

        <h1 style={questionTextStyle}>{currentQuestion.text}</h1>

        <div style={optionsContainerStyle}>
          {currentQuestion.type === 'scale' ? (
            <div style={scaleContainerStyle}>
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => handleAnswer(String(v))}
                  style={scaleButtonStyle}
                >
                  {v}
                </button>
              ))}
              <div style={scaleLabelsStyle}>
                <span>Low energy</span>
                <span>High energy</span>
              </div>
            </div>
          ) : (
            currentQuestion.options?.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                style={optionButtonStyle}
              >
                {option.label}
              </button>
            ))
          )}
        </div>

        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevious} style={previousButtonStyle}>
            Previous
          </button>
        )}
      </div>
    </div>
  );
}

function ReferralShare() {
  const [copied, setCopied] = useState(false);
  const referralLink = typeof window !== 'undefined'
    ? sessionStorage.getItem('referralLink') || `${window.location.origin}/quiz`
    : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Firstweeks - Postpartum Support',
          text: 'I just took the Firstweeks quiz and got personalized recovery insights. Check it out!',
          url: referralLink,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={referralStyle}>
      <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>
        Know a new mom who could use support?
      </h4>
      <p style={{ color: 'var(--color-neutral-600)', marginTop: '8px' }}>
        Share Firstweeks and both of you get a free week of MammaSync Plus when they sign up.
      </p>
      <button onClick={handleShare} style={shareButtonStyle}>
        {copied ? 'Link copied!' : 'Share Firstweeks'}
      </button>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--spacing-6)',
  background: 'linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-neutral-50) 100%)',
};

const quizContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  background: 'white',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-8)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const progressBarStyle: React.CSSProperties = {
  width: '100%',
  height: '8px',
  background: 'var(--color-neutral-200)',
  borderRadius: 'var(--radius-full)',
  marginBottom: 'var(--spacing-6)',
};

const progressFillStyle: React.CSSProperties = {
  height: '100%',
  background: 'var(--color-brand-500)',
  borderRadius: 'var(--radius-full)',
  transition: 'width 0.3s ease',
};

const questionCountStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: 'var(--color-neutral-500)',
  marginBottom: 'var(--spacing-4)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const questionTextStyle: React.CSSProperties = {
  fontSize: 'var(--text-xl)',
  fontWeight: 600,
  color: 'var(--color-neutral-900)',
  marginBottom: 'var(--spacing-6)',
  lineHeight: 'var(--leading-snug)',
};

const optionsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
};

const optionButtonStyle: React.CSSProperties = {
  padding: 'var(--spacing-4) var(--spacing-6)',
  background: 'var(--color-neutral-50)',
  border: '1px solid var(--color-neutral-200)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  color: 'var(--color-neutral-700)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'left',
};

const previousButtonStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-6)',
  padding: 'var(--spacing-3) var(--spacing-6)',
  background: 'transparent',
  border: '1px solid var(--color-neutral-300)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-neutral-600)',
  cursor: 'pointer',
};

const scaleContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--spacing-4)',
};

const scaleButtonStyle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: 'var(--radius-full)',
  border: '2px solid var(--color-neutral-300)',
  background: 'white',
  fontSize: 'var(--text-lg)',
  fontWeight: 600,
  color: 'var(--color-neutral-700)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const scaleLabelsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '300px',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-neutral-500)',
};

const resultsContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '700px',
  background: 'white',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-8)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const riskBadgeStyle = (risk: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: 'var(--spacing-2) var(--spacing-4)',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  ...getRiskColors(risk),
});

const getRiskColors = (risk: string) => {
  switch (risk) {
    case 'low':
      return { background: '#dcfce7', color: '#166534' };
    case 'moderate':
      return { background: '#fef9c3', color: '#854d0e' };
    case 'high':
      return { background: '#fee2e2', color: '#991b1b' };
    case 'urgent':
      return { background: '#fecaca', color: '#7f1d1d' };
    default:
      return { background: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' };
  }
};

const resultsTitleStyle: React.CSSProperties = {
  fontSize: 'var(--text-2xl)',
  fontWeight: 700,
  color: 'var(--color-neutral-900)',
  marginTop: 'var(--spacing-4)',
  marginBottom: 'var(--spacing-4)',
};

const summaryStyle: React.CSSProperties = {
  fontSize: 'var(--text-lg)',
  color: 'var(--color-neutral-600)',
  lineHeight: 'var(--leading-relaxed)',
  marginBottom: 'var(--spacing-6)',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 'var(--spacing-6)',
  padding: 'var(--spacing-4)',
  background: 'var(--color-brand-50)',
  borderRadius: 'var(--radius-md)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--text-lg)',
  fontWeight: 600,
  color: 'var(--color-brand-800)',
  marginBottom: 'var(--spacing-3)',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const listItemStyle: React.CSSProperties = {
  padding: 'var(--spacing-2) 0',
  paddingLeft: 'var(--spacing-6)',
  position: 'relative',
  color: 'var(--color-neutral-700)',
  fontSize: 'var(--text-base)',
};

const emailCaptureStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-8)',
  padding: 'var(--spacing-6)',
  background: 'var(--color-neutral-50)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-neutral-200)',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
};

const inputStyle: React.CSSProperties = {
  padding: 'var(--spacing-3) var(--spacing-4)',
  border: '1px solid var(--color-neutral-300)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  color: 'var(--color-neutral-900)',
};

const submitButtonStyle: React.CSSProperties = {
  padding: 'var(--spacing-3) var(--spacing-6)',
  background: 'var(--color-brand-600)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.2s ease',
};

const successStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-8)',
  padding: 'var(--spacing-6)',
  background: 'var(--color-success-50)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-success-200)',
  textAlign: 'center',
};

const referralStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-6)',
  padding: 'var(--spacing-4)',
  background: 'white',
  borderRadius: 'var(--radius-md)',
  border: '1px dashed var(--color-brand-300)',
};

const shareButtonStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-3)',
  padding: 'var(--spacing-3) var(--spacing-6)',
  background: 'var(--color-brand-600)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  cursor: 'pointer',
};
