import { describe, expect, it } from 'vitest';
import { DeliveryType, FeedingMethod, ProviderScreeningStatus, Specialty } from '../enums.js';
import { matchProviders } from '../matching/provider-matching.js';
import type { RecoveryProfile } from '../zod-schemas.js';
import {
  DEFAULT_NEXT_SLOT_DAYS,
  DEFAULT_PROVIDER_RADIUS_MILES,
  normalizeProvider,
} from './provider-normalizer.js';

const seedShapedProvider = {
  id: 'seed-provider-1',
  name: 'Dr. Rachel Thompson, MD',
  specialties: [Specialty.PERINATAL_MH, Specialty.PSYCHIATRY],
  location: {
    address: '1200 Medical Center Dr',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30322',
    latitude: 33.8321,
    longitude: -84.3213,
  },
  insuranceAccepted: ['Aetna', 'Cigna'],
  screeningStatus: ProviderScreeningStatus.APPROVED,
  availability: {
    days: ['Monday', 'Tuesday'],
    hours: { start: '09:00', end: '17:00' },
    virtual: true,
    inPerson: true,
  },
  contactInfo: {
    phone: '(404) 555-0123',
    email: 'dr.thompson@example.com',
    website: 'https://example.com',
    npi: '1234567890',
  },
};

const createProfile = (overrides: Partial<RecoveryProfile> = {}): RecoveryProfile => ({
  userId: 'user-1',
  deliveryType: DeliveryType.VAGINAL,
  feedingMethod: FeedingMethod.BREASTFEEDING,
  weeksPostpartum: 3,
  riskFlags: [],
  needsMentalHealth: true,
  needsLactation: false,
  needsPelvicFloor: false,
  insurance: 'Aetna',
  location: { lat: 33.83, lng: -84.32, zipCode: '30322' },
  ...overrides,
});

describe('normalizeProvider', () => {
  it('maps legacy seed location fields onto the canonical shape', () => {
    const provider = normalizeProvider(seedShapedProvider);

    expect(provider.location.lat).toBeCloseTo(33.8321);
    expect(provider.location.lng).toBeCloseTo(-84.3213);
    expect(provider.location.address).toBe('1200 Medical Center Dr');
    expect(provider.location.radiusMiles).toBe(DEFAULT_PROVIDER_RADIUS_MILES);
    expect(provider.availability.nextSlotDays).toBe(DEFAULT_NEXT_SLOT_DAYS);
    expect(provider.availability.slots).toEqual([]);
  });

  it('preserves richer display metadata as optional superset fields', () => {
    const provider = normalizeProvider(seedShapedProvider);

    expect(provider.location.city).toBe('Atlanta');
    expect(provider.location.state).toBe('GA');
    expect(provider.location.zipCode).toBe('30322');
    expect(provider.availability.days).toEqual(['Monday', 'Tuesday']);
    expect(provider.availability.hours).toEqual({ start: '09:00', end: '17:00' });
    expect(provider.availability.virtual).toBe(true);
    expect(provider.availability.inPerson).toBe(true);
    expect(provider.contactInfo.website).toBe('https://example.com');
    expect(provider.contactInfo.npi).toBe('1234567890');
  });

  it('produces a matchable provider with a finite score', () => {
    const provider = normalizeProvider(seedShapedProvider);

    const matches = matchProviders(createProfile(), [provider], { minScore: 0 });

    expect(matches).toHaveLength(1);
    expect(Number.isFinite(matches[0].score)).toBe(true);
    expect(matches[0].provider.id).toBe('seed-provider-1');
  });

  it('keeps a seed-shaped provider matchable above the default threshold', () => {
    const provider = normalizeProvider(seedShapedProvider);

    const matches = matchProviders(createProfile(), [provider]);

    expect(matches.map((m) => m.provider.id)).toContain('seed-provider-1');
  });

  it('leaves a legacy seed-shaped provider impossible to match before normalization', () => {
    const legacy = seedShapedProvider as unknown as Parameters<typeof matchProviders>[1][number];

    const matches = matchProviders(createProfile(), [legacy]);

    expect(matches).toHaveLength(0);
  });

  it('does not match a provider that is not approved', () => {
    const provider = normalizeProvider({
      ...seedShapedProvider,
      screeningStatus: ProviderScreeningStatus.PENDING,
    });

    expect(matchProviders(createProfile(), [provider], { minScore: 0 })).toEqual([]);
  });

  it('keeps intensive-care numeric fields finite when a row lacks coordinates', () => {
    const provider = normalizeProvider({
      ...seedShapedProvider,
      location: { address: 'Nowhere', city: 'Atlanta', state: 'GA', zipCode: '30322' },
    });

    expect(provider.location.lat).toBe(0);
    expect(provider.location.lng).toBe(0);

    const matches = matchProviders(createProfile(), [provider], { minScore: 0 });
    expect(matches).toHaveLength(1);
    expect(Number.isFinite(matches[0].score)).toBe(true);
  });
});
