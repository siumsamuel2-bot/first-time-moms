import { describe, expect, it } from 'vitest';
import { DeliveryType, FeedingMethod, ProviderScreeningStatus, Specialty } from '../enums.js';
import type { RiskMetrics } from '../rules/escalation.js';
import type { Provider, RecoveryProfile } from '../zod-schemas.js';
import { generateReferralContextSummary, matchProviders } from './provider-matching.js';

const createProfile = (overrides: Partial<RecoveryProfile> = {}): RecoveryProfile => ({
  userId: 'user-1',
  deliveryType: DeliveryType.VAGINAL,
  feedingMethod: FeedingMethod.BREASTFEEDING,
  weeksPostpartum: 3,
  riskFlags: [],
  needsMentalHealth: false,
  needsLactation: false,
  needsPelvicFloor: false,
  insurance: undefined,
  location: { lat: 40, lng: -74, zipCode: '10001' },
  ...overrides,
});

const createProvider = (overrides: Partial<Provider> = {}): Provider => ({
  id: 'provider-1',
  name: 'Dr. Jane Doe',
  specialties: [Specialty.OBGYN],
  location: { lat: 40, lng: -74, address: '1 Main St', radiusMiles: 10 },
  insuranceAccepted: [],
  screeningStatus: ProviderScreeningStatus.APPROVED,
  availability: { nextSlotDays: 10, slots: [] },
  contactInfo: { phone: '555-0100', email: 'provider@example.com' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

const createMetrics = (overrides: Partial<RiskMetrics> = {}): RiskMetrics => ({
  consecutiveSleepDisruptionDays: 0,
  consecutiveSadnessDays: 0,
  consecutiveAnxietyDays: 0,
  maxPainLevel: 0,
  heavyBleedingDays: 0,
  riskLevel: 'low',
  ...overrides,
});

const scoreById = (matches: ReturnType<typeof matchProviders>) =>
  Object.fromEntries(matches.map((m) => [m.provider.id, m.score]));

describe('matchProviders', () => {
  it('returns only APPROVED providers', () => {
    const providers = [
      createProvider({ id: 'approved', screeningStatus: ProviderScreeningStatus.APPROVED }),
      createProvider({ id: 'pending', screeningStatus: ProviderScreeningStatus.PENDING }),
      createProvider({ id: 'rejected', screeningStatus: ProviderScreeningStatus.REJECTED }),
      createProvider({ id: 'expired', screeningStatus: ProviderScreeningStatus.EXPIRED }),
    ];

    const result = matchProviders(createProfile(), providers);

    expect(result).toHaveLength(1);
    expect(result[0].provider.id).toBe('approved');
  });

  it('returns an empty array when no providers qualify', () => {
    const result = matchProviders(createProfile(), [
      createProvider({ screeningStatus: ProviderScreeningStatus.PENDING }),
    ]);

    expect(result).toEqual([]);
  });

  it('sorts matches by descending score', () => {
    const best = createProvider({
      id: 'best',
      availability: { nextSlotDays: 3, slots: [] },
    });
    const mid = createProvider({
      id: 'mid',
      specialties: [Specialty.DOULA],
      availability: { nextSlotDays: 3, slots: [] },
    });
    const low = createProvider({ id: 'low' });

    const result = matchProviders(createProfile(), [low, best, mid]);

    expect(result.map((m) => m.provider.id)).toEqual(['best', 'mid', 'low']);
    expect(result.map((m) => m.score)).toEqual([60, 55, 45]);
  });

  it('applies the default maxResults of 5', () => {
    const providers = Array.from({ length: 7 }, (_, i) => createProvider({ id: `p${i}` }));

    expect(matchProviders(createProfile(), providers)).toHaveLength(5);
  });

  it('respects a custom maxResults', () => {
    const providers = Array.from({ length: 7 }, (_, i) => createProvider({ id: `p${i}` }));

    expect(matchProviders(createProfile(), providers, { maxResults: 2 })).toHaveLength(2);
  });

  it('filters out providers below the default minimum score', () => {
    const far = createProvider({
      location: { lat: 41, lng: -75, address: 'Far away', radiusMiles: 1 },
    });

    expect(matchProviders(createProfile(), [far])).toHaveLength(0);
    expect(matchProviders(createProfile(), [far], { minScore: 0 })).toHaveLength(1);
  });

  it('filters by requiredSpecialties', () => {
    const mentalHealth = createProvider({ id: 'mh', specialties: [Specialty.PERINATAL_MH] });
    const lactation = createProvider({ id: 'lc', specialties: [Specialty.LACTATION] });

    const result = matchProviders(createProfile(), [mentalHealth, lactation], {
      requiredSpecialties: [Specialty.LACTATION],
    });

    expect(result.map((m) => m.provider.id)).toEqual(['lc']);
  });
});

describe('matchProviders scoring', () => {
  it('awards proximity points for providers inside their radius', () => {
    const [match] = matchProviders(createProfile(), [createProvider()], { minScore: 0 });

    expect(match.score).toBe(45);
    expect(match.reasons).toContain('0 miles away (within 10mi radius)');
  });

  it('awards no proximity points when the mom has no location', () => {
    const [match] = matchProviders(
      createProfile({ location: undefined }),
      [createProvider({ specialties: [Specialty.DOULA] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(0);
  });

  it('adds points and a reason for a perinatal mental health need', () => {
    const [match] = matchProviders(
      createProfile({ needsMentalHealth: true }),
      [createProvider({ specialties: [Specialty.PERINATAL_MH] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(70);
    expect(match.reasons).toContain('Specializes in perinatal mental health');
  });

  it('adds points and a reason for a lactation need', () => {
    const [match] = matchProviders(
      createProfile({ needsLactation: true }),
      [createProvider({ specialties: [Specialty.LACTATION] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(70);
    expect(match.reasons).toContain('Lactation consultant available');
  });

  it('adds points and a reason for a pelvic floor need', () => {
    const [match] = matchProviders(
      createProfile({ needsPelvicFloor: true }),
      [createProvider({ specialties: [Specialty.PELVIC_FLOOR] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(65);
    expect(match.reasons).toContain('Pelvic floor specialist');
  });

  it('does not award a specialty bonus when the need is not flagged', () => {
    const [match] = matchProviders(
      createProfile(),
      [createProvider({ specialties: [Specialty.PERINATAL_MH] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(40);
    expect(match.reasons).not.toContain('Specializes in perinatal mental health');
  });

  it('awards insurance points when the provider accepts the moms insurance', () => {
    const [match] = matchProviders(
      createProfile({ insurance: 'Aetna' }),
      [createProvider({ insuranceAccepted: ['Aetna', 'Cigna'] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(65);
    expect(match.reasons).toContain('Accepts Aetna');
  });

  it('does not award insurance points when the insurance is not accepted', () => {
    const [match] = matchProviders(
      createProfile({ insurance: 'Aetna' }),
      [createProvider({ insuranceAccepted: ['Cigna'] })],
      { minScore: 0 }
    );

    expect(match.score).toBe(45);
  });

  it('scores availability in tiers', () => {
    const result = matchProviders(
      createProfile(),
      [
        createProvider({ id: 'soon', availability: { nextSlotDays: 3, slots: [] } }),
        createProvider({ id: 'week', availability: { nextSlotDays: 7, slots: [] } }),
        createProvider({ id: 'later', availability: { nextSlotDays: 8, slots: [] } }),
      ],
      { minScore: 0 }
    );

    expect(scoreById(result)).toEqual({ soon: 60, week: 55, later: 45 });
    expect(result[0].reasons).toContain('Available in 3 days');
  });

  it('gives an OB-GYN/midwife bonus', () => {
    const result = matchProviders(
      createProfile(),
      [
        createProvider({ id: 'obgyn', specialties: [Specialty.OBGYN] }),
        createProvider({ id: 'doula', specialties: [Specialty.DOULA] }),
      ],
      { minScore: 0 }
    );

    expect(scoreById(result)).toEqual({ obgyn: 45, doula: 40 });
  });

  it('caps the total score at 100', () => {
    const [match] = matchProviders(
      createProfile({
        needsMentalHealth: true,
        needsLactation: true,
        needsPelvicFloor: true,
        insurance: 'Aetna',
      }),
      [
        createProvider({
          specialties: [
            Specialty.OBGYN,
            Specialty.PERINATAL_MH,
            Specialty.LACTATION,
            Specialty.PELVIC_FLOOR,
          ],
          insuranceAccepted: ['Aetna'],
          availability: { nextSlotDays: 1, slots: [] },
        }),
      ],
      { minScore: 0 }
    );

    expect(match.score).toBe(100);
  });

  it('includes a human-readable reason for each applied factor', () => {
    const [match] = matchProviders(
      createProfile({ needsMentalHealth: true, insurance: 'Aetna' }),
      [
        createProvider({
          specialties: [Specialty.OBGYN, Specialty.PERINATAL_MH],
          insuranceAccepted: ['Aetna'],
          availability: { nextSlotDays: 3, slots: [] },
        }),
      ],
      { minScore: 0 }
    );

    expect(match.reasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining('miles away'),
        'Specializes in perinatal mental health',
        'Accepts Aetna',
        'Available in 3 days',
        'OB-GYN/Midwife',
      ])
    );
  });
});

describe('generateReferralContextSummary', () => {
  it('summarizes the recovery profile and risk metrics', () => {
    const summary = generateReferralContextSummary(
      createProfile({
        weeksPostpartum: 6,
        deliveryType: DeliveryType.C_SECTION,
        feedingMethod: FeedingMethod.FORMULA,
        insurance: 'Aetna',
        riskFlags: ['preeclampsia', 'postpartum_hemorrhage'],
      }),
      createMetrics({
        consecutiveSleepDisruptionDays: 5,
        consecutiveSadnessDays: 4,
        consecutiveAnxietyDays: 2,
        maxPainLevel: 6,
        riskLevel: 'medium',
      })
    );

    expect(summary).toContain('Postpartum week: 6');
    expect(summary).toContain('Delivery: C_SECTION');
    expect(summary).toContain('Feeding: FORMULA');
    expect(summary).toContain('Sleep disruption streak: 5 days');
    expect(summary).toContain('Sadness streak: 4 days');
    expect(summary).toContain('Risk flags: preeclampsia, postpartum_hemorrhage');
    expect(summary).toContain('Insurance: Aetna');
  });

  it('uses placeholders when risk flags and insurance are absent', () => {
    const summary = generateReferralContextSummary(createProfile(), createMetrics());

    expect(summary).toContain('Risk flags: none');
    expect(summary).toContain('Insurance: not provided');
  });
});
