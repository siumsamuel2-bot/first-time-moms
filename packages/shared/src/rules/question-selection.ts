import type { CheckIn, Question, RecoveryProfile } from '../zod-schemas.js';

export const MAX_QUESTIONS_PER_DAY = 7;

export const BASE_QUESTIONS: Question[] = [
  {
    id: 'sleep_hours',
    text: 'How many hours of sleep did you get in the last 24 hours?',
    type: 'scale',
    options: ['0-2', '3-4', '5-6', '7-8', '9+'],
    required: true,
    category: 'sleep',
    weight: 1.0,
  },
  {
    id: 'sleep_disruption',
    text: 'How disrupted was your sleep? (1 = slept well, 5 = barely slept)',
    type: 'scale',
    options: ['1', '2', '3', '4', '5'],
    required: true,
    category: 'sleep',
    weight: 1.2,
  },
  {
    id: 'sadness',
    text: 'How sad or down have you felt today? (1 = not at all, 5 = extremely)',
    type: 'scale',
    options: ['1', '2', '3', '4', '5'],
    required: true,
    category: 'mood',
    weight: 1.5,
  },
  {
    id: 'anxiety',
    text: 'How anxious or worried have you felt today? (1 = not at all, 5 = extremely)',
    type: 'scale',
    options: ['1', '2', '3', '4', '5'],
    required: true,
    category: 'mood',
    weight: 1.3,
  },
  {
    id: 'pain_level',
    text: 'What is your current pain level? (1 = no pain, 10 = worst pain)',
    type: 'scale',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    required: true,
    category: 'physical',
    weight: 1.0,
  },
];

export const C_SECTION_QUESTIONS: Question[] = [
  {
    id: 'incision_pain',
    text: 'How is your incision healing? Any redness, swelling, or discharge?',
    type: 'multiple_choice',
    options: ['Healing well', 'Mild redness', 'Moderate pain/swelling', 'Signs of infection'],
    required: true,
    category: 'physical',
    weight: 1.4,
  },
  {
    id: 'mobility',
    text: 'How is your mobility compared to yesterday?',
    type: 'scale',
    options: ['Much better', 'Better', 'Same', 'Worse', 'Much worse'],
    required: true,
    category: 'physical',
    weight: 1.0,
  },
];

export const VAGINAL_DELIVERY_QUESTIONS: Question[] = [
  {
    id: 'perineal_pain',
    text: 'How is your perineal area feeling?',
    type: 'scale',
    options: ['No discomfort', 'Mild', 'Moderate', 'Significant pain', 'Severe pain'],
    required: true,
    category: 'physical',
    weight: 1.2,
  },
  {
    id: 'bleeding',
    text: 'How would you describe your bleeding?',
    type: 'multiple_choice',
    options: ['None', 'Spotting', 'Light', 'Moderate', 'Heavy (soaking pad in <1hr)'],
    required: true,
    category: 'physical',
    weight: 1.3,
  },
];

export const LACTATION_QUESTIONS: Question[] = [
  {
    id: 'latch_quality',
    text: "How is baby's latch?",
    type: 'multiple_choice',
    options: ['Good', 'Okay', 'Painful', "Baby won't latch", 'Not breastfeeding'],
    required: true,
    category: 'feeding',
    weight: 1.3,
  },
  {
    id: 'nipple_pain',
    text: 'Any nipple pain or damage?',
    type: 'scale',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Cracked/bleeding'],
    required: true,
    category: 'feeding',
    weight: 1.2,
  },
  {
    id: 'milk_supply_concern',
    text: 'Are you concerned about milk supply?',
    type: 'boolean',
    required: true,
    category: 'feeding',
    weight: 1.1,
  },
];

export const MOOD_FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: 'interest_pleasure',
    text: 'Have you had little interest or pleasure in doing things?',
    type: 'scale',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    required: true,
    category: 'mood',
    weight: 1.6,
  },
  {
    id: 'feeling_down',
    text: 'Have you been feeling down, depressed, or hopeless?',
    type: 'scale',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    required: true,
    category: 'mood',
    weight: 1.6,
  },
  {
    id: 'anxiety_worry',
    text: 'Have you been feeling nervous, anxious, or on edge?',
    type: 'scale',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    required: true,
    category: 'mood',
    weight: 1.4,
  },
  {
    id: 'uncontrollable_worry',
    text: 'Have you been unable to stop or control worrying?',
    type: 'scale',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    required: true,
    category: 'mood',
    weight: 1.4,
  },
];

export const SLEEP_DEEP_DIVE_QUESTIONS: Question[] = [
  {
    id: 'sleep_fragmentation',
    text: 'How many times did you wake up last night?',
    type: 'scale',
    options: ['0-1', '2-3', '4-5', '6+'],
    required: true,
    category: 'sleep',
    weight: 1.3,
  },
  {
    id: 'fall_asleep_difficulty',
    text: 'How hard was it to fall back asleep?',
    type: 'scale',
    options: ['Easy', 'Somewhat hard', 'Hard', 'Very hard', "Couldn't"],
    required: true,
    category: 'sleep',
    weight: 1.2,
  },
  {
    id: 'daytime_fatigue',
    text: 'How fatigued do you feel during the day?',
    type: 'scale',
    options: ['Not at all', 'Mildly', 'Moderately', 'Severely', 'Exhausted'],
    required: true,
    category: 'sleep',
    weight: 1.4,
  },
];

export function hasRecentFlag(
  history: CheckIn[],
  field: keyof Pick<CheckIn, 'sleepDisruption' | 'sadness' | 'anxiety' | 'painLevel'>,
  threshold: number,
  days: number
): boolean {
  const recent = history
    .filter((h) => h[field] !== undefined && h[field] !== null && h[field] >= threshold)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days);

  return recent.length >= days;
}

export function consecutiveDays(
  history: CheckIn[],
  predicate: (checkIn: CheckIn) => boolean
): number {
  const sorted = history
    .filter((h) => predicate(h))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) return 0;

  let count = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date).getTime();
    const curr = new Date(sorted[i].date).getTime();
    const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

export function selectQuestions(profile: RecoveryProfile, history: CheckIn[]): Question[] {
  const questions: Question[] = [...BASE_QUESTIONS];

  if (profile.deliveryType === 'C_SECTION') {
    questions.push(...C_SECTION_QUESTIONS);
  } else {
    questions.push(...VAGINAL_DELIVERY_QUESTIONS);
  }

  if (
    profile.feedingMethod === 'BREASTFEEDING' ||
    profile.feedingMethod === 'COMBO' ||
    profile.feedingMethod === 'PUMPING'
  ) {
    questions.push(...LACTATION_QUESTIONS);
  }

  if (hasRecentFlag(history, 'sadness', 3, 3) || hasRecentFlag(history, 'anxiety', 3, 3)) {
    questions.push(...MOOD_FOLLOWUP_QUESTIONS);
  }

  if (hasRecentFlag(history, 'sleepDisruption', 4, 5)) {
    questions.push(...SLEEP_DEEP_DIVE_QUESTIONS);
  }

  if (profile.riskFlags.includes('preeclampsia')) {
    questions.push({
      id: 'bp_check',
      text: 'Have you checked your blood pressure today?',
      type: 'boolean',
      required: true,
      category: 'physical',
      weight: 1.5,
    });
  }

  return questions
    .sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1))
    .slice(0, MAX_QUESTIONS_PER_DAY);
}
