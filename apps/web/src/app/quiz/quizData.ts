export type QuizSection = 'basic' | 'physical' | 'emotional' | 'practical';

export interface QuizQuestion {
  id: number;
  section: QuizSection;
  text: string;
  type: 'single' | 'scale' | 'yes-no';
  options?: QuizOption[];
  min?: number;
  max?: number;
}

export interface QuizOption {
  value: string;
  label: string;
  nextQuestionId?: number;
  score?: number;
}

export interface QuizResult {
  riskLevel: 'low' | 'moderate' | 'high' | 'urgent';
  summary: string;
  recommendations: string[];
  nextSteps: string[];
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    section: 'basic',
    text: 'How many weeks postpartum are you?',
    type: 'single',
    options: [
      { value: '0-2', label: '0-2 weeks' },
      { value: '2-6', label: '2-6 weeks' },
      { value: '6-12', label: '6-12 weeks' },
      { value: 'expecting', label: 'Still expecting' },
    ],
  },
  {
    id: 2,
    section: 'basic',
    text: 'Is this your first baby?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 3,
    section: 'physical',
    text: 'How would you rate your overall energy level?',
    type: 'scale',
    min: 1,
    max: 5,
  },
  {
    id: 4,
    section: 'physical',
    text: 'Are you experiencing any pain, bleeding, or unusual discharge?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 5,
    section: 'physical',
    text: 'How is your appetite and hydration?',
    type: 'single',
    options: [
      { value: 'good', label: 'Good' },
      { value: 'fair', label: 'Fair' },
      { value: 'poor', label: 'Poor' },
    ],
  },
  {
    id: 6,
    section: 'physical',
    text: 'How is your sleep quality?',
    type: 'single',
    options: [
      { value: 'well', label: 'Sleeping well' },
      { value: 'broken-okay', label: 'Broken but okay' },
      { value: 'very-disrupted', label: 'Very disrupted' },
    ],
  },
  {
    id: 7,
    section: 'emotional',
    text: 'How would you describe your mood most days?',
    type: 'single',
    options: [
      { value: 'happy', label: 'Happy' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'down', label: 'Down' },
      { value: 'overwhelmed', label: 'Overwhelmed' },
    ],
  },
  {
    id: 8,
    section: 'emotional',
    text: 'Do you feel connected to your baby?',
    type: 'single',
    options: [
      { value: 'very', label: 'Very much' },
      { value: 'somewhat', label: 'Somewhat' },
      { value: 'not-really', label: 'Not really' },
    ],
  },
  {
    id: 9,
    section: 'emotional',
    text: 'Are you having any thoughts of harming yourself or your baby?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 10,
    section: 'emotional',
    text: 'Do you have support at home?',
    type: 'single',
    options: [
      { value: 'plenty', label: 'Yes, plenty' },
      { value: 'some', label: 'Some' },
      { value: 'not-enough', label: 'Not enough' },
      { value: 'none', label: 'None' },
    ],
  },
  {
    id: 11,
    section: 'practical',
    text: 'What is your biggest challenge right now?',
    type: 'single',
    options: [
      { value: 'sleep', label: 'Sleep' },
      { value: 'breastfeeding', label: 'Breastfeeding' },
      { value: 'mental-health', label: 'Mental health' },
      { value: 'physical-recovery', label: 'Physical recovery' },
      { value: 'relationship', label: 'Relationship' },
      { value: 'something-else', label: 'Something else' },
    ],
  },
  {
    id: 12,
    section: 'practical',
    text: 'Are you currently tracking your postpartum symptoms?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'what-is-that', label: 'What is that?' },
    ],
  },
];

export function calculateResult(answers: Record<number, string>): QuizResult {
  let physicalScore = 0;
  let emotionalScore = 0;
  let concernFlags: string[] = [];

  // Physical scoring
  if (answers[3]) {
    const energyLevel = parseInt(answers[3]);
    if (energyLevel <= 2) physicalScore += 2;
    else if (energyLevel <= 4) physicalScore += 1;
  }
  if (answers[4] === 'yes') {
    physicalScore += 3;
    concernFlags.push('pain-bleeding');
  }
  if (answers[5] === 'poor') {
    physicalScore += 2;
    concernFlags.push('appetite');
  }
  if (answers[6] === 'very-disrupted') {
    physicalScore += 2;
    concernFlags.push('sleep');
  }

  // Emotional scoring
  if (answers[7] === 'overwhelmed') {
    emotionalScore += 3;
    concernFlags.push('overwhelmed');
  } else if (answers[7] === 'down') {
    emotionalScore += 2;
    concernFlags.push('low-mood');
  }
  if (answers[8] === 'not-really') {
    emotionalScore += 2;
    concernFlags.push('bonding');
  }
  if (answers[9] === 'yes') {
    emotionalScore += 5;
    concernFlags.push('self-harm');
  }
  if (answers[10] === 'none' || answers[10] === 'not-enough') {
    emotionalScore += 2;
    concernFlags.push('support');
  }

  const totalScore = physicalScore + emotionalScore;

  if (answers[9] === 'yes') {
    return {
      riskLevel: 'urgent',
      summary: 'Your responses indicate you may be experiencing thoughts that require immediate support. You are not alone, and help is available right now.',
      recommendations: [
        'Contact the National Suicide Prevention Lifeline: 988',
        'Reach out to your healthcare provider immediately',
        'Contact Postpartum Support International: 1-800-944-4773',
        'Contact emergency services if needed: 911',
      ],
      nextSteps: [
        'Speak with someone you trust',
        'Contact your OB-GYN or midwife',
        'Consider reaching out to a mental health crisis line',
      ],
    };
  }

  if (totalScore >= 7) {
    return {
      riskLevel: 'high',
      summary: `Your responses suggest several areas of concern. Based on your answers, you're dealing with multiple challenges that deserve attention and support.`,
      recommendations: [
        'Schedule a check-in with your healthcare provider within the next few days',
        'Reach out to Postpartum Support International: 1-800-944-4773',
        'Download the Firstweeks app for daily support and tracking',
        'Contact your OB-GYN to discuss your symptoms',
      ],
      nextSteps: [
        'Complete our daily check-ins for personalized support',
        'Connect with a postpartum support group',
        'Schedule follow-up appointments with your care team',
      ],
    };
  }

  if (totalScore >= 3) {
    return {
      riskLevel: 'moderate',
      summary: 'Your responses indicate some areas where a little extra support could help. Many new mothers experience similar challenges.',
      recommendations: [
        'Try the Firstweeks app for personalized daily tips',
        'Reach out to a postpartum doula or lactation consultant if needed',
        'Connect with other new mothers in your area',
        'Practice self-care: sleep when baby sleeps, accept help from others',
      ],
      nextSteps: [
        'Track your symptoms daily with the Firstweeks app',
        'Join our community of new mothers',
        'Take advantage of our provider matching service',
      ],
    };
  }

  return {
    riskLevel: 'low',
    summary: 'Your responses indicate you are doing relatively well. Keep taking care of yourself!',
    recommendations: [
      'Continue monitoring your well-being with daily check-ins',
      'Join the Firstweeks community for ongoing support',
      'Stay connected with your healthcare provider',
      'Reach out if anything changes',
    ],
    nextSteps: [
      'Download the app for daily personalized tips',
      'Connect with other mothers in our community',
      'Explore our resource library for new parents',
    ],
  };
}
