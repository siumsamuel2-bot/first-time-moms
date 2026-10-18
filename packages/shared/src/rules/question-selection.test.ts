import { describe, expect, it } from 'vitest';
import { BleedingLevel, DeliveryType, FeedingMethod } from '../enums.js';
import type { CheckIn, RecoveryProfile } from '../zod-schemas.js';
import { selectQuestions } from './question-selection.js';

const createProfile = (overrides: Partial<RecoveryProfile> = {}): RecoveryProfile => ({
  userId: 'user-1',
  deliveryType: DeliveryType.VAGINAL,
  feedingMethod: FeedingMethod.BREASTFEEDING,
  weeksPostpartum: 2,
  riskFlags: [],
  needsMentalHealth: false,
  needsLactation: true,
  needsPelvicFloor: true,
  ...overrides,
});

const createCheckIn = (overrides: Partial<CheckIn> = {}): CheckIn => ({
  id: 'checkin-1',
  userId: 'user-1',
  date: new Date().toISOString().split('T')[0],
  sleepHours: 6,
  sleepDisruption: 2,
  sadness: 2,
  anxiety: 2,
  painLevel: 3,
  bleeding: BleedingLevel.LIGHT,
  feedingIssues: false,
  customResponses: {},
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('question selection rules', () => {
  it('returns questions for standard profile', () => {
    const profile = createProfile();
    const history: CheckIn[] = [];
    const questions = selectQuestions(profile, history);

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(7);
    // Base questions should be present (sadness is highest weight)
    expect(questions.some((q) => q.id === 'sadness')).toBe(true);
    expect(questions.some((q) => q.id === 'anxiety')).toBe(true);
  });

  it('includes C-section questions for C-section delivery', () => {
    const profile = createProfile({
      deliveryType: DeliveryType.C_SECTION,
      feedingMethod: FeedingMethod.FORMULA,
    });
    const history: CheckIn[] = [];
    const questions = selectQuestions(profile, history);

    // With C-section + formula: base (5) + c-section (2) = 7, all should fit
    expect(questions.some((q) => q.id === 'incision_pain')).toBe(true);
    expect(questions.some((q) => q.id === 'mobility')).toBe(true);
  });

  it('includes vaginal delivery questions for vaginal delivery', () => {
    const profile = createProfile({ feedingMethod: FeedingMethod.FORMULA });
    const history: CheckIn[] = [];
    const questions = selectQuestions(profile, history);

    // With vaginal + formula: base (5) + vaginal (2) = 7, all should fit
    expect(questions.some((q) => q.id === 'perineal_pain')).toBe(true);
    expect(questions.some((q) => q.id === 'bleeding')).toBe(true);
  });

  it('includes lactation questions for breastfeeding', () => {
    const profile = createProfile({
      deliveryType: DeliveryType.C_SECTION,
      feedingMethod: FeedingMethod.BREASTFEEDING,
    });
    const history: CheckIn[] = [];
    const questions = selectQuestions(profile, history);

    // With C-section + breastfeeding: base (5) + c-section (2) + lactation (3) = 10, limited to 7
    // Highest weight questions should be selected
    expect(questions.some((q) => q.id === 'sadness')).toBe(true);
    expect(questions.some((q) => q.id === 'incision_pain')).toBe(true);
    // At least one lactation question should be included
    const lactationQuestions = questions.filter((q) =>
      ['latch_quality', 'nipple_pain', 'milk_supply_concern'].includes(q.id)
    );
    expect(lactationQuestions.length).toBeGreaterThan(0);
  });

  it('includes mood follow-up questions for recent sadness', () => {
    const profile = createProfile({ feedingMethod: FeedingMethod.FORMULA });
    const history: CheckIn[] = [
      createCheckIn({ date: '2024-01-05', sadness: 3 }),
      createCheckIn({ date: '2024-01-04', sadness: 3 }),
      createCheckIn({ date: '2024-01-03', sadness: 3 }),
    ];
    const questions = selectQuestions(profile, history);

    expect(questions.some((q) => q.id === 'interest_pleasure')).toBe(true);
    expect(questions.some((q) => q.id === 'feeling_down')).toBe(true);
  });

  it('includes sleep deep-dive questions for 5+ days sleep disruption', () => {
    const profile = createProfile({
      feedingMethod: FeedingMethod.FORMULA,
      deliveryType: DeliveryType.C_SECTION,
    });
    const history: CheckIn[] = [
      createCheckIn({ date: '2024-01-05', sleepDisruption: 4 }),
      createCheckIn({ date: '2024-01-04', sleepDisruption: 5 }),
      createCheckIn({ date: '2024-01-03', sleepDisruption: 4 }),
      createCheckIn({ date: '2024-01-02', sleepDisruption: 5 }),
      createCheckIn({ date: '2024-01-01', sleepDisruption: 4 }),
    ];
    const questions = selectQuestions(profile, history);

    // With sleep disruption streak, deep-dive questions should be added
    // C-section (2) + base (5) + sleep deep-dive (3) = 10, limited to 7
    // But sleep deep-dive questions have high weight
    expect(questions.some((q) => q.id === 'sleep_fragmentation')).toBe(true);
    expect(questions.some((q) => q.id === 'fall_asleep_difficulty')).toBe(true);
  });

  it('limits questions to MAX_QUESTIONS_PER_DAY', () => {
    const profile = createProfile({
      deliveryType: DeliveryType.C_SECTION,
      feedingMethod: FeedingMethod.BREASTFEEDING,
      riskFlags: ['preeclampsia'],
    });
    const history: CheckIn[] = [
      createCheckIn({ date: '2024-01-05', sadness: 3, sleepDisruption: 4 }),
      createCheckIn({ date: '2024-01-04', sadness: 3, sleepDisruption: 5 }),
      createCheckIn({ date: '2024-01-03', sadness: 3, sleepDisruption: 4 }),
    ];
    const questions = selectQuestions(profile, history);

    expect(questions.length).toBeLessThanOrEqual(7);
  });

  it('sorts questions by weight descending', () => {
    const profile = createProfile({ feedingMethod: FeedingMethod.FORMULA });
    const history: CheckIn[] = [];
    const questions = selectQuestions(profile, history);

    for (let i = 1; i < questions.length; i++) {
      expect(questions[i].weight ?? 1).toBeLessThanOrEqual(questions[i - 1].weight ?? 1);
    }
  });

  it('adds BP check question for preeclampsia risk flag', () => {
    const profile = createProfile({
      riskFlags: ['preeclampsia'],
      feedingMethod: FeedingMethod.FORMULA,
    });
    const history: CheckIn[] = [];
    const questions = selectQuestions(profile, history);

    expect(questions.some((q) => q.id === 'bp_check')).toBe(true);
  });
});
